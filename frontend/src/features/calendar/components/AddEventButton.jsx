/**
 * @file AddEventButton.jsx
 * @module AddEventButton
 * @description A button component that triggers a popover for adding new events to the calendar.
 * Utilizes Chakra UI's Popover component for the form interface.
 * 
 * @WIP The form is currently unconnected to any state management or backend logic for saving events.
 */

/* --- IMPORTS --- */
import { Popover, Button, Portal } from "@chakra-ui/react"
import { useState } from "react"
import { LuPlus } from "react-icons/lu"

import AddEventMenu from "./AddEventMenu"

/* --- MAIN COMPONENT --- */
/**
 * AddEventButton renders the popover for adding new events to the calendar.
 * @returns {JSX.Element} A Popover component representing the event addition interface.
 */
export default function AddEventButton({ onEventAdded }) {

    const [open, setOpen] = useState(false) // Track popover open state

    return (
        <Popover.Root 
            open={open} 
            onOpenChange={(e) => setOpen(e.open)}
            positioning={{ placement: "bottom" }}
        >
            <Popover.Trigger asChild>
                <Button
                    size={{ base: "xs", md: "md" }}
                    width={{ base: "100%", sm: "auto" }}
                    bg="blue.500"
                    color="white"
                    borderRadius="lg"
                    px={{ base: 3, md: 4 }}
                    fontSize={{ base: "xs", md: "sm" }}
                    _hover={{
                        filter: "brightness(0.92)",
                    }}
                >
                    Add Event
                    <LuPlus />
                </Button>
            </Popover.Trigger>
            <Portal> {/* Render the popover content in a portal to avoid z-index and overflow issues */}
                <Popover.Positioner>
                    <Popover.Content p="4" maxH="60vh" overflowY="auto"> {/* Portalled content for better positioning */}
                        <Popover.Arrow />
                        <AddEventMenu onClose={() => setOpen(false)} onEventAdded={onEventAdded}/> 
                    </Popover.Content>
                </Popover.Positioner>
            </Portal>
        </Popover.Root>
    )
}