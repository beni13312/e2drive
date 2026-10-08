import {api} from "./api.ts";

export async function listFiles(path:string = "/") {
    return await api.get(`/api/files/list?path=${encodeURIComponent(path)}`, {

    }).then((res)=>{
        return res.data;
    }).catch((error) => {
        console.log(error.response);
        return error.response.data;
    });
}

export async function uploadFiles(path:string, fileData:Blob) {
    const formData = new FormData();
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

export async function donwloadFiles(path:string) {
    return await api.get(`/api/files/download?path=${encodeURIComponent(path)}`
    ).then((res)=>{
        return res.data;
    }).catch((error) => {
        console.log(error.response);
        return error.response.data;
    });
}