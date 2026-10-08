import Files from "../components/Files.tsx";
import {useNavigate} from "react-router-dom";
import React, {useEffect, useState, useRef} from "react";
import {logout, validateSession} from "../api/auth.ts";
import {uploadFiles} from "../api/files.ts";
import Loading from "../components/Loading.tsx";
import RightClickMenu from "../components/RightClickMenu.tsx";
import E2ee from "../core/crypto/e2ee.ts";

interface props{
    encryptionKey: Uint8Array
}

function PersonalFiles({encryptionKey}:props){
    const navigate = useNavigate();

    // check session
    useEffect(()=>{
        const checkSession = async ()=>{
            const sessionCheck = await validateSession();
            console.log("valid session: " + sessionCheck);

            // if user is not authenticated already, navigate to files
            if(!sessionCheck){
                navigate("/");
            }
        };


        checkSession();
    }, [navigate]);

    const [isLoaded, setIsLoaded] = useState(false);
    const [isProfileDropDown, setProfileDropDown] = useState(false);
    const [rightClickMenu, setrightClickMenu] = useState({
        visible: false,
        x: 0,
        y: 0
    });
    const [isRightClickEvent, setIsRightClickEvent] = useState(false);
    const [upload, setUpload] = useState<FileList | null>(null);

    const profileDropDownRef = useRef<HTMLLIElement>(null);
    const rightClickMenuRef = useRef<HTMLDivElement>(null);

    const handleProfileDropDown = (e:React.MouseEvent) => {
            e.stopPropagation();
            !isProfileDropDown ? setProfileDropDown(true) : setProfileDropDown(false);
    };

    const handleLogOut = async ()=>{
        await logout();
        window.location.reload();

    };

    const handleRightClickMenu = (e:React.MouseEvent)=>{
        e.preventDefault();

        setrightClickMenu({
            visible: true,
            x: e.clientX,
            y: e.clientY
        });
    };

    const handleRightClickMenuClose = () =>{
        setrightClickMenu({
            visible: false,
            x: 0,
            y: 0
        });
    }

    const handleUpload = async ()=>{
        if (!upload) return;

        const e2ee = await E2ee.new(encryptionKey);
        if (upload?.[0].webkitRelativePath){
            console.log("folder");
        }
        for (const f of upload){
            console.log("Upload: " + f.name + "file size: " + Math.floor(f.size / 1024) + "KB");

            const bufferSize = 64 * 1024 // 64KB
            let size = f.size;
            let offset = 0;
            while (size > 0){
                console.log("uploading");
               const encryptedBuffer = await e2ee.encrypt((await f.bytes()).slice(offset, offset + bufferSize));

                await uploadFiles("/", new Blob([encryptedBuffer]));
                offset += bufferSize;
                size -= bufferSize;
            }
        }

        //await uploadFiles("/",);
    }

    // make dropdown close when interaction happening outside
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

    // make right click menu close when interaction happening outside
    useEffect(() => {
        const outOfRightClickMenu = (e:MouseEvent)=> {
            if(rightClickMenuRef.current && !rightClickMenuRef.current.contains(e.target as Node)){
                handleRightClickMenuClose();
            }
        }
        document.addEventListener("mousedown", outOfRightClickMenu);
        return () => {
            document.removeEventListener("mousedown", outOfRightClickMenu);
        }
    }, []);

    // close right click menu after interaction
    useEffect(() => {
        const onEventRightClickMenu = ()=>{
            if (isRightClickEvent) {
                setIsRightClickEvent(false);
                handleRightClickMenuClose();
            }
        }
        onEventRightClickMenu();
    }, [isRightClickEvent]);

    useEffect(() => {
        const uploadOnSet = async ()=>{
            if (upload){
                await handleUpload()
            }
        };
        uploadOnSet();

    }, [upload]);



    return (
        <>
            {
                !isLoaded && <Loading />
            }
            <div className={`dashboard ${isLoaded ? "flex" : "hidden"} h-dvh flex-col overflow-hidden`}>
                    <header className="header shrink-0 shadow-[0_4px_8px_rgba(0,0,0,0.15)]" >
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
                                        <div className="profile-drop-down w-60 z-1 rounded-lg top-20 right-0 absolute bg-app-card shadow-[4px_4px_8px_rgba(0,0,0,0.15)]">
                                            <ul>
                                                <li className="pl-5 p-2 hover:bg-gray-200 hover:rounded-lg cursor-pointer">Settings</li>
                                                <li className="pl-5 p-2 hover:bg-gray-200 hover:rounded-lg cursor-pointer">Information</li>
                                                <li onClick={handleLogOut} className="pl-5 p-2 hover:bg-gray-200 hover:rounded-lg cursor-pointer">Log out</li>
                                            </ul>
                                        </div>
                                    )
                                }
                            </li>
                        </ul>
                    </header>
                    <main className="main w-full min-h-0 flex-1 mb-10">
                        <div className="files-container h-full overflow-auto pl-5 pb-5 pr-5 m-5 border border-gray-200 rounded-lg bg-app-card" onContextMenu={(e) =>{handleRightClickMenu(e)}}>
                           <Files onReady={()=> {setIsLoaded(true)}} />
                            {
                                rightClickMenu.visible && <RightClickMenu ref={rightClickMenuRef} eventState={setIsRightClickEvent} fileObject={setUpload} posX={rightClickMenu.x} posY={rightClickMenu.y}/>
                            }
                        </div>
                    </main>

            </div>
        </>
    )
}
export default PersonalFiles;