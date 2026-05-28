/**
 * Home Page Component
 *
 * Renders the content of the home page
 *
 * @component
 * @returns {JSX.Element} The Home page component
 *
 * Last updated: 18/04/2026
 */

/* ---------- Imports Chakra UI ----------*/
import { Box, HStack, Spacer, Stack, VStack } from "@chakra-ui/react";

/* ---------- Imports Custom Layout Components ----------*/
import ResourceSelectorHeading from "@features/resource-selector-heading/ResourceSelectorHeading";
import NextEvent from "@features/next-event-widget/NextEventWidget";

export default function Home() {
    const user = JSON.parse(localStorage.getItem('user'));
    return (
        <Box width="100%" px={{ base: 3, md: 5 }} py={4}>
            <Stack
                direction={{ base: "column", lg: "row" }}
                width="100%"
                justifyContent="space-between"
                alignItems="stretch"
                gap={6}
            >
                {/* Left Column */}
                <VStack
                    width={{ base: "100%", lg: "55%" }}
                    align="stretch"
                    gap={5}
                >
                    <NextEvent />
                </VStack>

                {/* Right Column */}
                <VStack
                    width={{ base: "100%", lg: "40%" }}
                    align="stretch"
                    gap={5}
                >
                    {/* Add future widgets/components here */}
                </VStack>
            </Stack>
        </Box>
    )
}