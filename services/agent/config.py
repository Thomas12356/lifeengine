import os
from zoneinfo import ZoneInfo
from dotenv import load_dotenv

load_dotenv()

MODEL = os.getenv("MODEL", "qwen2.5:7b")
OLLAMA_HOST = os.getenv("OLLAMA_HOST", "http://localhost:11434")
TIMEZONE = "Europe/London"
LOCAL_TZ = ZoneInfo(TIMEZONE)