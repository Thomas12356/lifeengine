//-----Imports-----//
import { Provider } from "@/components/ui/provider"
import { Routes, Route, BrowserRouter } from 'react-router-dom'
//Components
import NavBar from "@layouts/NavBar"
//Pages
import Home from "@pages/Home"

export default function App() {
    return (
        <Provider>
            <BrowserRouter>
            <NavBar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/calendar" element={<h1>Calendar</h1>} />
                </Routes>
            </BrowserRouter>
        </Provider>
    )
}