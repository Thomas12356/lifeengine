/**
 * Resource Selector Heading Layout
 *
 * Displays multiple resource selectors and a greeting message to the user.
 *
 * @component
 * @returns {JSX.Element} ResourceSelectorHeading layout
 *
 * Last updated: 18/04/2026 by te215@kent.ac.uk
 * 
 * TODO:
 * - Add time-based greetings
 * - Add hoverable tooltips to explain the purpose the resource selector.
 * - Add Styling and Theming
 */

import DropDown from "@ui-components/DropDown";
import { HStack, VStack, Text, Stack } from "@chakra-ui/react";

export default function ResourceSelectorHeading() {
    const username = "Thomas";
    return(
        <HStack>

            <Stack gap={0}>
                <Text textStyle="headingSolid">Hello, {username}!</Text> {/* TODO - Good morning and Good evening messages instead of Hello */}
                <Text>How are you feeling today?</Text> {/* TODO - Add Hoverable Tool Tip */}
            </Stack>

            <HStack>
                <DropDown title={"Energy"} type={"ResourceLevel"} value={0} allowClear={false}></DropDown>
                <DropDown title={"Energy"} type={"ResourceLevel"} value={0} allowClear={false}></DropDown>
            </HStack>
        
        </HStack>
    )
}