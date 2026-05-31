import { createContext, useState, useEffect, useContext, useMemo } from "react";
import { fetchEventTypes } from "@/utils/eventServices";

// Initialise event type context
const EventTypeContext = createContext(null);

export function EventTypeProvider({ children }) {
    // Initialise state values
    const [eventTypes, setEventTypes] = useState([])

    // Fetch logged-in user from local storage
    // Replace with fetch from AuthContext
    const user = JSON.parse(localStorage.getItem("user"))

    async function refreshEventTypes() {
        if (!user?.id) return

        try {
            const eventTypes = await fetchEventTypes(user.id)
            setEventTypes(eventTypes)
        } catch (err) {
            console.log("Failed to fetch event types", err)
        }
    }

        // Build event type ID -> event type map
    const eventTypeByID = useMemo(() => {
        const map = {}
        for (const type of eventTypes) {
            map[type.id] = type
        }
        return map
    }, [eventTypes])

    // Build event type name -> event type map
    const eventTypeByName = useMemo(() => {
        const map = {}
        for (const type of eventTypes) {
            map[type.name] = type
        }
        return map
    }, [eventTypes])

    // Fetch event type from map by ID
    function getEventTypeByID(id) {
        return eventTypeByID[id] ?? null
    }

    // Fetch event type from map by name
    function getEventTypeByName(name) {
        return eventTypeByName[name] ?? null
    }

    // Fetch event type id using name
    function getEventTypeIDByName(name) {
        return eventTypeByName[name]?.id ?? null
    }

    // Fetch event type name using id
    function getEventTypeNameByID(id) {
        return eventTypeByID[id]?.name ?? null
    }

    // Fetch event type name using id
    function getEventTypeColourByID(id) {
        return eventTypeByID[id]?.colour ?? "#3182CE"
    }

    // Refresh event types on mount
    useEffect(() => {
        refreshEventTypes()
    }, [])

    // DEBUG - REMOVE LATER
    useEffect(() => {
        console.log(eventTypes)
    }, [eventTypes])

    const value = {
        eventTypes,
        getEventTypeByID,
        getEventTypeByName,
        getEventTypeIDByName,
        getEventTypeNameByID,
        getEventTypeColourByID
    }

    return (
        <EventTypeContext.Provider value={value}>
            {children}
        </EventTypeContext.Provider>
    )
}

export const useEventTypes = () => useContext(EventTypeContext);