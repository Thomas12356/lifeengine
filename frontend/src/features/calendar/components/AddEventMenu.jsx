import DropDown from "@ui-components/DropDown"
import { Button, Input, Stack, Field, HStack, Collapsible, NumberInput, Checkbox } from "@chakra-ui/react"
import { LuChevronRight } from "react-icons/lu"
import { useState } from "react"
import useAddEvent from "../hooks/useAddEvent"

export default function AddEventMenu({ onClose }){

    const[formData, setFormData] = useState({
        eventName : "",
        date : "",
        startTime : "",
        endTime : "",
        category : "",
        idealEnergy : "",
        priority : "",
        burnoutRate : "",
        isMoveable : false
    })

    function updateField(field, value) {
        setFormData((prev) => ({
            ...prev,
            [field] : value
        }))
    }

    const { sumbitEvent, loading, error} = useAddEvent()

    async function handleSave() {
        // DEBUG 
        console.log("Event saved : ")
        console.log(formData)
        
        const result = await sumbitEvent(formData)
        
        if (result.success) {
            console.log("Event saved : ")
            console.log(formData)
            onClose()
        }
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
                    <Field.Root>
                        <HStack>
                            <Field.Label>Priority</Field.Label>
                            <NumberInput.Root 
                                min={1} 
                                max={10}
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
                </Collapsible.Content>
            </Collapsible.Root>
            <Button 
                colorScheme="blue" 
                size="sm" 
                onClick={handleSave}
            >
                Save to Calendar
            </Button>
        </Stack>
    )
}