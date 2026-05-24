from flask import Blueprint, request, jsonify
from app.services import event_services

event_blueprint = Blueprint('event',__name__)

REQUIRED_EVENT_FIELDS = ['user_id', 'name', 'start_time', 'end_time', 'parameters']
REQUIRED_EVENT_PARAMETER_FIELDS = ["ideal_energy", "burnout_rate", "priority"]
REQUIRED_EVENT_TYPE_FIELDS = ["user_id", "event_parameter_id", "name"]

@event_blueprint.route('/addevent', methods=['POST'])
def add_event():
    data = request.get_json()

    # DEBUG - Remove later
    print(data)
    
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
        event_parameters=data["parameters"],
        is_moveable=data.get('is_moveable', False),
        is_active=data.get('is_active', True)
    )

    if not result["success"]:
        return jsonify({"error": result["error"]}), result["status_code"]

    return jsonify({
        "message": "Event created successfully", 
        "event_id": result["event_id"]
    }), 201

@event_blueprint.route("/createparameters", methods=['POST'])
def create_parameters():

    data = request.get_json()

    for field in REQUIRED_EVENT_PARAMETER_FIELDS:
        if field not in data or not data[field]:
            return jsonify({"error": f"Missing required field: {field}"}), 400

    result = event_services.create_event_parameters(
        ideal_energy=float(data["ideal_energy"]),
        burnout_rate=float(data["burnout_rate"]),
        priority=int(data["priority"])
    )

    if not result["success"]:
        return jsonify({"error": result["error"]}), result["status_code"]

    return jsonify({
        "message": "Event parameters created successfully", 
        "event_parameters_id": result["event_parameters_id"]
    }), 201


@event_blueprint.route("/createeventtype", methods=["POST"])
def create_event_type():

    data = request.get_json()

    for field in REQUIRED_EVENT_TYPE_FIELDS:
        if field not in data or not data[field]:
            return jsonify({"error": f"Missing required field: {field}"}), 400
    
    result = event_services.create_event_type(
        user_id_str=data["user_id"],
        event_params_id_str=data["event_parameter_id"],
        name=data["name"],
    )

    if not result["success"]:
        return jsonify({"error": result["error"]}), result["status_code"]

    return jsonify({
        "message": "Event type created successfully", 
        "event_type_id": result["event_type_id"]
    }), 201

