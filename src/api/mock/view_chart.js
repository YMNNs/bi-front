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
                            type_id: 0,
                            chart_name: "豆瓣电影数据分析",
                            last_modified_time: 1623916319,
                            options: null,
                            data: null,
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
