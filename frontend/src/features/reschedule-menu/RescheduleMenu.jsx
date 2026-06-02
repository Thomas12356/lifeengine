import { autoReschedule, rescheduleEvent, acceptAutoReschedule } from "@/utils/eventServices";
import { Button, Dialog, CloseButton, Portal, Stack, Input, Field, Text, HStack, Box, Spinner} from "@chakra-ui/react";
import { Tooltip } from "@/components/ui/tooltip"
import { useState, useEffect } from "react"
import buildReschedulePayload from "@features/reschedule-menu/utils/buildReschedulePayload";
import buildAutoReschedulePayload from "@features/reschedule-menu/utils/buildAutoReschedulePayload";
import SchedulePreviewWidget from "@features/reschedule-menu/components/SchedulePreviewWidget";


export default function RescheduleMenu({ isOpen, onOpenChange, event, onSuccess }) {
    const [formData, setFormData] = useState({
        newDate : "",
        newStart : "",
        newEnd : "",
        eventID : ""
    })

    const [autoRescheduleResult, setAutoRescheduleResult] = useState(null);
    const [autoLoading, setAutoLoading] = useState(false);
    const [acceptLoading, setAcceptLoading] = useState(false);
    const [error, setError] = useState("");

    function updateField(field, value) {
        setFormData((prev) => ({
            ...prev,
            [field] : value,
        }))
    }

    function resetState() {
        setFormData({
            newDate: "",
            newStart: "",
            newEnd: "",
            eventID: event?.id || "",
        });

        setAutoRescheduleResult(null);
        setAutoLoading(false);
        setAcceptLoading(false);
        setError("");
    }

    async function handleReschedule() {
        try {
            setError("");

            const payload = buildReschedulePayload(formData)
            await rescheduleEvent(payload)

            await onSuccess() // Refresh relevant data, e.g refresh homepage events, refresh calendar events
            resetState();

            onOpenChange(false)
        } catch (err) {
            console.log("Failed to reschedule event:", err)
            setError("Failed to reschedule event.");
        }
    }

    async function handleAutoReschedule() {
        try {
            setError("");
            setAutoRescheduleResult(null);
            setAutoLoading(true);

            const payload = buildAutoReschedulePayload(formData, true)
            console.log("AUTO RESCHEDULE PAYLOAD:", payload);
            const new_schedule = await autoReschedule(payload)

            // if (!new_schedule?.ok){
            //     throw new Error(new_schedule?.error || "Could not generate proposal.");
            // }

            setAutoRescheduleResult(new_schedule);
            console.log("AUTO RESCHEDULE RESULT:", autoRescheduleResult);

        } catch (err) {
            console.log(err.status)
            if (err.status === 422) {
                setError("Failed to find a new time. Please enter a time manually")
            }
            else {
                console.log("Failed to auto-reschedule event:", err)
                setError(err.message || "Failed to auto reschedule event.")
            }
        } finally{
            setAutoLoading(false);
        }
    }

    async function handleAcceptReschedule(){
        if(!autoRescheduleResult?.auto_reschedule_id){
            setError("Missing auto_reschedule_id.")
            return;
        }

        try{
            setError("");
            setAcceptLoading(true);
            await acceptAutoReschedule(autoRescheduleResult.auto_reschedule_id);
            await onSuccess();

            resetState();
            onOpenChange(false);
        } catch (err){
            console.log("Failed to accept auto reschedule: ", err);
            setError("Failed to apply auto reschedule.")
        }finally{
            setAcceptLoading(false);
        }
    }

    function handleDenyReschedule(){
        setAutoRescheduleResult(null);
        setError("");
    }

    function handleOpenChange(details){
        if(!details.open){
            resetState();
        }
        onOpenChange(details.open);
    }

    useEffect(() => {
        if (!event) return
        
        setFormData({
            newDate : "",
            newStart: "",
            newEnd : "",
            eventID : event.id
        })

        setAutoRescheduleResult(null);
        setError("");

        console.log(event)
    }, [isOpen, event?.id])

    return (
        <Dialog.Root 
            open={isOpen} 
            onOpenChange={handleOpenChange}
        >
            <Portal>
                <Dialog.Backdrop/>
                <Dialog.Positioner>
                    <Dialog.Content maxW="900px">
                        <Dialog.Header>
                            <Dialog.Title>
                                Reschedule {event?.name || "event"}
                            </Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>
                            <Stack gap={4}>
                                {error && (
                                    <Text textStyle="defaultText" color="red.500">
                                        {error}
                                    </Text>
                                )}

                                {!autoRescheduleResult && (
                                    <Stack>
                                        <Field.Root>
                                            <Field.Label>
                                                New date
                                            </Field.Label>

                                            <Input
                                                type="date"
                                                value={formData.newDate}
                                                onChange={(e) => updateField("newDate", e.target.value)}
                                                disabled={autoLoading}
                                            />
                                        </Field.Root>

                                        <Field.Root>
                                            <Field.Label>
                                                New start time
                                            </Field.Label>

                                            <Input
                                                type="time"
                                                value={formData.newStart}
                                                onChange={(e) => updateField("newStart", e.target.value)}
                                                disabled={autoLoading}
                                            />
                                        </Field.Root>

                                        <Field.Root>
                                            <Field.Label>
                                                New end time
                                            </Field.Label>

                                            <Input
                                                type="time"
                                                value={formData.newEnd}
                                                onChange={(e) => updateField("newEnd", e.target.value)}
                                                disabled={autoLoading}
                                            />
                                        </Field.Root>
                                    </Stack>
                                )}

                                {autoLoading && (
                                    <HStack>
                                        <Spinner />
                                        <Text textStyle="defaultText">
                                            Finding a better schedule...
                                        </Text>
                                    </HStack>
                                )}

                                {autoRescheduleResult && (
                                    <Stack gap={4}>
                                        <Text textStyle="darkBlueText">
                                            Review suggested schedule
                                        </Text>

                                        <HStack align="stretch" gap={4}>
                                            <Box flex="1" minW="0">
                                                <SchedulePreviewWidget
                                                    title="Current schedule"
                                                    events={autoRescheduleResult.old_schedule || []}
                                                />
                                            </Box>

                                            <Box flex="1" minW="0">
                                                <SchedulePreviewWidget
                                                    title="Suggested schedule"
                                                    events={autoRescheduleResult.new_schedule || []}
                                                />
                                            </Box>
                                        </HStack>
                                    </Stack>
                                )}
                            </Stack>
                        </Dialog.Body>

                        <Dialog.Footer>
                            {!autoRescheduleResult && (
                                <>
                                    <Text>
                                        <Text color={"red"}>WARNING : </Text>
                                        Auto-reschedule attempt to reschedule this event into an optimal timeslot based on your predicted energy.
                                        Depending on your scheduled events, a valid time may not be found.
                                    </Text>
                                    <Button
                                        disabled={autoLoading}
                                        onClick={handleAutoReschedule}
                                        size={{ base: "xs", md: "md" }}
                                        width={{ base: "x3", sm: "auto" }}
                                        bg="transparent"
                                        color="blueLight.500"
                                        border="1px solid"
                                        borderRadius="lg"
                                        px={{ base: 3, md: 4 }}
                                        fontSize={{ base: "xs", md: "sm" }}
                                        _hover={{
                                            filter: "brightness(0.92)",
                                            }}
                                        >
                                            Auto reschedule
                                    </Button>


                                    <Button
                                        onClick={handleReschedule}
                                        disabled={autoLoading}
                                        size={{ base: "xs", md: "md" }}
                                        width={{ base: "100%", sm: "auto" }}
                                        bg="blueLight.500"
                                        color="white"
                                        borderRadius="lg"
                                        px={{ base: 3, md: 4 }}
                                        fontSize={{ base: "xs", md: "sm" }}
                                        _hover={{
                                            filter: "brightness(0.92)",
                                        }}
                                    >
                                        Reschedule
                                    </Button>
                                </>
                            )}

                            {autoRescheduleResult && (
                                <>
                                    <Button
                                        variant="outline"
                                        onClick={handleDenyReschedule}
                                        disabled={acceptLoading}
                                    >
                                        Deny
                                    </Button>

                                    <Button
                                        onClick={handleAcceptReschedule}
                                        disabled={acceptLoading}
                                        bg="blueLight.500"
                                    >
                                        Accept
                                    </Button>
                                </>
                            )}
                        </Dialog.Footer>

                        <Dialog.CloseTrigger asChild>
                            <CloseButton />
                        </Dialog.CloseTrigger>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
}