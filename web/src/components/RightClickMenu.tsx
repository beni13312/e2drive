import React from "react";

interface props {
    onRef: React.RefObject<HTMLDivElement | null>,
    posX: number,
    posY: number
}

function RightClickMenu({onRef, posX, posY}:props){
    return (
      <div ref={onRef} className="right-click-menu rounded-lg absolute bg-app-card shadow-[4px_4px_8px_rgba(0,0,0,0.15)] w-50"
      style={
          {
              left: posX,
              top: posY,
          }
      }>
          <ul>
              <li className="pl-5 p-2 hover:bg-gray-200 hover:rounded-lg cursor-pointer">New folder</li>
              <li className="pl-5 p-2 hover:bg-gray-200 hover:rounded-lg cursor-pointer">File upload</li>
              <li className="pl-5 p-2 hover:bg-gray-200 hover:rounded-lg cursor-pointer">Folder upload</li>
          </ul>
      </div>
    );
}
export default RightClickMenu;