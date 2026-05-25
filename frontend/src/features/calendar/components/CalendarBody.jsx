/**
 * @file CalendarBody.jsx
 * @module CalendarBody
 * @description The main grid container for the LifeEngine calendar.
 * Coordinates the time-axis (VStack), the visual grid (GridBackground), 
 * and the dynamic event positioning (EventLayer).
 * @note Calendar height is currently fixed to 1440px - 1px per minute
 * 
 * @WIP Unstyled and event positioning logic needs to be reviewed to ensure responsivness and accuracy.
 */

/* --- IMPORTS --- */
import { HStack, VStack, Text, Box } from "@chakra-ui/react"
import { calculateEventPosition } from "../utils/dateHelpers.js"

/* --- LOCAL COMPONENTS --- */

/**
 * GridBackground creates the grid lines for the calendar body using CSS background images.
 * @returns {JSX.Element} A Box component with the grid background.
 */
const GridBackground = () => {
    return (
        <Box
            position="relative"
            h="1440px"
            flex="1"
            bgImage={`
                repeating-linear-gradient( /* Vertical lines every hour */
                to bottom, /* Run vertically */
                transparent,
                transparent 59px, /* 59px of blank space */
                #e2e8f0 60px /* 1px line at 60px (1 hour) */
                ),
                repeating-linear-gradient( /* Horizontal lines every day */
                to right, /* Run horizontally */
                transparent, 
                transparent calc(100% / 7 - 1px), /* Calculate width of 1/7th of container minus 1px for line */
                #e2e8f0 calc(100% / 7)
                )
            `}
        />
    )
}

/**
 * EventLayer renders the events on the calendar body based on their calculated positions.
 * @param {Array} events - An array of event objects to be displayed on the calendar.
 * @returns {JSX.Element} A Box component containing the event elements.
 */
const EventLayer = ({ events }) => {

    return (
        <Box position="absolute" top="0" left="0" w="100%" h="1440px">
            {events.map((event, index) => { // Loop through events and calculate their positions
                const { top, height, left, width } = calculateEventPosition(event)
                return (
                    <Box
                        key={index}
                        position="absolute" // Position each event absolutely within the calendar body
                        top={`${top}%`} // Position from the top based on event start time
                        left={`${left}%`} // Position from the left based on event weekday
                        w={`${width}%`}
                        h={`${height}%`}
                        bg="blue.500"
                        color="white"
                        p={2}
                    >
                        {event.title}
                    </Box>
                )
            })}
        </Box>
    )
}

/**
 * TimeIndicator renders a coloured line indicating the current time on the calendar body.
 * @returns {JSX.Element} A Box component representing the time indicator.
 */
const TimeIndicator = () => {
    const now = new Date() // Get current date and time
    const hours = now.getHours() // Get current hour
    const minutes = now.getMinutes() // Get current minute
    const topPosition = (hours * 60 + minutes) / 1440 * 100 // Calculate position as percentage of the day (1440 minutes)

    return (
        <Box
            position="absolute"
            top={`${topPosition}%`} // Position from the top based on current time
            left="0"
            w="100%"
            h="2px"
            bg="red.500"
        />
    )
}

/* --- MAIN COMPONENT --- */

/**
 * CalendarBody renders the main body of the calendar, including the grid, events, and time indicator.
 * @param {Array} events - An array of event objects to be displayed on the calendar.
 * @returns {JSX.Element} A Box component representing the calendar body.
 */
export default function CalendarBody({ events}) {

    const hours = Array.from({ length: 24 }, (_, i) => i) // Create an array of hours from 0 to 23 for the time axis

    return (
        <Box w="100%" h="100%" overflowY="auto" overflowX="hidden" position="relative"> {/* Main container for the calendar body */}
            <HStack align="start" spacing={0} w="100%" h="100%">
                <VStack w="60px" h="1440px" position="relative"> {/* Container for the time axis */}
                    {hours.map(hour => ( // Loop through hours and render time labels inside the container
                        <Text key={hour} top={`${hour * 60}px`} position="absolute">
                            {hour}:00
                        </Text>
                    ))}
                </VStack>
                <Box flex="1" h="1440px" position="relative"> {/* Main calendar body container */}
                    <GridBackground />
                    <EventLayer events={events} />
                    <TimeIndicator />
                </Box>
            </HStack>
        </Box>
    )
}