//-----Imports-----//
import { Provider } from "@/components/ui/provider"
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import { Box } from "@chakra-ui/react"
//Components
import NavBar from "@/features/navbar/NavBar"
//Pages
import Home from "@/pages/Home"

export default function App() {
    return (
        <Provider>

            <BrowserRouter>

            <Box
                position="fixed"
                top="0"
                left="0"
                w="100vw"
                h="100vh"
                bg="radial-gradient(circle, white, #EDEDED)"
                zIndex="-1">
            </Box>

                <NavBar />

                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/calendar" element={<h1>Calendar</h1>} />
                </Routes>
            
            </BrowserRouter>

        </Provider>
    )
}