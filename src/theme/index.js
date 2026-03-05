import { createSystem, defaultConfig } from "@chakra-ui/react"
import { defineConfig } from "@chakra-ui/react";

const customConfig = defineConfig( {
    globalCss: {
        body: {
            margin: 0,
            padding: 0,
            fontFamily: "mukta, sans-sans-serif",
        },
    },
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
                "sm": { value: "1rem" },
                "md": { value: "1.5rem" },
                "lg": { value: "1.75rem" },
                "xl": { value: "2.25rem" },
            },
            radii: {
                "widgetRadii": { value: "1.5rem" },
            },
            spacing: {
                general: {
                    "xsSpacing": { value: "0.5rem" },
                    "smSpacing": { value: "1.5rem" },
                    "mdSpacing": { value: "2rem" },
                    "lgSpacing": { value: "2.5rem" },
                },
                widget: {
                    "mLeftRight": { value: "1.75rem" },
                    "mTop": { value: "1.75rem" },
                    "pLeftRight": { value: "1.5rem" },
                    "pTopBottom": { value: "0.75rem" },
                },

            },
        },
    },
})


export const system = createSystem(defaultConfig, customConfig)
