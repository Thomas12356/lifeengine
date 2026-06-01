export default function buildAutoReschedulePayload(data) {
    if (!data.eventID) {
        throw new Error("Missing event ID.");
    }
    
    return {
        event_id : data.eventID,
    };
}