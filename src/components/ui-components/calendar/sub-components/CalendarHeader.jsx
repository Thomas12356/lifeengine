
import { HStack, VStack, Text, Box } from "@chakra-ui/react"
import { getWeekDays } from "../utils/dateHelpers.js"

const CalendarHeaderDate = ({ weekday, date }) => {
    return (
        <VStack flex="1">
            <Text>{weekday}</Text>
            <Text>{date}</Text>
        </VStack>
    )
}

export default function CalendarHeader({ selectedDate }) {

    const days = getWeekDays(selectedDate);

    return (
        <HStack w="100%" spacing={0}>
            <Box w="60px"/>
            {days.map((day, index) => (
                <CalendarHeaderDate key={index} weekday={day.weekday} date={day.date} />
            ))}
         </HStack>
    )
}
