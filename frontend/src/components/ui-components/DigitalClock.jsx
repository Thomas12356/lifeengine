import { useState, useEffect } from "react";
import { Box, Stack, Text } from "@chakra-ui/react";

const timeStyles = {
    textStyle: "5xl",
    fontWeight: "400",
    color: "grey.800",
};
const dateStyles = {
    textStyle: "defaultText",
    fontWeight: "normal",
};

export default function DigitalClock() {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formattedTime = (date) => {
        return date.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit',
        });
    };

  const formattedDate = (date) => {
    return date.toLocaleDateString([], { 
      weekday: 'long', 
      day: 'numeric',
      month: 'long'
    });
  };

    return (
        <Stack direction="column" justifyContent="start" gap={0}>
            <Text {...timeStyles}>{formattedTime(time)}</Text>
            <Text {...dateStyles}>{formattedDate(time)}</Text>
        </Stack>
    );
}