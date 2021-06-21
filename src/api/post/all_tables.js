import axios from "@/request";

export function all_tables() {
    return axios.post("data/all_tables", {}); //data没有也不能不写
}
