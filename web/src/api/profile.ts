import {api} from "./api.ts";

export async function getProfileName() {
    return await api.get(`/api/profile/name`, {

    }).then((res)=>{
        return res.data;
    }).catch((error) => {
        console.log(error.response);
        return error.response.data;
    });
}
