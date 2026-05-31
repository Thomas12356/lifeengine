from flask import Flask, jsonify, request, Blueprint

from app.services.agent.ollama_agent import ask_llm
from datetime import datetime
from zoneinfo import ZoneInfo, available_timezones

agent_blueprint = Blueprint("agent", __name__, url_prefix="/api/agent")

@agent_blueprint.post("/chat")
def chat():
    data = request.get_json(silent = True) or {}

    user_message = data.get("message")
    user_id = data.get("user_id")
    print(user_id)
    timezone = data.get("timezone")
    session_id = data.get("session_id")
    

    if not user_message:
        return jsonify({
            "ok" : False,
            "error" : "Missing message!"
        }), 400
    
    if not user_id:
        return jsonify({
            "ok" : False,
            "error" : "Missing user_id!"
        }), 400

    if not session_id:
        return jsonify({
            "ok": False,
            "error": "Missing session_id!"
        }), 400

    if timezone not in available_timezones():
        timezone = "UTC"

    user_timezone = ZoneInfo(timezone)
    base_time = datetime.now(user_timezone)
    
    result = ask_llm(
        user_id=user_id,
        user_message=user_message,
        session_id=session_id,
        timezone=timezone,
        base_time=base_time,
    )

    return jsonify({
        "ok" : True,
        "session_id" : session_id,
        "timezone" : timezone,
        "base_time" : base_time.isoformat(),
        "result" : result,
    })

@agent_blueprint.get("/health")
def get_agent_health():
    return jsonify({
        "ok" : True,
        "service" : "ellie_agent"
    })

# --------------- TEST ROUTES -----------------------
@agent_blueprint.get("/test/chat/sessions")
def get_chat_sessions():
    return