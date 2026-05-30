import { autoReschedule, rescheduleEvent } from "@/utils/eventServices";
import { Button, Dialog, CloseButton, Portal, Stack, Input, Field, Text} from "@chakra-ui/react";
import { useState, useEffect } from "react"
import buildReschedulePayload from "./utils/buildReschedulePayload";


export default function RescheduleMenu({ isOpen, onOpenChange, event }) {

    const [formData, setFormData] = useState({
        newDate : "",
        newStart : "",
        newEnd : "",
        eventID : event.id
    })

    function updateField(field, value) {
        setFormData((prev) => ({
            ...prev,
            [field] : value,
        }))
    }

    async function handleReschedule() {
        try {
            const payload = buildReschedulePayload(formData)
            await rescheduleEvent(payload)

            setFormData({
                newData : "",
                newStart: "",
                newEnd : ""
            })

            onOpenChange(false)
        } catch (err) {
            console.log("Failed to reschedule event:", err)
        }
    }

    async function handleAutoReschedule() {
        try {
            const payload = buildReschedulePayload(formData, true)
            await autoReschedule(payload)
        } catch (err) {
            console.log("Failed to auto-reschedule event:", err)
        }
    }

    useEffect(() => {
        if (!event) return
        
        setFormData({
            newDate : "",
            newStart: "",
            newEnd : "",
            eventID : event.id
        })
    }, [isOpen, event.id])

    const autoReschedulable = event?.is_moveable

    return (
        <Dialog.Root 
            open={isOpen} 
            onOpenChange={(details) => onOpenChange(details.open)}
        >
            <Portal>
                <Dialog.Backdrop/>
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>
                                Reschedule {event.name}
                            </Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>
                            <Stack>
                                <Field.Root>
                                    <Field.Label>
                                        New date
                                    </Field.Label>
                                    <Input 
                                        type="date"
                                        value={formData.date}
                                        onChange={(e) => updateField("newDate", e.target.value)}
                                    />
                                </Field.Root>
                                <Field.Root>
                                    <Field.Label>New start time</Field.Label>
                                    <Input 
                                        type="time"
                                        value={formData.newStart}
                                        onChange={(e) => updateField("newStart", e.target.value)}
                                    />
                                </Field.Root>
                                <Field.Root>
                                    <Field.Label>New end time</Field.Label>
                                    <Input 
                                        type="time"
                                        value={formData.newEnd}
                                        onChange={(e) => updateField("newEnd", e.target.value)}
                                    />
                                </Field.Root>
                            </Stack>
                        </Dialog.Body>
                        <Dialog.Footer>
                            <Button disabled={!autoReschedulable} onClick={handleAutoReschedule}>
                                Auto reschedule
                            </Button>
                            {!autoReschedulable && (
                                <Text textStyle="defaultText" fontSize="sm">
                                    To use this feature, allow auto rescheduling for this event.
                                </Text>
                            )}
                            <Button onClick={handleReschedule}>
                                Reschedule
                            </Button>
                        </Dialog.Footer>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton/>
                        </Dialog.CloseTrigger>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>    
        </Dialog.Root>
    )
}