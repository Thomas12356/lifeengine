""""
    Genetic Algorithm Scheduler - MVP Implementation

    This is an inital implementation of a genetic algorithm based scheduler.
    Given a list of events and a landscape of predicted energy and focus levels for each time slot, 
    the algorithm will evolve a candidate schedules over multiple generations to
    find an optimal or near optimal schedule that maximizes the fit of events to time slots.

    V1: Static user state
       - Basic event and time slot models
       - User state is static and defined by predicted energy and focus levels for each time slot

    V2: Dynamic user state and feedback loop
        - Simple user state dynamics model impacted by S process and residual fatigue from previous events
        - Feedback loop where the schedule impacts user state, which in turn impacts the fit score of subsequent events in the schedule

    DEV NOTES  v1:
    Prerequisites:
    - A list of events to be scheduled, each with an associated EventType that defines its ideal energy and focus levels, as well as the weights for energy and focus in the fit score calculation
    - A landscape of predicted energy and focus levels for each time slot (e.g. each hour of the day), which can be generated using the baseline predictor

    GA Flow :
        1. Initialise a population of candidate schedules (chromosomes)
        2. For each chromosone :
            a. Initialise a starting user state at time 0 (beginning of the day)
            b. Loop through each time slot in the schedule :
                - Calculate user state match score for event in time slot t
                - Apply the decay functions
                    * S(t+1) = S(t) - Decay(Event, UserState) + Recovery(UserState)
                - If S(t) falls below a threshold, apply a burnout penalty to the score and subsequent time slots until recovery occurs
            c. Aggregate the scores across all time slots to get a total fitness score for the schedule
        3. Select the top performing schedules based on fitness scores
        4. Apply crossover and mutation to create a new generation of schedules
            - We must use respect contraints during cross over and mutation to prevent invalid schedules (e.g. two events scheduled at the same time, or events scheduled outside of their allowed time windows)
        5. Use tournament selection to select best indivduals for reproduction
        6. Preserve some of the top performing schedules (elitism)
        5. Repeat for a set number of generations or until convergence


    DEV NOTES 8/05/26 (v2):
    - GA now simulates a candidate schedule measuring predicted yield of each event based on effective energy
    - Effective enery is calculated using the predicted energy, fatigue build up from previous events and the S process
    - The simulation provides the GA with a more realistic fitness score that is impacted dynamically by the schedule itself, 
    - This allows for discovery of schedules that strategically place high impact events to maximise energy and yield
    - While also placing low impact events in a way that allows for recovery and prevents burnout
"""
"""
    TODO : 
    - Implement tournament and elitism for selection of schedules to reproduce
    - Implement crossover and mutation functions to evolve the population of schedules
    - Tune the parameters of the simulation (e.g. fatigue build up, recovery rate)
    - Implement a model for focus states and integrate into the simulation and fitness evaluation
    
    !!!
    - Maybe implement a base schedule (all fixed events) rather than recalculating from list of events every time
"""

import math
from evaluator import Evaluator
from schedule import Schedule
from resource_predictor import get_baseline_array
from scheduler_mvp import compute_net_score
from models import EventType, Event, TimeSlot
from dataclasses import dataclass
import random

# NOTE : These constants should be moved to a GA config file
population_size = 50
num_generations = 100
WAKE_UP_TIME = 7 # 7am
SLEEP_DURATION = 8
BED_TIME = (WAKE_UP_TIME + 24 - SLEEP_DURATION) % 24
SCHEDULE_RESOLUTION = 24

# Placeholder for event type categories
event_types = {
    "Work": EventType("Work", ideal_energy=0.8, ideal_focus=0.8, energy_weight=1, focus_weight=4, impact=0.2, burnout_rate=0.1),
    "Exercise": EventType("Exercise", ideal_energy=0.6, ideal_focus=0.5, energy_weight=5, focus_weight=1, impact=0.4, burnout_rate=0.20),
    "Study": EventType("Study", ideal_energy=0.7, ideal_focus=0.9, energy_weight=1, focus_weight=4, impact=0.2, burnout_rate=0.15),
}

# Placeholder for storing events fed into the GA
events_to_schedule = [
    Event("Task 1", event_types["Work"], start_time=9, duration=2),
    Event("Task 2", event_types["Work"], start_time=None, duration=2),
    Event("Work meeting", event_types["Work"], start_time=12, duration=1),
    Event("Evening Workout", event_types["Exercise"], start_time=17, duration=1),
    Event("Study Session", event_types["Study"], start_time=None, duration=2),
    Event("Read budget report", event_types["Work"], start_time=None, duration=1),
]

class SchedulerGA:
    def __init__(self, events, energy_focus_landscape):
        self.events = events
        self.energy_focus_landscape = energy_focus_landscape
        self.population = self.initialise_population()
        self.fixed_events = []
        self.flexible_events = []
        self.base_schedule = []
    
    def initialise_population(self):
        population = [] # Initalise population container

        for i in range(population_size): # Iterate over population size

            candidate = Schedule(id=i, events=self.events, energy_landscape=self.energy_focus_landscape) # Intialise a new candidate schedule

            random.shuffle(candidate.events) # Shuffle list of events to be scheduled to increase diversity

            # NOTE: Fixed events could be determined by a flag rather than the presence of a start time
            fixed_events = [event for event in self.events if event.start_time is not None] # Extract events that cannot move 
            flexible_events = [event for event in self.events if event.start_time is None]

            # NOTE : We may want to expand this so some events can be carried over when day-to-day scheduling is implemented
            unscheduled_count = 0 # Track number of events that could not be scheduled so they can be penalised 
            for event in fixed_events:
                success = candidate.insert_event(event, event.start_time) # Attempt to insert event
                if not success:
                    unscheduled_count += 1 # If unsuccesfull increment the count

            for event in flexible_events:
                assigned = False
                attempts = 0
                while not assigned and attempts < 100: # Randomly select slots until limit is reached
                    attempts += 1
                    slot = random.randint(0, 23) # Randomly select a slot NOTE : We could limit this to not schedule <WAKEUP & >BEDTIME

                    success = candidate.insert_event(event, slot) # Attempt to insert into time slot
                    if success:
                        assigned = True

                if not assigned:
                    unscheduled_count += 1

            candidate.unscheduled_events = unscheduled_count # Update unscheduled count
            population.append(candidate) # Update population with new candidate

        return population


baseline_energy, baseline_focus = get_baseline_array(phi1=7, phi2=12) # Fetch baseline energy landscape from resource predictor

scheduler = SchedulerGA(events_to_schedule, energy_focus_landscape=list(zip(baseline_energy, baseline_focus))) # Initalise new GA instance

scheduler.initialise_population() # Initialise GA population
evaluator = Evaluator(scheduler.population, baseline_energy) # Initalise GA evaluator
evaluator.evaluate_population() # Evalute GA population