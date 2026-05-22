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
import { useRef, useState } from "react"

import AddEventMenu from "./AddEventMenu"

/* --- MAIN COMPONENT --- */
/**
 * AddEventButton renders the popover for adding new events to the calendar.
 * @returns {JSX.Element} A Popover component representing the event addition interface.
 */
export default function AddEventButton() {

    const [open, setOpen] = useState(false) // Track popover open state
    const firstFieldRef = useRef(null) // Ref to the first input field for initial focus when popover opens
    console.log("Popover is open:", open)
    return (
        <Popover.Root 
        open={open} 
        onOpenChange={(e) => setOpen(e.open)}
        positioning={{ placement: "bottom" }}
        >
            <Popover.Trigger> {/* Use asChild to render the trigger as a Chakra UI Button */}
                Add Event
            </Popover.Trigger>
            <Portal> {/* Render the popover content in a portal to avoid z-index and overflow issues */}
                <Popover.Positioner>
                    <Popover.Content p="4"> {/* Portalled content for better positioning */}
                        <Popover.Arrow />
                        <Popover.Title fontWeight="medium">Add New Event</Popover.Title>   
                        <AddEventMenu onClose={() => setOpen(false)}/> 
                    </Popover.Content>
                </Popover.Positioner>
            </Portal>
        </Popover.Root>
    )
}