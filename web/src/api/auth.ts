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
        return res.data.error;
    }).catch((error) => {
        console.log(error);
    });
}

export async function getCurrentUser() {
    return await api.get("/api/auth/validate", {
        headers:{
            "X-CSRF-Token": ""
        }
    }).then((res)=>{
        return res.data.error;
    }).catch((error) => {
        console.log(error);
    });
}
