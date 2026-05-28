import DropDown from "@ui-components/DropDown"
import { Button, Input, Stack, Field, HStack, Collapsible, NumberInput, Checkbox } from "@chakra-ui/react"
import ColourPicker from "@ui-components/ColourPicker"
import { LuChevronRight } from "react-icons/lu"
import { useState } from "react"
//import useAddEvent from "../hooks/useAddEvent"

//import buildEventPayload from "../utils/buildEventPayload"

export default function CreateEventMenu({ onClose, onEventTypeCreated }){

    const[formData, setFormData] = useState({
        eventTypeName : "",
        idealEnergy : "",
        priority : "",
        burnoutRate : "",
        isMoveable : false,
        color : ""
    })

    function updateField(field, value) {
        setFormData((prev) => ({
            ...prev,
            [field] : value
        }))
    }

    async function handleSubmit() {
        console.log(formData)
        
        onClose()
    }

    return (
        <Stack gap="4">
            <Field.Root>
                <Field.Label>Name</Field.Label>
                <Input 
                    placeholder="e.g. Deep Work"
                    value={formData.eventTypeName}
                    onChange={(e) => updateField("eventTypeName", e.target.value)}
                />
            </Field.Root>
            <Field.Root>
                <Field.Label>Label Colour</Field.Label>
                <ColourPicker value={formData.colour} onChange={(value) => updateField("colour", value)}/>
            </Field.Root>
            <Field.Root>
                <Checkbox.Root
                    value = {formData.isMoveable}
                    onCheckedChange={(e) => updateField("isMoveable", e.checked)}
                >
                    <Checkbox.HiddenInput/>
                    <Checkbox.Label>
                        Allow auto-rescheduling for this type
                    </Checkbox.Label>
                    <Checkbox.Control/>
                </Checkbox.Root>
            </Field.Root>

            <Collapsible.Root>
                <Collapsible.Trigger>
                    <Collapsible.Indicator>
                        <HStack>
                            Advanced Options
                            <LuChevronRight />
                        </HStack>
                    </Collapsible.Indicator>
                </Collapsible.Trigger>
                <Collapsible.Content>
                    <Stack gap={3}>
                        <Field.Root>
                            <HStack>
                                <Field.Label fontWeight="normal">Priority</Field.Label>
                                <NumberInput.Root 
                                    min={1} 
                                    max={10}
                                    width="80px"
                                    value = {formData.priority}
                                    onValueChange={(e) => updateField("priority", e.value)}
                                >
                                    <NumberInput.Control/>
                                    <NumberInput.Input/>
                                </NumberInput.Root>
                            </HStack>
                        </Field.Root>
                        <Field.Root>
                            <DropDown
                                title="Ideal Energy"
                                type="ResourceLevel"
                                value={formData.idealEnergy}
                                onChange={(value) => updateField("idealEnergy", value)}
                                placeholder="Default"
                                allowClear={true}
                            />
                        </Field.Root>
                        <Field.Root>
                            <DropDown 
                                title="Burnout Rate"
                                type="ResourceLevel"
                                value={formData.burnoutRate}
                                onChange={(value) => updateField("burnoutRate", value)}
                                placeholder="Default"
                                allowClear={true}
                            />
                        </Field.Root>
                    </Stack>
                </Collapsible.Content>
            </Collapsible.Root>
            <Button 
                size="sm" 
                onClick={handleSubmit}
                bg="blue.500"
                color="white"
                borderRadius="lg"
                _hover={{
                    filter: "brightness(0.92)",
                }}
            >
                Create event type
            </Button>
        </Stack>
    )
}