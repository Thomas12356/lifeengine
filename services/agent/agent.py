import json
import os
from dotenv import load_dotenv
from datetime import datetime, timedelta
from ollama import Client

load_dotenv()

MODEL = os.getenv("MODEL")
OLLAMA_HOST = os.getenv("OLLAMA_HOST")
client = Client(host=OLLAMA_HOST)

SYSTEM_PROMPT = """
You are an assistant for a calendar app called Ellie.
Your job is to understand the user's request and return only valid JSON.
If the user wants to add an event, return:

{
  "action": "add_event",
  "title": "event title",
  "date_text": "today/tomorrow/next monday/etc or null",
  "start_text": "5pm/in an hour/etc or null",
  "end_text": "6pm/etc"
}

Rules:
- Do not calculate exact dates.
- Keep natural phrases like "today", "tomorrow", "in an hour".
- Events must have a start_text and end_text and a date_text.
- Return JSON only.

If the user is just chatting, return:

{
  "action": "chat",
  "message": "your response"
}
"""

def ask_llm(user_message: str) -> dict:
    """
        Send users message to Ollama
        Expecting JSON from request.
    """

    response = client.chat(
        model=MODEL,
        messages=[
            {
                "role" : "system",
                "content" : SYSTEM_PROMPT
            },
            {
                "role" : "user",
                "content" : user_message,
            }
        ],
        format="json",
        options={"temperature" : 0},
    )

    content = response["message"]["content"]
    
    try:
        return json.loads(content)
    except json.JSONDecodeError:
        return {
            "action" : "chat",
            "message" : "Sorry, I could not understand that.",
        }
    
def add_event(title, date_text, start_text, end_text):
    return "function reached"

def handle_message_from_user(user_message: str):
    llm_result = ask_llm(user_message)
    action = llm_result.get("action")

    if action == "add_event":
        return add_event(
            title=llm_result.get("title"),
            date_text=llm_result.get("date_text"),
            start_text=llm_result.get("start_text"),
            end_text=llm_result.get("end_text"),
        )
    
    if action == "chat":
        return {
            "message" : llm_result.get("message", ""),
        }
    
    return{
        "message" : "Sorry, I did not understant that."
    }