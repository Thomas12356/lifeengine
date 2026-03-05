
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
        { weekday: "Mon", date: "1" },
        { weekday: "Tue", date: "2" },
        { weekday: "Wed", date: "3" },
        { weekday: "Thu", date: "4" },
        { weekday: "Fri", date: "5" },
        { weekday: "Sat", date: "6" },
        { weekday: "Sun", date: "7" },
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
