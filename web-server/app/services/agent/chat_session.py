from datetime import datetime, timedelta, timezone

SESSION_TIMEOUT_MINUTES = 30
PENDING_ACTION_TIMEOUT_MINUTES = 0.1

MAX_MESSAGE_HISTORY = 10
sessions = {}

def now_utc():
    return datetime.now(timezone.utc)

def is_expired(timestamp, timeout_minutes):
    if timestamp is None:
        return True

    return now_utc() - timestamp > timedelta(minutes=timeout_minutes)

def create_session():
    return {
        "messages": [],
        "pending_action": None,
        "pending_action_updated_at": None,
        "created_at": now_utc(),
        "last_seen": now_utc(),
    }

def cleanup_expired_sessions():
    expired_session_ids = []
    for session_id, session in sessions.items():
        if is_expired(session.get("last_seen"), SESSION_TIMEOUT_MINUTES):
            expired_session_ids.append(session_id)

    for session_id in expired_session_ids:
        sessions.pop(session_id, None)

def cleanup_pending_action(session):
    pending_action = session.get("pending_action")
    if pending_action is None:
        return
    pending_updated_at = session.get("pending_action_updated_at")
    if is_expired(pending_updated_at, PENDING_ACTION_TIMEOUT_MINUTES):
        session["pending_action"] = None
        session["pending_action_updated_at"] = None

def get_session(session_id):
    cleanup_expired_sessions()
    if session_id not in sessions:
        sessions[session_id] = create_session()

    session = sessions[session_id]
    if is_expired(session.get("last_seen"), SESSION_TIMEOUT_MINUTES):
        sessions[session_id] = create_session()
        session = sessions[session_id]

    session["last_seen"] = now_utc()
    cleanup_pending_action(session)
    return session

def add_message(session_id, role, content):
    session = get_session(session_id)
    session["messages"].append({
        "role" : role,
        "content" : content,
    })

    session["messages"] = session["messages"][-MAX_MESSAGE_HISTORY:]
    session["last_seen"] = now_utc()

def get_messages(session_id):
    session = get_session(session_id)
    return session["messages"]

def set_pending_action(session_id, pending_action):
    session = get_session(session_id)
    session["pending_action"] = pending_action
    session["pending_action_updated_at"] = now_utc()
    session["last_seen"] = now_utc()

def get_pending_action(session_id):
    session = get_session(session_id)
    return session["pending_action"]

def clear_pending_action(session_id):
    session = get_session(session_id)
    session["pending_action"] = None
    session["pending_action_updated_at"] = None
    session["last_seen"] = now_utc()

def delete_session(session_id):
    sessions.pop(session_id, None)