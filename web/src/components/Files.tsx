import {useEffect, useState} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {listFiles} from "../api/files.ts";
import AddIcon from "../assets/icons/add.svg?react";
import FileIcon from "../assets/icons/draft.svg?react";
import FolderIcon from "../assets/icons/folder.svg?react";

interface props {
    onReady: () => void;
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
    name:string
}

function parseUrl(arrayPath: Array<string>):string{
    return arrayPath.join('/');
}

function Files({onReady}:props) {
    const location = useLocation();
    const navigate = useNavigate();

    const [path, setPath] = useState<filePath[]>([]);
    const [items, setItems] = useState<fileItem[]>([]);
    const [errorMsg, setErrorMsg] = useState<string>("");

    // Get files and folder metadata
    useEffect(()  => {
        const getFilesList = async ()=>{
            console.log("Pathname: " + location.pathname);

            const result:{path?: filePath[], items?: fileItem[], error?:string} = await listFiles(location.pathname);
            if (result.items && result.path){
                setPath(result.path);
                setItems(result.items);

                const urlPath = parseUrl(result.path.map(segment => segment.name));

                console.log("URL parsed path: " + urlPath);

                // Navigate only if the pathname does not include the path already
                if (!location.pathname.includes(urlPath)){
                    navigate(urlPath);
                }
            }else if(result.error){
                setErrorMsg(result.error);
            }
            console.log(items);
        }

        getFilesList();
        
         if (onReady) onReady();
    }, [location.pathname]);

    const handleItemClick = (e:MouseEvent<HTMLTableRowElement>, id:string, type:string, name:string)=> {
      console.log("clicked: " + id + ' ' + type);

      if (type === "folder"){
          const handleOpenFolder = async () => {
              // Navigate only if the pathname does not include the path already
              if (!location.pathname.includes(id)){
                  navigate(id);
              }
              setPath(prev => [...prev, {id, name}]);
              console.log("Path: " + path);
          }
          handleOpenFolder();
      }
    };

    return (
        <>
            <div className="storage-path-container flex w-full h-15 sticky top-0 bg-app-card">
                <button className="new-button flex ml-5 text-xl items-center justify-center cursor-pointer text-white rounded-lg m-2 w-20 h-11 bg-cyan-500 hover:bg-cyan-400">
                     <AddIcon className="fill-white"/> New
                </button>
                <div className="storage-path flex ml-5 text-2xl text-gray-600 items-center">
                    {
                        path.map((segment, index) => (
                            <>
                                {console.log("Segments: " + segment.name)}
                                <div className="m-1 p-1 cursor-pointer hover:bg-app-hover rounded-lg text-app-text" id={segment.id} key={segment.id}>{segment.name}</div>
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
                            <tr onClick={(e) => handleItemClick(e, item.id, item.type, item.encryptedName)} key={`${item.type}-${item.id}`} id={item.id} className="hover:bg-app-hover cursor-pointer">
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
        </>
    );
}

export default Files;