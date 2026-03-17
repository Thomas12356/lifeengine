import { Button, Text, Icon as ChakraIcon } from "@chakra-ui/react";

export default function IconTextButton({ icon, text, variant }) {
    return(
        <Button leftIcon={icon} variant={variant}> 
            <Text>{text}</Text>
        </Button>
    )
}