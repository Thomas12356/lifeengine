import api from "@/api/api"

export async function addEvent(eventData) {
    const response = await api.post("/event/addevent", eventData)

    return response.data
}

export async function fetchAllEvents(userID) {

    const response = await api.get(`/event/getuserevents/${userID}`)

    console.log(response)

    const calendarEvents = response.data.events.map((event) => ({
        id : event.id,
        title : event.name,
        start : event.start_time,
        end : event.end_time
    }))

    return calendarEvents
}

export async function fetchEventsByDay(userID, day){
    
    try {
        const response = await api.get('/event/getevents/byday', 
            {
                params : {
                    user_id : userID,
                    day : day
                }
            }
        );

        const events = response.data;
        return events;

    } catch (error) {
        console.error('Error fetching events:', error);
        throw error;
    }
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

export async function fetchEventsByRange(userID, rangeStart, rangeEnd) {
    const response = await api.get("/event/getevents/byrange", 
        {
            params : {
                user_id : userID,
                range_start : rangeStart,
                range_end : rangeEnd
            }
        }
    )

    const calendarEvents = response.data.events.map((event) => ({
        id : event.id,
        title : event.name,
        start : event.start_time,
        end : event.end_time,
        is_moveable : event.is_moveable
    }))

    return calendarEvents
}

export async function rescheduleEvent(payload) {
    console.log(payload) // DEBUG
    const response = await api.post("/event/reschedule", payload)

    return response.data
}

export async function autoReschedule(payload) {
    console.log(payload) // DEBUG
    const response = await api.post("/event/autoreschedule", payload)

    return response.data
}