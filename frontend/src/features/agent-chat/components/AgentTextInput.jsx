import { HStack, Input, IconButton } from "@chakra-ui/react"
import { useState } from "react";
import { IoMdSend } from "react-icons/io";


export default function AgentTextInput({ onSendMessage }) {

    const [message, setMessage] = useState("");

    const handleSendMessage = () => {
        if (!message.trim()) return; // Don't send empty messages
        onSendMessage(message); // Call the parent callback to send the message
        setMessage(""); // Clear the input after sending
    }

    return (
        <HStack>
            <Input placeholder="Type your message..." onChange={(e) => setMessage(e.target.value)} value={message}/>
            <IconButton colorScheme="blue" onClick={handleSendMessage}>
                <IoMdSend />
            </IconButton>
        </HStack>
    )
}