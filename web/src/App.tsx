import './App.css'
import {BrowserRouter, Routes, Route} from "react-router-dom"
import {useState} from "react";
import Login from "./pages/Login.tsx";
import PersonalFiles from "./pages/PersonalFiles.tsx";


function App() {
    const [E2EEKey, setE2EEKey] = useState<Uint8Array>(new Uint8Array());
    console.log("E2EE encryption key set: " + (E2EEKey.length > 0))

    return (
    <div className="app">
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login setKey={setE2EEKey}/>} />
                <Route path="/files" element={<PersonalFiles />} />
            </Routes>
        </BrowserRouter>
    </div>
  )
}

export default App
