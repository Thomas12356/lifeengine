//-----Imports-----//
import { Provider } from "@/components/ui/provider"
import { defaultSystem } from "@chakra-ui/react"
import { Routes, Route, BrowserRouter } from 'react-router-dom'
//Pages
import Home from "@pages/Home"

export default function App() {
    return (
        <Provider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/calendar" element={<h1>Calendar</h1>} />
                </Routes>
            </BrowserRouter>
        </Provider>
    )
}