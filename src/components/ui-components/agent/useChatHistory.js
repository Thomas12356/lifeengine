

import { useState, useEffect } from "react"

// Dummy API data
import { chatHistory as dummyChatHistory } from "./chatService"

export default function useChatHistory(conversationId) {
    const [chatHistory, setChatHistory] = useState([])

    useEffect(() => {
        if (!conversationId) return
        loadInitial()}, [conversationId])

    async function loadInitial() {        
        // Simulate API call to fetch inital chat history
        const data = dummyChatHistory // Replace with actual API call

        setChatHistory(data.messages)
    }

    return { chatHistory }
}