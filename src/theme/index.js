import { createSystem, defaultConfig } from "@chakra-ui/react"
import { defineConfig } from "@chakra-ui/react";

const customConfig = defineConfig( {
    globalCss: {
        body: {
            fontFamily: "Mukta, sans-serif",

        },
    },
    theme:{
        textStyles: {
            "headingSolid": {
                value: {
                    fontSize: "lg",
                    fontWeight: "500",
                    color: "text.solid"
                }
            },
            "defaultGrey": {
                value: {
                    fontSize: "md",
                    fontWeight: "normal",
                    color: "brand.gray"
                }
            }
            
        },
        recipes: {
            button: {
                button: {
                }
            },
        },
        tokens: {
            colors: {
                brand:{
                    blueLight: {value: "#39A3FF"},
                    blueDark: {value: "#004A89"},
                    gray: {value: "#9A9A9A"},
                    grayLight: {value: "#F5F5F5"},
                    white: {value: "#FFFFFF"},
                },
                text: {
                    solid: { value: "#393939"},
                },
            },
            fontSizes: {
                //not final decision on sizing !
                "sm": { value: "1rem" },
                "md": { value: "1.5rem" },
                "lg": { value: "1.75rem" },
                "xl": { value: "2.25rem" },
            },
            fontWeights: {
                "normal": { value: "400" },
                "medium": { value: "500" },
                "bold": { value: "700" },
            },
            radii: {
                "widgetRadii": { value: "1.5rem" },
            },
            spacing: {
                general: {
                    "xsSpacing": { value: "0.5rem" },
                    "smSpacing": { value: "1rem" },
                    "mdSpacing": { value: "1.5rem" },
                    "lgSpacing": { value: "2rem" },
                },
                widget: {
                    "mLeftRight": { value: "1.75rem" },
                    "mTop": { value: "1.75rem" },
                    "pLeftRight": { value: "2rem" },
                    "pTopBottom": { value: "0.75rem" },
                },

            },
        },
    },
})


export const system = createSystem(defaultConfig, customConfig)
