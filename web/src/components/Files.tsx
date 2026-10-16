import {useEffect, useState} from "react";
import {listFiles} from "../api/files.ts";
import draftIcon from "../assets/icons/draft.svg";
import folderIcon from "../assets/icons/folder.svg";

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

    const [path, setPath] = useState<object[]>([]);
    const [response, setResponse] = useState<response[]>([]);

    // get response
    useEffect(()  => {

        const getFilesList = async ()=>{
            const result = await listFiles();
            if (!result.error && result.items && result.path){
                setResponse(result.items);
                setPath(result.path);
            }
            console.log(response);
        }

        getFilesList();
        
         if (onReady) onReady();
    }, [onReady]);

    return (
        <>
            <div className="storage-path-container flex w-full h-15 sticky top-0 bg-app-card">
                <button className="new-button flex ml-5 text-xl items-center  justify-center cursor-pointer text-white rounded-lg m-2 w-20 h-12 bg-cyan-500 hover:bg-cyan-400">
                    + New
                </button>
                <div className="storage-path flex ml-5 text-2xl text-gray-600 items-center">
                    {
                        path.map((segment, index) => (
                            <>
                                <div className="m-2 cursor-pointer hover:bg-gray-200 rounded-lg">{segment}</div>
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
                        <div className="hover:bg-gray-200 rounded-lg cursor-pointer py-2 px-4">Name</div>
                    </th>
                    <th className="text-right sticky top-15 shadow-[inset_0_-1px_0_0_#9ca3af] bg-app-card py-4">
                        <div className="hover:bg-gray-200 rounded-lg cursor-pointer py-2 px-4">Size</div>
                    </th>
                    <th className="text-right sticky top-15 shadow-[inset_0_-1px_0_0_#9ca3af] bg-app-card py-4">
                        <div className="hover:bg-gray-200 rounded-lg cursor-pointer py-2 px-4">Date</div>
                    </th>
                </tr>
                </thead>
                <tbody>
                {
                    response.map((item) => (
                        <tr id={item.id} className="hover:bg-gray-200 cursor-pointer">
                            <td className="py-4 border-b border-gray-400 pl-16">
                                <img className="min-w-9 min-h-9" src={item.type === "file" ? draftIcon : folderIcon}
                                     alt={item.type === "file" ? "file icon" : "folder icon"}/>
                            </td>
                            <td className="py-2 border-b border-gray-400 px-4">{item.encryptedName}</td> {/* set encrypted name for testing */}
                            <td className="py-2 border-b border-gray-400 px-4">{item.size}B</td>
                            <td className="py-2 border-b border-gray-400 px-4">{String(item.modDate).slice(0, 10).replaceAll('-', '.')}</td>
                        </tr>
                    ))
                }


                </tbody>
            </table>
        </>
    );
}

export default Files;