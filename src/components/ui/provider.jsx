'use client'

import { ChakraProvider } from '@chakra-ui/react'
import { ColorModeProvider } from './color-mode'
import { system } from '@/theme/index'

export function Provider(props) {
  return (
    <ChakraProvider value={system}>
      {/* <ColorModeProvider> */}
        {props.children}
      {/* </ColorModeProvider> */}
    </ChakraProvider>
  )
}
