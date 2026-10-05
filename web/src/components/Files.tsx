import {useEffect} from "react";
interface props {
    onReady: () => void;
}

function Files({onReady}:props) {
    const examplePathResponse = {
        segments: ["Storage", "testfolder1", "testfolder2"]
    };
    const exampleResponse = [
        {
            id: 1,
            type: "file",
            name: "test",
            byteSize: "1024",
            modDate: "2026.06.01"
        },
        {
            id: 2,
            type: "file",
            name: "test",
            byteSize: "1024",
            modDate: "2026.06.01"
        },
        {
            id: 3,
            type: "file",
            name: "test",
            byteSize: "1024",
            modDate: "2026.06.01"
        },
        {
            id: 4,
            type: "file",
            name: "test",
            byteSize: "1024",
            modDate: "2026.06.01"
        },
        {
            id: 5,
            type: "file",
            name: "test",
            byteSize: "1024",
            modDate: "2026.06.01"
        },
        {
            id: 6,
            type: "file",
            name: "test",
            byteSize: "1024",
            modDate: "2026.06.01"
        },
        {
            id: 7,
            type: "file",
            name: "test",
            byteSize: "1024",
            modDate: "2026.06.01"
        },
        {
            id: 8,
            type: "file",
            name: "test",
            byteSize: "1024",
            modDate: "2026.06.01"
        },
        {
            id: 9,
            type: "file",
            name: "test",
            byteSize: "1024",
            modDate: "2026.06.01"
        },

    ];

    // simulate time delay
    useEffect(() => {
        const testDelay = setTimeout(() => {
            onReady && onReady();
        }, 2000);

        return () => clearTimeout(testDelay);
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
                    exampleResponse.map((item) => (
                        <tr id={`${item.id}`} className="hover:bg-gray-200 cursor-pointer">
                            <td className="py-4 border-b border-gray-400 pl-16">icon</td>
                            <td className="py-4 border-b border-gray-400 px-8">{item.name}</td>
                            <td className="py-4 border-b border-gray-400 px-8">{item.byteSize}</td>
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