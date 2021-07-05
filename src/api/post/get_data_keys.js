import axios from "@/request";

export function get_data_keys(id, key_text) {
    return axios.post("data/keys", {
        id: id,
        key_text: key_text,
    });
}
