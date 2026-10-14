import './App.css'
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom"
import {useEffect, useState} from "react";
import Login from "./pages/Login.tsx";
import PersonalFiles from "./pages/PersonalFiles.tsx";
import AskEncryptionPassword from "./pages/AskEncryptionPassword.tsx";
import {validateSession} from "./api/auth.ts";


function App() {
    return (
    <div className="app">
        <BrowserRouter>
            <AppRoutes/>
        </BrowserRouter>
    </div>
  )
}

function AppRoutes(){
    const [isSessionValid, setIsSessionValid] = useState<boolean>(false);
    const [encryptionKey, setEncryptionKey] = useState<Uint8Array>(new Uint8Array());
    console.log("E2EE encryption key set: " + (encryptionKey.length > 0))

    useEffect(() => {
        const checkSession = async ()=>{
            setIsSessionValid(await validateSession());
        };
        checkSession();

    }, []);

    return (
        <Routes>
            <Route path="/" element={
                (isSessionValid) ? <Navigate to="/files" /> : <Login onLogin={() => setIsSessionValid(true)} setEncryptionPassword={setEncryptionKey} />
            } />
            <Route path="/files" element={
                (isSessionValid) ?
                    (encryptionKey.length === 0 ? <AskEncryptionPassword setEncryptionKey={setEncryptionKey}/> :
                    <PersonalFiles onLogout={() => setIsSessionValid(false)} encryptionKey={encryptionKey}/>) : <Navigate to="/" />
            } />
        </Routes>
    );
}

export default App
