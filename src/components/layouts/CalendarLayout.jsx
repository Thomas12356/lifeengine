import { VStack } from "@chakra-ui/react"

import CalendarMenu from "@/components/ui-components/calendar/sub-components/CalendarMenu"
import CalendarHeader from "@/components/ui-components/calendar/sub-components/CalendarHeader"
import CalendarBody from "@/components/ui-components/calendar/sub-components/CalendarBody"

export default function CalendarLayout() {
    return (
        <VStack>
            <CalendarMenu />
            <CalendarHeader />
            <CalendarBody />
        </VStack>
    )
}