import { Text, Stack, Field, HStack, Slider, Button } from "@chakra-ui/react";
import { WidgetBox } from "@ui-components/WidgetBox";
import DropDown from "@ui-components/DropDown"
import { NumberInput } from "@chakra-ui/react";
import ColourPicker from "@/components/ui-components/ColourPicker";
import { useState } from "react"

export default function EventPreferenceWidget({...props}){

    const [formData, setFormData] = useState({
        eventTypeID: 1,
        labelColour: "#3182CE",
        idealEnergy: "",
        burnoutRate: "",
        priority: 1,
        availabilityWindow: [660, 1200], // 11:00 - 20:00
        preferenceWindow: [1080, 1200],  // 18:00 - 20:00
    });

    function updateField(field, value) {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    }

    {/* NOTE : Slider operates on minutes since 00:00, so we need to convert minutes into HH:MM*/}
    function minutesToTime(minutes) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;

        return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
    }

    return(
        <WidgetBox {...props}>
            <Stack direction={"row"}>
                <Text textStyle={"headingSolid"}>Event Type Preferences</Text>
                <DropDown 
                    title={""} 
                    type={"EventCategory"} 
                    placeholder={"Default"}
                    value={formData.eventTypeID}
                    onChange={(value) => updateField("eventTypeID", value)}
                    allowClear={false}
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
                            defaultValue={formData.availabilityWindow}
                            min = {0}
                            max = {1440}
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
                            defaultValue={formData.preferenceWindow}
                            min = {0} 
                            max = {1440}
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
                <Button onClick={() => console.log(formData)}> {/* DEBUG */}
                    Save Preferences
                </Button>
            </Stack>
        </WidgetBox>
    );

}