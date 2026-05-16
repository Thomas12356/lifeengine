# Scheduler MVP Development Log

## Scheduler MVP Overview
**Purpose:** Schedule events based on a users metrics.
**Current State:** Distance based scheduling. (v.0)

## v.0 Basic Distance Based Scoring
- Pure Distance Based Scoring only.

## V.1 Basic Decision Model Scoring
- Basic Decision Model Scoring Only
### Changes
- Waste penalties have now been added, the consider the value of the time slot and have a weighted multiplier to lower their overall impact on the net score.
- Calculate Net Score Function has now been added.

## V.1.1 Fix Waste Cost
### Changes
- Waste cost only considered energy previously, now it considers both energy and focus.

## V.1.2
### Changes
- Event Type class with energy to focus weights
- Added quadratic fit and waste scoring

## V.1.3 In Progress
### Issues found in V.1.2
- **Todo** Test different coeficients on the fitnes equation with graph view to find starting point.
- **Done** Transition from symmetric -> asymmetric scoring
- **Done** Replace additive scoring with multiplicative to better model resource interdependence and fitness collapse
- **Check?** change weights to ratio's rather than percentages.
- **Done** Quadratic scoring
- **Done** currently the weighted score fit average doesnt consider the weight and needs to be chnaged to a waited average.
- **Done** Quadratic waste and exponent.

## Future Goals / Fixes
### Scoring Goals / Fixes
- **Maybe?** TESTING -> max(0.0, ...) silently hides problematic pairings: logging when it clamps so we can tune WASTE_COST_WEIGHT later?
- default event types + optional custom properties.
- Hungarian Algorithm for arranging schedule
- Time ranges
- Priority Events
- **Maybe?** harmonic mean, if a task requires 1 focus and the slot has 0 the task is impossible even if the energy matches perfectly. Using the Harmonic Mean ensures that if either fit is near zero, the total score crashes.


