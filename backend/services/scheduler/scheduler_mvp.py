from dataclasses import dataclass
from tokenize import Name

@dataclass
class Event:
    name: str
    ideal_energy: float # (low = 0, medium = 0.5, high = 1)
    ideal_focus: float # (low = 0, medium = 0.5, high = 1)

@dataclass
class TimeSlot:
    hour: int # 0-23
    predicted_energy: float # (low = 0, medium = 0.5, high = 1)
    predicted_focus: float # (low = 0, medium = 0.5, high = 1)