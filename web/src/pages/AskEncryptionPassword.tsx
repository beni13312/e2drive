import React, {useState} from "react";
import {checkEncryptionPassword, getEmail} from "../api/files.ts";
import {generateKDF} from "../core/crypto/kdf.ts";

interface props {
    setEncryptionKey: (encryptionKey:Uint8Array | null) => void
}

function AskEncryptionPassword({setEncryptionKey}:props){
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    const handleSubmit = async (e:React.SubmitEvent<HTMLFormElement>)=>{
        e.preventDefault();
        const result = await checkEncryptionPassword(password);
        if(result.encryptionPassword){
            const result = await getEmail();
            const salt = Uint8Array.from(result.email);

            setEncryptionKey(await generateKDF(password, salt));
        } else if (result.error){
            setErrorMsg(result.error);
        }
    }
    return (
        <div className="encryption-password min-h-screen flex items-center justify-center">
            <div className="encryption-password-container max-w-sm w-full">
                <form onSubmit={handleSubmit}>
                    <div className="space-y-2">
                        <div className="encryption-password-title flex content-center font-bold text-2xl">Encryption password:</div>
                        <input onChange={(e)=> setPassword(e.target.value)} className="encryption-password flex border-2 border-gray-300 px-4 focus:outline-none focus:border-gray-400 rounded-lg h-12 w-full" type="password"/>
                        <input className="encryption-password-enter flex cursor-pointer hover:bg-cyan-400 bg-cyan-500 text-white text-lg font-bold rounded-lg h-10 w-full" type="submit" title="Enter"/>
                        <div className={`error-box bg-red-400 w-full h-20 p-4 rounded-lg flex items-center ${errorMsg ? "visible" : "invisible"}`}>
                            <div className="error-message text-white font-bold">{errorMsg}</div>
                        </div>
                    </div>
                </form>
        </div>
        </div>
    );
}

export default AskEncryptionPassword;