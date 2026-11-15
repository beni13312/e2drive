import React, {useLayoutEffect, useRef, useState} from "react";
import {UploadFile, UploadFolder} from "./Upload.tsx";
import NewFolderIcon from "../assets/icons/new_folder.svg?react";
import FileUploadIcon from "../assets/icons/file_upload.svg?react";
import FolderUploadIcon from "../assets/icons/folder_upload.svg?react";
import DownloadIcon from "../assets/icons/download.svg?react";
import ViewIcon from "../assets/icons/view.svg?react";
import EditIcon from "../assets/icons/edit.svg?react";

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

    const [coordinates, setCoordinates] = useState(
        {
            x: posX,
            y: posY
        }
    );
    useLayoutEffect(()=>{
        if(!ref.current) return;

        const rect = ref.current.getBoundingClientRect();

        const menuWidth = rect.width;
        const menuHeight = rect.height;

        let x = posX;
        let y = posY;

        // flip at x coordinates
        if (posX + menuWidth > window.innerWidth) {
            x -= menuWidth;
        }

        // flip at y coordinates
        if (posY + menuHeight > window.innerHeight){
            y -= menuHeight;
        }

        setCoordinates({x,y});


    },[posX, posY]);

    return (
      <div ref={ref} className="context-menu rounded-lg absolute bg-app-card shadow-[4px_4px_8px_rgba(0,0,0,0.15)] w-50 z-10"
      style={
          {
              left: coordinates.x,
              top: coordinates.y,
          }
      }>
          {type === "general" ? (
              <>
                  <UploadFile ref={uploadFileRef} eventState={()=> eventState()} fileObject={fileObject}/>
                  <UploadFolder ref={uploadFolderRef} eventState={()=> eventState()} fileObject={fileObject}/>
                  <ul>
                      <li className="p-2 hover:bg-app-hover hover:rounded-lg flex cursor-pointer"><NewFolderIcon className="fill-white mr-2"/> New folder</li>
                      <li onClick={handleFileUpload} className="p-2 hover:bg-app-hover hover:rounded-lg flex cursor-pointer"><FileUploadIcon className="fill-white mr-2"/> File upload</li>
                      <li onClick={handleFolderUpload} className="p-2 hover:bg-app-hover hover:rounded-lg flex cursor-pointer"><FolderUploadIcon className="fill-white mr-2"/> Folder upload</li>
                  </ul>

          </>
          ): (
              <>
                  <ul>
                      <li className="p-2 hover:bg-app-hover hover:rounded-lg flex cursor-pointer"><ViewIcon className="fill-white mr-2"/> View</li>
                      <li className="p-2 hover:bg-app-hover hover:rounded-lg flex cursor-pointer"><EditIcon className="fill-white mr-2"/> Rename</li>
                      <li className="p-2 hover:bg-app-hover hover:rounded-lg flex cursor-pointer"><DownloadIcon className="fill-white mr-2"/> Download</li>
                  </ul>
              </>
          )}
      </div>
    );
}

export default ContextMenu;