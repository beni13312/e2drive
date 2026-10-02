import Files from "../components/Files.tsx";
import {useNavigate} from "react-router-dom";
import React, {useEffect, useState, useRef} from "react";
import {validateSession} from "../api/auth.ts";

function PersonalFiles(){
    const navigate = useNavigate();

    // check session
    useEffect(()=>{
        const effect = async ()=>{
            const sessionCheck = await validateSession();
            console.log("valid session: " + sessionCheck);

            // if user is not authenticated already, navigate to files
            if(!sessionCheck){
                navigate("/");
            }
        };


        effect();
    }, [navigate]);


    const [isProfileDropDown, setProfileDropDown] = useState(false);
    const profileDropDownRef = useRef<HTMLElement>(null);

    const handleProfileDropDown = (e:React.MouseEvent) => {
            e.stopPropagation();
            !isProfileDropDown ? setProfileDropDown(true) : setProfileDropDown(false);
    };

    useEffect(() => {
        const outOfProfileDropDown = (e:MouseEvent)=> {
            if(profileDropDownRef.current && !profileDropDownRef.current.contains(e.target as Node)){
                setProfileDropDown(false);
            }
        }
        document.addEventListener("mousedown", outOfProfileDropDown);
        return () => {
            document.removeEventListener("mousedown", outOfProfileDropDown);
        }
    }, []);

    return (
        <div className="dashboard">
            <header className="header shadow-[0_4px_8px_rgba(0,0,0,0.15)]" >
                <ul className="list-none ml-5 mr-5 flex">
                    <li className="logo flex w-15">
                        <img src="../../src/assets/logo.png" alt="logo"/>
                    </li>
                    <li className="searchbar flex ml-auto items-center">
                        <input className="border-2 border-gray-300 focus:outline-none px-4 rounded-lg h-10 w-100" placeholder="Search"/>
                    </li>
                    <li ref={profileDropDownRef} className="profile flex ml-auto items-center relative">
                        <div onClick={(e)=>{handleProfileDropDown(e)}} className="profile-name hover:bg-gray-200 rounded-lg p-2 cursor-pointer">
                            Test Profile
                        </div>
                        {
                            isProfileDropDown && (
                                <div className="profile-drop-down w-60  rounded-lg top-20 right-0 absolute bg-app-card shadow-[4px_4px_8px_rgba(0,0,0,0.15)]">
                                    <div className="pl-5 p-2 hover:bg-gray-200 hover:rounded-lg">Settings</div>
                                    <div className="pl-5 p-2 hover:bg-gray-200 hover:rounded-lg">Information</div>
                                    <div className="pl-5 p-2 hover:bg-gray-200 hover:rounded-lg">Log out</div>
                                </div>
                            )
                        }
                    </li>
                </ul>
            </header>
            <main className="main w-full">
               <Files />
            </main>
        </div>
    )
}
export default PersonalFiles;