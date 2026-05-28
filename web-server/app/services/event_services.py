import uuid
from datetime import datetime
from app import db
from app.models import Event, EventParameter, EventType

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

        event_parameters = clean_parameters(event_parameters)

        has_custom_params = False
        for param in event_parameters:
            if event_parameters[param] is not None:
                has_custom_params = True

        if has_custom_params:
            result = create_event_parameters(event_parameters)
            if not result["success"]:
                return result
            
            parameter_uuid = result["event_parameters_id"]
        else:
            parameter_uuid = None

        event_type_uuid = uuid.UUID(event_type_id_str) if event_type_id_str else None
        
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
        return {"success": False, "error": "Internal database error.", "status_code": 500}

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

def create_event_parameters(params):
    """
    Creates a record of event parameters, validates data and saves to db.
    """
    try:
        if params["priority"] is not None:
            priority = int(params["priority"])
            if priority > 10 or priority < 1:
                return {"success": False, "error": "priority must be between 1 and 10", "status_code": 400}
        else:
            priority = None
        
        if params["burnout_rate"] is not None:
            burnout_rate = float(params["burnout_rate"])
            if burnout_rate < 0 :
                return {"success": False, "error": "burnout_rate must be > 0", "status_code": 400}
        else:
            burnout_rate = None
        
        if params["ideal_energy"] is not None:
            ideal_energy = float(params["ideal_energy"])
            if ideal_energy < 0 or ideal_energy > 1:
                return {"success": False, "error": "ideal_energy must be between 0 and 1", "status_code": 400}
        else:
            ideal_energy = None

        created_at = datetime.now()

        new_parameters =  EventParameter(
            ideal_energy=ideal_energy,
            burnout_rate=burnout_rate,
            priority=priority,
            created_at=created_at,
        )

        db.session.add(new_parameters)
        db.session.commit()

        return {"success": True, "event_parameters_id": str(new_parameters.id)}
    
    except ValueError as e:
        return {"success": False, "error": f"Invalid data format: {str(e)}", "status_code": 400}
    
    except Exception as e:
        db.session.rollback()
        return {"success": False, "error": f"Internal database error. {str(e)}", "status_code": 500}

def create_event_type(user_id_str : str, parameters : dict, name : str):
    """
    Creates a new event type and saves to db.
    """
    default_parameters_id = "b0763a86-0d62-48a1-8cf8-cd881159405e"
    try:
        user_uuid = uuid.UUID(user_id_str)

        parameters = clean_parameters(parameters)

        has_custom_params = False
        for param in parameters:
            if parameters[param] is not None:
                has_custom_params = True

        if has_custom_params:
            result = create_event_parameters(parameters)
            if not result["success"]:
                return result
            
            parameters_uuid = result["event_parameters_id"]
        else:
            parameters_uuid = default_parameters_id

        created_at = datetime.now()

        new_event_type = EventType(
            user_id = user_uuid,
            event_parameter_id = parameters_uuid,
            name = name,
            created_at = created_at
        )

        db.session.add(new_event_type)
        db.session.commit()

        return {"success": True, "event_type_id": str(new_event_type.id)}
    
    except ValueError as e:
        return {"success": False, "error": f"Invalid data format: {str(e)}", "status_code": 400}
    
    except Exception as e:
        db.session.rollback()
        return {"success": False, "error": f"Internal database error. {str(e)}", "status_code": 500}
    
def get_user_events(user_id_str : str):

    try:

        user_uuid = uuid.UUID(user_id_str)

        events = Event.get_by_user_id(user_uuid)

        return {"success" : True, "events" : [event.to_dict() for event in events]}
    
    except ValueError as e:
        return {"success": False, "error": f"Invalid data format: {str(e)}", "status_code": 400}
    
    except Exception as e:
        return {"success": False, "error": f"Internal database error. {str(e)}", "status_code": 500}