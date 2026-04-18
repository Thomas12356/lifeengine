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

import { Box } from "@chakra-ui/react";

import ResourceSelect from "@/features/resource-selector-heading/components/ResourceSelect";
import ResourceSelectorHeading from "@/features/resource-selector-heading/ResourceSelectorHeading";

export default function Home() {
    return (
        <Box>
        <ResourceSelectorHeading username={"Thomas"}/>
        </Box>
    )
}