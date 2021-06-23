import Mock from "mockjs";

Mock.mock(process.env.VUE_APP_API_BASE_URL + "chart/all", "post", () => {
    return {
        status: {
            code: 0,
            message: "获取全部图表",
        },
        data: {
            all_charts: {
                quota: 10,
                charts: [
                    {
                        id: 1,
                        chart_name: "豆瓣",
                        type_id: 1,
                        last_modified_time: 1623748364,
                    },
                ],
            },
        },
    };
});
