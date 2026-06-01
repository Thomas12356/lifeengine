
// This is a small helper file for converting ideal energy and burnout rate values from user-friendly
//  high, medium or low to optimiser interpretable value
//  These values are limited and hardcoded for now but it may significantly reduce optimisers performance
// In the future these values should be adjusted over time based on user data, or we allow users to specify exact values

export function levelToFloat(level) {
    const map = {
        "High" : 0.8,
        "Medium" : 0.5,
        "Low" : 0.2
    }

    return map[level] ?? null
}

export function floatToLevel(float) {
    if (float == null) return ""
    if (float > 0.5) return "High"
    if (float > 0.2) return "Medium"
    return "Low"
}