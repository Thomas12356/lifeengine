
import { HStack, VStack, Text, Box } from "@chakra-ui/react"
import { calculateEventPosition } from "src/components/ui-components/calendar/utils/dateHelpers.js"

const GridBackground = () => {
    return (
        <Box
            position="relative"
            h="1440px"
            flex="1"
            bgImage={`
                repeating-linear-gradient(
                to bottom,
                transparent,
                transparent 59px,
                #e2e8f0 60px
                ),
                repeating-linear-gradient(
                to right,
                transparent,
                transparent calc(100% / 7 - 1px),
                #e2e8f0 calc(100% / 7)
                )
            `}
        />
    )
}

const EventLayer = () => {

    // Dummy event data for testing
    const events = [
        {
            title: "Meeting",
            start: "2026-03-02T14:00:00", // Monday 2:00 PM
            end: "2026-03-02T15:00:00"
        },
        {
            title: "Lunch",
            start: "2026-03-03T12:00:00", // Tuesday 12:00 PM
            end: "2026-03-03T13:00:00"
        },
        {
            title: "Workout",
            start: "2026-03-04T18:00:00", // Wednesday 6:00 PM
            end: "2026-03-04T19:30:00"
        }
    ]

    return (
        <Box position="absolute" top="0" left="0" w="100%" h="1440px">
            {events.map((event, index) => {
                const { top, height, left, width } = calculateEventPosition(event)
                return (
                    <Box
                        key={index}
                        position="absolute"
                        top={`${top}%`}
                        left={`${left}%`}
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

const TimeIndicator = () => {
    const now = new Date()
    const hours = now.getHours()
    const minutes = now.getMinutes()
    const topPosition = (hours * 60 + minutes) / 1440 * 100

    return (
        <Box
            position="absolute"
            top={`${topPosition}%`}
            left="0"
            w="100%"
            h="2px"
            bg="red.500"
        />
    )
}

export default function CalendarBody() {

    const hours = Array.from({ length: 24 }, (_, i) => i)

    return (
        <HStack align="start" spacing={0} w="100%">
            <VStack w="60px" h="1440px" position="relative">
                {hours.map(hour => (
                    <Text key={hour} top={`${hour * 60}px`} position="absolute">
                        {hour}:00
                    </Text>
                ))}
            </VStack>
            <Box flex="1" h="1440px" position="relative">
                <GridBackground />
                <EventLayer />
                <TimeIndicator />
            </Box>
        </HStack>
    )
}