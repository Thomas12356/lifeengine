from app import db
from app.models import UserPreferences
from datetime import datetime
import uuid

def create_preferences(
        user_id_str : str,
        wakeup_time_str : str,
        bed_time_str : str
    ):
    try:
        wakeup_time = datetime.fromisoformat(wakeup_time_str)
        bed_time = datetime.fromisoformat(bed_time_str)

        if bed_time <= wakeup_time:
                return {"success": False, "error": "wakeup_time must be before bed_time", "status_code": 400}
        
        user_uuid = uuid.UUID(user_id_str)

        preferences = UserPreferences(
            user_id=user_uuid,
            wakeup_time=wakeup_time,
            bed_time=bed_time
        )

        db.session.add(preferences)
        db.session.commit()

        return {"success": True, "user_preferences_id": str(preferences.id)}

    except ValueError as e:
        return {"success": False, "error": f"Invalid data format: {str(e)}", "status_code": 400}
    
    except Exception as e:
        db.session.rollback()
        return {"success": False, "error": "Internal database error.", "status_code": 500}
    

def update_preferences(user_id_str : str, wakeup_time_str : str, bed_time_str : str):
    try:        
        user_uuid = uuid.UUID(user_id_str)

        preferences = UserPreferences.get_user_preferences(user_uuid)

        preferences.wakeup_time = wakeup_time_str
        preferences.bed_time = bed_time_str

        db.session.commit()

        return {"success": True, "user_preferences_id": str(preferences.id)}

    except ValueError as e:
        return {"success": False, "error": f"Invalid data format: {str(e)}", "status_code": 400}
    
    except Exception as e:
        db.session.rollback()
        return {"success": False, "error": "Internal database error.", "status_code": 500}

def get_preferences(user_id_str : str):
    try:

        user_uuid = uuid.UUID(user_id_str)

        preferences = UserPreferences.get_user_preferences(user_id=user_uuid)

        return {"success": True, "user_preferences": preferences.to_dict()}

    
    except ValueError as e:
        return {"success": False, "error": f"Invalid data format: {str(e)}", "status_code": 400}
    
    except Exception as e:
        db.session.rollback()
        return {"success": False, "error": f"Internal database error. {str(e)}", "status_code": 500}
