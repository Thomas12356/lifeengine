import { fetchEventsByDay } from "@/utils/eventServices";
import { createContext, useState, useEffect, useMemo, useContext } from "react";


// Initialise homepage context
const HomepageContext = createContext(null);

export function HomepageProvider({ children }) {
    // Initialise state values
    const [todaysEvents, setTodaysEvents] = useState([])

    // Fetch logged-in user from local storage
    // Replace with fetch from AuthContext
    const user = JSON.parse(localStorage.getItem("user"))
    const userID = user.id

    // Helper function for getting the current date (FULL ISO STRING)
    function getTodaysDateISO() {
        return new Date().toISOString()
    }

    // Using current date fetch todays events
    async function refreshHomepageEvents() {
        if (!userID) return; // Return if userID undefined

        try {
            const today = getTodaysDateISO();
            const events = await fetchEventsByDay(userID, today) // API call to fetch events
            setTodaysEvents(events["events"]) // Update state
        } catch(err) {
            console.log("Failed to refresh homepage events:", err)
        }
    }

    // Refresh on userID change
    useEffect(() => {
        refreshHomepageEvents();
    }, [userID])

    // DEBUG - REMOVE LATER
    useEffect(() => {
        console.log("todaysEvents state changed:", todaysEvents);
    }, [todaysEvents]);

    // Package home page data
    const value = useMemo(() => ({
        todaysEvents,
        refreshHomepageEvents
    }), [todaysEvents])

    return (
        <HomepageContext.Provider value={value}>
            {children}
        </HomepageContext.Provider>
    )
}

export const useHomepage = () => useContext(HomepageContext);