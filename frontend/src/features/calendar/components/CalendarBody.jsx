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
import { useRef, useEffect } from "react"
import { formatEventTime } from "../utils/dateHelpers.js"

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
                repeating-linear-gradient( /* Horizontal hour lines */
                    to bottom, /* Run vertically */
                    transparent 0,
                    transparent 59px, /* 59px of blank space */
                    #94949442 60px /* 1px line at 60px (1 hour) */
                ),
                linear-gradient( /* Vertical day lines */
                    to right, /* Run horizontally */
                    transparent 0, 
                    transparent calc(100% - 1px),
                    #94949442 calc(100% - 1px),
                    #94949442 100%
                )
            `}
            bgSize={`
                100% 60px, /* Width and height, for hour lines */
                calc(100% / 7) 100% /* Width and height, for day lines */
            `}
            bgRepeat="repeat" // Repeat both gradient layers across full grid area
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
                        px={2}
                        py={1}
                        borderRadius={"md"}
                        boxShadow={"md"}
                        overflow="hidden"
                    >
                        <Text fontWeight="semibold" noOfLines={1}>
                            {event.title}
                        </Text>
                        <Text noOfLines={1}>
                            {formatEventTime(event.start)} - {formatEventTime(event.end)} {/* Slice ISO strings to only contain HH:MM */}
                        </Text>
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

    const scrollContainerRef = useRef(null) // Initalise scroll reference
    const hours = Array.from({ length: 24 }, (_, i) => i) // Create an array of hours from 0 to 23 for the time axis

    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = 8 * 60 // On page load auto scroll to 8 AM (1px = 1 minute)
        }
    })

    return (
        <Box w="100%" h="100%" overflowY="auto" overflowX="hidden" position="relative" ref={scrollContainerRef}> {/* Main container for the calendar body */}
            <HStack align="start" spacing={0} w="100%" h="100%">
                <VStack w="60px" h="1440px" position="relative"> {/* Container for the time axis */}
                    {hours.map(hour => ( // Loop through hours and render time labels inside the container
                        <Text key={hour} top={`${hour * 60}px`} position="absolute" transform={hour === 0 ? "none" : "translateY(-50%)"}>
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