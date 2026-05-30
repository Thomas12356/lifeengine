import { VStack, Text, Box } from "@chakra-ui/react"
import CalendarMenu from "@/features/calendar/components/CalendarMenu"
import CalendarHeader from "@/features/calendar/components/CalendarHeader"
import CalendarBody from "@/features/calendar/components/CalendarBody"
import { useState, useEffect } from "react"
import { startOfWeek, endOfWeek } from "date-fns"
import { fetchEventsByRange, deleteEvent } from "@utils/eventServices"
import { useHomepage } from "@context/HomepageContext"

export default function Calendar() {

    const [selectedDate, setSelectedDate] = useState(new Date())
    const [visibleEvents, setVisibleEvents] = useState(([]))
    const { refreshHomepageEvents } = useHomepage()

    async function loadEvents() {
        try {
            const userID = JSON.parse(localStorage.getItem('user'))?.id

            const rangeStart = startOfWeek(selectedDate, { weekStartsOn : 1 })
            const rangeEnd = endOfWeek(selectedDate, { weekStartsOn : 1 })

            const events = await fetchEventsByRange(
                userID,
                rangeStart.toISOString(),
                rangeEnd.toISOString()
            )

            setVisibleEvents(events)
        } catch (err) {
            console.log("Failed to fetch users events :", err)
        }
    }

    useEffect(() => {
        loadEvents()
    }, [selectedDate])

    async function handleEventAdded() {
        await loadEvents()
        await refreshHomepageEvents()
    }

    async function handleEventDelete(eventID) {
        try {
            const userID = JSON.parse(localStorage.getItem("user"))?.id

            await deleteEvent(userID, eventID)
            await loadEvents()
            await refreshHomepageEvents()
        } catch (err) {
            console.log("Failed to delete event:", err)
        }
    }

    async function handleEventReschedule() {
        await loadEvents()
        await refreshHomepageEvents()
    }

    //console.log("ALL EVENTS:", allEvents)

    return (
        <Box h="100%" border="1px solid" borderColor="gray.200" borderRadius="xl" p={25} bg="white" overflow="hidden">
            <VStack h="100%" spacing={0} align="stretch">
                <CalendarMenu 
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate} 
                    onEventAdded={handleEventAdded}
                />
                <CalendarHeader selectedDate={selectedDate} />
                <Box flex="1" minH={0} overflow="hidden">
                    <CalendarBody 
                        events={visibleEvents} 
                        onEventDelete={handleEventDelete}
                        onRescheduleSuccess={handleEventReschedule}
                    />
                </Box>
            </VStack>
        </Box>
    )
}