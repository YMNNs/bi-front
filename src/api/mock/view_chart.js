import Mock from "mockjs";

Mock.mock(
    process.env.VUE_APP_API_BASE_URL + "chart/view",
    "post",
    (request) => {
        const { id } = JSON.parse(request.body);
        switch (id) {
            case 1: {
                return {
                    status: {
                        code: 0,
                        message: "请求图表成功",
                    },
                    data: {
                        chart: {
                            type_id: 1,
                            data_id: 1,
                            chart_name: "豆瓣",
                            last_modified_time: 1623916319,
                            keys_number: ["rate"],
                            keys_text: ["name"],
                            xField: null,
                            yField: null,
                            seriesField: null,
                        },
                    },
                };
            }
            default: {
                return {
                    status: {
                        code: 1,
                        message: "图表id无效",
                    },
                    data: null,
                };
            }
        }
    }
);
