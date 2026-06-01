//-----Imports-----//
import { Provider } from "@/components/ui/provider"
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Box, Stack } from "@chakra-ui/react"
//Components
import  NavBar from "@/features/navbar/NavBar"
import { NavBarLogin } from "@/features/navbar/NavBar"
import ProtectedRoute from "@features/auth/components/ProtectedRoute"
import PublicOnlyRoute from "@features/auth/components/PublicOnlyRoute"
//Pages
import Home from "@pages/Home"
import Agent from "@pages/Agent"
import Profile from "@pages/Profile"
import CalendarPage from "@pages/CalendarPage"
import LoginPage from "@pages/Login"
import Register from "@pages/Register"

export default function App() {
    const location = useLocation()
    const isLoginPage = location.pathname === "/login"
    const isRegisterPage = location.pathname === "/register"

    return (
        <Box h="100dvh" overflow="hidden">
            <Box
                position="fixed"
                top="0"
                left="0"
                w="100vw"
                h="100vh"
                bg="radial-gradient(circle, #EDEDED, #EDEDED)"
                zIndex="-1"
            />

            <Box
                h="100%"
                pt="widget.mTopBottom"
                pl="widget.mLeftRight"
                pr="widget.mLeftRight"
                display="grid"
                gridTemplateRows="auto minmax(0, 1fr)"
                overflow="hidden"
            >
                <Box flexShrink={0}>
                    {isLoginPage && <NavBarLogin />}
                    {!isLoginPage && !isRegisterPage && <NavBar />}
                </Box>

                <Box minH={0} overflow="hidden" display="flex">
                    <Routes>
                        <Route element={<PublicOnlyRoute />}>
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/register" element={<Register />} />
                        </Route>

                        <Route element={<ProtectedRoute />}>
                            <Route path="/home" element={<Home />} />
                            <Route path="/calendar" element={<CalendarPage />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/agent" element={<Agent />} />
                        </Route>

                        <Route path="/" element={<Navigate to="/login" replace />} />
                    </Routes>
                </Box>
            </Box>
        </Box>
    )
}