

export const getEventDurationInMinutes = (start, end) => {
    const startTime = new Date(start)
    const endTime = new Date(end)
    return (endTime - startTime) / (1000 * 60) // duration in minutes
}

export const getEventWeekday = (date) => {
    const eventDate = new Date(date)
    const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    return weekdays[eventDate.getDay()]
}

export const calculateEventPosition = (event, weekStart) => {
    const eventStart = new Date(event.start)
    const eventEnd = new Date(event.end)

    const dayIndex = (eventStart.getDay() + 6) % 7 // Convert Sunday=0 to Sunday=6
    const startMinutes = eventStart.getHours() * 60 + eventStart.getMinutes()
    const endMinutes = eventEnd.getHours() * 60 + eventEnd.getMinutes()

    return {
        top: (startMinutes / 1440) * 100, // percentage of the day
        height: ((endMinutes - startMinutes) / 1440) * 100, // percentage of the day
        left: (dayIndex / 7) * 100, // percentage of the week
        width: (1 / 7) * 100 // percentage of the week for one day
    }
}