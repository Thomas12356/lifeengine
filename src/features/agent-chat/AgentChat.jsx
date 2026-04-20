/**
 * @file AgentChat.jsx
 * @module AgentChat
 * @description The main container for the agent chat interface.
 * Contains the chat header, message window, and input area.
 * 
 * @WIP Component does not yet have any functionality and is only a placeholder for the layout of the agent chat interface.
 */

/*------------------Imports------------------*/
import AgentChatHeader from "@/features/agent-chat/components/AgentChatHeader"
import AgentChatWindow from "@/features/agent-chat/components/AgentChatWindow"
import AgentTextInput from "@/features/agent-chat/components/AgentTextInput"
import { VStack } from "@chakra-ui/react"
import useChatHistory from "./hooks/useChatHistory"

/**
 * AgentChat
 *
 * Renders the agent chat interface, including the header, chat window, and text input.
 *
 * @component
 * @returns {JSX.Element} AgentChat
**/
export default function AgentChat() {

    const { chatHistory, sendMessage } = useChatHistory("dummy-id") // Hook to manage chat history and sending messages, 
    // currently using a dummy ID for testing purposes.

    return (
        <VStack>
            <AgentChatHeader />
            <AgentChatWindow chatHistory={chatHistory} />
            <AgentTextInput onSendMessage={sendMessage} />
        </VStack>
    )
}