import AgentChatHeader from "@ui-components/agent/AgentChatHeader"
import AgentChatWindow from "@ui-components/agent/AgentChatWindow"
import AgentSuggestionWindow from "@ui-components/agent/AgentSuggestionWindow"
import AgentTextInput from "@ui-components/agent/AgentTextInput"

import { VStack, HStack } from "@chakra-ui/react"

export default function AgentLayout() {
    return (
        <VStack>
            <AgentChatHeader />
            <HStack>
                <AgentChatWindow />
                <AgentSuggestionWindow />
            </HStack>
            <AgentTextInput />
        </VStack>
    )
}