import { Button, Dialog, CloseButton, Portal, Text } from "@chakra-ui/react";


export default function RescheduleMenu({ isOpen, onOpenChange }) {
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
                                Reschedule
                            </Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>
                            <Text>
                                Forms go here
                            </Text>
                        </Dialog.Body>
                        <Dialog.Footer>
                            <Dialog.ActionTrigger asChild>
                                <Button>
                                    Cancel
                                </Button>
                            </Dialog.ActionTrigger>
                            <Button>
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