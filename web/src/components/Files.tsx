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

function Files({onReady}:props) {
    const location = useLocation();
    const navigate = useNavigate();

    const [path, setPath] = useState<Array<string>>([]);
    const [response, setResponse] = useState<response[]>([]);

    // get response
    useEffect(()  => {

        const getFilesList = async ()=>{
            const result = await listFiles();
            if (!result.error && result.items && result.path){
                setResponse(result.items);

                // navigate only if the pathname does not include the path already
                if (!location.pathname.includes(result.path)){
                    navigate(result.path);
                }
                setPath(result.path);
            }
            console.log(result.path);
            console.log(response);
        }

        getFilesList();
        
         if (onReady) onReady();
    }, []);

    const handleItemClick = (e:MouseEvent, id:string, type:string)=> {
      console.log("clicked: " + id + ' ' + type);

      if (type === "folder"){
          const handleOpenFolder = async () => {
              const UrlPath = path + '/' + id;
              const result = await listFiles(UrlPath);

              // navigate only if the pathname does not include the path already
              if (!location.pathname.includes(id)){
                  navigate(id);
              }
              setPath(result.path);
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
                                <div className="m-1 p-1 cursor-pointer hover:bg-gray-200 rounded-lg">{segment}</div>
                                {index < path.length - 1 && (
                                    <div>/</div>
                                )}

                            </>
                        ))
                    }
                </div>
            </div>
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
                        <tr onClick={(e) => handleItemClick(e, item.id, item.type)} id={item.id} className="hover:bg-gray-200 cursor-pointer">
                            <td className="py-4 border-b border-gray-400 pl-4">
                                {
                                    item.type === "file" ? <FileIcon className="w-7 h-7"/> : <FolderIcon className="w-7 h-7"/>
                                }
                            </td>
                            <td className="py-1 border-b border-gray-400 px-4">{item.encryptedName}</td> {/* set encrypted name for testing */}
                            <td className="py-1 border-b border-gray-400 px-4">{item.size}B</td>
                            <td className="py-1 border-b border-gray-400 px-4">{String(item.modDate).slice(0, 10).replaceAll('-', '.')}</td>
                        </tr>
                    ))
                }


                </tbody>
            </table>
        </>
    );
}

export default Files;