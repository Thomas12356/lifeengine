
import { HStack } from "@chakra-ui/react"
import DateSelectMenu from "./DateSelectMenu"
import ViewSelectMenu from "./ViewSelectMenu"

export default function CalendarMenu( { selectedDate, setSelectedDate }) {
    return (
        <HStack>
            <DateSelectMenu selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
            <ViewSelectMenu />
        </HStack>
    )
}