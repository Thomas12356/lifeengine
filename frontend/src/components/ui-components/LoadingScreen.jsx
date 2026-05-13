import { Spinner, Text, VStack, AbsoluteCenter } from "@chakra-ui/react"

export default function LoadingScreen(){
    return(
        <AbsoluteCenter>
        <VStack >
            <Spinner size="xl" color={"brand.blueLight"}/>
            <Text textStyle = "defaultGrey">Loading LifeEngine ...</Text>
        </VStack>
        </AbsoluteCenter>
    );
}