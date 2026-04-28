/**
 * @file ViewSelectMenu.jsx
 * @module ViewSelectMenu
 * @description Renders the view selection menu for the LifeEngine calendar, 
 * allowing users to switch between day, week, and month views.
 * 
 * @WIP View selection menu is currently a placeholder and does not affect the calendar view.
 */

/* --- IMPORTS --- */
import { Menu, Portal, Button, Stack, Text, Icon } from "@chakra-ui/react"
import { FaAngleDown } from "react-icons/fa6"
import { useState } from "react"

/* --- MAIN COMPONENT --- */
export default function ViewSelectMenu() {

    const [view, setView] = useState("week")

    return (
        <Stack>
            <Menu.Root onSelect={(details) => setView(details.value)}>
                <Menu.Trigger asChild>
                    <Button>
                        <Text>{view.charAt(0).toUpperCase() + view.slice(1)}</Text>
                        <Icon>
                            <FaAngleDown />
                        </Icon>
                    </Button>
                </Menu.Trigger>
                <Portal>
                    <Menu.Positioner>
                        <Menu.Content>
                            <Menu.Item value="day">Day</Menu.Item>
                            <Menu.Item value="week">Week</Menu.Item>
                            <Menu.Item value="month">Month</Menu.Item>
                        </Menu.Content>
                    </Menu.Positioner>
                </Portal>
            </Menu.Root>
        </Stack>
    )
}

