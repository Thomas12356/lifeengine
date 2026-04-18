import { VStack, Text } from "@chakra-ui/react"
import useChatHistory from "./useChatHistory"

export default function AgentChatWindow() {

    const { chatHistory } = useChatHistory("dummy-id") // NOTE : Move state logic to parent and pass messages as props

    return (
        <VStack>
            {chatHistory.map((msg, index) => (
                <Text key={index} fontSize="md">{msg.content}</Text>
            ))}
        </VStack>
    )
}