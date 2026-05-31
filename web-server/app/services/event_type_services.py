import uuid
from datetime import datetime
from app import db
from app.models import EventType
import os

from app.services.event_parameter_services import create_event_parameters
from app.services.utils.events_util import clean_parameters

def get_default_event_type(user_id_str):
    try:
        user_uuid = uuid.UUID(user_id_str)

        existing_defaults = (
            EventType.query.filter_by(user_id=user_uuid, name="Default").one_or_none()
        )

        if existing_defaults:
            return {
                "success" : True,
                "event_type_id" : str(existing_defaults.id),
                "event_parameter_id" : str(existing_defaults.parameter.id)
                if existing_defaults.event_parameter_id else None
            }

        defaults = {
            "ideal_energy": os.environ.get("DEFAULT_IDEAL_ENERGY"),
            "burnout_rate": os.environ.get("DEFAULT_BURNOUT_RATE"),
            "priority": os.environ.get("DEFAULT_PRIORITY"),
        }

        result = create_event_parameters(defaults)

        if not result["success"]:
            return result

        parameter_uuid = uuid.UUID(result["event_parameters_id"])

        default_event_type = EventType(
            user_id=user_uuid,
            event_parameter_id=parameter_uuid,
            name="Default",
            created_at=datetime.now()
        )

        db.session.add(default_event_type)
        db.session.commit()

        return {
            "success" : True,
            "event_type_id" : str(default_event_type.id),
            "event_parameter_id" : str(default_event_type.parameter.id)
        }
    except ValueError as e:
        return {
            "success": False,
            "error": f"Invalid data format: {str(e)}",
            "status_code": 400
        }

    except Exception as e:
        db.session.rollback()
        return {
            "success": False,
            "error": f"Internal database error. {str(e)}",
            "status_code": 500
        }
    

def create_event_type(user_id_str : str, parameters : dict, name : str, is_default: bool = False):
    """
    Creates a new event type and saves to db.
    """
    if not is_default and name == "Default":
        return {"success": False, "error": "name cannot be default", "status_code": 400}
    try:
        user_uuid = uuid.UUID(user_id_str)

        existing_type = (
            EventType.query.filter_by(user_id=user_uuid, name=name).first()
        )

        if existing_type:
            return {"success" : False, "error" : "EventType with this name already exists", "status_code" : 409}

        parameters = clean_parameters(parameters)

        has_custom_params = False
        for param in parameters:
            if parameters[param] is not None:
                has_custom_params = True

        if has_custom_params:
            result = create_event_parameters(parameters)
            if not result["success"]:
                return result
            
            parameters_uuid = uuid.UUID(result["event_parameters_id"])

        elif is_default:
            defaults = {
                "ideal_energy": os.environ.get("DEFAULT_IDEAL_ENERGY"),
                "burnout_rate": os.environ.get("DEFAULT_BURNOUT_RATE"),
                "priority": os.environ.get("DEFAULT_PRIORITY"),
            }

            result = create_event_parameters(defaults)
            if not result["success"]:
                return result
            
            parameters_uuid = uuid.UUID(result["event_parameters_id"])
        else:
            default_result = get_default_event_type(user_id_str)

            if not default_result["success"]:
                return default_result
            
            parameters_uuid = uuid.UUID(default_result["event_parameter_id"])

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