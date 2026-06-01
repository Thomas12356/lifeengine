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

import { HStack, Text, Menu, Button, Portal } from "@chakra-ui/react";

var staticTypes = {
    "EventType" : ["Gym", "Work", "Study"],
    "ResourceLevel" : ["High", "Medium", "Low"]
}

export default function DropDown({ title, type, value, onChange, placeholder, allowClear, options, ...props }) {
    
    const typeOptions = options ?? staticTypes[type]

    function handleSelect(opt) {
        onChange?.(opt)
    }

    function handleClear() {
        onChange?.("")
    }
    
    return(
        <HStack>
            <Text>{title}</Text>
            <Menu.Root>
                <Menu.Trigger asChild>
                    {/* Custom button variant needed */}
                    <Button  variant="outline" color={"grey.800"} size={"sm"} px="50px" {...props}>
                        {value || placeholder}
                        {/*drop down icon */}
                    </Button>
                </Menu.Trigger>
                <Portal>
                    <Menu.Positioner>
                        <Menu.Content maxH="200px" minW={"10rem"}>

                            {allowClear && value && (
                                <Menu.Item value="clear" onClick={handleClear}>
                                    Clear
                                </Menu.Item>
                            )}

                            {typeOptions.map((opt) => (
                                <Menu.Item 
                                    key={opt} 
                                    value={opt}
                                    onClick={() => handleSelect(opt)}
                                >
                                    {opt}
                                </Menu.Item>
                            ))}
                        </Menu.Content>
                    </Menu.Positioner>           
                </Portal>
            </Menu.Root>
        </HStack>
    );
}