import {login} from "../api/auth.ts";
import React, {useState, type Dispatch, type SetStateAction} from "react";
import {useNavigate} from "react-router-dom";
import Logo from "../assets/logo/logo.svg?react";
import {generateKDF} from "../core/crypto/kdf.ts";

interface Props{
    onLogin: () => void,
    setEncryptionPassword: Dispatch<SetStateAction<Uint8Array>>
}

function Login({onLogin, setEncryptionPassword}:Props){
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
            navigate("/storage");
        }else{
            setErrorMsg(result.error);
        }
    }

    return (
        <div className="login min-h-screen flex justify-center">
            <div className="login-container max-w-sm w-full">
                <div className="logo flex flex-col w-full pb-10 top-1">
                    <Logo className="flex ml-auto mr-auto size-60 translate-y-8"/>
                    <div className="flex justify-center text-8xl text-logo-text"><strong>E2</strong>Drive</div>
                    <div className="flex justify-center text-[27.5px] text-logo-text"><strong>END-TO-END-ENCRYPTED</strong></div>

                </div>
                <form onSubmit={(e) => handleSubmit(e)}>
                    <div className="space-y-2">
                            <input className="login-email border-2 border-app-border px-4 focus:outline-none focus:border-app-border-focus rounded-lg h-12 w-full"
                                   value={email} onChange={(e)=>
                            setEmail(e.target.value.toLowerCase())} type="email" placeholder="E-mail"/>
                            <input className="login-password border-2 border-app-border px-4 focus:outline-none focus:border-app-border-focus rounded-lg h-12 w-full"
                                   value={password} onChange={(e)=>
                            setPassword(e.target.value)} type="password" placeholder="Password"/>
                            <button className="login-submit cursor-pointer hover:bg-accent-hover bg-accent text-white text-lg font-bold rounded-lg h-10 w-full"
                                   type="submit">Login</button>

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