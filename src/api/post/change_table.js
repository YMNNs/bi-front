import axios from "@/request";

export function change_table(id, name) {
    return axios.post("data/table_content", {
        table_id: id,
        table_name: name,
    });
}
