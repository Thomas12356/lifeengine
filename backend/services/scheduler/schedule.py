
"""
    The schedule class represents a candidate schedule for the genetic algorithm.
    It contain a list of events and a list of timeslots, as well as fitness scores.
    Methods include helper functions for inserting events, checking schedule availability & logging

    In the future this class could be re-used for other schedule based applications throughout the system
    In that case we would remove some fields and methods, and create a child class called CandidateSchedule specifically for the GA

"""

from dataclasses import dataclass
from models import Event, TimeSlot

# NOTE : Abstract to global constants file
SCHEDULE_RESOLUTION = 24 # 24 timeslots per day

class Schedule:
    def __init__(self, id, events, energy_landscape):
        self.id = id # Unique identifier for the schedule
        self.events = events # Container for events to be scheduled
        self.timeslots = [None] * SCHEDULE_RESOLUTION # Initialize empty timeslots for the schedule
        self.match_fitness = 0.0 # Fitness score based on the match between ideal and predicted energy levels
        self.simulation_score = 0.0 # Fitness score based on the results of the fatigue simulation
        self.total_fitness = 0.0 # Combined fitness score (could be a weighted sum of match_fitness and simulation_score)
        self.unscheduled_events = 0 # Track the number of unscheduled events, value is used to penalise schedules that fail to contain all events
        self.energy_landscape = energy_landscape

    # Given an event and start time, return True if the event can be scheduled at that time, False otherwise
    def check_availability(self, event, start_time):
        if start_time + event.duration >= 24:
            return False # Event cannot be scheduled as it exceeds the day boundary
        else:
            for hour in range(event.duration): # Iterate over the duration of the event
                if self.timeslots[start_time + hour] is not None:
                    return False # Event cannot be scheduled as it overlaps with another event
            return True

    # Given an event and start time, attempt to insert the event into the schedule at the specified time
    # Return True if the event was successfully inserted, False otherwise
    def insert_event(self, event, start_time):
        if self.check_availability(event, start_time):
            for hour in range(event.duration):
                predicted_energy, _ = self.energy_landscape[start_time + hour]
                self.timeslots[start_time + hour] = TimeSlot(hour=start_time + hour,event=event, predicted_energy=predicted_energy)
            return True
        else:
            return False
        
    # Utility function to visualise the schedule in a readable format
    def visualise(self):
        print(f"""
              Candidate Schedule {self.id}
              (Match fitness: {self.match_fitness})
              (Simulation score: {self.simulation_score})
              (Total Fitness: {self.total_fitness}):
        """)
        input("Press ENTER to view schedule : ")
        i = 0
        for timeslot in self.timeslots:
            if timeslot is not None:
                print(f"""
                      Hour {timeslot.hour}: {timeslot.event.name},
                      Predicted Energy: {timeslot.predicted_energy},
                      Ideal Energy: {timeslot.event.EventType.ideal_energy},
                      Effective Energy: {timeslot.effective_energy},
                """)
            else:
                print(f"Hour {i}: Free")
            i += 1
        print("\n")

    # Utility function to reset fitness scores
    def reset_scores(self):
        self.match_fitness = 0.0
        self.simulation_score = 0.0
        self.total_fitness = 0.0