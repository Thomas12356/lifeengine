import json
from ollama import Client
from tools import create_event
from tools_schema import TOOLS_SCHEMA
from datetime import datetime, timedelta
from config import OLLAMA_HOST, MODEL, TIMEZONE, LOCAL_TZ

client = Client(host=OLLAMA_HOST)

def now_local() -> datetime:
    return datetime.now(LOCAL_TZ)

def build_system_prompt():
    current_time = now_local().strftime("%A, %d %B %Y, %H:%M")

    return f"""

    

"""