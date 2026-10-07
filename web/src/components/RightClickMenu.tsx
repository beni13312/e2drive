import React from "react";
import {useState} from "react";
import {UploadFile, UploadFolder} from "./Upload.tsx";

interface props {
    ref: React.RefObject<HTMLDivElement | null>,
    posX: number,
    posY: number
}

function RightClickMenu({ref, posX, posY}:props){
    const [isUpload, setIsUpload] = useState(false);
    const [file, setFile] = useState(null);

    const handleFileUpload = ()=>{
        setIsUpload(!isUpload);
    }
    const handleFolderUpload = ()=>{

    }

    return (
      <div ref={ref} className="right-click-menu rounded-lg absolute bg-app-card shadow-[4px_4px_8px_rgba(0,0,0,0.15)] w-50"
      style={
          {
              left: posX,
              top: posY,
          }
      }>
          <UploadFile />
          <UploadFolder />
          <ul>
              <li className="pl-5 p-2 hover:bg-gray-200 hover:rounded-lg cursor-pointer">New folder</li>
              <li onClick={handleFileUpload} className="pl-5 p-2 hover:bg-gray-200 hover:rounded-lg cursor-pointer">File upload</li>
              <li onClick={handleFolderUpload} className="pl-5 p-2 hover:bg-gray-200 hover:rounded-lg cursor-pointer">Folder upload</li>
          </ul>
      </div>
    );
}
export default RightClickMenu;