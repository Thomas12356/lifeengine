
export default function buildReschedulePayload(data) {

    const user = JSON.parse(localStorage.getItem("user"))

    // Build local date object using form data
    const newStart = new Date(`${data.newDate}T${data.newStart}`)
    const newEnd = new Date(`${data.newDate}T${data.newEnd}`)

    return {
        user_id : user.id,
        event_id : data.eventID,
        new_start : newStart.toISOString(), // Convert local date to UTC
        new_end : newEnd.toISOString(), // Convert local date to UTC
    }

}
