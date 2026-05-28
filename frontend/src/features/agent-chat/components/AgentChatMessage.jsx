/**
 * @file AgentChatMessage.jsx
 * @module AgentChatMessage
 * @description Renders a formatted message in the agent chat window.
 * 
 * @WIP Component is unfinished, support for message variations containing action buttons will be implemented in the future.
 */

/*------------------Imports------------------*/
import { Text, Box, Icon } from "@chakra-ui/react"
import { RiChatAiLine } from "react-icons/ri";

/**
 * AgentChatMessage
 *
 * Renders a box containing a message from the agent, including an icon and the message content.
 *
 * @component
 * @returns {JSX.Element} AgentChatMessage
**/
export default function AgentChatMessage({ message }) {
    return (
        <Box>
            <Icon>
                <RiChatAiLine />
            </Icon>
            <Text textStyle="defaultText" fontWeight="400">{message.content}</Text>
        </Box>
    )
}