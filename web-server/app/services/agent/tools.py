from datetime import datetime, timedelta
from zoneinfo import ZoneInfo
import dateparser
from uuid import UUID
from app.services.event_services import create_event

UTC = ZoneInfo("UTC")

def parse_event_datetime(timezone, base_time, date_text, start_text, end_text=None):
    user_tz = ZoneInfo(timezone)

    if base_time is None:
        base_time = datetime.now(user_tz)

    if base_time.tzinfo is None:
        base_time = base_time.replace(tzinfo=user_tz)
    else:
        base_time = base_time.astimezone(user_tz)

    settings = {
        "RELATIVE_BASE": base_time,
        "PREFER_DATES_FROM": "future",
        "RETURN_AS_TIMEZONE_AWARE": True,
        "TIMEZONE": timezone,
        "TO_TIMEZONE": timezone,
    }

    parsed_date = dateparser.parse(
        date_text,
        languages=["en"],
        settings=settings,
    )
    if parsed_date is None:
        raise ValueError(f"Could not understand date: {date_text}")
    
    event_date = parsed_date.date()

    start_dt = dateparser.parse(
        f"{event_date.isoformat()} {start_text}",
        languages=["en"],
        settings=settings,
    )

    if start_dt is None:
        raise ValueError(f"Could not understand start time: {start_text}")

    if end_text:
        end_dt = dateparser.parse(
            f"{event_date.isoformat()} {end_text}",
            languages=["en"],
            settings=settings,
        )

        if end_dt is None:
            raise ValueError(f"Could not understand end time: {end_text}")
    else:
        end_dt = start_dt + timedelta(hours=1)

    start_dt = start_dt.astimezone(user_tz)
    end_dt = end_dt.astimezone(user_tz)

    #handles events that go into next day
    if end_dt <= start_dt:
        end_dt += timedelta(days=1)

    return {
        "start_local": start_dt,
        "end_local": end_dt,
        "start_utc": start_dt.astimezone(UTC),
        "end_utc": end_dt.astimezone(UTC),
    }
    


def create_event_tool(user_id, title, date_text, start_text, end_text, timezone="UTC", base_time=None):
    parsed = parse_event_datetime(
        timezone=timezone,
        base_time=base_time,
        date_text=date_text,
        start_text=start_text,
        end_text=end_text,
    )

    event = {
        "title": title,
        "user_id" : user_id,
        "start": parsed["start_utc"].isoformat(),
        "end": parsed["end_utc"].isoformat(),
        "start_local": parsed["start_local"].isoformat(),
        "end_local": parsed["end_local"].isoformat(),
        "timezone": timezone,
    }

    log = {
        "ok": True,
        "message": f"Event '{title}' created.",
        "event": event,
    }
    print(log)

    result = create_event(user_id_str=event["user_id"], name=event["title"], start_time_str=event["start"], end_time_str=event["end"])
    if not result["success"]:
        return {
            "ok": False,
            "message": result.get("error", "Could not create event."),
            "status_code": result.get("status_code", 500),
        }

    return {
        "ok": True,
        "message": f"Event '{title}' created.",
        "event": {
            "id": result["event_id"],
        },
    }