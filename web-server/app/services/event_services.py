import uuid
from datetime import datetime, time
from app import db
from app.models import Event

from app.services.event_parameter_services import create_event_parameters
from app.services.event_type_services import get_default_event_type
from app.utils.events_util import clean_parameters

def create_event(
        user_id_str: str,
        name, start_time_str: str,
        end_time_str: str,
        colour: str,
        event_type_id_str: str = None,
        event_parameters: dict = None,
        is_moveable: bool = False,
        is_active: bool = True,
    ):
    """
    Creates an event and validates data format, saves to db.
    """
    try:
        start_dt = datetime.fromisoformat(start_time_str)
        end_dt = datetime.fromisoformat(end_time_str)

        if end_dt <= start_dt:
            return {"success": False, "error": "end_time must be after start_time", "status_code": 400}

        user_uuid = uuid.UUID(user_id_str)

        overlapping_event = (
            Event.query
            .filter(Event.user_id==user_uuid)
            .filter(Event.is_active==True)
            .filter(Event.start_time < end_dt)
            .filter(Event.end_time > start_dt)
            .first()
        )

        if overlapping_event:
            return {"success": False, "error": "Event overlaps with existing event", "status_code": 409}


        event_parameters = clean_parameters(event_parameters)

        if event_type_id_str:
            event_type_uuid = uuid.UUID(event_type_id_str) 
        else:
            result = get_default_event_type(user_id_str)

            if not result["success"]:
                return result
            
            event_type_uuid = uuid.UUID(result["event_type_id"])

        has_custom_params = False
        parameter_uuid = None
        for param in event_parameters:
            if event_parameters[param] is not None:
                has_custom_params = True

        if has_custom_params:
            result = create_event_parameters(event_parameters)
            if not result["success"]:
                return result
            
            parameter_uuid = uuid.UUID(result["event_parameters_id"])
        
        
        new_event = Event(user_id=user_uuid,
                           event_type_id=event_type_uuid,
                           event_parameter_id=parameter_uuid,
                           name=name,
                           start_time=start_dt,
                           end_time=end_dt,
                           is_moveable=is_moveable,
                           is_active=is_active,
                           colour=colour
                        )
        
        db.session.add(new_event)
        db.session.commit()

        return {"success": True, "event_id": str(new_event.id)}

    except ValueError as e:
        return {"success": False, "error": f"Invalid data format: {str(e)}", "status_code": 400}
    
    except Exception as e:
        db.session.rollback()
        return {"success": False, "error": f"Internal database error: {str(e)}", "status_code": 500}

def delete_event(user_id_str : str, event_id_str : str):
    """
    Soft deletes and event by setting the columns is_active to False
    """

    try:
        event_uuid = uuid.UUID(event_id_str)
        user_uuid = uuid.UUID(user_id_str)

        event = Event.find_by_id(event_uuid) # Fetch event by ID

        # Return error if event could not be found
        if not event:
            return {"success" : False, "error" : "Event does not exist.", "status_code" : 404}

        # Return error if event does not belong to user making request
        if event.user_id != user_uuid:
            return {"success" : False, "error" : "User does not have permission to delete this event.", "status_code" : 403}

        event.is_active = False # Soft delete
        db.session.commit()
        return {"success" : True} # Return success

    except ValueError as e:
        return {"success": False, "error": f"Invalid data format: {str(e)}", "status_code": 400}
    
    except Exception as e:
        db.session.rollback()
        return {"success": False, "error": "Internal database error.", "status_code": 500}

def get_user_events_details(user_id_str : str):

    try:

        user_uuid = uuid.UUID(user_id_str)

        events = Event.get_details_by_user_id(user_uuid)

        events_list = [{
                "id" : event.id,
                "name" : event.name,
                "start_time" : event.start_time.isoformat() if event.start_time else None,
                "end_time" : event.end_time.isoformat() if event.end_time else None,
                "colour" : event.colour
            }
            for event in events
        ]

        return {"success" : True, "events" : events_list}
    
    except ValueError as e:
        return {"success": False, "error": f"Invalid data format: {str(e)}", "status_code": 400}
    
    except Exception as e:
        return {"success": False, "error": f"Internal database error. {str(e)}", "status_code": 500}
    
#------------------- GET USER EVENTS -> BY DAY -------------------
def get_user_events_by_day(user_id_str : str, date_str : str):
    if not date_str:
        return {"success": False, "error": "date parameter is required", "status_code": 400}
    elif not user_id_str:
        return {"success": False, "error": "user_id parameter is required", "status_code": 400}
    
    try:
        user_uuid = uuid.UUID(user_id_str)
        iso_date = datetime.fromisoformat(date_str)

        target_date = iso_date.date()
        day_start = datetime.combine(target_date, time.min)
        day_end = datetime.combine(target_date, time.max)

        events = (
            Event.query
            .filter(Event.user_id == user_uuid,
                    Event.start_time >= day_start,
                    Event.end_time <= day_end,
                    Event.is_active == True
            ).all()
        )

        if not events:
            return {"success": True, "events": [], "status_code": 200}

        events_list = [
            {
                "id": event.id,
                "name": event.name,
                "start_time": event.start_time.isoformat(),
                "end_time": event.end_time.isoformat(),
                "colour": event.colour,
                "is_moveable" : event.is_moveable
            }
            for event in events
        ]

        return {"success": True, "events": events_list, "status_code": 200}

    except ValueError as e:
        return {"success": False, "error": f"Invalid data format: {str(e)}", "status_code": 400}
    
    except Exception as e:
        return {"success": False, "error": f"Internal database error. {str(e)}", "status_code": 500}
    
def get_user_events_by_range(user_id_str : str, range_start_str : str, range_end_str : str):
    """
        Fetch all events within a date range using user_id
    """
    try:

        user_uuid = uuid.UUID(user_id_str)
        range_start = datetime.fromisoformat(range_start_str)
        range_end = datetime.fromisoformat(range_end_str)

        if range_end < range_start:
            return {"success": False, "error": f"range_start must be before range_end", "status_code": 400}

        events = Event.get_range_by_user_id(user_uuid, range_start, range_end)

        events_list = [
            {
                "id" : event.id,
                "name" : event.name,
                "start_time" : event.start_time.isoformat() if event.start_time else None,
                "end_time" : event.end_time.isoformat() if event.end_time else None,
                "colour" : event.colour
            }
            for event in events
        ]

        return {"success" : True, "events" : events_list}
    
    except ValueError as e:
        return {"success": False, "error": f"Invalid data format: {str(e)}", "status_code": 400}
    
    except Exception as e:
        return {"success": False, "error": f"Internal database error. {str(e)}", "status_code": 500}


