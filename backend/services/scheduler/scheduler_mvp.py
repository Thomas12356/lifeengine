#V.1
from models import EventType, Event, TimeSlot
import math

#Config
#Weights
#How Aggressively to penalize low demand events in high value time slots.
WASTE_COST_WEIGHT = 0.5

def score_fit(event, timeslot):
    def calculate_resource_fit(ideal, predicted):
        gap = ideal - predicted

        if predicted > ideal:
            gap *= WASTE_COST_WEIGHT

        resource_fit = - 6*(gap ** 2)

        return resource_fit

    energy_fit = calculate_resource_fit(event.EventType.ideal_energy, timeslot.predicted_energy)

    focus_fit = calculate_resource_fit( event.EventType.ideal_focus, timeslot.predicted_focus)

    total_weight = (event.EventType.energy_weight + event.EventType.focus_weight)
    avg_fit = (energy_fit * event.EventType.energy_weight + focus_fit * event.EventType.focus_weight) / total_weight

    return math.exp(avg_fit)

def compute_net_score(event, timeslot):
    fit_score = score_fit(event, timeslot)
    #Prevent negative scores - avoid very low demand events that are being scheduled in high value slots producing negative net scores
    return max(0.0 ,fit_score)

#Test
def test():
    event_type = EventType("Work", ideal_energy=0.6, ideal_focus=0.8, energy_weight=1, focus_weight=5)
    event = Event("meeting", EventType=event_type)
    timeslot = TimeSlot(hour=10, predicted_energy=1, predicted_focus=1)
    
    fit_score = score_fit(event, timeslot)
    net_score = compute_net_score(event, timeslot)

    print(f"Fit Score : {fit_score}")
    print(f"Net Score : {net_score}")

if __name__ == "__main__":
    test()