/**
 * Resource Select UI Component
 *
 * A basic dropdown menu for selecting a resource level.
 *
 * @component
 * @returns {JSX.Element} ResourceSelect component
 *
 * Last updated: 13/04/2026 by te215@kent.ac.uk
 */

import { HStack, Text, Menu, Button } from "@chakra-ui/react";
import { useState } from "react";

export default function ResourceSelect({ resource, options = ['Low', "Normal", "High"] }) {
    const [selected, setSelected] = useState(options[1]);
    
    return(
        <HStack>
            <Text>{resource}</Text>
            <Menu.Root>
                <Menu.Trigger asChild>
                    <Button variant="outline" size="sm">
                        {selected}
                        <Text>Arrow</Text>
                    </Button>
                </Menu.Trigger>
                <Menu.Positioner>
                    <Menu.Content>
                        {options.map((opt) => (
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