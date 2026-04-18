import { HStack, Button, Input, IconButton } from "@chakra-ui/react"

import { IoMdSend } from "react-icons/io";


export default function AgentTextInput() {
    return (
        <HStack>
            <Input placeholder="Type your message..." />
            <IconButton colorScheme="blue">
                <IoMdSend />
            </IconButton>
        </HStack>
    )
}