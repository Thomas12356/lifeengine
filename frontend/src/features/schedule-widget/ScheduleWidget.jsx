import React from 'react';
import { Box, Text, VStack, HStack } from '@chakra-ui/react';
import { WidgetBox } from '@ui-components/WidgetBox';

export default function ScheduleWidget() {
  const scheduleItems = [
    { time: '11:00 AM', event: 'Meet Liam about Project' },
    { time: '12:00 PM', event: 'Food Shop' },
    { time: '01:00 PM', event: 'Golf Range' },
    { time: '02:00 PM', event: 'University Lecture' },
    { time: '02:00 PM', event: 'University Lecture' },
    { time: '02:00 PM', event: 'University Lecture' },
  ];

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

          {scheduleItems.map((item, index) => (
            <HStack key={index} spaceX="6" align="baseline">

              <Text textStyle="darkBlueText">
                {item.time}
              </Text>

              <Text textStyle="defaultText">
                {item.event}
              </Text>

            </HStack>
          ))}
        </VStack>
    </WidgetBox>
  );
}