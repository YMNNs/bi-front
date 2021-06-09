import axios from "@/request";
import md5 from "js-md5";
import { randomString } from "@/util";

export function login(login, password, rememberMe) {
    const salt = randomString();
    return axios.post("user/login", {
        login: login,
        password: md5(md5(password) + salt),
        rememberMe: rememberMe,
        salt: salt,
    });
}
