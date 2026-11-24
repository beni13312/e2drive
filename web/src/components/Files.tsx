import React, {useEffect, useRef, useState} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {listFiles} from "../api/storage.ts";
import AddIcon from "../assets/icons/add.svg?react";
import FileIcon from "../assets/icons/draft.svg?react";
import FolderIcon from "../assets/icons/folder.svg?react";
import ContextMenu from "./ContextMenu.tsx";
import CreateFolder from "./CreateFolder.tsx";
import E2ee from "../core/crypto/e2ee.ts";

interface Props {
    encryptionKey:Uint8Array;
    onReady: () => void;
    handleUpload: (upload: FileList | null) => void;
    refreshTrigger: boolean;
    handleCreateFolder: (parentId: string, folderName: string) => void;
}

interface FilePath{
    id: string,
    encryptedName:string
}

interface FileItem{
    id: string,
    type: string,
    encryptedName: string,
    size: string,
    modDate: string
}

interface DecryptedFilePath extends Omit<FilePath, "encryptedName">{
    name:string
}

interface DecryptedFileItem extends Omit<FileItem, "encryptedName">{
    name: string,
}


function parseUrl(arrayPath: Array<string>):string{
    return arrayPath.join('/');
}

function Files({encryptionKey, onReady, handleUpload, refreshTrigger, handleCreateFolder}:Props) {
    const location = useLocation();
    const navigate = useNavigate();

    const [contextMenu, setContextMenu] = useState({
        visible: false,
        x: 0,
        y: 0,
        type: ""
    });
    const [path, setPath] = useState<DecryptedFilePath[]>([
        {id:"storage-root", name: "Storage"} // the root placeholder
    ]);
    const [items, setItems] = useState<DecryptedFileItem[]>([]);
    const [msg, setMsg] = useState<string>("");
    const [isNewFolder, setIsNewFolder] = useState(false);

    const contextMenuRef = useRef<HTMLDivElement>(null);

    // Get file and folder metadata
    useEffect(()  => {
        // Reset the msg useState
        setMsg("");
        const getFilesList = async ()=>{
            const urlPath = location.pathname.replace("/storage", "");
            console.log("Pathname: " + urlPath);

            const result:{path: FilePath[], items: FileItem[], info?:string, error?:string} = await listFiles(urlPath);
            if (result.path && result.items){
                let path: DecryptedFilePath[] = [];
                let items:DecryptedFileItem[] = [];

                const e2ee = await E2ee.new(encryptionKey);
                const decoder = new TextDecoder("utf-8");

                for (const i of result.path){
                    const decryptedData = await e2ee.decrypt(Uint8Array.from(atob(i.encryptedName), c => c.charCodeAt(0)));
                    path.push({id: i.id, name: decoder.decode(decryptedData)});
                }
                for (const i of result.items){
                    const decryptedData = await e2ee.decrypt(Uint8Array.from(atob(i.encryptedName), c => c.charCodeAt(0)));
                    items.push(
                        {
                            id: i.id,
                            type: i.type,
                            name: decoder.decode(decryptedData),
                            size: i.size,
                            modDate: i.modDate

                        }
                    );
                }

                setPath([
                    {id:"storage-root", name: "Storage"},
                    ...path
                ]);
                if(result.info){
                    setMsg(result.info);
                }else{
                    setItems(items);
                }

                const parsedPath = parseUrl(result.path.map(segment => segment.id));

                console.log("URL parsed path: " + parsedPath);

                // Navigate only if the pathname does not include the path already
                // if (!location.pathname.includes(parsedPath)){
                //     navigate(parsedPath);
                // }
            }else if(result.error){
                setMsg(result.error);
            }
            console.log("Path: ");
            console.log(result.path);
            console.log("Items: ");
            console.log(result.items);
        }

        getFilesList();
        
         if (onReady) onReady();
    }, [location.pathname, refreshTrigger]);


    // update page title
    useEffect(()=>{
        const currentPath = path[path.length -1];

        document.title = currentPath ? `E2Drive - ${currentPath.name}` : "E2Drive - Storage"
    }, [path]);


    const handlePathClick = (_e: React.MouseEvent, id:string) =>{
        console.log("clicked path: " + id);

        if (id === "storage-root"){
            navigate("/storage");
        }
        if (location.pathname.includes(id)){
            console.log("ID: " + id);

            let navigatePathArray:string[] = [];
            for (const e of path){
                if (e.id !== "storage-root") {
                    navigatePathArray.push(e.id);
                }
                if (e.id === id) break;
            }
            const parsedPath = parseUrl(navigatePathArray)
            navigate(`/storage/${parsedPath}`);
        }
    };

    const handleItemClick = (_e:React.MouseEvent, id:string, type:string)=> {
      console.log("clicked: " + id + ' ' + type);

      if (type === "folder"){
          // Navigate only if the pathname does not include the path already
          if (location.pathname != location.pathname + id){
              console.log("ID: " + id);
              navigate(`${location.pathname}/${id}`);
          }
      }
    };

    const handleContextMenu = (e:React.MouseEvent, type:string)=>{
        e.preventDefault();
        e.stopPropagation()

        setContextMenu({
            visible: true,
            x: e.clientX,
            y: e.clientY,
            type: type,
        });
    };

    const handleContextMenuClose = () =>{
        setContextMenu({
            visible: false,
            x: 0,
            y: 0,
            type: ""
        });
    }


    const handleNewClick = (e:React.MouseEvent)=>{
        e.stopPropagation();
        !contextMenu.visible ?
            setContextMenu({
            visible: true,
            x: 58,
            y: 145,
            type: "general"
        }):
        handleContextMenuClose()

    };

    // Make context menu close when interaction happening outside
    useEffect(() => {
        const outOfContextMenu = (e:MouseEvent)=> {
            const target = e.target as HTMLButtonElement;
            if(!target.closest(".new-button") &&  contextMenuRef.current && !contextMenuRef.current.contains(e.target as Node)){
                handleContextMenuClose();
            }
        }
        document.addEventListener("mousedown", outOfContextMenu);
        return () => {
            document.removeEventListener("mousedown", outOfContextMenu);
        }
    }, []);

    return (
        <div className="files-container h-full overflow-auto flex flex-col pl-5 pb-5 pr-5 m-5 border border-app-border rounded-lg bg-app-card">
            {
                contextMenu.visible && <ContextMenu
                    ref={contextMenuRef}
                    eventState={()=> handleContextMenuClose()}
                    handleUpload={handleUpload}
                    onNewFolder={() => setIsNewFolder(true)}
                    posX={contextMenu.x} posY={contextMenu.y} type={contextMenu.type}/>
            }
            {
                isNewFolder && <CreateFolder
                    onCancel={()=> setIsNewFolder(false)}
                    onCreate={(folderName) => handleCreateFolder(path[path.length -1]?.id === "storage-root" ? "" : path[path.length -1]?.id, folderName)} />
            }
            <div className="storage-path-container flex w-full h-15 sticky top-0 bg-app-card">
                <button onClick={e => handleNewClick(e)} className="new-button flex ml-5 items-center justify-center cursor-pointer text-on-accent rounded-lg m-2 w-20 h-11 bg-accent hover:bg-accent-hover">
                     <AddIcon className="fill-on-accent"/> New
                </button>
                <div className="storage-path flex ml-5 text-2xl text-app-text items-center">
                    {
                        path.map((segment, index) => (
                            <>
                                <div onClick={e => handlePathClick(e, segment.id)}
                                     className={`m-1 p-1 cursor-pointer hover:bg-app-hover rounded-lg ${index < path.length - 1 ? "text-app-unfocused" : "text-app-text"}`}
                                     id={segment.id} key={segment.id}>{segment.name}</div>
                                {index < path.length - 1 && (
                                    <div className="text-app-unfocused">/</div>
                                )}

                            </>
                        ))
                    }
                </div>
            </div>
            {
                (msg.length !== 0) ? (<div className="errorMsg text-2xl ml-5 mt-5">{msg}</div>) : (

                <div onContextMenu={(e) => handleContextMenu(e, "general")} className="files-table-container flex-1">

                    <table className="files-table table-auto border-collapse border-spacing-x-8">
                        <colgroup>
                            <col className="w-auto"/>
                            <col className="w-full"/>
                            <col className="w-auto"/>
                            <col className="w-auto"/>
                        </colgroup>
                        <thead>
                        <tr>
                            <th className="text-left sticky top-15 shadow-[inset_0_-1px_0_0_var(--color-app-border)] bg-app-card py-4"></th>
                            <th className="text-left sticky top-15 shadow-[inset_0_-1px_0_0_var(--color-app-border)] bg-app-card py-4">
                                <div className="hover:bg-app-hover rounded-lg cursor-pointer py-1 px-4">Name</div>
                            </th>
                            <th className="text-left sticky top-15 shadow-[inset_0_-1px_0_0_var(--color-app-border)] bg-app-card py-4">
                                <div className="hover:bg-app-hover rounded-lg cursor-pointer py-1 px-4">Size</div>
                            </th>
                            <th className="text-left sticky top-15 shadow-[inset_0_-1px_0_0_var(--color-app-border)] bg-app-card py-4">
                                <div className="hover:bg-app-hover rounded-lg cursor-pointer py-1 px-4">Date</div>
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            items.map((item) => (
                                <tr onContextMenu={(e)=> handleContextMenu(e, "entry")} onClick={(e) => handleItemClick(e, item.id, item.type)} key={`${item.type}-${item.id}`} id={item.id} className="hover:bg-app-hover cursor-pointer">
                                    <td className="py-4 border-b border-app-border pl-4">
                                        {
                                            item.type === "file" ? <FileIcon className="w-7 h-7 fill-file-icon"/> : <FolderIcon className="w-7 h-7 fill-folder-icon"/>
                                        }
                                    </td>
                                    <td className="py-1 border-b border-app-border px-4">{item.name}</td>
                                    <td className="py-1 border-b border-app-border px-4">{item.size}B</td>
                                    <td className="py-1 border-b border-app-border px-4">{String(item.modDate).slice(0, 10).replaceAll('-', '.')}</td>
                                </tr>
                            ))
                        }


                        </tbody>
                    </table>
                </div>
                )
            }
        </div>
    );
}

export default Files;