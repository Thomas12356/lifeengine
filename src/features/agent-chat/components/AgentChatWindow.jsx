import { VStack, Text } from "@chakra-ui/react"

export default function AgentChatWindow({ chatHistory }) {

    return (
        <VStack>
            {chatHistory.map((msg, index) => (
                <Text key={index} fontSize="md">{msg.content}</Text>
            ))}
        </VStack>
    )
}