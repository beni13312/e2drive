import './App.css'
import {BrowserRouter, Routes, Route} from "react-router-dom"
import Login from "./pages/Login.tsx";
import PersonalFiles from "./pages/PersonalFiles.tsx";


function App() {

  return (
    <div className="app">
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/files" element={<PersonalFiles />} />
            </Routes>
        </BrowserRouter>
    </div>
  )
}

export default App
