import { Text, chakra } from "@chakra-ui/react";

export default function LifeEngineLogo() {
    return(
        <Text fontSize = "lg" fontWeight="normal">
            <chakra.span color="blueDark.500">Life</chakra.span>
            <chakra.span color="blueLight.500">Engine</chakra.span>
        </Text>
    )
}