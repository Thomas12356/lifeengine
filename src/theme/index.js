import { createSystem, defaultConfig } from "@chakra-ui/react"
import { defineConfig } from "@chakra-ui/react";

const customConfig = defineConfig( {
    theme:{
        tokens: {
            colors: {
                brand:{
                    blueLight: {value: "#39A3FF"},
                    blueDark: {value: "#004A89"},
                },
            },
        },
    },
})
export const system = createSystem(defaultConfig, customConfig)
