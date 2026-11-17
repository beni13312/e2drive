import {useState} from "react";

interface props{
    onCancel: () => void,
    onCreate: (folderName:string) => void

}

function CreateFolder({onCancel, onCreate}:props){

    const [folderName, setFolderName] = useState<string>("New Folder");

    const handleCreate = () => {
        onCreate(folderName)
    };

    return (
        <div className="new-folder z-10 fixed inset-0 items-center justify-center w-full h-full flex bg-[rgba(0,0,0,0.15)]">
            <div className="new-folder-container p-5 rounded-lg bg-app-bg flex flex-col">
                 <h1 className="text-xl mb-5">New folder</h1>
                <div className="new-folder-input-container">
                    <input onChange={(e) => setFolderName(e.target.value)} type="text" className="new-folder-input mb-5 px-4 w-70 h-10 focus:outline-none rounded-lg border-2 border-app-border" defaultValue="New Folder" placeholder="Foldername"/>
                    <div className="new-folder-button-container flex flex-row gap-5 justify-end">
                        <button onClick={onCancel} className="new-folder-cancel cursor-pointer">Cancel</button>
                        <button onClick={handleCreate} className="new-folder-create cursor-pointer ">Create folder</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default CreateFolder;