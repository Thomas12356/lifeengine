/**
 * @file AgentChatHeader.jsx
 * @module AgentChatHeader
 * @description Renders the header for the agent chat interface.
 * 
 * @WIP Component is unfinished, Action history text is placeholder for a popover link to view the agent's action history.
 */

/*------------------Imports------------------*/
import { HStack, Text } from "@chakra-ui/react"

/**
 * AgentChatHeader
 *
 * Renders a title for the agent chat interface and a placeholder for an action history link.
 *
 * @component
 * @returns {JSX.Element} AgentChatHeader
**/
export default function AgentChatHeader() {
    return (
        <HStack>
            <Text fontSize="2xl" fontWeight="bold">ELLIE</Text>
            <Text fontSize="md" color="gray.500">Action history</Text>
        </HStack>
    )
}