import DropDown from "@ui-components/DropDown"
import { Button, Input, Stack, Field, HStack, Collapsible, NumberInput, Checkbox } from "@chakra-ui/react"
import ColourPicker from "@ui-components/ColourPicker"
import { LuChevronRight } from "react-icons/lu"
import { useState } from "react"
import useAddEvent from "../hooks/useAddEvent"

import buildEventPayload from "../utils/buildEventPayload"

export default function AddEventMenu({ onClose, onEventAdded }){

    const[formData, setFormData] = useState({
        eventName : "",
        date : "",
        startTime : "",
        endTime : "",
        category : "",
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

    const { sumbitEvent, loading, error} = useAddEvent()

    async function handleSave() {

        const payload = buildEventPayload(formData)

        // DEBUG
        console.log(payload)
        
        const result = await sumbitEvent(payload)
        
        onEventAdded()
        onClose()
    }

    return (
        <Stack gap="4">
            <Field.Root>
                <Field.Label>Event Name</Field.Label>
                <Input 
                    placeholder="e.g. Design Sync"
                    value={formData.eventName}
                    onChange={(e) => updateField("eventName", e.target.value)}
                />
            </Field.Root>

            <Field.Root>
                <Field.Label>Date</Field.Label>
                <Input 
                    type="date"
                    value={formData.date}
                    onChange={(e) => updateField("date", e.target.value)}
                />
            </Field.Root>

            <HStack>
                <Field.Root>
                    <Field.Label>Start Time</Field.Label>
                    <Input 
                        type="time"
                        value={formData.startTime}
                        onChange={(e) => updateField("startTime", e.target.value)}
                    />
                </Field.Root>
                <Field.Root>
                    <Field.Label>End Time</Field.Label>
                    <Input 
                        type="time"
                        value={formData.endTime}
                        onChange={(e) => updateField("endTime", e.target.value)}
                    />
                </Field.Root>
            </HStack>

            <Field.Root>
                <Field.Label>Event Type</Field.Label>
                <DropDown 
                    title="Category"
                    type={"EventCategory"}
                    value={formData.category}
                    option={0}
                    onChange={(value) => updateField("category", value)}
                    placeholder="No Category"
                    allowClear={true}
                />
            </Field.Root>
            <Field.Root>
                <Field.Label>Label Colour</Field.Label>
                <ColourPicker value={formData.colour} onChange={(value) => updateField("colour", value)}/>
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
                        <Field.Root>
                            <Checkbox.Root
                                value = {formData.isMoveable}
                                onCheckedChange={(e) => updateField("isMoveable", e.checked)}
                            >
                                <Checkbox.HiddenInput/>
                                <Checkbox.Label>
                                    Allow auto-rescheduling
                                </Checkbox.Label>
                                <Checkbox.Control/>
                            </Checkbox.Root>
                        </Field.Root>
                    </Stack>
                </Collapsible.Content>
            </Collapsible.Root>
            <Button 
                size="sm" 
                onClick={handleSave}
                bg="blue.500"
                color="white"
                borderRadius="lg"
                _hover={{
                    filter: "brightness(0.92)",
                }}
            >
                Save to Calendar
            </Button>
        </Stack>
    )
}