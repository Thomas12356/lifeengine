
"""
    The schedule class represents a candidate schedule for the genetic algorithm.
    It contain a list of events and a list of timeslots, as well as fitness scores.
    Methods include helper functions for inserting events, checking schedule availability & logging

    In the future this class could be re-used for other schedule based applications throughout the system
    In that case we would remove some fields and methods, and create a child class called CandidateSchedule specifically for the GA

"""

from ..models import TimeSlot
from ..config import SCHEDULE_RESOLUTION, SLOTS_PER_DAY, SLOT_SIZE
import random

class Schedule:
    def __init__(self, id, events, energy_landscape, wakeup_slot, bed_time_slot):
        self.id = id # Unique identifier for the schedule
        self.events = list(events) # Container for events to be scheduled
        self.timeslots = [None] * SCHEDULE_RESOLUTION # Initialize empty timeslots for the schedule
        self.match_fitness = 0.0 # Fitness score based on the match between ideal and predicted energy levels
        self.simulation_score = 0.0 # Fitness score based on the results of the fatigue simulation
        self.total_fitness = 0.0 # Combined fitness score (could be a weighted sum of match_fitness and simulation_score)
        self.unscheduled_events = 0 # Track the number of unscheduled events, value is used to penalise schedules that fail to contain all events
        self.energy_landscape = energy_landscape
        self.positive_yield_total = 0.0
        self.negative_energy_penalty_total = 0.0
        self.sleep_penalty_total = 0.0
        self.fatigue_drain_total = 0.0
        self.preference_penalty_total = 0.0
        self.wakeup_slot = wakeup_slot
        self.bed_time_slot = bed_time_slot

    # Given an event and start slot index, return True if the event can be scheduled at that index, False otherwise
    def check_availability(self, event, start_slot):
        
        if start_slot + event.duration_slots > SLOTS_PER_DAY:
            return False # Event cannot be scheduled as it exceeds the day boundary
        
        if event.is_moveable:
            if start_slot < self.wakeup_slot:
                return False
            
            if start_slot + event.duration_slots > self.bed_time_slot:
                return False

        (start, end) = event.EventType.availability_window

        if start_slot < start or start_slot + event.duration_slots >= end: # NOTE : Timeslots are end-exclusive
            return False

        for slot in range(event.duration_slots): # Iterate over the duration of the event
            if self.timeslots[start_slot + slot] is not None:
                return False # Event cannot be scheduled as it overlaps with another event
        return True

    # Given an event and start slot, attempt to insert the event into the schedule at the specified index
    # Return True if the event was successfully inserted, False otherwise
    def insert_event(self, event, start_slot):
        if self.contains_event(event.event_id):
            return False
        if self.check_availability(event, start_slot):
            for slot in range(event.duration_slots):
                slot_index = start_slot + slot
                predicted_energy, _ = self.energy_landscape[slot_index]
                self.timeslots[slot_index] = TimeSlot(slot_index=slot_index ,event=event, predicted_energy=predicted_energy)
            return True
        else:
            return False
        
    # Utility function to visualise the schedule in a readable format
    def visualise(self):
        def slot_to_time(slot_index):
            minutes = slot_index * SLOT_SIZE
            hour = minutes // 60
            minute = minutes % 60
            return f"{hour:02d}:{minute:02d}"
        
        print(f"""
              Candidate Schedule {self.id}
              (Match fitness: {self.match_fitness}
              (Simulation score: {self.simulation_score}
              (Total Fitness: {self.total_fitness}
              (Positive Yield) : {self.positive_yield_total}
              (Negative energy penalty) : {self.negative_energy_penalty_total}
              (Sleep penalty) : {self.sleep_penalty_total}
              (Fatigue Drain total) : {self.fatigue_drain_total}
              (Unscheduled Events) : {self.unscheduled_events}
              (Preference Window Penalty) : {self.preference_penalty_total}
        """)
        input("Press ENTER to view schedule : ")
        i = 0
        while i < len(self.timeslots):
            timeslot = self.timeslots[i]
            if timeslot is not None:
                end_time = i + timeslot.event.duration_slots
                print(f"""
                Time {slot_to_time(i)} - {slot_to_time(end_time)} ,
                Event : {timeslot.event.name}
                """)
                #print(f"""
                #      Predicted Energy: {timeslot.predicted_energy},
                #      Ideal Energy: {timeslot.event.EventType.ideal_energy},
                #      Effective Energy: {timeslot.effective_energy},
                #""")
                i += timeslot.event.duration_slots
            else:
                #print(f"Time {slot_to_time(i)}: Free")
                i += 1
        print("\n")

    # Utility function to reset fitness scores
    def reset_scores(self):
        self.match_fitness = 0.0
        self.simulation_score = 0.0
        self.total_fitness = 0.0
        self.positive_yield_total = 0.0
        self.negative_energy_penalty_total = 0.0
        self.sleep_penalty_total = 0.0
        self.fatigue_drain_total = 0.0

    # Scan all timeslots to check for duplicated and fragemented events produced from crossover
    # Once checked, clear invalid events and attempt to rebuild a valid schedule
    def repair(self):
        
        # 3 CASES WHERE REPAIR IS NEEDED
        #   - Duplicate events
        #       - Collect all scheduled events and check for duplicates
        #       - Remove instance with lower effective energy
        #   - Fragmented events
        #       - Scan list of scheduled events
        #       - Check each event to see if it occupies duration number of slots
        #   - Missing events
        #       - Build a list of events present in the schedule
        #       - Compare against self.events (master list, must be clean)
        #       - Attempt to greedy insert each missing event

        self.unscheduled_events = 0 # Reset unscheduled event count
        # STEP 1. Remove duplicate events
        seen = set() # Initialise set to track seen event IDs
        i = 0
        while i < len(self.timeslots): # Iterate over all timeslots
            slot = self.timeslots[i] # Select current time slot
            if slot is None:
                i += 1
                continue # Increment pointer and move on if slot is empty
            
            event = self.timeslots[i].event # Select event in current timeslot
            if event.event_id in seen: # Event has been seen before, so it is a duplicate and must be removed
                while i < len(self.timeslots):
                    if self.timeslots[i] != None and (self.timeslots[i].event.event_id == event.event_id):
                        self.timeslots[i] = None # Clear timeslots
                        i += 1
                    else:
                        break # Empty timeslot or new event found, break out of clearing loop
            else: # Event has not been seen yet
                seen.add(event.event_id) # Update set
                i += event.duration_slots # Jump to end of event block

        # STEP 2. Check for fragmented events and clear them
        # When a fragmented event is found, we clear all occupied timeslots by that event and add it to a list of events to be re inserted later
        unscheduled_events = []
        i = 0 # Intialise pointer
        while i < len(self.timeslots):
            slot = self.timeslots[i] # Current timeslot being viewed

            if slot is None: # Check if an event has been scheduled in current timeslot
                i += 1
                continue # If not increment pointer and move jump back to top of loop

            event = slot.event # Event scheduled in current timeslot
            duration = event.duration_slots
            is_fragmented = False # Initialise flag to exit loop

            # Check temporal integrity (event start at the correct time)
            if not event.is_moveable: # Check if event is reschedulable
                if event.start_slot != i: # If there is a discrepancy between start times, event has been fragemented
                    is_fragmented = True

            # NOTE : We can instantly tell if a fixed event has been fragemented by comparing correct and actual start times
            # Since the loop jumps when an event has been checked we will always be looking at the start of an event, even if it spans multiple timeslots

            # Check structural integrity (full duration is met)
            if not is_fragmented:
                for d in range(duration): # Iterate over event duration
                    if i + d >= len(self.timeslots): # Check if event has been cutoff by end-of-day
                        is_fragmented = True
                        break
                    target = self.timeslots[i + d] # Set target slot to where the next block of the event should be scheduled
                    if target == None or target.event.event_id != event.event_id: # Check if timeslot if empty or contains a different event
                        is_fragmented = True
                        break
            
            # Resolve by removing fragements and pushing event into unscheduled_events
            if is_fragmented: # Event has been fragmented
                current_id = event.event_id
                while i < len(self.timeslots): # Iterate over each subsequent time slot 
                    if self.timeslots[i] != None and (self.timeslots[i].event.event_id == current_id): # Check if timeslot contains a fragment
                        self.timeslots[i] = None # Clear the timeslot
                        i += 1 # Increment pointer
                    else:
                        break # Stop clearing as new event or empty slot has been reached
                if event.event_id not in {e.event_id for e in unscheduled_events}:
                    unscheduled_events.append(event) # Push event to unscheduled events to be re inserted later
            else: # Event integrity has been preserved
                i += duration # Jump to end of event

        # STEP 3. Re insert missing events
        # When fragemented events are found we clear all instances and so it must be re-inserted at an appropriate time
        # Comparing the master list (self.events) of events that should have been scheduled we can also pickup any events that were lost during crossover
        # To do this we follow the same logic as the initalise_population method in the GA:
        #   - Attempt to insert fixed events at the correct time first
        #   - Attempt to insert flexible events in random slots until successfull or attempt limit reached

        scheduled_events = set(timeslot.event.event_id for timeslot in self.timeslots if timeslot)
        fragmented_events = set(event.event_id for event in unscheduled_events)

        for event in self.events:
            if event.event_id not in scheduled_events and event.event_id not in fragmented_events:
                unscheduled_events.append(event)

        fixed_events = [event for event in unscheduled_events if not event.is_moveable]
        flexible_events = [event for event in unscheduled_events if event.is_moveable]

        # First attempt to re-insert fixed events, same logic as SchedulerGA.initalise_population()
        for event in fixed_events:
            success = self.insert_event(event, event.start_slot)
            if not success:
                self.unscheduled_events += 1
        
        # Next we attempt to insert flexible events at the first available found spot, same logic as SchedulerGA.initalise_population()
        for event in flexible_events:
            assigned = False
            attempts = 0
            while not assigned and attempts < 100:
                attempts += 1
                slot = random.randint(0, SCHEDULE_RESOLUTION - event.duration_slots)
                success = self.insert_event(event, slot)
                if success:
                    assigned = True
            if not assigned:
                self.unscheduled_events += 1

    # NOTE : This function could possibly be re-used in self.repair(), we should review this
    # Given an event ID linearly search self.timeslots and clear any instance of that event
    def clear_event(self, event_id):
        i = 0
        while i < len(self.timeslots): # Iterate over all timeslots
            slot = self.timeslots[i]
            if slot is not None and slot.event.event_id == event_id: # Check if event IDs match
                self.timeslots[i] = None # If so, clear the event
            i += 1

    # NOTE : This function could possibly be re-used in self.repair(), we should review this
    # Given an event ID, linearly search self.timeslots to find the hour the event first appears in
    # NOTE : This should not be used to fetch the correct start time of a fixed event
    def find_start_slot(self, event_id):
        i = 0
        while i < len(self.timeslots): # Iterate over all timeslots
            slot = self.timeslots[i]
            if slot is not None and slot.event.event_id == event_id: # Check if IDs match
                return slot.slot_index # If so, return the current timeslots index
            i += 1
        return None # Event not in schedule, so return None
    
    def contains_event(self, event_id):
        return any(
            slot is not None and slot.event.event_id == event_id
            for slot in self.timeslots
        )
    
    def fetch_events(self):
        events = []
        i = 0
        while i < len(self.timeslots):
            timeslot = self.timeslots[i]
            if timeslot is not None:
                events.append({
                    "id" : timeslot.event.event_id,
                    "name" : timeslot.event.name,
                    "start_slot" : timeslot.slot_index
                })
                i += timeslot.event.duration_slots
            i += 1

        return events

            


        