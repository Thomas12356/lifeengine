import { WidgetBox } from "@ui-components/WidgetBox";
import { useHomepage } from "@/context/HomepageContext";
import { useState } from "react";

import RescheduleMenu from "../reschedule-menu/RescheduleMenu";
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
    
    const { nextEvent, cancelEvent, refreshHomepageEvents } = useHomepage()
    const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);

    function formatEventTime(time) {
        return new Date(time).toLocaleTimeString([],{
            hour:"2-digit",
            minute:"2-digit"
        }
        )
    }

    function getTimeUntil(time) {
        const now = new Date()
        const eventStart = new Date(time)

        const differenceMs = eventStart - now // Get difference in ms
        const differenceMins = Math.max(0, Math.round(differenceMs / 1000 / 60)) // Convert ms to minutes

        if (differenceMins >= 60) {
            const differenceHours = Math.floor(differenceMins / 60)
            if (differenceHours > 1) {
                return `${differenceHours} hours`
            }
            else {
                return `${differenceHours} hour`
            }
        }
        else {
            if (differenceMins == 1){
                `${differenceMins} minutes`
            }
            return `${differenceMins} minutes`
        }
    }

    if (!nextEvent) {
        return (
            <WidgetBox>
                <Text textStyle="darkBlueText">
                    Next Up
                </Text>

                <Text textStyle="headingSolid">
                    No upcoming events
                </Text>

                <Text textStyle="defaultText">
                    You're clear for the rest of the day.
                </Text>
            </WidgetBox>
        );
    }

    return(
        <>
            <WidgetBox>
                <Stack
                    direction={{ base: "column", xl: "row" }}
                    justifyContent="space-between"
                    align={{ base: "start", xl: "center" }}
                    gap={5}
                    width="100%"
                >
                    {/* Left Section */}
                    <Stack gap={0} minW={0}>

                        <Text textStyle="darkBlueText">
                            Next Up
                        </Text>

                        <Text textStyle="headingSolid" wordBreak="break-word">
                            {nextEvent.name}
                        </Text>
                        <Text textStyle="defaultText">
                            {formatEventTime(nextEvent.start_time)} - {formatEventTime(nextEvent.end_time)}
                        </Text>
                    </Stack>

                    {/* Right Section */}
                    <Stack
                        align={{ base: "start", xl: "end" }}
                        gap={4}
                        width={{ base: "100%", xl: "auto" }}
                    >
                        <Text textStyle="defaultText" fontSize="sm">
                            Starts in {getTimeUntil(nextEvent.start_time)}
                        </Text>

                        <HStack
                            wrap="wrap"
                            spacing={3}
                            width={{ base: "100%", xl: "auto" }}
                        >
                            <Button
                                borderRadius="100px"
                                px={{ base: 4, xl: 7 }}
                                width={{ base: "100%", xl: "auto" }}
                                bg="warningYellow"
                                fontSize="md"
                                onClick={() => setIsRescheduleOpen(true)}
                            >
                                Reschedule
                            </Button>

                            <Button
                                borderRadius="100px"
                                px={{ base: 4, xl: 7 }}
                                width={{ base: "100%", xl: "auto" }}
                                bg="errorRed"
                                fontSize="md"
                                onClick={() => cancelEvent(nextEvent.id)}
                            >
                                Cancel
                            </Button>
                        </HStack>
                    </Stack>
                </Stack>
            </WidgetBox>

            <RescheduleMenu 
                isOpen={isRescheduleOpen} 
                onOpenChange={setIsRescheduleOpen}
                event={nextEvent}
                onSuccess={refreshHomepageEvents}
            />
        </>
    )
}