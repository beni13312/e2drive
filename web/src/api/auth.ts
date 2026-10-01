import {api} from "./api";

export async function login(email: string, password: string) {
    return await api.post("/api/auth/login", {
        email: email,
        password: password,
    }, {
        headers:{
            "X-CSRF-Token": ""
        }
    }).then((res)=>{
        return res.data;
    }).catch((error) => {
        console.log(error.response);
        return error.response.data;
    });
}

export async function validateSession() {
    return await api.get("/api/auth/validate", {
        headers:{
            "X-CSRF-Token": ""
        }
    }).then((res)=>{
        return !!res.data?.validate;

    }).catch((error) => {
        console.log(error.response);
        return false;
    });
}
