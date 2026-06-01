# This is just a temp file to test the scheduler

from app.services.schedule_optimiser.scheduler.scheduler_ga import SchedulerGA

# Custom data types import
from .models import EventType, Event

# Resource predictor import
from app.services.schedule_optimiser.energy_predictor import get_baseline_array

from app.services.schedule_optimiser.config import SCHEDULE_RESOLUTION, WAKE_UP_SLOT, BED_SLOT, WAKE_UP_TIME, BED_TIME

global_avail_window = (WAKE_UP_SLOT + 4, BED_SLOT - 4) # 1 hour after wakeup, 1 hour before bed
default_pref_window = global_avail_window

# Placeholder for event type categories
event_types = {
    "Work": EventType(
        "Work",
        ideal_energy=0.8,
        ideal_focus=0.8,
        energy_weight=1,
        focus_weight=4,
        impact=0.2,
        burnout_rate=0.1,
        availability_window=global_avail_window,
        preferred_window=default_pref_window
    ),
    "Exercise": EventType(
        "Exercise",
        ideal_energy=0.6,
        ideal_focus=0.5,
        energy_weight=5,
        focus_weight=1,
        impact=0.4,
        burnout_rate=0.20,
        availability_window=global_avail_window,
        preferred_window=default_pref_window
    ),
    "Study": EventType(
        "Study",
        ideal_energy=0.7,
        ideal_focus=0.9,
        energy_weight=1,
        focus_weight=4,
        impact=0.2,
        burnout_rate=0.15,
        availability_window=global_avail_window,
        preferred_window=(52, 76) # 1PM-7PM
    ),
    "Default": EventType(
        "Default",
        ideal_energy=0.1,
        ideal_focus=0.1,
        energy_weight=1,
        focus_weight=4,
        impact=0.1,
        burnout_rate=0.15,
        availability_window=global_avail_window,
        preferred_window=default_pref_window
    ),
}

# Placeholder for storing events fed into the GA
events_to_schedule = [
    Event(1, "Task 1", event_types["Default"], start_slot=36, duration_slots=8, importance=1, is_moveable=True),
    Event(2, "Task 2", event_types["Default"], start_slot=72, duration_slots=8, importance=1, is_moveable=False),
    Event(3, "Work meeting", event_types["Default"], start_slot=48, duration_slots=4, importance=1, is_moveable=False),
    Event(4, "Evening Workout", event_types["Default"], start_slot=68, duration_slots=4, importance=10, is_moveable=True),
    Event(5, "Study Session", event_types["Study"], start_slot=52, duration_slots=8, importance=1, is_moveable=True),
]
    # NOTE : REVIEW PHI1 & PHI2 CALC
baseline_energy, _ = get_baseline_array(phi1=WAKE_UP_TIME + 1, phi2=WAKE_UP_TIME, resolution=SCHEDULE_RESOLUTION) # Fetch baseline energy landscape from resource predictor

scheduler = SchedulerGA(
    events_to_schedule,
    energy_focus_landscape=list(zip(baseline_energy,_)),
    wakeup_slot=WAKE_UP_SLOT,
    bed_time_slot=BED_SLOT
    
) # Initalise new GA instance
scheduler.run() # Run the scheduler
