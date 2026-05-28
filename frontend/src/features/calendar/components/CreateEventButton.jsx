import { Popover, Button, Portal } from "@chakra-ui/react"
import { useState } from "react"
import { LuPlus } from "react-icons/lu"

import CreateEventMenu from "./CreateEventMenu"

export default function CreateEventButton() {

    const [open, setOpen] = useState(false) // Track popover open state

    return (
        <Popover.Root 
            open={open} 
            onOpenChange={(e) => setOpen(e.open)}
            positioning={{ placement: "bottom" }}
        >
            <Popover.Trigger asChild>
                <Button
                    bg="transparent"
                    color="blue.500"
                    border="1px solid"
                    borderRadius="xl"
                    _hover={{
                        filter: "brightness(0.92)",
                    }}
                >
                    Create Event Type
                    <LuPlus />
                </Button>
            </Popover.Trigger>
            <Portal> {/* Render the popover content in a portal to avoid z-index and overflow issues */}
                <Popover.Positioner>
                    <Popover.Content p="4"> {/* Portalled content for better positioning */}
                        <Popover.Arrow />
                        <Popover.Title fontWeight="medium">Create New Event Type</Popover.Title>   
                        <CreateEventMenu onClose={() => setOpen(false)}/>
                    </Popover.Content>
                </Popover.Positioner>
            </Portal>
        </Popover.Root>
    )
}