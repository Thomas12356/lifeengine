import api from "@/api/api"

export async function addEvent(eventData) {
    const response = await api.post("/event/addevent", eventData)

    return response.data
}

export async function fetchEvents(userID) {

    const response = await api.post("/event/getuserevents", {
        user_id : userID
    })

    console.log(response)

    const calendarEvents = response.data.events.map((event) => ({
        id : event.id,
        title : event.name,
        start : event.start_time,
        end : event.end_time,
        colour : event.colour
    }))

    return calendarEvents
}

export async function deleteEvent(userID, eventID) {

    const response = await api.delete("/event/deleteevent", {
        data : {
            user_id : userID,
            event_id : eventID
        }
    })

    return response

}

export async function createEventType(eventTypeData) {
    const response = await api.post("/event/createeventtype", eventTypeData)

    return response.data
}