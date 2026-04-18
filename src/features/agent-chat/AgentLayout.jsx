import AgentChatHeader from "@/features/agent-chat/components/AgentChatHeader"
import AgentChatWindow from "@/features/agent-chat/components/AgentChatWindow"
import AgentSuggestionWindow from "@/features/agent-chat/components/AgentSuggestionWindow"
import AgentTextInput from "@/features/agent-chat/components/AgentTextInput"

import { VStack, HStack } from "@chakra-ui/react"
import useChatHistory from "./hooks/useChatHistory"

export default function AgentLayout() {

    const { chatHistory, sendMessage } = useChatHistory("dummy-id") // NOTE : Move state logic to parent and pass messages as props

    return (
        <VStack>
            <AgentChatHeader />
            <HStack>
                <AgentChatWindow chatHistory={chatHistory} />
                <AgentSuggestionWindow />
            </HStack>
            <AgentTextInput onSendMessage={sendMessage} />
        </VStack>
    )
}