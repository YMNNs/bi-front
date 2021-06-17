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
                        name: "My chart",
                        type_id: 1,
                        type_name: "折线图",
                        last_modified_time: 1623748364,
                    },
                    {
                        id: 2,
                        name: "My chart2",
                        type_id: 2,
                        type_name: "柱状图",
                        last_modified_time: 1623748365,
                    },
                    {
                        id: 3,
                        name: "My chart3",
                        type_id: 3,
                        type_name: "条形图",
                        last_modified_time: 1623748362,
                    },
                    {
                        id: 4,
                        name: "My chart4",
                        type_id: 4,
                        type_name: "面积图",
                        last_modified_time: 1623748368,
                    },
                    {
                        id: 5,
                        name: "My chart5",
                        type_id: 5,
                        type_name: "饼图",
                        last_modified_time: 1623748361,
                    },
                    {
                        id: 6,
                        name: "My chart6",
                        type_id: 6,
                        type_name: "散点图",
                        last_modified_time: 1623748369,
                    },
                    {
                        id: 6,
                        name: "My chart7",
                        type_id: 7,
                        type_name: "雷达图",
                        last_modified_time: 1623748372,
                    },
                ],
            },
        },
    };
});
