import { createSystem, defaultConfig } from "@chakra-ui/react"
import { defineConfig } from "@chakra-ui/react";

const customConfig = defineConfig( {
    theme:{
        tokens: {
            colors: {
                brand:{
                    blueLight: {value: "#39A3FF"},
                    blueDark: {value: "#004A89"},
                    gray: {value: "#9A9A9A"}
                },
            },
            fontSizes: {
                //not final decision on sizing !
                sm: { value: "0.875rem" },
                md: { value: "1rem" },
                lg: { value: "2rem" },
                xl: { value: "2.25rem" },
            },
            radii: {
                "widgetRadii": { value: "1.5rem" },
            },
            spacing: {
                "MWidgetLeftRight": { value: "1rem" },
                "MWidgetTop": { value: "0.5rem" },
                "PWidgetLeftRight": { value: "1.5rem" },
                "PWidgetTopBottom": { value: "0.5rem" },
            },
        },
    },
})


export const system = createSystem(defaultConfig, customConfig)
