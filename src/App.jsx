//-----Imports-----//
import { Provider } from "@/components/ui/provider"
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import { Box } from "@chakra-ui/react"
//Components
import NavBar from "@/features/navbar/NavBar"
//Pages
import Home from "@pages/Home"
import Profile from "@pages/Profile"
import CalendarPage from "@pages/CalendarPage"

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
                bg="radial-gradient(circle, #EDEDED, #EDEDED)"
                zIndex="-1">
            </Box>

            <Box pt={"widget.mTopBottom"} pb={"widget.mTopBottom"} pl={"widget.mLeftRight"} pr={"widget.mLeftRight"}>

                <NavBar />

                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/calendar" element={<h1>Calendar</h1>} />
                    <Route path="/profile" element={<Profile/>}/>
                </Routes>
            </Box>
            
            </BrowserRouter>

        </Provider>
    )
}