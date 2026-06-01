from dataclasses import dataclass
from typing import Optional

@dataclass(frozen=True)
class EventType:
    name: str
    ideal_energy: float
    ideal_focus: float
    energy_weight: float
    focus_weight: float
    impact : float
    burnout_rate : float

    availability_window : tuple
    preferred_window : tuple

@dataclass(frozen=True)
class Event:
    event_id : int
    name: str
    EventType: EventType
    is_moveable : bool
    importance : int

    start_slot : int
    duration_slots : int

@dataclass
class TimeSlot:
    slot_index: int # 0-23
    event: Optional[Event] = None
    predicted_energy: float = 0.0 # (low = 0, medium = 0.5, high = 1)
    predicted_focus: float = 0.0# (low = 0, medium = 0.5, high = 1)
    effective_energy: float = 0.0