"""
    This file defines the DTOs which hold clean, predictible input data that can be mapped to GA models
"""
from dataclasses import dataclass
from datetime import datetime

@dataclass
class dbEventInput:

    id : str
    name : str

    start_time : datetime
    end_time : datetime

    is_moveable: bool

    ideal_energy : float | None
    burnout_rate : float | None
    priority : int
    

@dataclass
class dbEventTypeInput:

    id : str
    name : str

    is_moveable : bool

    availability_start : datetime
    availability_end : datetime
    preference_start : datetime
    preference_end : datetime

    ideal_energy : float
    burnout_rate : float
    priority : int

@dataclass
class dbUserPreferenceInput:

    wakeup_time : datetime
    bed_time : datetime
