
import { Text, Box } from "@chakra-ui/react"

export default function UserChatMessage({ message }) {
    return (
        <Box>
            <Text>User</Text>
            <Text fontSize="md">{message.content}</Text>
        </Box>
    )
}