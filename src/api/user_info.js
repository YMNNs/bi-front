import axios from "@/request/index";
export function user_info() {
    return axios.post("user/info", {}); //data没有也不能不写
}
