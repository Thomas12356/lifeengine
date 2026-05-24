import api from "@/api/api"

export async function addEvent(eventData) {
    const response = await api.post("/event/addevent", eventData)

    return response.data.success
}