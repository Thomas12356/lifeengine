
import { HStack, VStack, Text, Box } from "@chakra-ui/react"

const CalendarHeaderDate = ({ weekday, date }) => {
    return (
        <VStack flex="1">
            <Text>{weekday}</Text>
            <Text>{date}</Text>
        </VStack>
    )
}

export default function CalendarHeader() {

    const days = [
        { weekday: "Mon", date: "2" },
        { weekday: "Tue", date: "3" },
        { weekday: "Wed", date: "4" },
        { weekday: "Thu", date: "5" },
        { weekday: "Fri", date: "6" },
        { weekday: "Sat", date: "7" },
        { weekday: "Sun", date: "8" },
    ]

    return (
        <HStack w="100%" spacing={0}>
            <Box w="60px"/>
            {days.map((day, index) => (
                <CalendarHeaderDate key={index} weekday={day.weekday} date={day.date} />
            ))}
         </HStack>
    )
}
