from dataclasses import dataclass

@dataclass(frozen=True)
class EventType:
    name: str
    ideal_energy: float
    ideal_focus: float
    energy_weight: float
    focus_weight: float
    impact : float
    burnout_rate : float

@dataclass(frozen=True)
class Event:
    event_id : int
    name: str
    EventType: EventType
    start_time: None
    duration: None
    is_moveable : bool

@dataclass
class TimeSlot:
    hour: int # 0-23
    event: None
    predicted_energy: float = 0.0 # (low = 0, medium = 0.5, high = 1)
    predicted_focus: float = 0.0# (low = 0, medium = 0.5, high = 1)
    effective_energy: float = 0.0