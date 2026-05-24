import api from "@/api/api"

export async function addEvent(eventData) {
    const response = await api.post("/event/addevent", eventData)

    return response.data
}

export async function fetchEvents(userID) {

    const response = await api.post("/events/getuserevents", {
        user_id : userID
    })

    const calendarEvents = response.events.map((event) => ({
        id : event.id,
        title : event.name,
        start : event.start_time,
        end : event.end_time
    }))

    return calendarEvents
}