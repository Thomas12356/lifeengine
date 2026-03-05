
import { HStack, VStack, Text } from "@chakra-ui/react"

const CalendarHeaderDate = ({ weekday, date }) => {
    return (
        <VStack>
            <Text>{weekday}</Text>
            <Text>{date}</Text>
        </VStack>
    )
}

export default function CalendarHeader() {
    return (
        <HStack>
            <CalendarHeaderDate weekday="Mon" date="1" />
            <CalendarHeaderDate weekday="Tue" date="2" />
            <CalendarHeaderDate weekday="Wed" date="3" />
            <CalendarHeaderDate weekday="Thu" date="4" />
            <CalendarHeaderDate weekday="Fri" date="5" />
            <CalendarHeaderDate weekday="Sat" date="6" />
            <CalendarHeaderDate weekday="Sun" date="7" />
         </HStack>
    )
}
