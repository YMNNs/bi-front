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
                    no: 0,
                    chart_id: 2,
                },
                {
                    id: 455,
                    no: 1,
                    chart_id: 1,
                },
                {
                    id: 456,
                    no: 2,
                    chart_id: 2,
                },
            ],
        },
    };
});
