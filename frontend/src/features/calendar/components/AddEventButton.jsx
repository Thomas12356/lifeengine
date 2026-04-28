/**
 * @file AddEventButton.jsx
 * @module AddEventButton
 * @description A button component that triggers a popover for adding new events to the calendar.
 * Utilizes Chakra UI's Popover component for the form interface.
 * 
 * @WIP The form is currently unconnected to any state management or backend logic for saving events.
 */

/* --- IMPORTS --- */
import { Popover, Button, Input, Stack, Field, Portal, HStack } from "@chakra-ui/react"
import { useRef, useState } from "react"
import DropDown from "@ui-components/DropDown"

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
                <Button variant="outline" size="sm">Add Event</Button>
            </Popover.Trigger>

            <Portal> {/* Render the popover content in a portal to avoid z-index and overflow issues */}
                <Popover.Positioner>
                    <Popover.Content p="4" portalled={true.toString()}> {/* Portalled content for better positioning */}
                        <Popover.Arrow />
                        <Stack gap="4">
                            <Popover.Title fontWeight="medium">Add New Event</Popover.Title>
                    
                            <Field.Root>
                                <Field.Label>Event Name</Field.Label>
                                <Input 
                                    ref={firstFieldRef} 
                                    placeholder="e.g. Design Sync" 
                                />
                            </Field.Root>

                            <Field.Root>
                                <Field.Label>Date</Field.Label>
                                <Input type="date" />
                            </Field.Root>

                            <HStack>
                                <Field.Root>
                                    <Field.Label>Start Time</Field.Label>
                                    <Input type="time" />
                                </Field.Root>
                                <Field.Root>
                                    <Field.Label>End Time</Field.Label>
                                    <Input type="time" />
                                </Field.Root>
                            </HStack>

                            <Field.Root>
                                <Field.Label>Event Type</Field.Label>
                                <DropDown type={"Category"} option={0} />
                            </Field.Root>

                            <Button 
                                colorScheme="blue" 
                                size="sm" 
                                onClick={() => setOpen(false)}
                            >
                                Save to Calendar
                            </Button>
                        </Stack>
                    </Popover.Content>
                </Popover.Positioner>
            </Portal>
        </Popover.Root>
    )
}