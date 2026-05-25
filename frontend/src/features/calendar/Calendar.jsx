import { VStack, Text, Box } from "@chakra-ui/react"
import CalendarMenu from "@/features/calendar/components/CalendarMenu"
import CalendarHeader from "@/features/calendar/components/CalendarHeader"
import CalendarBody from "@/features/calendar/components/CalendarBody"
import { useState, useEffect } from "react"
import { useWeekEvents } from "@/features/calendar/hooks/useWeekEvents"
import { fetchEvents } from "./utils/eventsApi"

// Dummy event data for testing
const allEvents2 = [
    {
        title: "Meeting",
        start: "2026-03-02T14:00:00", // Monday 2:00 PM
        end: "2026-03-02T15:00:00"
    },
    {
        title: "Lunch",
        start: "2026-03-03T12:00:00", // Tuesday 12:00 PM
        end: "2026-03-03T13:00:00"
    },
    {
        title: "Workout",
        start: "2026-03-04T18:00:00", // Wednesday 6:00 PM
        end: "2026-03-04T19:30:00"
    },
    {
        title: "Project Deadline",
        start: "2026-03-05T23:59:00", // Thursday 11:59 PM
        end: "2026-03-05T23:59:59"
    },
    {
        title: "Family Dinner",
        start: "2026-03-06T19:00:00", // Friday 7:00 PM
        end: "2026-03-06T21:00:00"
    },
    {
        title: "Grocery Shopping",
        start: "2026-03-18T10:00:00", // Saturday 10:00 AM
        end: "2026-03-18T11:00:00"
    }
]

export default function Calendar() {

    const [selectedDate, setSelectedDate] = useState(new Date())
    const [allEvents, setAllEvents] = useState(([]))

    useEffect(() => {
        async function loadEvents() {
            try {
                const events = await fetchEvents(JSON.parse(localStorage.getItem('user'))?.id)
                setAllEvents(events)
            } catch (err) {
                console.log("Failed to fetch users events :", err)
            }
        }

        loadEvents()
    }, [])

    async function handleEventAdded() {
        try {
            const userId = JSON.parse(localStorage.getItem("user"))?.id
            const events = await fetchEvents(userId)
            setAllEvents(events)
        } catch (err) {
            console.log("Failed to refresh user's events:", err)
        }
    }

    const weekEvents = useWeekEvents(allEvents, selectedDate)

    //console.log("ALL EVENTS:", allEvents)

    return (
        <Box h="100%" border="1px solid" borderColor="gray.200" borderRadius="xl" bg="white" overflow="hidden">
            <VStack h="100%" spacing={0} align="stretch">
                <Text>Selected Date: {selectedDate.toString()}</Text>
                <CalendarMenu 
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate} 
                    onEventAdded={handleEventAdded}
                />
                <CalendarHeader selectedDate={selectedDate} />
                <Box flex="1" minH={0} overflow="hidden">
                    <CalendarBody events={weekEvents}/>
                </Box>
            </VStack>
        </Box>
    )
}