/*
 * Calendar Page Component
 *
 * Renders the content of the calendar page
 *
 * @component
 * @returns {JSX.Element} The Calendar page component
 *
 * Last updated: 21/02/2026
*/

import { Box } from "@chakra-ui/react";
import Calendar from "@/features/calendar/Calendar";

export default function CalendarPage() {
    return (
        <Box>
            <Calendar />
        </Box>
    )
}