/**
 * Home Page Component
 *
 * Renders the content of the home page
 *
 * @component
 * @returns {JSX.Element} The Home page component
 *
 * Last updated: 21/02/2026
 */

/* ---------- Imports Chakra UI ----------*/
import { Box } from "@chakra-ui/react";

/* ---------- Imports Custom Layout Components ----------*/
import ResourceSelectorHeading from "@features/resource-selector-heading/ResourceSelectorHeading";
import NextEvent from "@features/next-event-widget/NextEventWidget";

export default function Home() {
    return (
        <Box>
            <ResourceSelectorHeading username={"Thomas"}/>
            <NextEvent/>
        </Box>
    )
}