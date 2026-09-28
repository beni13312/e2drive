import login from "../api/auth.ts";
import {type FormEvent, useState} from "react";

function Login(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        await login(email, password);
    }

    return (
        <div className="login min-h-screen flex items-center justify-center">

            <div className="container max-w-sm w-full">
                <div className="logo flex  w-full p-10 top-1"><img src="../../src/assets/logo2.png" alt="logo"/></div>
                <form onSubmit={(e)=>{handleSubmit(e)}}>
                <ul className="list-none space-y-2">
                    <li><input className="login-email border-2 px-4 border-app-text rounded-lg h-12 w-full"
                               value={email} onChange={(e)=>
                        setEmail(e.target.value)} type="email" placeholder="E-mail"/></li>
                    <li><input className="login-password border-2 px-4 border-app-text rounded-lg h-12 w-full"
                               value={password} onChange={(e)=>
                        setPassword(e.target.value)} type="password" placeholder="Password"/></li>
                    <li><input className="login-submit cursor-pointer hover:bg-cyan-400 bg-cyan-500 text-white text-lg font-bold rounded-lg h-10 w-full"
                               type="submit" value="Login"/></li>
                </ul>
                </form>
            </div>
        </div>
    )
}
export default Login;