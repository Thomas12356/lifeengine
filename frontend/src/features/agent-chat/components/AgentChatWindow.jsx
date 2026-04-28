import { VStack, Text, Box } from "@chakra-ui/react"
import AgentChatMessage from "./AgentChatMessage"
import UserChatMessage from "./UserChatMessage"

export default function AgentChatWindow({ chatHistory }) {

    const messageTypes = {
        agent: AgentChatMessage,
        user: UserChatMessage
    }

    return (
        <Box>
            <VStack>
                {chatHistory.map((msg, index) => {
                    const MessageComponent = messageTypes[msg.sender];
                    return <MessageComponent key={index} message={msg} />;
                })}
            </VStack>
        </Box>
    )
}