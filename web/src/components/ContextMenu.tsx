import React, {useLayoutEffect, useRef} from "react";
import {UploadFile, UploadFolder} from "./Upload.tsx";

interface props {
    ref: React.RefObject<HTMLDivElement | null>,
    eventState: () => void,
    fileObject: (files:FileList | null) => void,
    posX: number,
    posY: number,
    type: "general" | "entry" | string
}

function ContextMenu({ref, eventState, fileObject, posX, posY, type}:props){

    const uploadFileRef = useRef<HTMLInputElement>(null);
    const uploadFolderRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = ()=>{
        uploadFileRef.current?.click();
    }
    const handleFolderUpload = ()=>{
        uploadFolderRef.current?.click();
    }

    useLayoutEffect(()=>{
        if(ref.current) return;


    },[ref, posX, posY])

    return (
      <div ref={ref} className="context-menu rounded-lg absolute bg-app-card shadow-[4px_4px_8px_rgba(0,0,0,0.15)] w-50 z-10"
      style={
          {
              left: posX,
              top: posY,
          }
      }>
          {type === "general" ? (
              <>
                  <UploadFile ref={uploadFileRef} eventState={()=> eventState()} fileObject={fileObject}/>
                  <UploadFolder ref={uploadFolderRef} eventState={()=> eventState()} fileObject={fileObject}/>
                  <ul>
                      <li className="pl-5 p-2 hover:bg-app-hover hover:rounded-lg cursor-pointer">New folder</li>
                      <li onClick={handleFileUpload} className="pl-5 p-2 hover:bg-app-hover hover:rounded-lg cursor-pointer">File upload</li>
                      <li onClick={handleFolderUpload} className="pl-5 p-2 hover:bg-app-hover hover:rounded-lg cursor-pointer">Folder upload</li>
                  </ul>

          </>
          ): (
              <>
                  <ul>
                      <li className="pl-5 p-2 hover:bg-app-hover hover:rounded-lg cursor-pointer">View</li>
                      <li className="pl-5 p-2 hover:bg-app-hover hover:rounded-lg cursor-pointer">Rename</li>
                      <li className="pl-5 p-2 hover:bg-app-hover hover:rounded-lg cursor-pointer">Download</li>
                  </ul>
              </>
          )}
      </div>
    );
}

export default ContextMenu;