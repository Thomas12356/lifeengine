""""
    Genetic Algorithm Scheduler - MVP Implementation

    This is an inital implementation of a genetic algorithm based scheduler.
    Given a list of events and a landscape of predicted energy and focus levels for each time slot, 
    the algorithm will evolve a candidate schedules over multiple generations to
    find an optimal or near optimal schedule that maximizes the fit of events to time slots.

    V1: Static user state
       - Basic event and time slot models
       - User state is static and defined by predicted energy and focus levels for each time slot

    V2 (Future): Dynamic user state and feedback loop
        - Incorporate a dynamic user state which evolves based on event state impact decay and recovery periods

"""

from resource_predictor import get_baseline_array
from scheduler_mvp import EventType, Event, TimeSlot, score_fit, compute_net_score
from dataclasses import dataclass
import random

@dataclass
class CandidateSchedule:
    events: list[Event]
    timeslots: list[TimeSlot]
    fitness_score: float = 0.0

population_size = 50
num_generations = 100

population = list[CandidateSchedule]

events_to_schedule = [
    Event("Task 1", EventType("Work", ideal_energy=0.8, ideal_focus=0.8, energy_weight=1, focus_weight=4)),
    Event("Task 2", EventType("Work", ideal_energy=0.8, ideal_focus=0.8, energy_weight=1, focus_weight=4)),
    Event("Evening Workout", EventType("Exercise", ideal_energy=0.6, ideal_focus=0.5, energy_weight=5, focus_weight=1)),
    Event("Study Session", EventType("Study", ideal_energy=0.7, ideal_focus=0.9, energy_weight=1, focus_weight=4)),
]

class SchedulerGA:
    def __init__(self, events, energy_focus_landscape):
        self.events = events
        self.energy_focus_landscape = energy_focus_landscape
        self.population = self.initialize_population()

    def initialize_population(self):
        population = []
        for i in range(population_size):
            timeslots = [None] * 24 # Assuming 24 time slots (e.g. each hour of the day)
            # Randomly shuffle events and assign to time slots
            random.shuffle(self.events)
            for event in self.events:
                assigned = False
                while not assigned:
                    slot = random.randint(0, 23)
                    if timeslots[slot] is None: # Check if time slot is available
                        timeslots[slot] = event
                        assigned = True
            candidate = CandidateSchedule(events=self.events, timeslots=timeslots)
            population.append(candidate)

        return population
    
    def visualise_population(self):
        for individual in self.population:
            print("Candidate Schedule:")
            for hour, event in enumerate(individual.timeslots):
                if event is not None:
                    print(f"Hour {hour}: {event.name}")
                else:
                    print(f"Hour {hour}: Free")
            print("\n")

baseline_energy, baseline_focus = get_baseline_array(phi1=7, phi2=12) # Example phase shifts for circadian and circasemidian rhythms

scheduler = SchedulerGA(events_to_schedule, energy_focus_landscape=list(zip(baseline_energy, baseline_focus)))

scheduler.visualise_population()


"""
    V1 Implementation Notes:
    - We will start with a basic implementation that focuses on the core GA flow and the fit score calculation
    - User state dynamics and the feedback loop will be added in a future iteration, V1 focus will be on core structure

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
"""