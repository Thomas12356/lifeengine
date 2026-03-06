import { DatePicker } from '@ark-ui/react/date-picker'
import { Portal } from '@ark-ui/react/portal'
import { Text, Button } from '@chakra-ui/react'
import { LuChevronDown, LuChevronLeft, LuChevronRight } from 'react-icons/lu'

import { useArkCalendar } from "../hooks/useArkCalendar.js"

export default function DateSelectMenu({ selectedDate, setSelectedDate }) {

  console.log("DateSelectMenu rendered with selectedDate:", selectedDate)

  const { arkValue, handleDateChange } = useArkCalendar(selectedDate, setSelectedDate);


  return (
    <DatePicker.Root
      value={arkValue}
      onValueChange={handleDateChange}
      selectionMode='single'
    >
      <DatePicker.Control>
        <DatePicker.Trigger>
            <Button>
                <Text>March 2026</Text>
                <LuChevronDown />
            </Button>
        </DatePicker.Trigger>
        <DatePicker.ClearTrigger>Today</DatePicker.ClearTrigger>
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