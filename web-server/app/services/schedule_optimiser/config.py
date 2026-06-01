
# ------- SCHEDULE CONFIG ----------------
SLOT_SIZE = 15 # time slots size in minutes
SLOTS_PER_DAY = 24 * 60 // SLOT_SIZE
SCHEDULE_RESOLUTION = SLOTS_PER_DAY

# ------------ GA CONFIG -----------------
POPULATION_SIZE = 50 # Number of candidates in a population
NUM_GENERATIONS = 100 # Number of generations the GA runs for
ELITISM_RATE = 0.02 # Top % of population carried over for elitism
TOURNAMENT_SIZE = 5 # The size of the subset of individuals picked from for parent selection
MUTATION_RATE = 0.15 # Probability that a child will be mutatated
SHIFT_RANGE_HOURS = 2 # Number of hours an event can be shifted by
SHIFT_RANGE = (SHIFT_RANGE_HOURS * 60) // SLOT_SIZE # Convert hours to slot index

# ---------- SIMULATION CONFIG -----------
S = 0.02 # Placeholder for inital S process value used in the simulation at wakeup time
IMPORTANCE = 50 # Placeholder for event importance, to be replaced with a value defined in the Event object
K = 1 # Steepness of the yield curve - to be tuned based on experimentation (k = 1 is linear, k > 1 exponential)
FATIGUE_MODIFIER = -2.0 # Modifier for the fatigue penalty applied to task yield when effective energy is below 0
RECOVERY_RATE = 0.7 # Rate at which residual fatigue decreases during rest 
WASTE_COST_WEIGHT = 0.5 # Weight of penalisation for wasted energy (high prediction on low energy task)
UNSCHEDULED_EVENTS_PENALTY = 1000 # Total fitness penalty per event left unscheduled
PREFERENCE_WINDOW_PENATLY = 2 # Total fitness penalty for scheduling an event outside preference hours

SLOT_HOURS = SLOT_SIZE / 60

# -------- REMOVE ONCE DTO IS MADE -------
WAKE_UP_TIME = 7
BED_TIME = 23
WAKE_UP_SLOT = (WAKE_UP_TIME * 60) // SLOT_SIZE
BED_SLOT = (BED_TIME * 60) // SLOT_SIZE