import {api} from "./api.ts";

export async function listFiles(currentPath:string = "/") {
    return await api.get(`/api/files/list?path=${currentPath}`, {

    }).then((res)=>{
        return res.data;
    }).catch((error) => {
        console.log(error.response);
        return error.response.data;
    });
}