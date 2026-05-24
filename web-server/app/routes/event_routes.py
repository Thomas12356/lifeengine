from flask import Blueprint, request, jsonify
from app.services import event_services

event_blueprint = Blueprint('event',__name__)

REQUIRED_EVENT_FIELDS = ['user_id', 'name', 'start_time', 'end_time']

@event_blueprint.route('/addevent', methods=['POST'])
def add_event():
    data = request.get_json()

    # check required data has been given.
    for field in REQUIRED_EVENT_FIELDS:
        if field not in data or not data[field]:
            return jsonify({"error": f"Missing required field: {field}"}), 400
        
    result = event_services.create_event(
        user_id_str=data['user_id'],
        name=data['name'],
        start_time_str=data['start_time'],
        end_time_str=data['end_time'],
        event_type_id_str=data.get('event_type_id'),
        event_parameter_id_str=data.get('event_parameter_id'),
        is_moveable=data.get('is_moveable', False),
        is_active=data.get('is_active', True)
    )

    if not result["success"]:
        return jsonify({"error": result["error"]}), result["status_code"]

    return jsonify({
        "message": "Event created successfully", 
        "event_id": result["event_id"]
    }), 201