
// Replace with localStorage fetch once data loading is implemented
const eventCategoryMap = {
    "" : "81ae3ffa-85a3-4d3f-914b-eb54646bc6c7", // Default category
    "Gym" : "1"
}

export default function buildEventPayload(eventData) {

    // Format date and start/end times into ISO string
    const startTimeISO = `${eventData.date}T${eventData.startTime}`
    const endTimeISO = `${eventData.date}T${eventData.endTime}`
    
    // Map category name -> ID
    const eventCategoryID = eventCategoryMap[eventData.category]

    const user = JSON.parse(localStorage.getItem("user"))

    return {
        user_id : user.id,
        name : eventData.eventName,
        start_time : startTimeISO,
        end_time : endTimeISO,
        event_type_id : eventCategoryID,
        parameters : {
            ideal_energy : eventData.idealEnergy,
            priority : eventData.priority,
            burnout_rate : eventData.burnoutRate,
            is_moveable : eventData.isMoveable
        }
    }

}