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
 * 
 */

/* ---------- Imports Chakra UI ----------*/
import { Box, HStack, Stack } from "@chakra-ui/react";
import { Text, Button } from "@chakra-ui/react";

export default function NextEvent() {
    
    return(
        <HStack>
            <Stack>
                <Text>Next Up</Text>
                <Text textStyle="headingSolid">Code LifeEngine</Text>
                {/*<Text>Starts in -- Minutes</Text> */}
                {/* How long till user needs to begin commute */}
            </Stack>

            <Stack>
                <Text>10:00 AM - 11:00 AM</Text>
                <HStack>
                    <Button>Cancel</Button>
                    <Button>Reschedule</Button>
                </HStack>
            </Stack>
        </HStack>
    )
}