import axios from "@/request";
import md5 from "js-md5";

export function register(email, username, password, nickname) {
    return axios.post("user/register", {
        email: email,
        username: username,
        password: md5(password),
        nickname: nickname,
    });
}
