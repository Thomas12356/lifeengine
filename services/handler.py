# This is just a temp file to test each package works individually

"""
from services.scheduler.scheduler_ga import SchedulerGA

# Custom data types import
from services.scheduler.models import EventType, Event

# Resource predictor import
from services.energy_predictor import get_baseline_array

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

baseline_energy, baseline_focus = get_baseline_array(phi1=7, phi2=12) # Fetch baseline energy landscape from resource predictor

scheduler = SchedulerGA(events_to_schedule, energy_focus_landscape=list(zip(baseline_energy, baseline_focus))) # Initalise new GA instance
scheduler.run() # Run the scheduler
"""