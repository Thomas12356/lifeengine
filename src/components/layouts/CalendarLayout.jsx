import { VStack } from "@chakra-ui/react"

import CalendarMenu from "@ui-components/calendar/CalendarMenu"
import CalendarHeader from "@ui-components/calendar/CalendarHeader"
import CalendarBody from "@ui-components/calendar/CalendarBody"

export default function CalendarLayout() {
    return (
        <VStack>
            <CalendarMenu />
            <CalendarHeader />
            <CalendarBody />
        </VStack>
    )
}