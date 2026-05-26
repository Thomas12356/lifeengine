
// Replace with localStorage fetch once data loading is implemented
const eventCategoryMap = {
    "" : "81ae3ffa-85a3-4d3f-914b-eb54646bc6c7", // Default category
}

export default function buildEventPayload(eventData) {

    // Build local date object using form data
    const localStart = new Date(`${eventData.date}T${eventData.startTime}`)
    const localEnd = new Date(`${eventData.date}T${eventData.endTime}`)

    // Map category name -> ID
    const eventCategoryID = eventCategoryMap[eventData.category]

    const user = JSON.parse(localStorage.getItem("user"))

    return {
        user_id : user.id,
        name : eventData.eventName,
        start_time : localStart.toISOString(), // Convert local date to UTC
        end_time : localEnd.toISOString(), // Convert local date to UTC
        event_type_id : eventCategoryID,
        is_moveable : eventData.isMoveable,
        colour : eventData.colour,
        parameters : {
            ideal_energy : eventData.idealEnergy,
            priority : eventData.priority,
            burnout_rate : eventData.burnoutRate
        }
    }

}