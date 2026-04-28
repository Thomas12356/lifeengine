/**
 * @file useArkCalendar.js
 * @module useArkCalendar
 * @description Custom hook to manage state and value change handling for ArkUI DatePicker.
 * The DatePicker component uses a custom value format and change handler, 
 * so this hook converts between the standard JS Date format and the Ark UI format.
 */

/* --- IMPORTS --- */
import { parseDate } from "@ark-ui/react";

/**
 * useArkCalendar manges state and value change handling, converting between JS Date and ArkUI formats.
 * @param {Date} selectedDate 
 * @param {Function} setSelectedDate 
 * @returns {Object} An object containing the Ark UI calendar value and change handler.
 */
export function useArkCalendar(selectedDate, setSelectedDate) {

    // If selectedDate is a valid JS Date object, conver it to the Ark UI format (array of Date objects).
    const arkValue = (selectedDate instanceof Date && !isNaN(selectedDate))
        ? [parseDate(selectedDate.toISOString().split('T')[0])]
        : [];
        
    const handleDateChange = (date) => {
        const newDate = date.value[0]; // Fetch only the first element of the Ark UI date array, since we're using single selection mode
        if (newDate) {
            setSelectedDate(newDate.toDate('GMT')); // NOTE : Could allow dynamic timezone selection based on users location, or preferences
        }
    };

    return {
        arkValue,
        handleDateChange
    }
}
