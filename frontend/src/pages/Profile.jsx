/**
 * Profile Page Component
 *
 * Renders the content of the profile page
 *
 * @component
 * @returns {JSX.Element} The profile page component
 *
 * Last updated: 18/04/2026 by te215@kent.ac.uk
 */
import { Box, Stack, Flex } from "@chakra-ui/react";
import UserMenu from "@/features/profile-menu/UserMenu";
import EventTypesMenu from "@/features/profile-menu/EventTypesMenu"

export default function Profile(){
    return(
        <Box
            w="100%"
            h="100%"
            minH={0}

            px={3}
            py={2}
            overflow="scroll"
            pb="10"
        >
            <Stack
                direction={{ base: "column", lg: "row" }}
                gap={{ base: 4, md: 6 }}
                align="stretch"
                w="100%"
            >

                <UserMenu flex={{ base: "unset", lg: "0 0 380px" }}/>
                <EventTypesMenu flex="1" minW={0}/>

            </Stack>
        </Box>
        
    )
}