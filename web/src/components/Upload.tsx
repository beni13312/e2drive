import React from "react";
interface props {
    ref: React.RefObject<HTMLInputElement | null>,
    eventState: () => void,
    handleUpload: (files:FileList) => void
}

export function UploadFile({ref, eventState, handleUpload}:props){
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
        const file = e.target.files;
        console.log(file);
        if (!file) return;
        handleUpload(file);
        eventState();
    }
    return (
        <>
        <input onChange={handleChange} ref={ref} className="hidden" type="file" multiple accept="*/*"/>
        </>
    );
}
export function UploadFolder({ref, eventState, handleUpload}:props){
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
        const folder = e.target.files;
        console.log(folder);
        if (!folder) return;
        handleUpload(folder);
        eventState();
    }
    return (
        <>
            <input onChange={handleChange} ref={ref} className="hidden" type="file" webkitdirectory=""/>
        </>
    );
}