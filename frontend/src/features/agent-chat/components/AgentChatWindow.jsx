import { VStack, Text, Box } from "@chakra-ui/react"
import AgentChatMessage from "./AgentChatMessage"
import UserChatMessage from "./UserChatMessage"
import { BlueWidgetBox } from "@ui-components/WidgetBox"

export default function AgentChatWindow({ chatHistory }) {

    const messageTypes = {
        agent: AgentChatMessage,
        user: UserChatMessage
    }

    return (
            <BlueWidgetBox width="100%" my={2}>
            <VStack width="100%" height="200px" overflowY="scroll" p={2} gap={1} align="start">
                {chatHistory.map((msg, index) => {
                    const MessageComponent = messageTypes[msg.sender];
                    return <MessageComponent key={index} message={msg} />;
                })}
            </VStack>
            </BlueWidgetBox>
    )
}