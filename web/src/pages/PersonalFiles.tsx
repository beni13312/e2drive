import Files from "../components/Files.tsx";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {validateSession} from "../api/auth.ts";

function PersonalFiles(){
    const navigate = useNavigate();

    const [isValidSession, setIsValidSession] = useState(false);

    useEffect(()=>{
        const effect = async ()=>{
            setIsValidSession(await validateSession());
            console.log("valid session: " + isValidSession);
        };
        effect();
    }, []);

    // if user is not authenticated already, navigate to files
    if(!isValidSession){
        navigate("/");
    }

    return (
        <div className="dashboard">
            <header className="header shadow-[0_4px_8px_rgba(0,0,0,0.15)]" >
                <ul className="list-none ml-5">
                    <li className="logo flex w-15"><img src="../../src/assets/logo.png" alt="logo"/></li>
                </ul>
            </header>
            <main className="main w-full">
               <Files />
            </main>
        </div>
    )
}
export default PersonalFiles;