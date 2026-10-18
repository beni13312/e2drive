import {login} from "../api/auth.ts";
import React, {useState, type Dispatch, type SetStateAction} from "react";
import {useNavigate} from "react-router-dom";
import Logo from "../assets/logo/logo.svg?react";
import {generateKDF} from "../core/crypto/kdf.ts";

interface props{
    onLogin: () => void,
    setEncryptionPassword: Dispatch<SetStateAction<Uint8Array>>
}

function Login({onLogin, setEncryptionPassword}:props){
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        const salt = Uint8Array.from(email);
        
        // set E2EE encryption key
        setEncryptionPassword(await generateKDF(password, salt));

        const result = await login(email, password);
        if (result.login){
            onLogin();
            navigate("/files");
        }else{
            setErrorMsg(result.error);
        }
    }

    return (
        <div className="login min-h-screen flex items-center justify-center">
            <div className="login-container max-w-sm w-full">
                <div className="logo flex flex-col w-full pb-10 top-1">
                    <Logo className="flex translate-y-42"/>
                    <div className="flex justify-center text-8xl text-[#183454]"><strong>E2</strong>Drive</div>
                    <div className="flex justify-center text-2xl text-[#183454]"><strong>END-TO-END-ENCRYPTED</strong></div>

                </div>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-2">
                            <input className="login-email border-2 border-gray-300 px-4 focus:outline-none focus:border-gray-400 rounded-lg h-12 w-full"
                                   value={email} onChange={(e)=>
                            setEmail(e.target.value.toLowerCase())} type="email" placeholder="E-mail"/>
                            <input className="login-password border-2 border-gray-300 px-4 focus:outline-none focus:border-gray-400 rounded-lg h-12 w-full"
                                   value={password} onChange={(e)=>
                            setPassword(e.target.value)} type="password" placeholder="Password"/>
                            <input className="login-submit cursor-pointer hover:bg-cyan-400 bg-cyan-500 text-white text-lg font-bold rounded-lg h-10 w-full"
                                   type="submit" value="Login"/>

                            <div className={`error-box bg-red-400 w-full h-20 p-4 rounded-lg flex items-center ${errorMsg ? "visible" : "invisible"}`}>
                                <div className="error-message text-white font-bold">{errorMsg}</div>
                            </div>
                    </div>
                </form>
            </div>
        </div>
    )
}
export default Login;