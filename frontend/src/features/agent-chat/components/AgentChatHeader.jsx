/**
 * @file AgentChatHeader.jsx
 * @module AgentChatHeader
 * @description Renders the header for the agent chat interface.
 * 
 * @WIP Component is unfinished, Action history text is placeholder for a popover link to view the agent's action history.
 */

/*------------------Imports------------------*/
import { HStack, Text, Link } from "@chakra-ui/react"

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
        <HStack justifyContent="space-between" width="100%">
            <Text textStyle="headingSolid">Ellie Agent</Text>

            <HStack alignItems="end" gap={2} alignSelf="flex-end">
                <Link textStyle="linkText">Action history</Link>
                <Link textStyle="linkText">Customise Ellie</Link>
            </HStack>
        </HStack>
    )
}