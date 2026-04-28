/**
 * @file useWeekEvents.js
 * @module useWeekEvents
 * @description Custom React hook for filtering events to display only those that fall within the currently selected week in the calendar. 
 */

/* --- IMPORTS --- */
import { useState, useEffect } from "react"
import { startOfWeek, endOfWeek } from "date-fns"

/**
 * useWeekEvents filters a list of events to include only those that occur within the week of the selected date.
 * @param {Array} allEvents - An array of event objects.
 * @param {Date} selectedDate - The currently selected date in the calendar.
 * @returns {Array} An array of event objects that occur within the week of the selected date.
 */
export function useWeekEvents(allEvents, selectedDate) {

    // State to hold the events for the current week
    const [weekEvents, setWeekEvents] = useState([])

    // Update state with filtered events
    useEffect(() => {
        // Calculate start and end of week based on selectedDate
        const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 }) // Monday as first day of the week
        const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 }) // Sunday as last day of the week

        // Filter events that fall within the week
        const weekEvents = allEvents.filter(event => {
            const eventDate = new Date(event.start)
            return eventDate >= weekStart && eventDate <= weekEnd
        })

        setWeekEvents(weekEvents)
    }, [allEvents, selectedDate]);
    
    return weekEvents
}