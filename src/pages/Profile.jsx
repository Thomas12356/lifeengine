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
import UserInfoWidget from "@/features/user-info-widget/UserInfoWidget";
import EventPreferenceWidget from "@/features/event-preferences-widget/EventPreferencesWidget";

export default function Profile(){
    return(
        <Box>
            <Stack direction={"row"}>
                    <UserInfoWidget />
                    <EventPreferenceWidget/>
            </Stack>
        </Box>    
        
    )
}