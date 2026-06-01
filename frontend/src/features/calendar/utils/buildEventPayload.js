
import { levelToFloat } from "@/utils/parametersHelper"

export default function buildEventPayload(eventData) {

    // Build local date object using form data
    const localStart = new Date(`${eventData.date}T${eventData.startTime}`)
    const localEnd = new Date(`${eventData.date}T${eventData.endTime}`)

    const user = JSON.parse(localStorage.getItem("user"))

    return {
        user_id : user.id,
        name : eventData.eventName,
        start_time : localStart.toISOString(), // Convert local date to UTC
        end_time : localEnd.toISOString(), // Convert local date to UTC
        event_type_id : eventData.eventTypeID,
        is_moveable : eventData.isMoveable,
        parameters : {
            ideal_energy : levelToFloat(eventData.idealEnergy),
            priority : eventData.priority,
            burnout_rate : levelToFloat(eventData.burnoutRate)
        }
    }

}