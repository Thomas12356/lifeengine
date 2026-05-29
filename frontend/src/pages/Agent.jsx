import AgentChat from "@/features/agent-chat/AgentChat"
import AgentWidget from "@/features/agent-widget/AgentWidget"
import { WidgetBox } from "@ui-components/WidgetBox"
import { Box } from "@chakra-ui/react"

export default function Agent() {
    return (
        <Box width="100%" px={3} py={2}>
            <AgentWidget />
        </Box>
    )
}