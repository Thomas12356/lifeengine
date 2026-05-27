"""

    Basic implementation of a baseline energy and focus predictor.
    Uses a two phase sinusoidal model to predict energy and focus levels for each hour of the day.
    The model is based on the idea that energy levels are influenced by both circadian
    rhythms (which follow a roughly 24 hour cycle) and circasemidian rhythms (which follow a roughly 12 hour cycle).

    Currently focus is only modelled as a function of energy.

    NOTE : THIS FILE SHOULD BE REVIEWED FOR A REFACTOR

"""
import math
import numpy as np
import matplotlib.pyplot as plt

# Sigmoid function to map raw baseline values to a 0-1 range
def sigmoid(x):
    return 1 / (1 + np.exp(-x))

# Given the a current time, t and phase shifts for the circadian and circasemidian components,
# compute and return a value between 0 and 1 for predicted energy and focus levels.
def get_baseline(t, phi1, phi2):

    A = 1 # Amplitude of the circadian component
    B = 0.8 # Amplitude of the circasemidian component
    #offset = -1 # Baseline offset to adjust the overall level of energy and focus

    # f(t) = A * sin(2π(t-phi1)/24) + B * sin(2π(t-phi2)/12)
    circadian_component = A * math.sin((2*math.pi * (t-phi1)) / 24)
    circasemidian_component = B * math.sin((2*math.pi * (t-phi2)) / 12)

    energy_baseline = circadian_component + circasemidian_component

    normalised_energy = (energy_baseline + 1.8) / 3.6

    if normalised_energy < 0.0:
        normalised_energy = 0.0
    elif normalised_energy > 1.0:
        normalised_energy = 1.0

    focus_baseline = math.pow(normalised_energy, 1.3) # Placeholder model
    #if energy_baseline < 0: # Revert back to negative if energy baseline is negative to preserve the relationship
        #focus_baseline = -focus_baseline

    #return sigmoid(energy_baseline), sigmoid(focus_baseline) # Return normalized to 0-1 range
    return normalised_energy, focus_baseline

# Generate an array of baseline values for each hour of the day
def get_baseline_array(phi1, phi2, resolution):
    energy_baseline = []
    focus_baseline = []
    for t in range(resolution):
        energy, focus = get_baseline(t, phi1, phi2)
        energy_baseline.append(energy)
        focus_baseline.append(focus)

    return energy_baseline, focus_baseline

# Plot the predicted energy and focus baselines over a 24 hour period to visualize the model
def plot_baselines(phi1, phi2):
    t = np.linspace(0, 24, 100)
    energy = []
    focus = []

    for time in t:
        energy_baseline, focus_baseline = get_baseline(time, phi1=phi1, phi2=phi2)
        energy.append(energy_baseline)
        focus.append(focus_baseline)

    plt.figure(figsize=(12, 6))
    plt.plot(t, energy, label='Energy Baseline')
    plt.plot(t, focus, label='Focus Baseline')
    plt.title('Predicted Energy and Focus Baselines Over 24 Hours')
    plt.xlabel('Time (hours)')
    plt.ylabel('Baseline Level')
    plt.legend()
    plt.grid()
    plt.show()

def demo():

    phi1 = float(input("Enter an approximate wake up time (0-24): "))
    phi2 = phi1 - 3.0

    plot_baselines(phi1, phi2)


# Test the baseline predictor by plotting the predicted energy and focus levels over a 24 hour period
if __name__ == "__main__":
    demo()