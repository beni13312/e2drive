import Files from "../components/Files.tsx";
import {useNavigate} from "react-router-dom";
import React, {useEffect, useState, useRef} from "react";
import {logout} from "../api/auth.ts";
import {uploadMetaData, uploadChunk, createFolder} from "../api/storage.ts";
import Loading from "../components/Loading.tsx";
import E2ee from "../core/crypto/e2ee.ts";
import {getProfileName} from "../api/profile.ts";
import Logo from "../assets/logo/logo.svg?react";
import SettingsIcon from "../assets/icons/settings.svg?react";
import InformationIcon from "../assets/icons/info.svg?react"
import LogOutIcon from "../assets/icons/logout.svg?react";
import SearchIcon from "../assets/icons/search.svg?react";

interface Props{
    onLogout: () => void,
    encryptionKey: Uint8Array
}

function PersonalFiles({onLogout, encryptionKey}:Props){
    const navigate = useNavigate();

    const [isLoaded, setIsLoaded] = useState(false);
    const [profileName, setProfileName] = useState("");
    const [isProfileDropDown, setProfileDropDown] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(false);

    const profileDropDownRef = useRef<HTMLLIElement>(null);

    const handleProfileName = async ()=>{
            const result = await getProfileName();
            if (result.name){
                setProfileName(result.name);
            }
    }

    const handleProfileDropDown = (e:React.MouseEvent) => {
            e.stopPropagation();
            !isProfileDropDown ? setProfileDropDown(true) : setProfileDropDown(false);
    };

    const handleLogOut = async ()=>{
        await logout();
        onLogout();
        navigate("/", {replace: true});

    };



    const handleUpload = async (upload: FileList | null)=>{
        if (!upload) return;

        const e2ee = await E2ee.new(encryptionKey);
        if (upload?.[0].webkitRelativePath){
            console.log("folder");
        }

        const urlPath = location.pathname.replace("/storage", "");
        for (const f of upload){
            console.log("Upload: " + f.name + "file size: " + Math.floor(f.size / 1024) + "KB");

            const encoder = new TextEncoder();
            const encryptedFileName = await e2ee.encrypt(encoder.encode(f.name));
            const encryptedFileNameBase64 = btoa(String.fromCodePoint(...encryptedFileName));
            console.log("Base64FileName: " + encryptedFileNameBase64);

            const uploadFileInfo = await uploadMetaData(String(urlPath), encryptedFileNameBase64, f.size, String(f.lastModified));
            if (uploadFileInfo.id){
                console.log("file ID in database: " + uploadFileInfo.id);
            }

            let bufferSize = 64 * 1024 // 64KB
            let size = f.size;
            let offset = 0;

            // making stream from chunks
            const dataStream = new ReadableStream<Uint8Array>({
                 async start(controller){
                       try{
                            while (size > 0){
                                bufferSize = Math.min(size, bufferSize);
                                console.log("uploading");
                                const encryptedBuffer = await e2ee.encrypt(new Uint8Array(await f.slice(offset, offset + bufferSize).arrayBuffer()));

                                controller.enqueue(encryptedBuffer);

                                offset += bufferSize;
                                size -= bufferSize;
                            }
                            controller.close();
                        }catch (error){
                            controller.error(error);
                        }
                    }
            });

            const result = await uploadChunk(dataStream);
            setRefreshTrigger(!refreshTrigger);
        }

    };

    const handleCreateFolder = async (parentId:string, folderName:string)=>{
        const e2ee = await E2ee.new(encryptionKey);
        const encoder = new TextEncoder();

        const encryptedFolderName = await e2ee.encrypt(encoder.encode(folderName));
        const encryptedFolderNameeBase64 = btoa(String.fromCodePoint(...encryptedFolderName));
        console.log("Base64FileName: " + encryptedFolderNameeBase64);
        const result = await createFolder(parentId, encryptedFolderNameeBase64);
        setRefreshTrigger(!refreshTrigger);
    }

    useEffect(() => {
        const profile = async ()=>{
            await handleProfileName();
        }
        profile();
    }, []);

    // Make dropdown close when interaction happening outside
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
        <>
            {
                !isLoaded && <Loading />
            }
            <div className={`dashboard ${isLoaded ? "flex" : "hidden"} h-dvh flex-col overflow-hidden`}>
                    <header className="header shrink-0 shadow-[0_4px_8px_rgba(0,0,0,0.15)]" >
                        <ul className="list-none ml-5 mr-5 flex">
                            <li className="logo flex w-15">
                                <Logo className="size-15"/>
                            </li>
                            <li className="searchbar flex ml-auto items-center">
                                <div className="gap-2 flex flex-row border-2 items-center rounded-lg border-app-border focus-within:border-app-border-focus w-90 h-10">
                                    <SearchIcon className="fill-app-text size-7 ml-2"/>
                                    <input className="h-full w-full flex focus:outline-none" placeholder="Search"/>
                                </div>
                            </li>
                            <li ref={profileDropDownRef} className="profile flex ml-auto items-center relative">
                                <div onClick={(e)=> handleProfileDropDown(e)} className="profile-name hover:bg-app-hover rounded-lg p-2 cursor-pointer">
                                    {profileName}
                                </div>
                                {
                                    isProfileDropDown && (
                                        <div className="profile-drop-down w-50 z-1 rounded-lg top-16 right-0 absolute bg-app-bg shadow-[4px_4px_8px_rgba(0,0,0,0.15)]">
                                            <ul>
                                                <li className="p-2 hover:bg-app-hover hover:rounded-lg flex cursor-pointer"><SettingsIcon className="fill-app-text mr-2"/> Settings</li>
                                                <li className="p-2 hover:bg-app-hover hover:rounded-lg flex cursor-pointer"><InformationIcon className="fill-app-text mr-2"/> Information</li>
                                                <li onClick={handleLogOut} className="p-2 hover:bg-app-hover hover:rounded-lg flex cursor-pointer"><LogOutIcon className="fill-app-text mr-2"/> Log out</li>
                                            </ul>
                                        </div>
                                    )
                                }
                            </li>
                        </ul>
                    </header>
                    <main className="main w-full min-h-0 flex-1 mb-10">
                           <Files
                               encryptionKey={encryptionKey}
                               onReady={()=> setIsLoaded(true)}
                               handleUpload={handleUpload}
                               refreshTrigger={refreshTrigger}
                               handleCreateFolder={handleCreateFolder}
                           />
                    </main>

            </div>
        </>
    )
}
export default PersonalFiles;