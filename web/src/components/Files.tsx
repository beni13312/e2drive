import {useEffect, useState} from "react";
import {listFiles} from "../api/files.ts";

interface props {
    onReady: () => void;
}

function Files({onReady}:props) {
    const examplePathResponse = {
        segments: ["Storage", "testfolder1", "testfolder2"]
    };

    const [response, setResponse] = useState<object[]>([]);

    // get response
    useEffect(()  => {

        const getFilesList = async ()=>{
            const result = await listFiles();
            if (!result.error){
                setResponse(result);
            }
            console.log(response);
        }

        getFilesList();
        
         if (onReady) onReady();
    }, [onReady]);

    return (
        <>
            <div className="storage-path-container flex w-full h-15 sticky top-0 bg-app-card">
                <div className="storage-path flex ml-5 text-2xl text-gray-600 items-center">
                    {
                        examplePathResponse.segments.map((segment, index) => (
                            <>
                                <div className="m-2 cursor-pointer hover:bg-gray-200 rounded-lg">{segment}</div>
                                {index < examplePathResponse.segments.length - 1 && (
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
                        <div className="hover:bg-gray-200 rounded-lg cursor-pointer py-2 px-8">Name</div>
                    </th>
                    <th className="text-right sticky top-15 shadow-[inset_0_-1px_0_0_#9ca3af] bg-app-card py-4">
                        <div className="hover:bg-gray-200 rounded-lg cursor-pointer py-2 px-8">Size</div>
                    </th>
                    <th className="text-right sticky top-15 shadow-[inset_0_-1px_0_0_#9ca3af] bg-app-card py-4">
                        <div className="hover:bg-gray-200 rounded-lg cursor-pointer py-2 px-8">Date</div>
                    </th>
                </tr>
                </thead>
                <tbody>
                {
                    response.map((item) => (
                        <tr id={`${item.id}`} className="hover:bg-gray-200 cursor-pointer">
                            <td className="py-4 border-b border-gray-400 pl-16">
                                {item.type == "file" ?
                                    <img src="../assets/icons/draft_24dp_666666_FILL1_wght400_GRAD0_opsz24.svg" alt="file icon"/> :
                                    <img src="../assets/icons/folder_24dp_ECB576_FILL1_wght400_GRAD0_opsz24.svg" alt="folder icon"/>
                                }
                            </td>
                            <td className="py-4 border-b border-gray-400 px-8">{item.encryptedName}</td> {/* set encrypted name for testing */}
                            <td className="py-4 border-b border-gray-400 px-8">{item.size}</td>
                            <td className="py-4 border-b border-gray-400 px-8">{item.modDate}</td>
                        </tr>
                    ))
                }


                </tbody>
            </table>
        </>
    );
}

export default Files;