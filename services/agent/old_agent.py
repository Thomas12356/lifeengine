import json
import os
from dotenv import load_dotenv
from datetime import datetime, timedelta
from ollama import Client
from pydantic import BaseModel, Field, ValidationError
from typing import Literal, Optional

load_dotenv()

MODEL = os.getenv("MODEL")
OLLAMA_HOST = os.getenv("OLLAMA_HOST")
client = Client(host=OLLAMA_HOST)



class AgentResult(BaseModel):
    action: Literal["add_event", "ask_for_event_details", "chat"]

    title: Optional[str] = Field(
        default=None,
        description="Event title, for example gym, lecture, meeting"
    )

    date_text: Optional[str] = Field(
        default=None,
        description="Natural date phrase, for example today, tomorrow, next Monday"
    )

    start_text: Optional[str] = Field(
        default=None,
        description="Natural start time phrase, for example 5pm, in an hour"
    )

    end_text: Optional[str] = Field(
        default=None,
        description="Natural end time phrase, for example 6pm"
    )

    message: Optional[str] = Field(
        default=None,
        description="Message to show the user when asking for missing details or chatting"
    )



SYSTEM_PROMPT = """
You are a calendar assistant.
Your job is to extract the users intent into the provided JSON schema.

Rules:
- Use action "add_event" only when the user has provided: title, date_text, start_text and end_text .
- If the user wants to add an event but any required details are missing use action "ask_for_event_details".

- If the user is just chatting use the action "chat.

- Do not calculate exact dates
- Keep Natural phrases like "today", "tommorow", "5pm".

- Return only data that fits in the schema.
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
        format=AgentResult.model_json_schema(),
        options={"temperature" : 0},
    )

    content = response["message"]["content"]
    
    try:
        data = json.loads(content)
        return AgentResult.model_validate(data)

    except (json.JSONDecodeError, ValidationError):
        return AgentResult(
            action="chat",
            message="Sorry, I could not understand that."
        )
    
def is_missing(value):
    if value is None:
        return True

    if isinstance(value, str) and value.strip().lower() in {"", "null", "none", "unknown"}:
        return True

    return False

def add_event(title, date_text, start_text, end_text):
    return {
        "status": "function reached",
        "title": title,
        "date_text": date_text,
        "start_text": start_text,
        "end_text": end_text,
    }

def get_missing_event_fields(result: AgentResult):
    required_fields = ["title", "date_text", "start_text", "end_text"]

    missing_fields = []

    for field in required_fields:
        value = getattr(result, field)

        if is_missing(value):
            missing_fields.append(field)

    return missing_fields


def handle_message_from_user(user_message: str):
    result = ask_llm(user_message)

    if result.action == "add_event":
        missing_fields = get_missing_event_fields(result)

        if missing_fields:
            return {
                "message": "I can add that. What is the title, date, start time and end time?",
                "missing_fields": missing_fields,
            }

        return add_event(
            title=result.title,
            date_text=result.date_text,
            start_text=result.start_text,
            end_text=result.end_text,
        )

    if result.action == "ask_for_event_details":
        return {
            "message": result.message or "Yes. What is the title, date, start time and end time?"
        }

    if result.action == "chat":
        return {
            "message": result.message or "How can I help?"
        }

    return {
        "message": "Sorry, I did not understand that."
    }