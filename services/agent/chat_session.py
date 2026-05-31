MAX_MESSAGE_HISTORY = 10
sessions = {}


def get_session(session_id):
    if session_id not in sessions:
        sessions[session_id] = {
            "messages" : [],
            "pending_action" : None,
        }
    return sessions[session_id]

def add_message(session_id, role, content):
    session = get_session(session_id)

    session["messages"].append({
        "role" : role,
        "content" : content,
    })

    session["messages"] = session["messages"][-MAX_MESSAGE_HISTORY:]

def get_messages(session_id):
    session = get_session(session_id)
    return session["messages"]

def set_pending_action(session_id, pending_action):
    session = get_session(session_id)
    session['pending_action'] = pending_action

def get_pending_action(session_id):
    session = get_session(session_id)
    return session["pending_action"]

def clear_pending_action(session_id):
    session = get_session(session_id)
    session["pending_action"] = None