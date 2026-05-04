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

import math

from resource_predictor import get_baseline_array
from scheduler_mvp import compute_net_score
from models import EventType, Event, TimeSlot
from dataclasses import dataclass
import random

@dataclass
class CandidateSchedule:
    events: list[Event]
    timeslots: list[TimeSlot]
    fitness_score: float = 0.0
    simulation_score: float = 0.0
    unscheduled_events: int = 0


population_size = 50
num_generations = 100
WAKE_UP_TIME = 7 # 7am

population = list[CandidateSchedule]

event_types = {
    "Work": EventType("Work", ideal_energy=0.8, ideal_focus=0.8, energy_weight=1, focus_weight=4),
    "Exercise": EventType("Exercise", ideal_energy=0.6, ideal_focus=0.5, energy_weight=5, focus_weight=1),
    "Study": EventType("Study", ideal_energy=0.7, ideal_focus=0.9, energy_weight=1, focus_weight=4),
}

events_to_schedule = [
    Event("Task 1", event_types["Work"], start_time=9, duration=2),
    Event("Task 2", event_types["Work"], start_time=None, duration=2),
    Event("Work meeting", event_types["Work"], start_time=11, duration=1),
    Event("Evening Workout", event_types["Exercise"], start_time=17, duration=1),
    Event("Study Session", event_types["Study"], start_time=None, duration=2),
    Event("Read budget report", event_types["Work"], start_time=None, duration=1),
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
            fixed_events = [event for event in self.events if event.start_time is not None]
            flexible_events = [event for event in self.events if event.start_time is None]
            for event in fixed_events:
                if event.start_time is not None:
                    if timeslots[event.start_time] is None: # Check if preferred time slot is available
                        timeslots[event.start_time] = event
            unscheduled_count = 0
            for event in flexible_events:
                # If preferred time slot is not available, assign to a random available slot
                    assigned = False
                    while not assigned:
                        slot = random.randint(0, 23)
                        if timeslots[slot] is None: # Check if time slot is available
                            for hour in range(slot, min(slot + event.duration, 24)): # Check if the required duration can fit in the available time slots
                                if timeslots[hour] is None:
                                    timeslots[hour] = event
                                    assigned = True
                        break
                    if not assigned:
                        unscheduled_count += 1

            candidate = CandidateSchedule(events=self.events, timeslots=timeslots, unscheduled_events=unscheduled_count)
            population.append(candidate)

        return population
    
    def evaluate_population(self):
        for candidate in self.population:
            self.evaluate_fitness(candidate)

        best_fitness = 0.0
        best_individual = None
        for individual in self.population:
            if individual.fitness_score > best_fitness:
                best_individual = individual
                best_fitness = individual.fitness_score
        print(f"Best Individual : ")
        self.visualise_individual(best_individual)

    def evaluate_population_v2(self):
        best_fitness = 0.0
        best_individual = None

        best_simulation_score = 0.0
        best_simulation_individual = None

        for individual in self.population:
            self.evaluate_fitness(individual)
            self.simulate_schedule(individual)
            if individual.fitness_score > best_fitness:
                best_individual = individual
                best_fitness = individual.fitness_score
            if individual.simulation_score > best_simulation_score:
                best_simulation_individual = individual
                best_simulation_score = individual.simulation_score

        print(f"Best Individual (Fitness Score): {best_fitness}")
        print(f"Best Individual (Simulation Score): {best_simulation_score}")

        #self.visualise_individual(best_individual)
        input("Press Enter to view best simulation individual...")
        self.visualise_individual(best_simulation_individual)

    def evaluate_fitness(self, candidate):
        # --------------------- LAYER 1 (ENERGY MATCHING)----------------------------
        total_score = 0.0
        for hour, event in enumerate(candidate.timeslots):
            if event is not None:
                predicted_energy, predicted_focus = self.energy_focus_landscape[hour]
                timeslot = TimeSlot(hour=hour, predicted_energy=predicted_energy, predicted_focus=predicted_focus)
                score = compute_net_score(event, timeslot)
                total_score += score
        candidate.fitness_score = total_score
        # --------------------- LAYER 2 (SIMULATION)----------------------------
        # residual fatigue.= 0
        # consecutive_hours = 0
        # s_inital = s at wakeup
        # for each hour of the day:
        
            # calculate effective energy (E = (C - S) - residual fatigue)
            # normalise to avoid negative

            # calculate event impacts
                # if event is scheduled
                    # use effective energy to calculate yield for the hour??
                    # consecutive hours += 1
                    # calculate drain (D = I(1 + alpha)^(consecutive_hours - 1))
                    # residual fatigue += D
                # else
                    # consecutive hours = 0
                    # calculate recovery impact on residual fatigue

            # update new S value

    def simulate_schedule(self, candidate):
        print(f"\nSimulating schedule for candidate with fitness score: {candidate.fitness_score}")
        def calculate_s(s_inital):
            t = 30
            return (1 - (1 - s_inital) * math.exp(-1/t)) # Placeholder exponential decay function, to be replaced with a more complex function based on user state dynamics
        
        residual_fatigue = 0.0
        consecutive_hours = 0
        s = 0.02 # Placeholder for inital S process value

        importance = 50 # REPLACE WITH EVENT IMPORTANCE DEFINED IN EVENT OBJECT
        intensity = 0.01 # REPLACE WITH EVENT INTENSITY DEFINED IN EVENT OBJECT
        alpha = 0.1 # Modifier for consecutive work impact on drain 
        k = 1 # Steepness of the yield curve - to be tuned based on experimentation (k = 1 is linear, k > 1 exponential)

        total_fitness = 0.0

        for i in range(24):
            clock_hour = (i + WAKE_UP_TIME) % 24
            event = candidate.timeslots[clock_hour]
            #print(f"Evaluating hour: {clock_hour}")
            predicted_energy, predicted_focus = self.energy_focus_landscape[clock_hour]
            effective_energy = predicted_energy - (s * 0.5) - residual_fatigue
            if event is not None:
                if effective_energy < 0:
                    task_yield = (importance * 0.01) + (effective_energy * 0.5)
                else:
                    task_yield = importance * math.pow(effective_energy, k)
                consecutive_hours += 1
                drain = intensity * math.pow((1 + alpha), consecutive_hours - 1)
                residual_fatigue += drain
                total_fitness += task_yield
            else:
                consecutive_hours = 0
                residual_fatigue *= 0.7
            
            if True:
                if event is not None:
                    print(f"Hour {clock_hour}: Event: {event.name if event else 'Free'}, Predicted Energy: {predicted_energy}, Effective Energy: {effective_energy}, Task Yield: {task_yield if event else 'N/A'}, Residual Fatigue: {residual_fatigue}, S value: {s}")
                else:
                    print(f"Hour {clock_hour}: Event: Free, Predicted Energy: {predicted_energy}, Effective Energy: {effective_energy}, Residual Fatigue: {residual_fatigue}, S value: {s}")
            s = calculate_s(s)
        
        candidate.simulation_score = total_fitness

    def visualise_individual(self, candidate):
        print(f"Candidate Schedule (Fitness: {candidate.simulation_score}):")
        for hour, event in enumerate(candidate.timeslots):
            if event is not None:
                print(f"""
                      Hour {hour}: {event.name}, 
                      Energy/Focus match score: {compute_net_score(event, TimeSlot(hour=hour, predicted_energy=self.energy_focus_landscape[hour][0],predicted_focus=self.energy_focus_landscape[hour][1]))},
                      Predicted Energy: {self.energy_focus_landscape[hour][0]},
                      Predicted Focus: {self.energy_focus_landscape[hour][1]},
                      Ideal Energy: {event.EventType.ideal_energy},
                      Ideal Focus: {event.EventType.ideal_focus}
                """)
            else:
                print(f"Hour {hour}: Free")
        print("\n")


baseline_energy, baseline_focus = get_baseline_array(phi1=7, phi2=12) # Example phase shifts for circadian and circasemidian rhythms

scheduler = SchedulerGA(events_to_schedule, energy_focus_landscape=list(zip(baseline_energy, baseline_focus)))

#scheduler.evaluate_population()
scheduler.evaluate_population_v2()

#test_schedule = CandidateSchedule(events=[], timeslots=[None]*24)
#scheduler.simulate_schedule(test_schedule)

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