import { Box, HStack, Spacer, Stack } from "@chakra-ui/react";
import { Text, Button } from "@chakra-ui/react";
import { WidgetBox } from "@ui-components/WidgetBox";
import DigitalClock from "@ui-components/DigitalClock";
import { GreyHorizontalDivider } from "@ui-components/Dividers";
import AgentChat from "@features/agent-chat/AgentChat";

export default function AgentWidget() {
    
    return(
        <WidgetBox>
            <Stack direction="column" width="100%" align="start">
                <Text textStyle="darkBlueText">Good Morning, Thomas Eardley!</Text>
                <DigitalClock />
            </Stack>
            <GreyHorizontalDivider />

            <AgentChat />
        </WidgetBox>
    )
}