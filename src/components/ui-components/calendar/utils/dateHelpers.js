/**
 * @file dateHelpers.js
 * @module dateHelpers
 * @description Utility functions for handling date calculations in the LifeEngine calendar.
 * @NOTE Functions could be re-used for other purposes, if so then abstract to a global date utility module.
 * 
 * @WIP These functions are currently basic implementations and may need to be expanded or optimized as the calendar features are developed.
 */

/* --- IMPORTS --- */
import { startOfWeek } from "date-fns"

/* --- MAIN FUNCTIONS --- */

/**
 * getWeekDays returns an array of objects representing the days of the week (Monday to Sunday) for a given date.
 * @param {Date} selectedDate - The date for which to calculate the week days.
 * @returns {Array} An array of date objects representing the days of the week for the given date.
 */
export const getWeekDays = (selectedDate) => {
    const days = []
    const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 }) // Monday as first day of the week
    for (let i = 0; i < 7; i++) { // Loop through the 7 days of the week and calculate the date for each day
        const date = new Date(weekStart)
        date.setDate(weekStart.getDate() + i) // Increment the date
        days.push(date) // Add the date to the array
    }
    return days
}

/**
 * getEventDurationInMinutes calculates the duration of an event in minutes based on its start and end times.
 * @param {string|Date} start - The start time of the event, can be a date string or a Date object.
 * @param {string|Date} end - The end time of the event, can be a date string or a Date object.
 * @returns {number} The duration of the event in minutes.
 */
export const getEventDurationInMinutes = (start, end) => {
    const startTime = new Date(start)
    const endTime = new Date(end)
    return (endTime - startTime) / (1000 * 60) // duration in minutes
}

/**
 * getEventWeekday returns the weekday name for a given date.
 * @param {string|Date} date - The date for which to calculate the weekday, can be a date string or a Date object.
 * @returns {string} The short weekday name (e.g., "Mon", "Tue") for the given date.
 */
export const getEventWeekday = (date) => {
    const eventDate = new Date(date)
    const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    return weekdays[eventDate.getDay()]
}

/**
 * calculateEventPosition calculates the position and size of an event on the calendar based on its start and end times.
 * @param {Object} event - The event object containing start and end times.
 * @returns {Object} An object containing the top, height, left, and width properties for positioning the event on the calendar.
 */
export const calculateEventPosition = (event) => {
    const eventStart = new Date(event.start)
    const eventEnd = new Date(event.end)

    const dayIndex = (eventStart.getDay() + 6) % 7 // Convert Sunday=0 to Sunday=6 to align with our Monday-start week
    const startMinutes = eventStart.getHours() * 60 + eventStart.getMinutes() // Total minutes from the start of the day to the event start time
    const endMinutes = eventEnd.getHours() * 60 + eventEnd.getMinutes() // Total minutes from the start of the day to the event end time

    return {
        top: (startMinutes / 1440) * 100, // percentage of the day
        height: ((endMinutes - startMinutes) / 1440) * 100, // percentage of the day
        left: (dayIndex / 7) * 100, // percentage of the week
        width: (1 / 7) * 100 // percentage of the week for one day
    }
}

