
import { HStack, VStack, Text, Box } from "@chakra-ui/react"
import { calculateEventPosition } from "../utils/dateHelpers.js"

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

const EventLayer = ({ events}) => {

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

export default function CalendarBody({ events}) {

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
                <EventLayer events={events} />
                <TimeIndicator />
            </Box>
        </HStack>
    )
}