"""
    This file holds mapping functions for converting input DTOs to GA models
"""

from .input_dto import dbEventInput, dbEventTypeInput, dbUserPreferenceInput
from ..models import Event, EventType
from ..config import SLOT_SIZE
from datetime import datetime

# Given a HH:MM string, convert to slot index
def convert_hh_mm(time : str):
    hours, minutes = map(int, time.split(":"))
    total_minutes = (hours * 60) + minutes
    return total_minutes // SLOT_SIZE

# Given an ISO string convert to a slot index
def convert_time_iso(timeISO : str):
    time = datetime.fromisoformat(timeISO)
    return (time.hour * 60 + time.minute) // SLOT_SIZE

# Given a slot index convert to HH:MM
def convert_slot_index(slot_index):
    total_minutes = slot_index * SLOT_SIZE
    hours, minutes = divmod(total_minutes, 60)
    return f"{hours:02d}:{minutes:02d}"

def map_event(event_dto : dbEventInput, event_type_dto : dbEventTypeInput):
    """
        Given event, event type DTOs, map their values to Event and EventType
    """
    ideal_energy = event_dto.ideal_energy if event_dto.ideal_energy is not None else event_type_dto.ideal_energy
    burnout_rate = event_dto.burnout_rate if event_dto.burnout_rate is not None else event_type_dto.burnout_rate
    priority = event_dto.priority if event_dto.priority else event_type_dto.priority
    is_moveable = event_dto.is_moveable if not event_dto.is_moveable else event_type_dto.is_moveable

    scheduler_event_type = EventType(
        name=event_type_dto.name,
        ideal_energy=ideal_energy,
        ideal_focus=0, # TODO : Remove focus fields in future refactor
        energy_weight=1, # NOTE : Unused but maybe required, review
        focus_weight=1, # NOTE : Unused but maybe required, review
        impact=0.2, # NOTE : DEFAULT VALUE FOR NOW, WE SHOULD TEST THIS
        burnout_rate=burnout_rate,

        availability_window=(
            convert_hh_mm(event_type_dto.availability_start),
            convert_hh_mm(event_type_dto.availability_end)
        ),

        preferred_window=(
            convert_hh_mm(event_type_dto.preference_start),
            convert_hh_mm(event_type_dto.preference_end)
        )
    )

    scheduler_event = Event(
        event_id=event_dto.id,
        name=event_dto.name,
        EventType=scheduler_event_type,
        is_moveable=is_moveable,
        importance=priority,

        start_slot=convert_time_iso(event_dto.start_time),
        duration_slots=convert_time_iso(event_dto.end_time) - convert_time_iso(event_dto.start_time)

    )

    return scheduler_event

def map_preferences(preferences : dbUserPreferenceInput):

    wakeup_slot = convert_hh_mm(preferences.wakeup_time)
    bed_time = convert_hh_mm(preferences.bed_time)

    return wakeup_slot, bed_time

