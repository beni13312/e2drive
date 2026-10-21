import {api} from "./api.ts";

export async function validateSession() {
    return await api.get("/api/validate", {
    }).then((res)=>{
        return !!res.data?.validate;

    }).catch((error) => {
        console.log(error.response);
        return false;
    });
}