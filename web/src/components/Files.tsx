import {useEffect, useState} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {listFiles} from "../api/files.ts";
import AddIcon from "../assets/icons/add.svg?react";
import FileIcon from "../assets/icons/draft.svg?react";
import FolderIcon from "../assets/icons/folder.svg?react";

interface props {
    onReady: () => void;
}

interface response{
    id: string,
    type: string,
    encryptedName: string,
    size: string,
    modDate: string
}

function parseUrl (path:Array<string>): string{
    let strUrl = "";
    path.forEach((segment, index)=>{
        strUrl += segment;
        if(index < path.length - 1){
            strUrl += '/';
        }
    });
    return strUrl;
}


function Files({onReady}:props) {
    const location = useLocation();
    const navigate = useNavigate();

    const [path, setPath] = useState<Array<{id:string, name:string}>>([]);
    const [response, setResponse] = useState<response[]>([]);
    const [errorMsg, setErrorMsg] = useState<string>("");

    // Get response
    useEffect(()  => {

        const getFilesList = async ()=>{
            console.log("Pathname: " + location.pathname);

            const result = await listFiles(location.pathname);
            if (result.items && result.path){
                setResponse(result.items);

                const urlPath = parseUrl(result.path[0].name);

                console.log("URL path: " + urlPath);
                console.log("Response path: " + result.path[0].name);

                // Navigate only if the pathname does not include the path already
                if (!location.pathname.includes(urlPath)){
                    navigate(urlPath);
                }
                setPath(result.path[0]);

            }else if(result.error){
                setErrorMsg(result.error);
            }
            console.log(response);
        }

        getFilesList();
        
         if (onReady) onReady();
    }, []);

    const handleItemClick = (e:MouseEvent<HTMLTableRowElement>, id:string, type:string, name:string)=> {
      console.log("clicked: " + id + ' ' + type);

      if (type === "folder"){
          const handleOpenFolder = async () => {
              const urlPath = parseUrl(path.map(item => item.id));
              const UrlPath = urlPath + '/' + id;
              const result = await listFiles(UrlPath);
              setResponse(result.items);

              // Navigate only if the pathname does not include the path already
              if (!location.pathname.includes(id)){
                  navigate(id);
              }
              setPath(prev => [...prev, {id, name}]);
              console.log("Path: " + path);
              console.log(result);
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
                                <div className="m-1 p-1 cursor-pointer hover:bg-gray-200 rounded-lg">{segment.name}</div>
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
                        <th className="text-left sticky top-15 shadow-[inset_0_-1px_0_0_#9ca3af] bg-app-card py-4"></th>
                        <th className="text-left sticky top-15 shadow-[inset_0_-1px_0_0_#9ca3af] bg-app-card py-4">
                            <div className="hover:bg-gray-200 rounded-lg cursor-pointer py-1 px-4">Name</div>
                        </th>
                        <th className="text-left sticky top-15 shadow-[inset_0_-1px_0_0_#9ca3af] bg-app-card py-4">
                            <div className="hover:bg-gray-200 rounded-lg cursor-pointer py-1 px-4">Size</div>
                        </th>
                        <th className="text-left sticky top-15 shadow-[inset_0_-1px_0_0_#9ca3af] bg-app-card py-4">
                            <div className="hover:bg-gray-200 rounded-lg cursor-pointer py-1 px-4">Date</div>
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        response.map((item) => (
                            <tr onClick={(e) => handleItemClick(e, item.id, item.type, item.encryptedName)} key={item.id} id={item.id} className="hover:bg-gray-200 cursor-pointer">
                                <td className="py-4 border-b border-gray-400 pl-4">
                                    {
                                        item.type === "file" ? <FileIcon className="w-7 h-7"/> : <FolderIcon className="w-7 h-7"/>
                                    }
                                </td>
                                <td className="py-1 border-b border-gray-400 px-4">{item.encryptedName}</td>
                                <td className="py-1 border-b border-gray-400 px-4">{item.size}B</td>
                                <td className="py-1 border-b border-gray-400 px-4">{String(item.modDate).slice(0, 10).replaceAll('-', '.')}</td>
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