import React, {useState} from "react";
import {checkEncryptionPassword} from "../api/files.ts";

interface props {
    setEncryptionPassword: (encryptionPassword:string | null) => void
}

function AskEncryptionPassword({setEncryptionPassword}:props){
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    const handleSubmit = async (e:React.SubmitEvent<HTMLFormElement>)=>{
        e.preventDefault();
        const result = await checkEncryptionPassword(password);
        console.log(result);
        if(result.encryptionPassword){
            setEncryptionPassword(password);
        }
    }
    return (
        <div className="encryption-password flex items-center justify-center min-h-screen">
            <form onSubmit={handleSubmit}>
                <div className="encryption-password-container flex flex-col space-y-2">
                    <div className="encryption-password-title flex content-center font-bold text-2xl">Encryption password:</div>
                    <input onChange={(e)=> setPassword(e.target.value)} className="encryption-password flex border-2 border-gray-300 px-4 focus:outline-none focus:border-gray-400 rounded-lg h-12 w-full" type="password" placeholder="Password"/>
                    <input className="encryption-password-enter flex cursor-pointer hover:bg-cyan-400 bg-cyan-500 text-white text-lg font-bold rounded-lg h-10 w-full" type="submit" title="Enter"/>
                    <div className={`error-box bg-red-400 w-full h-20 p-4 rounded-lg flex items-center ${errorMsg ? "visible" : "invisible"}`}>
                        <div className="error-message text-white font-bold">{errorMsg}</div>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default AskEncryptionPassword;