import axios from "@/request";

export function table_content(table, offset) {
    const max_length = 10;
    return axios.post("data/table_content", {
        table: table,
        max_length: max_length,
        offset: offset,
    });
}
