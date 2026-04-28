#V.1
from dataclasses import dataclass

#Config
#Weights
#How Aggressively to penalize low demand events in high value time slots.
WASTE_COST_WEIGHT = 0.5

@dataclass
class Event:
    name: str
    EventType: EventType

@dataclass
class TimeSlot:
    hour: int # 0-23
    predicted_energy: float # (low = 0, medium = 0.5, high = 1)
    predicted_focus: float # (low = 0, medium = 0.5, high = 1)

@dataclass
class EventType:
    name: str
    ideal_energy: float
    ideal_focus: float
    energy_weight: float
    focus_weight: float

def score_fit(event, timeslot):
    energy_fit = 1 - (event.EventType.ideal_energy - timeslot.predicted_energy) ** 2
    focus_fit = 1 - (event.EventType.ideal_focus - timeslot.predicted_focus) ** 2
    return (energy_fit * event.EventType.energy_weight + focus_fit * event.EventType.focus_weight) / 2

def time_slot_value(timeslot):
    return (timeslot.predicted_energy + timeslot.predicted_focus) / 2

def waste_cost(event, timeslot):
    event_demand_value = (event.EventType.ideal_energy + event.EventType.ideal_focus) / 2
    if event_demand_value < time_slot_value(timeslot):
        gap = time_slot_value(timeslot) - event_demand_value
        #quadratic penalty
        return (gap ** 2) * WASTE_COST_WEIGHT
    else:
        return 0.0

def compute_net_score(event, timeslot):
    fit_score = score_fit(event, timeslot)
    cost = waste_cost(event, timeslot)
    #Prevent negative scores - avoid very low demand events that are being scheduled in high value slots producing negative net scores
    return max(0.0 ,fit_score - cost)

#Test
def test():
    event_type = EventType("Work", ideal_energy=0, ideal_focus=1, energy_weight=0.5, focus_weight=0.5)
    event = Event("meeting", EventType=event_type)
    timeslot = TimeSlot(hour=10, predicted_energy=1, predicted_focus=0.3)
    
    fit_score = score_fit(event, timeslot)
    net_score = compute_net_score(event, timeslot)
    
    print(f"Fit Score: {fit_score}")
    print(f"Net Score: {net_score}")

test()