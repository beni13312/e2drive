import React from "react";
interface props {
    ref: React.RefObject<HTMLInputElement | null>,
    eventState: (event:boolean) => void,
    fileObject: (files:FileList) => void
}

export function UploadFile({ref, eventState, fileObject}:props){
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
        const file = e.target.files;
        console.log(file);
        if (!file) return;
        fileObject(file);
        eventState(true);
    }
    return (
        <>
        <input onChange={handleChange} ref={ref} className="hidden" type="file" multiple accept="*/*"/>
        </>
    );
}
export function UploadFolder({ref, eventState, fileObject}:props){
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
        const folder = e.target.files;
        console.log(folder);
        if (!folder) return;
        fileObject(folder);
        eventState(true);
    }
    return (
        <>
            <input onChange={handleChange} ref={ref} className="hidden" type="file" webkitdirectory=""/>
        </>
    );
}