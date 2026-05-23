import { createSystem, defaultConfig } from "@chakra-ui/react"
import { defineConfig } from "@chakra-ui/react";

const customConfig = defineConfig({
    globalCss: {
        body: {
            fontFamily: "Mukta, sans-serif",
        },
    },

    theme: {
        textStyles: {
            headingSolid: {
                value: {
                    fontSize: "lg",
                    fontWeight: "500",
                    color: "text.solid",
                },
            },

            defaultGrey: {
                value: {
                    fontSize: "sm",
                    fontWeight: "normal",
                    color: "grey.500",
                },
            },

            defaultText: {
                value: {
                    fontSize: "md",
                    fontWeight: "normal",
                    color: "grey.500",
                },
            },
            errorText: {
                value: {
                    fontSize: "sm",
                    fontWeight: "normal",
                    color: "errorRed"
                }
            },
            linkText: {
                value: {
                    fontSize: "sm",
                    fontWeight: "normal",
                    color: "blueLight.500",
                    textDecoration: "underline"
                }
            }
        },

        tokens: {
            colors: {
                blueLight: {
                    50: { value: "#E6F4FF" },
                    100: { value: "#B3DDFF" },
                    200: { value: "#80C6FF" },
                    300: { value: "#4DAFFF" },
                    400: { value: "#1A98FF" },
                    500: { value: "#39A3FF" },
                    600: { value: "#2F86CC" },
                    700: { value: "#256899" },
                    800: { value: "#1A4A66" },
                    900: { value: "#0D2433" },
                },

                blueDark: {
                    50: { value: "#E6F0FA" },
                    100: { value: "#B3D1F0" },
                    200: { value: "#80B3E6" },
                    300: { value: "#4D94DB" },
                    400: { value: "#1A75D1" },
                    500: { value: "#004A89" },
                    600: { value: "#003D73" },
                    700: { value: "#00305C" },
                    800: { value: "#002246" },
                    900: { value: "#00152F" },
                },

                grey: {
                    50: { value: "#FAFAFA" },
                    100: { value: "#F5F5F5" },
                    200: { value: "#E6E6E6" },
                    300: { value: "#CCCCCC" },
                    400: { value: "#B3B3B3" },
                    500: { value: "#9A9A9A" },
                    600: { value: "#7A7A7A" },
                    700: { value: "#5A5A5A" },
                    800: { value: "#3A3A3A" },
                    900: { value: "#1A1A1A" },
                },

                white: { value: "#ffffff" },

                errorRed: { value: "#ff7272" },

                text: {
                    "solid": { value: "#393939" },
                },
            },

            fontSizes: {
                sm: { value: "1rem" },
                md: { value: "1.5rem" },
                lg: { value: "1.75rem" },
                xl: { value: "2.25rem" },
            },

            fontWeights: {
                normal: { value: "400" },
                medium: { value: "500" },
                bold: { value: "700" },
            },

            radii: {
                widgetRadii: { value: "1.5rem" },
            },

            spacing: {
                general: {
                    xsSpacing: { value: "0.5rem" },
                    smSpacing: { value: "1rem" },
                    mdSpacing: { value: "1.5rem" },
                    lgSpacing: { value: "2rem" },
                },

                widget: {
                    mLeftRight: { value: "0.875rem" },
                    mTopBottom: { value: "0.875rem" },
                    pLeftRight: { value: "2rem" },
                    pTopBottom: { value: "1rem" },
                },
            },
        },
    },
});

export const system = createSystem(defaultConfig, customConfig)
