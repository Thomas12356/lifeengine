from datetime import datetime
from app import db
from app.models import EventParameter

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
