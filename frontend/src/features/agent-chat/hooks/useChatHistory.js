//TODO use cookie id instead of conversation id.

import { useState, useEffect } from "react";
import api from "@/api/api";
import { useHomepage } from "@/context/HomepageContext";

// Dummy API data
import { chatHistory as dummyChatHistory } from "../util/chatService";

function getTimezone(){
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
}

function createMessage(sender, content, extra = {}){
    return {
        id : crypto.randomUUID(),
        sender,
        content,
        ...extra,
    }
}

function getAgentReply(data){
    const result = data?.result;

    if (!result) {
        return "Sorry, I did not get a valid response.";
    }
    if (result.type ==="chat"){
        return result.message || result.response || "How can I help?";
    }
    if (result.type === "tool_result"){
        const firstResult = result.results?.[0];
        return firstResult?.message || "Done.";
    }
    return "Done.";
}

export default function useChatHistory(chat_session_id) {
    const [chatHistory, setChatHistory] = useState([])
    const [isLoading, setIsLoading] = useState(false);
    const { refreshHomepageEvents } = useHomepage()

    useEffect(() => {
        if (!chat_session_id) return
        loadInitial()}, [chat_session_id])

    async function loadInitial() {        
        // Simulate API call to fetch inital chat history
        const data = dummyChatHistory // Replace with actual API call

        setChatHistory(data.messages)
    }

    async function sendMessage(message) {
        // Simulate API call to send message and get response
        const trimmedMessage = message.trim();

        if (!trimmedMessage || isLoading) return;

        const userMessage = createMessage("user", trimmedMessage);

        setChatHistory((prev) => [
            ...prev,
            userMessage,
        ]);

        setIsLoading(true);
        try{
            const response = await api.post("/agent/chat", {
                session_id: chat_session_id,
                message: trimmedMessage,
                user_id : JSON.parse(localStorage.getItem("user")).id,
                timezone: getTimezone(),
            });

            const agentMessage = createMessage(
                "agent",
                getAgentReply(response.data),
                {
                    raw: response.data,
                }
            );

            setChatHistory((prev) => [
                ...prev,
                agentMessage,

            ]);
            refreshHomepageEvents()
        } catch (error){
            const errorMessage = 
            error.response?.data?.error || 
            error.message ||
            "Could not connect to Ellie.";

            const agentErrorMessage = createMessage("agent", errorMessage);

            setChatHistory((prev) => [
                ...prev,
                agentErrorMessage,
            ]);
        } finally {
            setIsLoading(false);
        }
    }

    return { chatHistory, sendMessage, isLoading };
}