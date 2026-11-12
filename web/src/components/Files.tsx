import React, {useEffect, useRef, useState} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {listFiles} from "../api/files.ts";
import AddIcon from "../assets/icons/add.svg?react";
import FileIcon from "../assets/icons/draft.svg?react";
import FolderIcon from "../assets/icons/folder.svg?react";
import {ContextMenu} from "./ContextMenu.tsx";

interface props {
    onReady: () => void;
    handleUpload: (upload: FileList | null) => void;
}

interface fileItem{
    id: string,
    type: string,
    encryptedName: string,
    size: string,
    modDate: string
}

interface filePath{
    id: string,
    encryptedName:string
}

function parseUrl(arrayPath: Array<string>):string{
    return arrayPath.join('/');
}

function Files({onReady, handleUpload}:props) {
    const location = useLocation();
    const navigate = useNavigate();

    const [path, setPath] = useState<filePath[]>([
        {id:"0", encryptedName: "Storage"} // the root placeholder
    ]);

    const [rightClickMenu, setRightClickMenu] = useState({
        visible: false,
        x: 0,
        y: 0
    });
    const [items, setItems] = useState<fileItem[]>([]);
    const [errorMsg, setErrorMsg] = useState<string>("");

    const rightClickMenuRef = useRef<HTMLDivElement>(null);

    // Get file and folder metadata
    useEffect(()  => {
        const getFilesList = async ()=>{
            const urlPath = location.pathname.replace("/files", "");
            console.log("Pathname: " + urlPath);

            const result:{path?: filePath[], items?: fileItem[], error?:string} = await listFiles(urlPath);
            if (result.items && result.path){
                setPath([
                    {id:"0", encryptedName: "Storage"},
                    ...result.path
                ]);
                setItems(result.items);

                const urlPath = parseUrl(result.path.map(segment => segment.id));

                console.log("URL parsed path: " + urlPath);

                // Navigate only if the pathname does not include the path already
                if (!location.pathname.includes(urlPath)){
                    navigate(urlPath);
                }
            }else if(result.error){
                setErrorMsg(result.error);
            }
            console.log(result.path);
            console.log(result.items);
        }

        getFilesList();
        
         if (onReady) onReady();
    }, [location.pathname]);


    // update page title
    useEffect(()=>{
        const currentPath = path[path.length -1];

        document.title = currentPath ? `E2Drive - ${currentPath.encryptedName}` : "E2Drive - Storage"
    }, [path]);


    const handlePathClick = (e, id:string) =>{
        console.log("clicked path: " + id);

        if (id == "0"){
            navigate("/files");
        }
        if (location.pathname.includes(id)){
            console.log("ID: " + id);
            navigate(`/files/${id}`);
        }
    };

    const handleItemClick = (e:MouseEvent<HTMLTableRowElement>, id:string, type:string)=> {
      console.log("clicked: " + id + ' ' + type);

      if (type === "folder"){
          // Navigate only if the pathname does not include the path already
          if (location.pathname != location.pathname + id){
              console.log("ID: " + id);
              navigate(`${id}`);
          }
      }
    };

    const handleNewClick = (e:MouseEvent)=>{
        console.log("New clicked");
        // TODO: make the button work
    };

    const handleRightClickMenu = (e:React.MouseEvent)=>{
        e.preventDefault();

        setRightClickMenu({
            visible: true,
            x: e.clientX,
            y: e.clientY
        });
    };

    const handleRightClickMenuClose = () =>{
        setRightClickMenu({
            visible: false,
            x: 0,
            y: 0
        });
    }

    // Make context menu close when interaction happening outside
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

    return (
        <div className="files-container h-full overflow-auto pl-5 pb-5 pr-5 m-5 border border-app-border rounded-lg bg-app-card" onContextMenu={(e) =>{handleRightClickMenu(e)}}>
            {
                rightClickMenu.visible && <ContextMenu ref={rightClickMenuRef} eventState={()=> handleRightClickMenuClose()} fileObject={handleUpload} posX={rightClickMenu.x} posY={rightClickMenu.y}/>
            }
            <div className="storage-path-container flex w-full h-15 sticky top-0 bg-app-card">
                <button onClick={e => handleNewClick(e)} className="new-button flex ml-5 text-xl items-center justify-center cursor-pointer text-white rounded-lg m-2 w-20 h-11 bg-cyan-500 hover:bg-cyan-400">
                     <AddIcon className="fill-white"/> New
                </button>
                <div className="storage-path flex ml-5 text-2xl text-app-text items-center">
                    {
                        path.map((segment, index) => (
                            <>
                                <div onClick={e => handlePathClick(e, segment.id)} className="m-1 p-1 cursor-pointer hover:bg-app-hover rounded-lg text-app-text" id={segment.id} key={segment.id}>{segment.encryptedName}</div>
                                {index < path.length - 1 && (
                                    <div>/</div>
                                )}

                            </>
                        ))
                    }
                </div>
            </div>
            {
                (errorMsg.length !== 0) ? (<div className="errorMsg text-2xl ml-5 mt-5">{errorMsg}</div>) :

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
                            <tr onClick={(e) => handleItemClick(e, item.id, item.type)} key={`${item.type}-${item.id}`} id={item.id} className="hover:bg-app-hover cursor-pointer">
                                <td className="py-4 border-b border-app-border pl-4">
                                    {
                                        item.type === "file" ? <FileIcon className="w-7 h-7"/> : <FolderIcon className="w-7 h-7"/>
                                    }
                                </td>
                                <td className="py-1 border-b border-app-border px-4">{item.encryptedName}</td>
                                <td className="py-1 border-b border-app-border px-4">{item.size}B</td>
                                <td className="py-1 border-b border-app-border px-4">{String(item.modDate).slice(0, 10).replaceAll('-', '.')}</td>
                            </tr>
                        ))
                    }


                    </tbody>
                </table>
            }
        </div>
    );
}

export default Files;