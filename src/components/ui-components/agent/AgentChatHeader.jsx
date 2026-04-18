
import { HStack, Text } from "@chakra-ui/react"

export default function AgentChatHeader() {
    return (
        <HStack>
            <Text fontSize="2xl" fontWeight="bold">ELLIE</Text>
            <Text fontSize="md" color="gray.500">Action history</Text>
        </HStack>
    )
}