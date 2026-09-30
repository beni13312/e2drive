import {api} from "./api";

async function login(email: string, password: string) {
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
export default login;