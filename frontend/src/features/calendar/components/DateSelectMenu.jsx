/**
 * @file DateSelectMenu.jsx
 * @module DateSelectMenu
 * @description Renders the date selection menu for the LifeEngine calendar.
 * @NOTE : ArkUI DatePicker component uses a custom value format and change handler, 
 * so we use a custom hook to convert between the standard JSDate format and the Ark UI format.
 * 
 * @WIP Currently the DatePicker trigger label does not update to display selected date 
 * and the clear trigger does not jump to today's date. 
 */

/* --- IMPORTS ---*/
import { DatePicker } from '@ark-ui/react/date-picker'
import { Portal } from '@ark-ui/react/portal'
import { Text, HStack } from '@chakra-ui/react'
import { LuChevronDown, LuChevronLeft, LuChevronRight } from 'react-icons/lu'
import { useArkCalendar } from "../hooks/useArkCalendar.js"

/* --- MAIN COMPONENT ---*/
/**
 * DateSelectMenu renders the date selection menu for the LifeEngine calendar.
 * @param {Date} selectedDate - The date for which to display the calendar.
 * @param {Function} setSelectedDate - A function to update the selected date.
 * @returns {JSX.Element} A Custom DatePicker component containing the date selection menu.
 */
export default function DateSelectMenu({ selectedDate, setSelectedDate }) {
  // Use the custom hook to get the Ark UI calendar value and change handler
  const { arkValue, handleDateChange } = useArkCalendar(selectedDate, setSelectedDate);

  return (
    <DatePicker.Root
      value={arkValue}
      onValueChange={handleDateChange} // Update the selected date when the user selects a new date
      selectionMode='single' // Set the selection mode to single, allowing only one date to be selected at a time
    >
      <DatePicker.Control>
        <DatePicker.Trigger>
          <HStack>
            <Text>{selectedDate.toDateString()}</Text> {/* Display the currently selected date in a human-readable format */}
            <LuChevronDown /> {/* Icon indicating that this is a dropdown menu */}
          </HStack>
        </DatePicker.Trigger>
      </DatePicker.Control>
      <Portal>
        <DatePicker.Positioner>
          <DatePicker.Content>
            <DatePicker.View view="day">
              <DatePicker.Context>
                {(datePicker) => (
                  <>
                    <DatePicker.ViewControl>
                      <DatePicker.PrevTrigger>
                        <LuChevronLeft />
                      </DatePicker.PrevTrigger>
                      <DatePicker.ViewTrigger>
                        <DatePicker.RangeText />
                      </DatePicker.ViewTrigger>
                      <DatePicker.NextTrigger>
                        <LuChevronRight />
                      </DatePicker.NextTrigger>
                    </DatePicker.ViewControl>
                    <DatePicker.Table bgcolor='grey'>
                      <DatePicker.TableHead>
                        <DatePicker.TableRow>
                          {datePicker.weekDays.map((weekDay, id) => (
                            <DatePicker.TableHeader key={id}>
                              {weekDay.short}
                            </DatePicker.TableHeader>
                          ))}
                        </DatePicker.TableRow>
                      </DatePicker.TableHead>
                      <DatePicker.TableBody>
                        {datePicker.weeks.map((week, id) => (
                          <DatePicker.TableRow key={id}>
                            {week.map((day, id) => (
                              <DatePicker.TableCell key={id} value={day}>
                                <DatePicker.TableCellTrigger>
                                  {day.day}
                                </DatePicker.TableCellTrigger>
                              </DatePicker.TableCell>
                            ))}
                          </DatePicker.TableRow>
                        ))}
                      </DatePicker.TableBody>
                    </DatePicker.Table>
                  </>
                )}
              </DatePicker.Context>
            </DatePicker.View>
          </DatePicker.Content>
        </DatePicker.Positioner>
      </Portal>
    </DatePicker.Root>
  )
}