# Library imports
import random
import copy
# Class & config imports
from ..evaluator import Evaluator
from .schedule import Schedule
from ..config import (
    SCHEDULE_RESOLUTION,
    SLOT_SIZE,
    POPULATION_SIZE,
    NUM_GENERATIONS,
    ELITISM_RATE,
    TOURNAMENT_SIZE,
    MUTATION_RATE,
    SHIFT_RANGE
)

class SchedulerGA:
    def __init__(self, events, energy_focus_landscape, wakeup_slot, bed_time_slot):
        self.events = events
        self.energy_focus_landscape = energy_focus_landscape
        self.energy_landscape, _ = list(zip(*self.energy_focus_landscape))
        self.wakeup_slot = wakeup_slot
        self.bed_time_slot = bed_time_slot
        self.population = self.initialise_population()
        self.next_gen = []
        #self.fixed_events = []
        #self.flexible_events = []
        #self.base_schedule = []
        self.generation = 0
    
    def initialise_population(self):
        population = [] # Initalise population container

        for i in range(POPULATION_SIZE): # Iterate over population size

            candidate = Schedule(
                id=i,
                events=self.events,
                energy_landscape=self.energy_focus_landscape,
                wakeup_slot=self.wakeup_slot,
                bed_time_slot=self.bed_time_slot
            ) # Intialise a new candidate schedule

            random.shuffle(candidate.events) # Shuffle list of events to be scheduled to increase diversity

            # NOTE: Fixed events could be determined by a flag rather than the presence of a start time
            fixed_events = [event for event in candidate.events if not event.is_moveable] # Extract events that cannot move 
            flexible_events = [event for event in candidate.events if event.is_moveable]

            # NOTE : We may want to expand this so some events can be carried over when day-to-day scheduling is implemented
            unscheduled_count = 0 # Track number of events that could not be scheduled so they can be penalised 
            for event in fixed_events:
                success = candidate.insert_event(event, event.start_slot) # Attempt to insert event
                if not success:
                    unscheduled_count += 1 # If unsuccesfull increment the count

            for event in flexible_events:
                assigned = False
                attempts = 0
                while not assigned and attempts < 100: # Randomly select slots until limit is reached
                    attempts += 1
                    slot = random.randint(0, SCHEDULE_RESOLUTION - event.duration_slots) # Randomly select a slot NOTE : We could limit this to not schedule <WAKEUP & >BEDTIME

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

        crossover_point = random.randint(0, SCHEDULE_RESOLUTION - 1) # Randomly select a point to split each parent

        # Breed parents to create offspring using deep copy to break references
        child1_slots = copy.deepcopy(parent1.timeslots[:crossover_point] + parent2.timeslots[crossover_point:])
        child2_slots = copy.deepcopy(parent2.timeslots[:crossover_point] + parent1.timeslots[crossover_point:])

        # Filter through time slots to build list of events
        #child1_events = [timeslot.event for timeslot in child1_slots if timeslot is not None]
        #child2_events = [timeslot.event for timeslot in child2_slots if timeslot is not None]

        # Create schedule objects using childrens event lists
        child1 = Schedule(id=len(self.next_gen), events=self.events, energy_landscape=self.energy_focus_landscape, wakeup_slot=self.wakeup_slot, bed_time_slot=self.bed_time_slot)
        child2 = Schedule(id=len(self.next_gen) + 1, events=self.events, energy_landscape=self.energy_focus_landscape, wakeup_slot=self.wakeup_slot, bed_time_slot=self.bed_time_slot)

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
        if random.random() > MUTATION_RATE:
            return
        
        if random.random() > 0.5:
            self.move_mutation(candidate, SHIFT_RANGE)
        else:
            self.swap_mutation(candidate)

    # Given a candidate and shift range, select a random event and adjust the start time
    def move_mutation(self, candidate, shift_range):
        
        # Build list of scheduled flexible events
        # NOTE : This line is re-used in swap_mutation, it could be made a method of Schedule (e.g Schedule.get_flexible_events)
        flexible_events = list(set(timeslot.event for timeslot in candidate.timeslots if timeslot is not None and timeslot.event.is_moveable))       

        if len(flexible_events) == 0: # No flexible events present so mutation not possible
            return
        
        event = random.choice(flexible_events) # Randomly select an event

        old_start = candidate.find_start_slot(event.event_id) # Find the slot in which the event is scheduled to start
        shift = random.randint(-shift_range, shift_range) # Randomly select a value within the shift range to shift the start time by
        new_start = max(0, min(SCHEDULE_RESOLUTION - event.duration_slots, old_start + shift)) # Calculate and normalise the shifted start time so it does not exceed the 24 hour time period

        candidate.clear_event(event.event_id) # Remove all instances of the event
        candidate.insert_event(event, new_start) # Attempt to re-insert at the shifted start time

    # Given a candidate, randomly select 2 events and swap their start times
    def swap_mutation(self, candidate):
        
        # Build list of scheduled flexible events
        flexible_events = list(set(timeslot.event for timeslot in candidate.timeslots if timeslot is not None and timeslot.event.is_moveable))

        if len(flexible_events) < 2: # If there is not enough elements to perform a swap, abort the mutation
            return

        event1, event2 = random.sample(flexible_events, 2) # Randomly select 2 events

        # Fetch the start times of both events
        event1_start = candidate.find_start_slot(event1.event_id)
        event2_start = candidate.find_start_slot(event2.event_id)

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
        evaluator = Evaluator(list(energy_landscape), self.wakeup_slot, self.bed_time_slot) # Initalise evaluator
        best_individual = None
        
        while self.generation < NUM_GENERATIONS: # Repeat until max number of generations has been reached
            self.population = evaluator.evaluate_population(self.population) # Evalute whole population

            # NOTE : We should sort by total fitness once it has been decided how we weight energy match & simulation scores
            self.population.sort(key=lambda x: x.total_fitness, reverse=True) # Sort based on simulation score

            # DEBUG - This is used to track number of unique candidates and check genetic diversity across generations
            seen = set() 
            for ind in self.population:
               seen.add(ind.simulation_score)

            # DEBUG
            #print(f"Generation {self.generation} max fitness : {self.population[0].total_fitness}, n unique scores = {len(seen)}")

            # Compare best individual of current generation against overall best
            if best_individual:
                if self.population[0].total_fitness > best_individual.total_fitness:
                    best_individual = self.population[0]
            else:
                best_individual = self.population[0]

            self.evolve() # Evolve population
            self.generation += 1 # Increment number of generations
            evaluator.population = self.population # Update evaluator with new population
        
        self.population = evaluator.evaluate_population(self.population)
        self.population.sort(key=lambda x: x.total_fitness, reverse=True) # Sort population
        
        return best_individual

