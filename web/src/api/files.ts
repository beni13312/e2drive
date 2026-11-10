import {baseURL, api} from "./api.ts";

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

export async function listFiles(path:string | null) {
    if(!path) path = '/';
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
    filename:string,
    size: string,
    modDate:string
)
{
    if(!path) path = "/";

    return await api.post(`/api/files/uploadMetaData?path=${encodeURIComponent(path)}`,
        {
            filename: new TextEncoder().encode(filename),
            dataSize: size,
            modDate: modDate
        }
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
    return await fetch(`${baseURL}/api/files/uploadChunk`, {
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