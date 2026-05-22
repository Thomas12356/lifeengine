import DropDown from "@ui-components/DropDown"
import { Button, Input, Stack, Field, HStack } from "@chakra-ui/react"

export default function AddEventMenu({ onClose }){
    return (
        <Stack gap="4">
            <Field.Root>
                <Field.Label>Event Name</Field.Label>
                <Input placeholder="e.g. Design Sync" />
            </Field.Root>

            <Field.Root>
                <Field.Label>Date</Field.Label>
                <Input type="date" />
            </Field.Root>

            <HStack>
                <Field.Root>
                    <Field.Label>Start Time</Field.Label>
                    <Input type="time" />
                </Field.Root>
                <Field.Root>
                    <Field.Label>End Time</Field.Label>
                    <Input type="time" />
                </Field.Root>
            </HStack>

            <Field.Root>
                <Field.Label>Event Type</Field.Label>
                <DropDown type={"Category"} option={0} />
            </Field.Root>

            <Button 
                colorScheme="blue" 
                size="sm" 
                onClick={onClose}
            >
                Save to Calendar
            </Button>
        </Stack>
    )
}