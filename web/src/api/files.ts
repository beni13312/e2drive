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

export async function uploadFiles(
    path:string | null,
    filename:Blob,
    size: string,
    modDate:string,
    fileData:Blob
)
{
    if(!path) path = "/";

    const formData = new FormData();
    formData.append("filename", filename);
    formData.append("size", size);
    formData.append("modDate", modDate);
    formData.append("data", fileData);

    return await api.post(`/api/files/upload?path=${encodeURIComponent(path)}`,
        formData
    ).then((res)=>{
        return res.data;
    }).catch((error) => {
        console.log(error.response);
        return error.response.data;
    });
}

export async function donwloadFiles(path:string | null) {
    if(!path) path = "/";

    return await api.get(`/api/files/download?path=${encodeURIComponent(path)}`
    ).then((res)=>{
        return res.data;
    }).catch((error) => {
        console.log(error.response);
        return error.response.data;
    });
}