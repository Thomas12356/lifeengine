import uuid
from datetime import datetime
from app import db
from app.models import Event


def create_event(user_id_str: str, name, start_time_str: str, end_time_str: str, event_type_id_str: str = None, event_parameter_id_str: str = None, is_moveable: bool = False, is_active: bool = True):
    """
    Creates an event and validates data format, saves to db.
    """
    try:
        start_dt = datetime.fromisoformat(start_time_str)
        end_dt = datetime.fromisoformat(end_time_str)

        if end_dt <= start_dt:
            return {"success": False, "error": "end_time must be after start_time", "status_code": 400}

        user_uuid = uuid.UUID(user_id_str)
        event_type_uuid = uuid.UUID(event_type_id_str) if event_type_id_str else None
        parameter_uuid = uuid.UUID(event_parameter_id_str) if event_parameter_id_str else None

        new_event = Event(user_id=user_uuid,
                           event_type_id=event_type_uuid,
                           event_parameter_id=parameter_uuid,
                           name=name,
                           start_time=start_dt,
                           end_time=end_dt,
                           is_moveable=is_moveable,
                           is_active=is_active)
        
        db.session.add(new_event)
        db.session.commit()

        return {"success": True, "event_id": str(new_event.id)}

    except ValueError as e:
        return {"success": False, "error": f"Invalid data format: {str(e)}", "status_code": 400}
    
    except Exception as e:
        db.session.rollback()
        return {"success": False, "error": "Internal database error.", "status_code": 500}
        