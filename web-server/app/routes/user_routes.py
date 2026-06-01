from flask import Blueprint, request, jsonify
from app.services import user_services

user_blueprint = Blueprint('user',__name__)

REQUIRED_CREATE_PREFERENCE_FIELDS = ["user_id", "wakeup_time", "bed_time"]

@user_blueprint.route("/createpreferences", methods=["POST"])
def createpreferences():
    data = request.get_json()

    for field in REQUIRED_CREATE_PREFERENCE_FIELDS:
        if field not in data or not data[field]:
            return jsonify({"error": f"Missing required field: {field}"}), 400

    result = user_services.create_preferences(
        user_id_str=data["user_id"],
        wakeup_time_str=data["wakeup_time"],
        bed_time_str=data["bed_time"]
    )

    if not result["success"]:
        return jsonify({"error": result["error"]}), result["status_code"]
    
    return jsonify({
        "message": "User preferences created succesfully",
        "user_preferences_id": result["user_preferences_id"]
    }), 201

@user_blueprint.route("/updatepreferences", methods=["POST"])
def update_preferences():
    data = request.get_json()

    for field in REQUIRED_CREATE_PREFERENCE_FIELDS:
        if field not in data or not data[field]:
            return jsonify({"error": f"Missing required field: {field}"}), 400
    
    result = user_services.update_preferences(
        user_id_str=data["user_id"],
        wakeup_time_str=data["wakeup_time"],
        bed_time_str=data["bed_time"]
    )

    if not result["success"]:
        return jsonify({"error": result["error"]}), result["status_code"]
    
    return jsonify({
        "message": "User preferences updated succesfully",
        "user_preferences_id": result["user_preferences_id"]
    }), 201

@user_blueprint.route("/getpreferences", methods=["GET"])
def get_preferences():

    user_id = request.args.get("user_id")

    result = user_services.get_preferences(user_id_str=user_id)

    if not result["success"]:
        return jsonify({"error": result["error"]}), result["status_code"]
    
    return jsonify({
        "message": "User preferences fetched",
        "data": result["user_preferences"]
    }), 201