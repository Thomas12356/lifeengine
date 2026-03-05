import { Text, chakra } from "@chakra-ui/react";

export default function LifeEngineLogo() {
    return(
        <Text fontSize = "lg">
            <chakra.span color="brand.blueDark">Life</chakra.span>
            <chakra.span color="brand.blueLight">Engine</chakra.span>
        </Text>
    )
}