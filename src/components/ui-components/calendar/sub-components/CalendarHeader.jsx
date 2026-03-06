/**
 * @file CalendarHeader.jsx
 * @module CalendarHeader
 * @description Renders the header for the LifeEngine calendar, displaying the days of the week.
 * 
 * @WIP Header currently does not contain indicator for the current day & selected day
 */

/* --- IMPORTS --- */
import { HStack, VStack, Text, Box } from "@chakra-ui/react"
import { getWeekDays } from "../utils/dateHelpers.js"


/* --- MAIN COMPONENT --- */

/**
 * CalendarHeader renders the header for the LifeEngine calendar, displaying the days of the week.
 * @param {Date} selectedDate - The date for which to display the calendar header.
 * @returns {JSX.Element} A HStack component containing the calendar header.
 */

export default function CalendarHeader({ selectedDate }) {

    const days = getWeekDays(selectedDate); // Fetch the dates of the current week being viewed based on the selected date

    return (
        <HStack w="100%" spacing={0}>
            <Box w="60px"/>
            {days.map((day, index) => ( // Loop through the days of the week and render a header cell for each day
                <VStack flex="1">
                    <Text>{day.toLocaleString('en-US', { weekday: 'short' })}</Text>
                    <Text>{day.getDate()}</Text>
                </VStack>
            ))}
         </HStack>
    )
}
