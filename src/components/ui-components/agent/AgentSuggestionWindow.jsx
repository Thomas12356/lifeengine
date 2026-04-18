
import { VStack, Text } from "@chakra-ui/react"

export default function AgentSuggestionWindow() {

    const suggestions = [
        "Suggestion 1",
        "Suggestion 2",
        "Suggestion 3",
        "Suggestion 4",
        "Suggestion 5"
    ]

    return (
        <VStack>
            {suggestions.map((suggestion, index) => (
                <Text fontSize="md" fontWeight="bold" key={index}>
                    {suggestion}
                </Text>
            ))}
        </VStack>
    )
}