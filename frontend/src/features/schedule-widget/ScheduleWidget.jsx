import React from 'react';
import { Box, Text, VStack, HStack } from '@chakra-ui/react';
import { WidgetBox } from '@ui-components/WidgetBox';
import { useHomepage } from '@/context/HomepageContext';
//import { fetchEvents } from "@utils/eventServices"

export default function ScheduleWidget() {
  const { todaysEvents } = useHomepage()

  return (
    <WidgetBox>
      <Text textStyle="headingSolid" mb="3">
        Todays Schedule
      </Text>

        <VStack 
            width="100%"
            height="200px" 
            overflowY="scroll" 
            p={2}
            mb={2}
            gap={5} 
            align="start" 
            css={{
                "&::-webkit-scrollbar": {
                width: "8px",
                },
                "&::-webkit-scrollbar-track": {
                background: "rgba(0, 0, 0, 0.05)", 
                borderRadius: "4px",
                },
                "&::-webkit-scrollbar-thumb": {
                background: "rgba(0, 0, 0, 0.2)", 
                borderRadius: "4px",},
            }}>

          {todaysEvents.map((event) => (
            <HStack key={event.id} spaceX="6" align="baseline">

              <Text textStyle="darkBlueText">
                {event.start_time}
              </Text>

              <Text textStyle="defaultText">
                {event.name}
              </Text>

            </HStack>
          ))}
        </VStack>
    </WidgetBox>
  );
}