"""

    Scheduler task : Auto reschedule single event on the same day

"""

from ..dto.input_dto import dbUserPreferenceInput
from ..dto.mapper import map_event, map_preferences, convert_slot_index
from ..config import SCHEDULE_RESOLUTION, SLOT_SIZE
from ..energy_predictor import get_baseline_array
from ..scheduler import SchedulerGA
from dataclasses import replace
from datetime import datetime

def auto_reschedule(
        event_to_reschedule : tuple,
        day_array : list[tuple],
        user_preferences_dto : dbUserPreferenceInput,
        same_day : bool
    ):
    
    events_to_schedule = [] # Initalise array to feed into GA
    for (event_dto, event_type_dto) in day_array: # Extract DTOs from array and map to GA Event model
        events_to_schedule.append(map_event(event_dto=event_dto, event_type_dto=event_type_dto))

    (event_dto, event_type_dto) = event_to_reschedule
    reschedule_id = event_dto.id # Record ID so we can fetch from GA result and add to array
    events_to_schedule.append(map_event(event_dto=event_dto, event_type_dto=event_type_dto))

    if same_day: # If the event requested for reschedule is today, block all other events from moving and ensure that event can move
        for index, event in enumerate(events_to_schedule):
            if event.event_id != reschedule_id:
                events_to_schedule[index] = replace(event, is_moveable=False)
            else:
                events_to_schedule[index] = replace(event, is_moveable=True)

    # Map wakeup and bed times to slot indexes
    WAKEUP_SLOT, BED_TIME_SLOT = map_preferences(user_preferences_dto)
    # Calculate circadian and circasemidian peaks based on wake up times as slot indexes
    # NOTE : For now peak times are hardcoded, but in the future we could ask the user what time they
    # experience peak energy
    slots_per_hour = 60 // SLOT_SIZE
    circadian_peak = WAKEUP_SLOT + (3 * slots_per_hour) # (3 hours after wakeup)
    circasemidian_peak = WAKEUP_SLOT + (3 * slots_per_hour) # (Also 3 hours after wakeup)

    ciradian_time_shift = circadian_peak - ((24/4) * slots_per_hour) # Calculate timeshift from peak position
    circasemidian_time_shift = circasemidian_peak - ((12/4) * slots_per_hour)

    # Fetch baseline energy prediction
    # NOTE : the predictor still returns baseline focus array, but we can ignore it
    baseline_energy, _ = get_baseline_array(phi1=ciradian_time_shift, phi2=circasemidian_time_shift, resolution=SCHEDULE_RESOLUTION)

    scheduler = SchedulerGA(
        events_to_schedule,
        energy_focus_landscape=list(zip(baseline_energy,_)),
        wakeup_slot=WAKEUP_SLOT,
        bed_time_slot=BED_TIME_SLOT
        
    ) # Initalise new GA instance
    result = scheduler.run() # Run the scheduler

    # If the event being rescheduled is today, we should reject a new start time earlier than the current time
    # NOTE : We can improve this by including the logic in the fitness function, because currently if we try
    # multiple attempts at rescheduling the same result will be produced
    if same_day:
        event_slot = result.find_start_slot(reschedule_id)
        new_event_start = convert_slot_index(event_slot)
        current_time = datetime.now().strftime("%H:%M")

        if new_event_start < current_time:
            return {"error": "Failed to find a valid time today.", "ok": False}

    return {"result": result, "ok": True}



    