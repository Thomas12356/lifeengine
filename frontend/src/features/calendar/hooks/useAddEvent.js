

import { useState } from "react";
import { addEvent } from "../utils/eventsApi";

export default function useAddEvent() {

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    async function sumbitEvent(eventData) {
        setLoading(true)
        setError(null)

        try {
            const result = await addEvent(eventData)

            const existingEvents = JSON.parse(
                localStorage.getItem("events") || []
            )

            localStorage.setItem(
                "events",
                JSON.stringify([...existingEvents, formData])
            )

            return {success : true, event: formData}
        } catch(err) {
            setError(err.response?.data?.error || "Failed to add event")

            return {sucess : false, error : "Failed to add event"}
        } finally {
            setLoading(false)
        }
    }

    return {
        sumbitEvent,
        loading,
        error
    }
}