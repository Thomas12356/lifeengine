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
        <HStack width="100%" my={1}>
            <Input textStyle="defaultText" fontWeight="400" bg="blueLight.50" p="6" mr="5" variant="plain" borderRadius="20px" width="100%" placeholder="Type your message..." onChange={(e) => setMessage(e.target.value)} value={message}/>
            <IconButton bg="grey.800" onClick={handleSendMessage}>
                <IoMdSend />
            </IconButton>
        </HStack>
    )
}