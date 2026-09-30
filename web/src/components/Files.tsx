function Files(){
    const exampleResponse = [
        {   id: 1,
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



    return (
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
                <th className="text-left border-b border-gray-400 py-4 px-8">Name</th>
                <th className="text-right border-b border-gray-400 py-4 px-8">Size</th>
                <th className="text-right border-b border-gray-400 py-4 px-8">Date</th>
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
    );
}

export default Files;