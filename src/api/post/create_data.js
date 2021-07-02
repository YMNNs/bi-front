import axios from "@/request";

export function create_data(name, description, columns, data) {
    return axios.post("data/create", {
        name: name,
        description: description,
        columns: columns,
        dataSource: data,
    });
}
