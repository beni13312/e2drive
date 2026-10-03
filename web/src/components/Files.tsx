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
            <div className="storage-path-container flex w-full h-15">
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
                    <th className="text-left border-b border-gray-400 py-4 px-8"></th>
                    <th className="text-left border-b hover:bg-gray-200 rounded-lg cursor-pointer border-gray-400 py-4 px-8">Name</th>
                    <th className="text-right border-b hover:bg-gray-200 rounded-lg cursor-pointer border-gray-400 py-4 px-8">Size</th>
                    <th className="text-right border-b hover:bg-gray-200 rounded-lg cursor-pointer border-gray-400 py-4 px-8">Date</th>
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