"""

    Scheduler task : Auto reschedule single event on the same day

    Notes : 
        - Reject immedietly if no time left in the day to fit in event
        - Take in DTOS, they are built in the service file
"""

from app.services import event_services, event_type_services, event_parameter_services, user_services
from app.models import Event, EventType, EventParameter, UserPreferences
from ..dto.input_dto import dbEventInput, dbEventTypeInput, dbUserPreferenceInput
from ..dto.mapper import map_event

def auto_reschedule(event_to_reschedule : dbEventInput, event_type : dbEventTypeInput, user_preferences : dbUserPreferenceInput):
    
    print(map_event(event_dto=event_to_reschedule, event_type_dto=event_type), user_preferences)

    