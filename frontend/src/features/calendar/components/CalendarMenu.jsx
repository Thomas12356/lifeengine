
// --- IMPORTS ---
import { Flex } from "@chakra-ui/react"
import DateSelectMenu from "./DateSelectMenu"
import ViewSelectMenu from "./ViewSelectMenu"
import AddEventButton from "./AddEventButton"
import CreateEventTypeButton from "./CreateEventTypeButton"

/**
 * CalendarMenu renders the menu for the LifeEngine calendar, providing options to select the date and view.
 * @param {Date} selectedDate - The date for which to display the calendar.
 * @param {Function} setSelectedDate - A function to update the selected date.
 * @returns {JSX.Element} A HStack component containing the calendar menu.
 * 
 * @WIP View selection menu is currently a placeholder and does not affect the calendar view.
 */
export default function CalendarMenu( { selectedDate, setSelectedDate, onEventAdded }) {
    return (
        <Flex
            align={{ base: "stretch", md: "center" }}
            justify={{ base: "start", md: "space-between" }}
            direction={{ base: "column", md: "row" }}
            gap={{ base: 3, md: 4 }}
            px={{ base: 1, md: 4 }}
            pb={2}
            width="100%"
        >
            <Flex width={{ base: "100%", md: "auto" }} minW={0}>
                <DateSelectMenu
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                />
            </Flex>

            <Flex
                gap={2}
                width={{ base: "100%", md: "auto" }}
                direction={{ base: "column", md: "row" }}
                justify={{ base: "stretch", md: "end" }}
            >
                <CreateEventTypeButton />
                <AddEventButton onEventAdded={onEventAdded} />
            </Flex>
        </Flex>
    )
}