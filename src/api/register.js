import axios from "@/request/index";

export function register(email, username, password, nickname) {
    return axios.post("user/register", {
        email: email,
        username: username,
        password: password,
        nickname: nickname,
    }); //data没有也不能不写
}
