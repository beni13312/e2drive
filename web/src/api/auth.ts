import {api} from "./api";

export async function login(email: string, password: string) {
    return await api.post("/api/auth/login", {
        email: email,
        password: password,
    }).then((res)=>{
        return res.data;
    }).catch((error) => {
        console.log(error.response);
        return error.response.data;
    });
}

export async function logout() {
    return await api.get("/api/auth/logout", {

    }).then((res)=>{
        return res.data;
    }).catch((error) => {
        console.log(error.response);
        return error.response.data;
    });
}
