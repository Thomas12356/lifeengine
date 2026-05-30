import { WidgetBox } from "@ui-components/WidgetBox";

/**
 * Next Event Loayout
 *
 * Displays the next event in the user's schedule and options to cancel and reschedule.
 *
 * @component
 * @returns {JSX.Element} NextEvent Layout
 *
 * Last updated: 16/04/2026 by te215@kent.ac.uk
 * 
 * TODO:
 * - Theming and Styling
 * - Data Passing
 */

/* ---------- Imports Chakra UI ----------*/
import { Box, HStack, Spacer, Stack } from "@chakra-ui/react";
import { Text, Button } from "@chakra-ui/react";

export default function NextEvent() {
    
    return(
        <WidgetBox>
            <Stack
                direction={{ base: "column", lg: "row" }}
                justifyContent="space-between"
                align={{ base: "start", lg: "center" }}
                gap={5}
                width="100%"
            >
                {/* Left Section */}
                <Stack gap={0} minW={0}>

                        <Text textStyle="darkBlueText">
                            Next Up
                        </Text>

                        <Text textStyle="headingSolid" wordBreak="break-word">
                            Code LifeEngine
                        </Text>
                        <Text textStyle="defaultText">
                        10:00 AM - 11:00 AM
                    </Text>
                </Stack>

                {/* Right Section */}
                <Stack
                    align={{ base: "start", lg: "end" }}
                    gap={4}
                    width={{ base: "100%", lg: "auto" }}
                >
                    <Text textStyle="defaultText" fontSize="sm">
                        Starts in -- Minutes
                    </Text>

                    <HStack
                        wrap="wrap"
                        spacing={3}
                        width={{ base: "100%", lg: "auto" }}
                    >
                        <Button
                            borderRadius="100px"
                            px={{ base: 4, lg: 7 }}
                            width={{ base: "100%", lg: "100%" }}
                            bg="warningYellow"
                            fontSize="md"
                        >
                            Reschedule
                        </Button>

                        <Button
                            borderRadius="100px"
                            px={{ base: 4, lg: 7 }}
                            width={{ base: "100%", lg: "100%" }}
                            bg="errorRed"
                            fontSize="md"
                        >
                            Cancel
                        </Button>
                    </HStack>
                </Stack>
            </Stack>
        </WidgetBox>
    )
}