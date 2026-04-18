

import { useState, useEffect } from "react"

// Dummy API data
import { chatHistory as dummyChatHistory } from "../util/chatService"

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

    async function sendMessage(message) {
        // Simulate API call to send message and get response
        const response = {
            id: Date.now(),
            sender: "agent",
            content: `Echo: ${message}`,
            timestamp: new Date().toISOString()
        }

        // Update chat history with new message and response
        setChatHistory(prev => [...prev, { id: Date.now(), sender: "user", content: message, timestamp: new Date().toISOString() }, response])
    }

    return { chatHistory, sendMessage }
}