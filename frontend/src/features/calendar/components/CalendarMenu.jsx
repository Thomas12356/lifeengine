
// --- IMPORTS ---
import { Flex } from "@chakra-ui/react"
import DateSelectMenu from "./DateSelectMenu"
import ViewSelectMenu from "./ViewSelectMenu"
import AddEventButton from "./AddEventButton"
import CreateEventButton from "./CreateEventButton"

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
            align="center"
            justify="space-between"
            px={4}
            py={3}
        >
            <DateSelectMenu selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
            <Flex gap={2}>

                <CreateEventButton/>
                <AddEventButton onEventAdded={onEventAdded}/>
            </Flex>
        </Flex>
    )
}