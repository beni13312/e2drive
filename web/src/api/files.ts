import {api} from "./api.ts";

export async function checkEncryptionPassword(password: string) {
    return await api.post("/api/files/checkEncryptionPassword", {
        password: password,
    }).then((res)=>{
        return res.data;
    }).catch((error) => {
        console.log(error.response);
        return error.response.data;
    });
}

export async function getEmail(){
    return await api.get("/api/files/getEmail", {
    }).then((res)=>{
        return res.data;
    }).catch((error) => {
        console.log(error.response);
        return error.response.data;
    });
}

export async function listFiles(path:string = "/") {
    return await api.get(`/api/files/list?path=${encodeURIComponent(path)}`, {

    }).then((res)=>{
        return res.data;
    }).catch((error) => {
        console.log(error.response);
        return error.response.data;
    });
}

export async function uploadMetaData(
    path:string | null,
    filename:Blob,
    size: string,
    modDate:string
)
{
    if(!path) path = "/";

    const formData = new FormData();
    formData.append("filename", filename);
    formData.append("DataSize", size);
    formData.append("modDate", modDate);

    return await api.post(`/api/files/uploadMetaData?path=${encodeURIComponent(path)}`,
        formData
    ).then((res)=>{
        return res.data;
    }).catch((error) => {
        console.log(error.response);
        return error.response.data;
    });
}

export async function uploadChunk(
    fileStream:ReadableStream
)
{
    return await fetch("http://localhost:3000/api/files/uploadChunk", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/octet-stream",
        },
        body:fileStream,
        // @ts-ignore
        duplex: "half"
    }).then(async (res)=>{
        return res.status;
    }).catch((error) => {
        console.log(error.messsage);
        return error.message;
    });
}

export async function downloadFiles(path:string | null) {
    if(!path) path = "/";

    return await api.get(`/api/files/download?path=${encodeURIComponent(path)}`
    ).then((res)=>{
        return res.data;
    }).catch((error) => {
        console.log(error.response);
        return error.response.data;
    });
}