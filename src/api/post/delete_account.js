import axios from "@/request";
import md5 from "js-md5";
import { randomString } from "@/util";

export function delete_account(username, password) {
    const salt = randomString();
    return axios.post("user/delete", {
        username: username,
        password: md5(md5(password) + salt),
        salt: salt,
    });
}
