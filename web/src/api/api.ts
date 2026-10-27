import axios from "axios";

export const baseURL = "https://api.e2drive.local:4443";

export const api = axios.create({
    baseURL: baseURL,
    withCredentials: true,
});