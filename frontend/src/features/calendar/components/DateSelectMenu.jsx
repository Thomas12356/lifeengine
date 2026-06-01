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
import { Text, HStack, Box, Button } from '@chakra-ui/react'
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
        <DatePicker.Trigger asChild>
          <Box as="button">
            <HStack>
              <Text
                fontSize={{ base: "md", md: "xl" }}
                fontWeight="medium"
                color="gray.700"
              > {/* Display the currently selected date in a readable format */}
                {selectedDate.toLocaleDateString("en-GB", {month : "short", year : "numeric"})}
              </Text> 
              <LuChevronDown /> {/* Icon indicating that this is a dropdown menu */}
            </HStack>
          </Box>
        </DatePicker.Trigger>
      </DatePicker.Control>
      <Portal>
        <DatePicker.Positioner>
          <DatePicker.Content 
            style={{
              background: "white",
              border: "1px solid #E2E8F0",
              borderRadius: "12px",
              padding: "12px",
              boxShadow: "0 12px 30px rgba(0, 0, 0, 0.12)",
              zIndex: 50,
              userSelect: "none"
            }}
          >
            <DatePicker.View view="day">
              <DatePicker.Context>
                {(datePicker) => (
                  <>
                    <DatePicker.ViewControl
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginBottom: "8px",
                        }}
                    >
                        <DatePicker.PrevTrigger
                            style={{
                                padding: "6px",
                                borderRadius: "8px",
                            }}
                        >
                            <LuChevronLeft />
                        </DatePicker.PrevTrigger>

                        <DatePicker.ViewTrigger
                            style={{
                                fontWeight: 600,
                                fontSize: "14px",
                            }}
                        >
                            <DatePicker.RangeText />
                        </DatePicker.ViewTrigger>

                        <DatePicker.NextTrigger
                            style={{
                                padding: "6px",
                                borderRadius: "8px",
                            }}
                        >
                            <LuChevronRight />
                        </DatePicker.NextTrigger>
                    </DatePicker.ViewControl>
                    <DatePicker.Table style={{
                        width: "100%",
                        borderCollapse: "separate",
                        borderSpacing: "4px",
                    }}>
                      <DatePicker.TableHead>
                        <DatePicker.TableRow>
                          {datePicker.weekDays.map((weekDay, id) => (
                            <DatePicker.TableHeader key={id}>
                              <Text fontWeight={"medium"}>{weekDay.short}</Text>
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
                    <Button
                      bg={"white"}
                      color={"black"}
                      w="100%"
                      _hover={{
                        bg: "gray.200",
                        color: "gray.800",
                      }}
                      _active={{
                        bg: "gray.300",
                      }}
                      onClick={() => datePicker.selectToday()}
                    >
                      Today
                    </Button>
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