import './App.css'
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom"
import {useEffect, useState} from "react";
import Login from "./pages/Login.tsx";
import PersonalFiles from "./pages/PersonalFiles.tsx";
import AskEncryptionPassword from "./pages/AskEncryptionPassword.tsx";
import {validateSession} from "./api/validate.ts";


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
    const [isCheckingSession, setIsCheckingSession] = useState(true);
    const [isSessionValid, setIsSessionValid] = useState<boolean>(false);

    // Keep encryption key in memory which will be cleared after the site refreshed
    const [encryptionKey, setEncryptionKey] = useState<Uint8Array>(new Uint8Array());
    console.log("E2EE encryption key set: " + (encryptionKey.length > 0))

    useEffect(() => {
        const checkSession = async ()=>{
            setIsSessionValid(await validateSession());
            setIsCheckingSession(false);
        };
        checkSession();

    }, []);

    return (
        <Routes>
            <Route path="/" element={
                isCheckingSession ? (
                        <div></div>
                ) :
                (isSessionValid) ? <Navigate to="/files" replace /> : <Login onLogin={() => setIsSessionValid(true)} setEncryptionPassword={setEncryptionKey} />
            } />
            <Route path="/files/*" element={
                isCheckingSession ? (
                    <div></div>
                ) :
                (isSessionValid) ?
                    (encryptionKey.length === 0 ? <AskEncryptionPassword setEncryptionKey={setEncryptionKey}/> :
                    <PersonalFiles onLogout={() => setIsSessionValid(false)} encryptionKey={encryptionKey}/>) : <Navigate to="/" />
            } />
        </Routes>
    );
}

export default App
