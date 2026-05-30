from flask import Blueprint, request, jsonify
from app.services import event_services
from app.services import event_type_services
from app.services import event_parameter_services

event_blueprint = Blueprint('event',__name__)

REQUIRED_EVENT_FIELDS = ['user_id', 'name', 'start_time', 'end_time', 'parameters', "colour"]
REQUIRED_EVENT_PARAMETER_FIELDS = ["ideal_energy", "burnout_rate", "priority"]
REQUIRED_EVENT_TYPE_FIELDS = ["user_id", "parameters", "name"]
REQUIRED_GET_EVENTS_FIELDS = ["user_id"]
REQUIRED_RESCHEDULE_EVENT_FIELDS = ["user_id", "event_id","new_start", "new_end"]

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
        event_parameters=data["parameters"],
        is_moveable=data["is_moveable"],
        is_active=data.get('is_active', True),
        colour=data.get("colour", None)
    )

    if not result["success"]:
        return jsonify({"error": result["error"]}), result["status_code"]

    return jsonify({
        "message": "Event created successfully", 
        "event_id": result["event_id"]
    }), 201

@event_blueprint.route('/deleteevent', methods=['DELETE'])
def delete_event():
    data = request.get_json()

    required_fields  = ["user_id", "event_id"]

    for field in required_fields:
        if field not in data or not data[field]:
            return jsonify({"error": f"Missing required field: {field}"}), 400
    
    result = event_services.delete_event(
        user_id_str = data["user_id"],
        event_id_str = data["event_id"]
    )

    if not result["success"]:
        return jsonify({"error": result["error"]}), result["status_code"]

    return jsonify({
        "message" : "Event deleted successfully."
    }), 200




@event_blueprint.route("/createparameters", methods=['POST'])
def create_parameters():

    data = request.get_json()

    for field in REQUIRED_EVENT_PARAMETER_FIELDS:
        if field not in data or not data[field]:
            return jsonify({"error": f"Missing required field: {field}"}), 400

    result = event_parameter_services.create_event_parameters(data)

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
    
    result = event_type_services.create_event_type(
        user_id_str=data["user_id"],
        parameters=data["parameters"],
        name=data["name"],
    )

    if not result["success"]:
        return jsonify({"error": result["error"]}), result["status_code"]

    return jsonify({
        "message": "Event type created successfully", 
        "event_type_id": result["event_type_id"]
    }), 201

@event_blueprint.route("/getuserevents/<user_id>", methods=["GET"])
def get_user_events_details(user_id):

    if not user_id:
        return jsonify({"error": f"Missing required field user_id"}), 400
        
    result = event_services.get_user_events_details(user_id)

    if not result["success"]:
        return jsonify({"error": result["error"]}), result["status_code"]
    
    return jsonify({
        "message": f"User {user_id} events fetched.", 
        "events": result["events"]
    }), 200 

@event_blueprint.route("/getevents/byrange", methods=["GET"])
def get_user_events_by_range():

    user_id = request.args.get("user_id")
    range_start = request.args.get("range_start")
    range_end = request.args.get("range_end")

    if not user_id:
        return jsonify({"error": f"Missing required field user_id"}), 400

    if not range_start:
        return jsonify({"error": f"Missing required field range_start"}), 400
    
    if not range_end:
        return jsonify({"error": f"Missing required field range_end"}), 400
    
    result = event_services.get_user_events_by_range(
        user_id_str=user_id,
        range_start_str=range_start,
        range_end_str=range_end
    )
    
    if not result["success"]:
        return jsonify({"error": result["error"]}), result["status_code"]
    
    return jsonify({
        "message": f"User {user_id} events fetched between {range_start} & {range_end}.", 
        "events": result["events"]
    }), 200


@event_blueprint.route("getevents/byday", methods={"GET"})
def get_user_events_by_day():
    user_id_str = request.args.get("user_id")
    day_str = request.args.get("day")


    result = event_services.get_user_events_by_day(user_id_str=user_id_str, date_str=day_str)

    if not result["success"]:
        return jsonify({"error": result["error"]}), result["status_code"]
    else:
        return jsonify({
            "message": f"Events for {user_id_str} on {day_str} fetched.",
            "events" : result["events"]
        }), result["status_code"]

@event_blueprint.route("/reschedule", methods=["POST"])
def reschedule_event():

    data = request.get_json()

    for field in REQUIRED_RESCHEDULE_EVENT_FIELDS:
        if field not in data or not data[field]:
            return jsonify({"error": f"Missing required field: {field}"}), 400
        
    result = event_services.reschedule_event(
        user_id_str=data["user_id"],
        event_id_str=data["event_id"],
        new_start=data["new_start"],
        new_end=data["new_end"]
    )

    if not result["success"]:
        return jsonify({"error": result["error"]}), result["status_code"]
    else:
        return jsonify({
            "message": f"Events {data['event_id']} rescheduled",
        }), result["status_code"]

        
    
        
    