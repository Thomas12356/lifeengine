import { Box } from "@chakra-ui/react";

export function VerticalDivider() {
    return(
        <Box width="2px" />
    )
}

export function HorizontalDivider() {
    return(
        <Box height="2px"/>
    )
}
export function GreyHorizontalDivider() {
    return(
        <Box height="2px" width="100%" bg="gray.200" my="2"/>
    )
}