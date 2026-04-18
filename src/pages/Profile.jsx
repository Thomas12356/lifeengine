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

export default function Profile(){
    return(
        <Box>
            <Stack 
            direction={"row"} 
            justifyContent={"space-between"} 
            >

                    <UserInfoWidget />

            </Stack>
        </Box>    
        
    )
}