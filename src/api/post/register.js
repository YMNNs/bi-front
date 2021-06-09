import axios from "@/request";

export function register(email, username, password, nickname) {
    return axios.post("user/register", {
        email: email,
        username: username,
        password: password,
        nickname: nickname,
    });
}
