import './App.css'
import {BrowserRouter, Routes, Route} from "react-router-dom"
import {useState} from "react";
import Login from "./pages/Login.tsx";
import PersonalFiles from "./pages/PersonalFiles.tsx";
import AskEncryptionPassword from "./pages/AskEncryptionPassword.tsx";


function App() {
    const [encryptionKey, setEncryptionKey] = useState<Uint8Array>(new Uint8Array());
    console.log("E2EE encryption key set: " + (encryptionKey.length > 0))

    return (
    <div className="app">
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login setKey={setEncryptionKey}/>} />
                <Route path="/files" element={
                    encryptionKey.length === 0 ? <AskEncryptionPassword/> :
                    <PersonalFiles encryptionKey={encryptionKey}/>} />
            </Routes>
        </BrowserRouter>
    </div>
  )
}

export default App
