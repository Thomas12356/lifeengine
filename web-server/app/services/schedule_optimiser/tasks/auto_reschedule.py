"""

    Scheduler task : Auto reschedule single event on the same day

"""

from ..dto.input_dto import dbUserPreferenceInput
from ..dto.mapper import map_event, map_preferences, convert_slot_index
from ..config import SCHEDULE_RESOLUTION, SLOT_SIZE
from ..energy_predictor import get_baseline_array
from ..scheduler import SchedulerGA

def auto_reschedule(
        event_to_reschedule : tuple,
        day_array : list[tuple],
        user_preferences_dto : dbUserPreferenceInput
    ):
    
    events_to_schedule = [] # Initalise array to feed into GA
    for (event_dto, event_type_dto) in day_array: # Extract DTOs from array and map to GA Event model
        events_to_schedule.append(map_event(event_dto=event_dto, event_type_dto=event_type_dto))

    (event_dto, event_type_dto) = event_to_reschedule
    reschedule_id = event_dto.id # Record ID so we can fetch from GA result and add to array
    events_to_schedule.append(map_event(event_dto=event_dto, event_type_dto=event_type_dto))

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

    result.visualise()

    return result



    