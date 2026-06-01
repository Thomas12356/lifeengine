import api from "@/api/api"

export async function updatePreferences(data) {
    const response = await api.post("/user/updatepreferences", data)

    return response.data
}

export async function getUserPreferences(userID) {
    console.log(userID)
    const response = await api.get("user/getpreferences",
        {
            params : {
                user_id : userID
            }
        }
    )

    return response.data.data
}