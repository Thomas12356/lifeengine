import { HStack, Text } from "@chakra-ui/react"
import { Select as ChakraSelect } from "@chakra-ui/select"

export default function ResourceSelect({ resource, options = ['Low', "Normal", "High"] }) {
    return(
        <HStack>
            <Text>{resource}:</Text>
            {/* Change to menu ?? */}
            <ChakraSelect icon = {<></>}>
                {options.map((opt) => (
                    <option key={opt} value={opt}>
                        {opt}
                    </option>
                ))}
            </ChakraSelect>
        </HStack>
    )
}