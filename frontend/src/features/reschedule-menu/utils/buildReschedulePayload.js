
export default function buildReschedulePayload(data, autoReschedule) {

    const user = JSON.parse(localStorage.getItem("user"))

    if (autoReschedule) {
        console.log("auto")
        return {
            user_id : user.id,
            event_id : data.eventID,
        }
    }

    // Build local date object using form data
    const newStart = new Date(`${data.newDate}T${data.newStart}`)
    const newEnd = new Date(`${data.newDate}T${data.newEnd}`)

    return {
        user_id : user.id,
        event_id : data.eventID,
        new_end : newStart.toISOString(), // Convert local date to UTC
        new_start : newEnd.toISOString(), // Convert local date to UTC
    }

}