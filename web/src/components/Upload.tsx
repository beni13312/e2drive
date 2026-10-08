import React from "react";
interface props {
    ref: React.RefObject<HTMLInputElement | null>,
    eventBool: (bool:boolean) => void,
    fileObject: (files:FileList | null) => void
}

export function UploadFile({ref, eventBool, fileObject}:props){
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
        const file = e.target.files;
        console.log(file);
        if (!file) return;
        fileObject(file);
        eventBool(true);
    }
    return (
        <>
        <input onChange={handleChange} ref={ref} className="hidden" type="file" multiple accept="*/*"/>
        </>
    );
}
export function UploadFolder({ref, eventBool, fileObject}:props){
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
        const folder = e.target.files;
        console.log(folder);
        if (!folder) return;
        fileObject(folder);
        eventBool(true);
    }
    return (
        <>
            <input onChange={handleChange} ref={ref} className="hidden" type="file" webkitdirectory=""/>
        </>
    );
}