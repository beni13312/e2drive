import {baseURL, api} from "./api.ts";

export async function checkEncryptionPassword(password: string) {
    return await api.post("/api/storage/checkEncryptionPassword", {
        password: password,
    }).then((res)=>{
        return res.data;
    }).catch((error) => {
        console.log(error.response);
        return error.response.data;
    });
}

export async function getEmail(){
    return await api.get("/api/storage/getEmail", {
    }).then((res)=>{
        return res.data;
    }).catch((error) => {
        console.log(error.response);
        return error.response.data;
    });
}

export async function listFiles(path:string | null) {
    if(!path) path = '/';
    return await api.get(`/api/storage/list?path=${encodeURIComponent(path)}`, {

    }).then((res)=>{
        return res.data;
    }).catch((error) => {
        console.log(error.response);
        return error.response.data;
    });
}

export async function uploadMetaData(
    pathId:string | null,
    encryptedFilenameBase64:string,
    size: number,
    modDate:string
)
{
    if(!pathId) pathId = "/";

    return await api.post(`/api/storage/uploadMetaData?id=${encodeURIComponent(pathId)}`,
        {
            filename: encryptedFilenameBase64,
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
    fileStream:ReadableStream,
    fileId: string
)
{
    return await fetch(`${baseURL}/api/storage/uploadChunk?id=${fileId}`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/octet-stream",
        },
        body:fileStream,
        // @ts-ignore
        duplex: "half"
    }).then(async (res)=>{
        if(!res.ok) return res.status;
        return res.json();
    }).catch((error) => {
        console.log(error.messsage);
        return error.message;
    });
}

export async function createFolder(parentId:string | null, encryptedFolderNameBase64:string) {
    if(!parentId) parentId = "";

    return await api.post("/api/storage/createFolder",
        {
            parentId: parentId,
            folderName: encryptedFolderNameBase64
        }
    ).then((res)=>{
        return res.data;
    }).catch((error) => {
        console.log(error.response);
        return error.response.data;
    });
}

export async function downloadFiles(fileId:string) {

    return await api.get(`/api/storage/download?id=${encodeURIComponent(fileId)}`
    ).then((res)=>{
        return res.data;
    }).catch((error) => {
        console.log(error.response);
        return error.response.data;
    });
}