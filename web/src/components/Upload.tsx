import React from "react";
interface props {
    onClick: React.MouseEvent,
    ref: React.RefObject<HTMLInputElement | null>
}

export function UploadFile({onClick, ref}:props){
    const handleChange = ()=>{

    }
    return (
        <>
        <input onChange={handleChange} ref={ref} className="hidden" type="file" accept="*/*"/>
        </>
    );
}
export function UploadFolder({onClick, ref}:props){
    return (
        <>
            <input onChange={} ref={ref} className="hidden" type="file" directory="" webkitdirectory=""/>
        </>
    );
}