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
import { Box } from "@chakra-ui/react";

/* ---------- Imports Custom Layout Components ----------*/
import ResourceSelectorHeading from "@features/resource-selector-heading/ResourceSelectorHeading";
import NextEvent from "@features/next-event-widget/NextEventWidget";
import LogoutButton from "@/features/auth/components/LogoutButton";

export default function Home() {
    const user = JSON.parse(localStorage.getItem('user'));
    return (
        <Box>
            <ResourceSelectorHeading username={user?.first_name}/>
            <NextEvent/>
        </Box>
    )
}