export default function buildAutoReschedulePayload(data) {
    if (!data.eventID) {
        throw new Error("Missing event ID.");
    }
    
    return {
        user_id : JSON.parse(localStorage.getItem("user")).id,
        event_id : data.eventID,
    };
}