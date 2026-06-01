import { VStack, HStack, Text, Box } from "@chakra-ui/react";
import { WidgetBox } from "@ui-components/WidgetBox";

export default function SchedulePreviewWidget({ title, events = [] }) {
    function formatEventTime(time) {
        return new Date(time).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    }

    return (
        <WidgetBox
            width="100%"
            height="100%"
            minH="0"
            display="flex"
            flexDirection="column"
        >
            <Text textStyle="darkBlueText" mb="3">
                {title}
            </Text>

            {events.length === 0 ? (
                <Box>
                    <Text textStyle="headingSolid" color="grey.300">
                        No events
                    </Text>
                </Box>
            ) : (
                <VStack
                    width="100%"
                    maxH="220px"
                    overflowY="auto"
                    p={2}
                    gap={4}
                    align="start"
                >
                    {events.map((event) => (
                        <HStack key={event.id} gap="6" align="baseline">
                            <Text textStyle="darkBlueText">
                                {formatEventTime(event.start_time)}
                            </Text>

                            <Text textStyle="defaultText">
                                {event.name}
                            </Text>
                        </HStack>
                    ))}
                </VStack>
            )}
        </WidgetBox>
    );
}