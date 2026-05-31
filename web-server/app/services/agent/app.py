from flask import Flask, jsonify, request

from ollama_agent import ask_llm

app = Flask(__name__)

@app.post("/chat")
def chat():
    data = request.get_json(silent = True) or {}

    user_message = data.get("message")
    session_id = data.get("session_id")

    if not user_message:
        return jsonify({
            "ok" : False,
            "error" : "Missing message!"
        }), 400
    
    result = ask_llm(user_message, session_id)

    return jsonify({
        "ok" : True,
        "result" : result,
    })