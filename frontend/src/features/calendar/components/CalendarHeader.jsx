/**
 * @file CalendarHeader.jsx
 * @module CalendarHeader
 * @description Renders the header for the LifeEngine calendar, displaying the days of the week.
 * 
 * @WIP Header currently does not contain indicator for the selected day, just the current day
 */

/* --- IMPORTS --- */
import { HStack, VStack, Text, Box } from "@chakra-ui/react"
import { getWeekDays, isSameDay } from "../utils/dateHelpers.js"


/* --- MAIN COMPONENT --- */

/**
 * CalendarHeader renders the header for the LifeEngine calendar, displaying the days of the week.
 * @param {Date} selectedDate - The date for which to display the calendar header.
 * @returns {JSX.Element} A HStack component containing the calendar header.
 */

export default function CalendarHeader({ selectedDate }) {

    const days = getWeekDays(selectedDate); // Fetch the dates of the current week being viewed based on the selected date

    return (
        <HStack w="100%" borderBottom="2px solid" borderColor="#94949442" pb={{ base: 2, md: 4 }} gap={0}>
            <Box w={{ base: "42px", md: "60px" }} flexShrink={0}/>
            {days.map((day, index) => ( // Loop through the days of the week and render a header cell for each day
                <VStack key={index} flex="1" lineHeight={1} gap={{ base: 1, md: 2 }} minW={0}>
                    <Text fontWeight="medium" fontSize={{ base: "xs", md: "sm" }} color="#3a3a3a">
                        {day.toLocaleString('en-US', { weekday: 'short' })}
                    </Text>
                    <Box   
                        mx="auto"
                        w={{ base: "26px", md: "32px" }}
                        h={{ base: "26px", md: "32px" }}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        borderRadius="full"
                        border={isSameDay(day, new Date()) ? "2px solid" : "2px solid transparent"} // Apply border to indicate current day
                        borderColor={isSameDay(day, new Date()) ? "blue.500" : "transparent"}
                    > {/* Highlight the current day */}
                        <Text 
                            fontSize={{ base: "sm", md: "md" }}
                            fontWeight={isSameDay(day, new Date()) ? "semibold" : "normal"}
                        >
                            {day.getDate()}
                        </Text>
                    </Box>
                </VStack>
            ))}
         </HStack>
    )
}
