from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import Event, EventType, EventParameter, UserPreferences
from app.services.schedule_optimiser.dto.input_dto import dbEventInput, dbEventTypeInput, dbUserPreferenceInput
from app.services.schedule_optimiser.dto.mapper import convert_slot_index
from app.services.schedule_optimiser.tasks.auto_reschedule import auto_reschedule
from app.services import event_type_services, event_services
from datetime import datetime
import uuid

from app.services.event_services import reschedule_event

def auto_reschedule_event(event_id_str):
    """
    Generate a proposed schedule.
    Do not save changes here.
    """

    event = Event.find_by_id(uuid.UUID(event_id_str)).to_dict() # Fetch event details
    user_id = event["user_id"] # Fetch user ID, in future replace with JWT fetch

    event_date = event["start_time"][:10]

    same_day = False
    today_date = datetime.now().date().isoformat()
    if today_date == event_date:
        same_day = True

    event_to_reschedule = None
    day_events = (event_services.get_user_events_by_day(user_id, event["start_time"]))["events"]
    day_array = []
    for event in day_events:    
        event_type = EventType.get_by_own_id(uuid.UUID(event["event_type_id"])).to_dict() # Fetch event type details
        
        # If event has custom paramters, fetch them, otherwise use EventTypes parameters
        parameter_id = event["event_parameter_id"] if event["event_parameter_id"] != "None" or None else event_type["event_parameter_id"]
        event_parameters = EventParameter.find_by_id(uuid.UUID(parameter_id)).to_dict()

        # Get the users default event type
        user_default_type = event_type_services.get_default_event_type(user_id)
        default_params = EventParameter.find_by_id(uuid.UUID(user_default_type["event_parameter_id"])).to_dict()

        ideal_energy = event_parameters.get("ideal_energy") # Try to retrieve parameters
        burnout_rate = event_parameters.get("burnout_rate") # If thse are None, we use default values

        # Build event DTO
        event_dto = dbEventInput(
            id=event["id"],
            name=event["name"],
            start_time=event["start_time"],
            end_time=event["end_time"],
            is_moveable=event["is_moveable"],
            ideal_energy=ideal_energy if ideal_energy is not None else default_params["ideal_energy"],
            burnout_rate=burnout_rate if burnout_rate is not None else default_params["burnout_rate"],
            priority=event_parameters["priority"]
        )

        # Build event type DTO
        event_type_dto = dbEventTypeInput(
            id=event_type["id"],
            name=event_type["name"],
            is_moveable=event_type["is_moveable"],
            availability_start = event_type["availability_start"],
            availability_end = event_type["availability_end"],
            preference_start = event_type["preference_start"],
            preference_end = event_type["preference_end"],
            ideal_energy=ideal_energy if ideal_energy is not None else default_params["ideal_energy"],
            burnout_rate=burnout_rate if burnout_rate is not None else default_params["burnout_rate"],
            priority=event_parameters["priority"]
        )

        if str(event["id"]) != event_id_str: # 
            day_array.append((event_dto, event_type_dto))
        else:
            event_to_reschedule = (event_dto, event_type_dto)

    # Fetch user preferences
    user_preferences = UserPreferences.get_user_preferences(user_id).to_dict()
    user_preferences_dto = dbUserPreferenceInput(
        wakeup_time=user_preferences["wakeup_time"],
        bed_time=user_preferences["bed_time"]
    )

    result = auto_reschedule(event_to_reschedule, day_array, user_preferences_dto, same_day=same_day)
    new_schedule = []
    for event in result.fetch_events():
        end_slot = event["start_slot"] + event["duration_slots"]
        new_schedule.append(
            {
                "id" : event["id"],
                "name" : event["name"],
                "start_time" : event_date + "T" + convert_slot_index(event["start_slot"]),
                "end_time" : event_date + "T" + convert_slot_index(end_slot)
            }
            
        )

    
    return {
        "ok": True,
        "old_schedule": day_events,
        "new_schedule": new_schedule,
        # "changes": [
        #     {
        #         "event_id": event_id_str,
        #     }
        # ],
    }

def apply_auto_reschedule(user_id_str: str, pending_reschedule: dict):
    new_schedule = pending_reschedule.get("new_schedule", [])

    if not new_schedule:
        return {
            "ok": False,
            "error": "No proposed schedule to apply.",
        }
    
    updated_events = []

    for event in new_schedule:
        event_id = event.get("id")
        event_services.delete_event(user_id_str, event_id)

    for event in new_schedule:
        event_id = event.get("id")
        new_start = event.get("start_time")
        new_end = event.get("end_time")

        if not event_id or not new_start or not new_end:
            return {
                "ok": False,
                "error": "Invalid event in proposed schedule.",
            }
        
        event_services.delete_event(user_id_str, event_id)
        
        result = reschedule_event(
            user_id_str=user_id_str,
            event_id_str=str(event_id),
            new_start=new_start,
            new_end=new_end,
            bulk=True
        )

        if not result.get("success"):
            return result

        updated_events.append({
            "event_id": event_id,
            "result": result,
        })

    return {
        "success": True,
        "message": "Auto-reschedule applied.",
        "updated_events": updated_events,
        "status_code": 200,
    }