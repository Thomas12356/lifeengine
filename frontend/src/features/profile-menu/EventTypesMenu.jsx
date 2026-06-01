import { Text, Stack, Field, HStack, Slider, Button } from "@chakra-ui/react";
import { WidgetBox } from "@ui-components/WidgetBox";
import DropDown from "@ui-components/DropDown"
import { NumberInput } from "@chakra-ui/react";
import ColourPicker from "@/components/ui-components/ColourPicker";
import { useState, useEffect, useRef } from "react"
import { useEventTypes } from "@/context/EventTypeContext";
import { updateEventType } from "@/utils/eventServices";
import { floatToLevel, levelToFloat } from "@/utils/parametersHelper";

export default function EventTypesMenu({...props}){

    const { eventTypes, getEventTypeByName, refreshEventTypes } = useEventTypes()
    const eventTypeNames = eventTypes.map((type) => type.name)
    const hasInitialEventType = useRef(false)

    const [formData, setFormData] = useState({
        eventTypeName: "", // We need to read in event types IDs and map to names
        labelColour: "#3182CE",
        idealEnergy: "",
        burnoutRate: "",
        priority: 1,
        availabilityWindow: [0, 1425],
        preferenceWindow: [0, 1425],
    });

    function updateField(field, value) {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    }

    useEffect(() => { // On load set selected event type to Default
        if (hasInitialEventType.current) return
        if (eventTypes.length === 0) return

        const defaultEventType =
            eventTypes.find((type) => type.name === "Default")

        updateField("eventTypeName", defaultEventType.name)
        hasInitialEventType.current = true
    }, [eventTypes])

    // NOTE : Slider operates on minutes since 00:00, so we need to convert minutes into HH:MM
    function minutesToTime(minutes) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;

        return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
    }

    // Convert HH:MM into minutes since 00:00
    function parseTime(time) {
        const [hoursStr, minutesStr] = time.split(":")

        const hours = parseInt(hoursStr, 10)
        const minutes = parseInt(minutesStr, 10)

        return (hours * 60) + minutes

    }

    async function handleSave() {
        if (!formData.eventTypeID) return

        const user = JSON.parse(localStorage.getItem("user"))

        const payload = {
            
            user_id : user.id,
            event_type_id : formData.eventTypeID,
            colour: formData.labelColour,
            parameters: {
                ideal_energy: levelToFloat(formData.idealEnergy),
                burnout_rate: levelToFloat(formData.burnoutRate),
                priority: formData.priority
            },
            availability_start : minutesToTime(formData.availabilityWindow[0]),
            availability_end : minutesToTime(formData.availabilityWindow[1]),
            preference_start : minutesToTime(formData.preferenceWindow[0]),
            preference_end : minutesToTime(formData.preferenceWindow[1])
        }

        try {
            await updateEventType(payload)
            await refreshEventTypes()
        } catch (err) {
            console.log("Failed to update event type", err)
        }
    }


    // Fill formdata with selected event type
    useEffect(() => {
        if (!formData.eventTypeName) return

        const selectedEventType = getEventTypeByName(formData.eventTypeName)
        if (!selectedEventType) return

        setFormData((prev) => ({
            ...prev,
            eventTypeID: selectedEventType.id,
            labelColour: selectedEventType.colour,

            idealEnergy: floatToLevel(selectedEventType.parameters.ideal_energy),
            burnoutRate: floatToLevel(selectedEventType.parameters.burnout_rate),
            priority: selectedEventType.parameters.priority,
            availabilityWindow: [
                parseTime(selectedEventType.availability_start),
                parseTime(selectedEventType.availability_end)
            ],
            preferenceWindow: [
                parseTime(selectedEventType.preference_start),
                parseTime(selectedEventType.preference_end)
            ]
        }))
    }, [formData.eventTypeName, getEventTypeByName])

    return(
        <WidgetBox {...props}>
            <Stack direction={"row"}>
                <Text textStyle={"headingSolid"}>Event Type Preferences</Text>
                <DropDown 
                    title={""} 
                    type={"EventType"} 
                    placeholder={"Default"}
                    value={formData.eventTypeName}
                    onChange={(value) => updateField("eventTypeName", value)}
                    allowClear={false}
                    options={eventTypeNames}
                />
            </Stack>
            <Stack mt={"general.xsSpacing"}>
                <Field.Root>
                    <HStack>
                        <Field.Label fontWeight={"unset"}>Label colour</Field.Label>
                        <ColourPicker 
                            value={formData.labelColour}
                            onChange={(value) => updateField("labelColour", value)}
                        />
                    </HStack>
                </Field.Root>
                <DropDown 
                    title={"Ideal energy"}
                    type={"ResourceLevel"}
                    placeholder={"Default"}
                    value={formData.idealEnergy}
                    onChange={(value) => updateField("idealEnergy", value)}
                    allowClear={false}
                />
                <DropDown 
                    title={"Burnout rate"}
                    type={"ResourceLevel"}
                    placeholder={"Default"}
                    value={formData.burnoutRate}
                    onChange={(value) => updateField("burnoutRate", value)}
                    allowClear={false}
                />
                <Field.Root>
                    <HStack>
                        <Field.Label fontWeight={"unset"}>
                            Priority
                        </Field.Label>
                        <NumberInput.Root 
                            min={1} 
                            max={10}
                            width="80px"
                            value={formData.priority}
                            onValueChange={(e) =>
                                updateField("priority", e.value)
                            }
                        >
                            <NumberInput.Control/>
                            <NumberInput.Input/>
                        </NumberInput.Root>
                    </HStack>
                </Field.Root>
                <Field.Root>
                    <HStack width="100%" align="center">
                        <Field.Label fontWeight={"unset"}> 
                            Availability Window
                        </Field.Label>
                        <Slider.Root 
                            width="350px"
                            value={formData.availabilityWindow}
                            min = {0}
                            max = {1425}
                            minStepsBetweenThumbs={4} 
                            step={15} 
                            onValueChange={(details) => updateField("availabilityWindow", details.value)}
                        >
                            <Slider.Control>
                                <Slider.Track>
                                    <Slider.Range />
                                </Slider.Track>
                                <Slider.Thumbs />
                            </Slider.Control>
                        </Slider.Root>
                    </HStack>
                    <Text minW="110px">
                        {minutesToTime(formData.availabilityWindow[0])} -{" "}
                        {minutesToTime(formData.availabilityWindow[1])}
                    </Text>
                </Field.Root>
                <Field.Root>
                    <HStack width="100%" align="center">
                        <Field.Label fontWeight={"unset"}>
                            Preference Window
                        </Field.Label>
                        <Slider.Root 
                            width="350px" 
                            value={formData.preferenceWindow}
                            min = {0} 
                            max = {1425}
                            minStepsBetweenThumbs={4} 
                            step={15} 
                            onValueChange={(details) => updateField("preferenceWindow", details.value)}
                        >
                            <Slider.Control>
                                <Slider.Track>
                                    <Slider.Range />
                                </Slider.Track>
                                <Slider.Thumbs />
                            </Slider.Control>
                        </Slider.Root>
                    </HStack>
                    <Text minW="110px">
                        {minutesToTime(formData.preferenceWindow[0])} -{" "}
                        {minutesToTime(formData.preferenceWindow[1])}
                    </Text>
                </Field.Root>
                <Button onClick={handleSave}> {/* DEBUG */}
                    Save Preferences
                </Button>
            </Stack>
        </WidgetBox>
    );

}