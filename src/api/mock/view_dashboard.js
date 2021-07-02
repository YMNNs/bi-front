import Mock from "mockjs";

Mock.mock(process.env.VUE_APP_API_BASE_URL + "dashboard/view", "post", () => {
    return {
        status: {
            code: 0,
            message: "仪表盘请求成功",
        },
        data: {
            instruments: [
                {
                    id: 453,
                    index: 0,
                    chart_id: 2,
                    data_id: 2,
                    selected_keys: ["南"],
                },
                {
                    id: 455,
                    index: 1,
                    chart_id: 1,
                    data_id: 1,
                    selected_keys: [],
                },
                {
                    id: 456,
                    index: 2,
                    chart_id: 2,
                    data_id: 2,
                    selected_keys: [],
                },
            ],
        },
    };
});
