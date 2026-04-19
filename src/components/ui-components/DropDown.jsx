/**
 * Drop Down UI Component
 *
 * A resusable drop down menu component.
 *
 * @component
 * @returns {JSX.Element} DropDown component
 *
 * Last updated: 18/04/2026 by te215@kent.ac.uk
 */

import { HStack, Text, Menu, Button } from "@chakra-ui/react";
import { useState } from "react";

export default function DropDown({ type, option }) {
    {/* { type } will make an api call and run the handler named { type } */}
    var temptypeOptions = ["Normal", "Exercise", "8:00 AM"];
    var temptypeStartOption = option;

    const [selected, setSelected] = useState(temptypeOptions[temptypeStartOption]);
    
    return(
        <HStack>
            <Text>{type}</Text>
            <Menu.Root>
                <Menu.Trigger asChild>
                    {/* Custom button variant needed */}
                    <Button variant="outline" color={"brand.blueDark"} size={"sm"}>
                        {selected}
                        {/*drop down icon */}
                    </Button>
                </Menu.Trigger>
                <Menu.Positioner>
                    <Menu.Content maxH="200px" minW={"10rem"}>
                        {temptypeOptions.map((opt) => (
                            <Menu.Item 
                                key={opt} 
                                value={opt}
                                onClick={() => setSelected(opt)}
                            >
                                {opt}
                            </Menu.Item>
                        ))}
                    </Menu.Content>
                </Menu.Positioner>
            </Menu.Root>
        </HStack>
    );
}