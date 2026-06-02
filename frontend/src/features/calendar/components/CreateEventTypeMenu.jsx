import DropDown from "@ui-components/DropDown"
import { Button, Input, Stack, Field, HStack, Collapsible, NumberInput, Checkbox, Text } from "@chakra-ui/react"
import ColourPicker from "@ui-components/ColourPicker"
import { LuChevronRight } from "react-icons/lu"
import { useState } from "react"
//import useAddEvent from "../hooks/useAddEvent"
import { createEventType } from "@utils/eventServices"
import { useEventTypes } from "@/context/EventTypeContext"
import { levelToFloat } from "@/utils/parametersHelper"

//import buildEventPayload from "../utils/buildEventPayload"

export default function CreateEventTypeMenu({ onClose, onEventTypeCreated }){

    const { refreshEventTypes } = useEventTypes()

    const[formData, setFormData] = useState({
        eventTypeName : "",
        idealEnergy : "",
        priority : "",
        burnoutRate : "",
        isMoveable : false,
        colour : "#39A3FF"
    })

    function updateField(field, value) {
        setFormData((prev) => ({
            ...prev,
            [field] : value
        }))
    }

    async function handleSubmit() {
        try {
            
            const user = JSON.parse(localStorage.getItem("user"))

            const eventTypeData = {
                user_id : user.id,
                name : formData.eventTypeName,
                colour : formData.colour,   
                parameters : {
                    ideal_energy : levelToFloat(formData.idealEnergy),
                    burnout_rate : levelToFloat(formData.burnoutRate),
                    priority : formData.priority,     
                }
            }

            console.log(eventTypeData)

            await createEventType(eventTypeData)
            await refreshEventTypes()
            onClose()
        } catch (err) {
            console.error("Failed to create event type.", {err})
        }
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
                        Allow events of this type to be moved during
                        auto-rescheduling of other events
                    </Checkbox.Label>
                    <Checkbox.Control/>
                </Checkbox.Root>
            </Field.Root>

            <Collapsible.Root>
                <Collapsible.Trigger>
                    <Collapsible.Indicator>
                        <HStack>
                            <Text fontWeight={"normal"}>Advanced Options</Text>
                            <LuChevronRight />
                        </HStack>
                    </Collapsible.Indicator>
                </Collapsible.Trigger>
                <Collapsible.Content>
                    <Stack gap={3} paddingTop={4}>
                        <Field.Root>
                            <HStack>
                                <Field.Label fontWeight={"unset"}>Priority</Field.Label>
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