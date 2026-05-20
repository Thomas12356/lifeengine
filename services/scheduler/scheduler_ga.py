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
    - Locate bug which results in fitness scores not showing for the found solution
    - Tune the parameters of the simulation (e.g. fatigue build up, recovery rate)
    - Implement a model for focus states and integrate into the simulation and fitness evaluation
    
"""

# Class imports
from evaluator import Evaluator
from schedule import Schedule

# Resource predictor import
from resource_predictor import get_baseline_array

# Custom data types import
from models import EventType, Event

# Library imports
import random
import copy

# NOTE : These constants should be moved to a GA config file
POPULATION_SIZE = 50 # Number of candidates in a population
NUM_GENERATIONS = 100 # Number of generations the GA runs for
ELITISM_RATE = 0.02 # Top % of population carried over for elitism
TOURNAMENT_SIZE = 5 # The size of the subset of individuals picked from for parent selection
MUTATION_RATE = 0.15 # Probability that a child will be mutatated

WAKE_UP_TIME = 7 # 7am
SLEEP_DURATION = 8 # User-reported ideal sleep duration
BED_TIME = (WAKE_UP_TIME + 24 - SLEEP_DURATION) % 24 # NOTE : This is not being used, could be removed
SCHEDULE_RESOLUTION = 24 # Number of timeslots to divide the day into (24 = 1 timeslot per hour)

# Placeholder for event type categories
event_types = {
    "Work": EventType("Work", ideal_energy=0.8, ideal_focus=0.8, energy_weight=1, focus_weight=4, impact=0.2, burnout_rate=0.1),
    "Exercise": EventType("Exercise", ideal_energy=0.6, ideal_focus=0.5, energy_weight=5, focus_weight=1, impact=0.4, burnout_rate=0.20),
    "Study": EventType("Study", ideal_energy=0.7, ideal_focus=0.9, energy_weight=1, focus_weight=4, impact=0.2, burnout_rate=0.15),
}

# Placeholder for storing events fed into the GA
events_to_schedule = [
    Event(1, "Task 1", event_types["Work"], start_time=9, duration=2),
    Event(2, "Task 2", event_types["Work"], start_time=None, duration=2),
    Event(3, "Work meeting", event_types["Work"], start_time=12, duration=1),
    Event(4, "Evening Workout", event_types["Exercise"], start_time=17, duration=1),
    Event(5, "Study Session", event_types["Study"], start_time=None, duration=2),
    Event(6, "Read budget report", event_types["Work"], start_time=None, duration=1),
]

class SchedulerGA:
    def __init__(self, events, energy_focus_landscape):
        self.events = events
        self.energy_focus_landscape = energy_focus_landscape
        self.energy_landscape, _ = list(zip(*self.energy_focus_landscape))
        self.population = self.initialise_population()
        self.next_gen = []
        self.fixed_events = []
        self.flexible_events = []
        self.base_schedule = []
        self.generation = 0
    
    def initialise_population(self):
        population = [] # Initalise population container

        for i in range(POPULATION_SIZE): # Iterate over population size

            candidate = Schedule(id=i, events=self.events, energy_landscape=self.energy_focus_landscape) # Intialise a new candidate schedule

            random.shuffle(candidate.events) # Shuffle list of events to be scheduled to increase diversity

            # NOTE: Fixed events could be determined by a flag rather than the presence of a start time
            fixed_events = [event for event in candidate.events if event.start_time is not None] # Extract events that cannot move 
            flexible_events = [event for event in candidate.events if event.start_time is None]

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
    
    def tournament_selection(self):

        selection = random.sample(self.population, TOURNAMENT_SIZE) # Randomly select k individuals
        return max(selection, key=lambda ind:ind.total_fitness) # Return the best from the selection

    def crossover(self, parent1, parent2):

        crossover_point = random.randint(0, 23) # Randomly select a point to split each parent

        # Breed parents to create offspring using deep copy to break references
        child1_slots = copy.deepcopy(parent1.timeslots[:crossover_point] + parent2.timeslots[crossover_point:])
        child2_slots = copy.deepcopy(parent2.timeslots[:crossover_point] + parent1.timeslots[crossover_point:])

        # Filter through time slots to build list of events
        #child1_events = [timeslot.event for timeslot in child1_slots if timeslot is not None]
        #child2_events = [timeslot.event for timeslot in child2_slots if timeslot is not None]

        # Create schedule objects using childrens event lists
        child1 = Schedule(id=len(self.next_gen), events=self.events, energy_landscape=self.energy_focus_landscape)
        child2 = Schedule(id=len(self.next_gen) + 1, events=self.events, energy_landscape=self.energy_focus_landscape)

        # Set children timeslots
        child1.timeslots = child1_slots
        child2.timeslots = child2_slots

        # NOTE: Children need to be repaired to ensure schedules stay valid (no repeat events)
        return child1, child2
    
    def mutate(self, candidate):
        # Only mutate based on probability (mutation rate)
        # Randomly select either swap mutation or move mutation
        # Swap mutations provide macro variations where order of events change
        # Move mutations provide micro variations where flexible events are shifted
        shift_range = 6

        if random.random() > MUTATION_RATE:
            return
        
        if random.random() > 0.5:
            self.move_mutation(candidate, shift_range)
        else:
            self.swap_mutation(candidate)

    # Given a candidate and shift range, select a random event and adjust the start time
    def move_mutation(self, candidate, shift_range):
        
        # Build list of scheduled flexible events
        # NOTE : This line is re-used in swap_mutation, it could be made a method of Schedule (e.g Schedule.get_flexible_events)
        flexible_events = list(set(timeslot.event for timeslot in candidate.timeslots if timeslot is not None and timeslot.event.start_time is None))       

        if len(flexible_events) == 0: # No flexible events present so mutation not possible
            return
        
        event = random.choice(flexible_events) # Randomly select an event

        old_start = candidate.find_start_time(event.event_id) # Find the hour in which the event is scheduled to start
        shift = random.randint(-shift_range, shift_range) # Randomly select a value within the shift range to shift the start time by
        new_start = max(0, min(23, old_start + shift)) # Calculate and normalise the shifted start time so it does not exceed the 24 hour time period

        candidate.clear_event(event.event_id) # Remove all instances of the event
        candidate.insert_event(event, new_start) # Attempt to re-insert at the shifted start time

    # Given a candidate, randomly select 2 events and swap their start times
    def swap_mutation(self, candidate):
        
        # Build list of scheduled flexible events
        flexible_events = list(set(timeslot.event for timeslot in candidate.timeslots if timeslot is not None and timeslot.event.start_time is None))

        if len(flexible_events) < 2: # If there is not enough elements to perform a swap, abort the mutation
            return

        event1, event2 = random.sample(flexible_events, 2) # Randomly select 2 events

        # Fetch the start times of both events
        event1_start = candidate.find_start_time(event1.event_id)
        event2_start = candidate.find_start_time(event2.event_id)

        # Clear both events from the schedule
        candidate.clear_event(event1.event_id)
        candidate.clear_event(event2.event_id)

        # Attempt to insert each event at the others start time
        candidate.insert_event(event2, event1_start)
        candidate.insert_event(event1, event2_start)

    def evolve(self):
        # EVOLUTION LOOP :
        #   1. Use elitism to preserve top candidates
        #   2. Use tournament selection population_size / 2 times to produce offspring
        #   3. Mutate each offspring with a probability of mutation_rate
        #   4. Repair offspring to resolve invalid schedules produced by crossover and mutation
        #   5. Add offspring to next_gen
        #   6. Replace current population with next generation

        # Elitism
        num_elits = max(1, int(POPULATION_SIZE * ELITISM_RATE)) # Using elitism rate calculate the number of individuals to be directly carried over
        for i in range(num_elits):
            individual = copy.deepcopy(self.population[i]) # copy.deepcopy() to ensure object integrity
            self.next_gen.append(individual) # Add the "elite" individual directly to the next population

        # Main loop, repeat until population is full
        while len(self.next_gen) < POPULATION_SIZE:
            
            # Select parents 
            parent1 = self.tournament_selection()
            parent2 = self.tournament_selection()

            child1, child2 = self.crossover(parent1, parent2) # "Breed" parent 1 & 2 to produce children

            # Mutate each child (only happens with probability MUTATION_RATE)
            self.mutate(child1)
            self.mutate(child2)

            # Repair each child after crossover & mutation to ensure they are valid schedules
            child1.repair()
            child2.repair()

            # Update next generation
            self.next_gen.append(child1) 
            if len(self.next_gen) < POPULATION_SIZE:
                self.next_gen.append(child2)

        self.population = self.next_gen # Replace current population with the next generation
        self.next_gen = [] # Clear next generation

    def run(self):
        
        energy_landscape, _ = zip(*self.energy_focus_landscape) # Unpack energy landscape
        evaluator = Evaluator(self.population, list(energy_landscape)) # Initalise evaluator
        best_individual = None
        
        while self.generation < NUM_GENERATIONS: # Repeat until max number of generations has been reached
            self.population = evaluator.evaluate_population() # Evalute whole population

            # NOTE : We should sort by total fitness once it has been decided how we weight energy match & simulation scores
            self.population.sort(key=lambda x: x.total_fitness, reverse=True) # Sort based on simulation score

            # DEBUG - This is used to track number of unique candidates and check genetic diversity across generations
            seen = set() 
            for ind in self.population:
               seen.add(ind.simulation_score)
           
            print(f"Generation {self.generation} max fitness : {self.population[0].total_fitness}, n unique scores = {len(seen)}")

            # Compare best individual of current generation against overall best
            if best_individual:
                if self.population[0].total_fitness > best_individual.total_fitness:
                    best_individual = self.population[0]
            else:
                best_individual = self.population[0]

            self.evolve() # Evolve population
            self.generation += 1 # Increment number of generations
            evaluator.population = self.population # Update evaluator with new population
        
        self.population = evaluator.evaluate_population()
        self.population.sort(key=lambda x: x.total_fitness, reverse=True) # Sort population
        best_individual.visualise() # DEBUG - Used to visualise the schedule of the best individual across all generations

baseline_energy, baseline_focus = get_baseline_array(phi1=7, phi2=12) # Fetch baseline energy landscape from resource predictor

scheduler = SchedulerGA(events_to_schedule, energy_focus_landscape=list(zip(baseline_energy, baseline_focus))) # Initalise new GA instance
scheduler.run() # Run the scheduler
