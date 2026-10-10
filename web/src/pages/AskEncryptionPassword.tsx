interface props {
    setEncryptionPassword: (encryptionPassword:string | null) => void
}

function AskEncryptionPassword({setEncryptionPassword}:props){
    const handleSubmit = (e)=>{
        setEncryptionPassword();
    }
    return (
        <div className="ask-encryption-password flex items-center content-center h-screen w-screen">
            <div className="encryption-password-title flex content-center">Encryption password:</div>
            <input type="password" placeholder="Password"/>
            <input type="submit" title="Enter"/>
        </div>
    );
}

export default AskEncryptionPassword;