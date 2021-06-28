import Mock from "mockjs";
import { mock_data } from "@/api/mock/mock_data";

Mock.mock(process.env.VUE_APP_API_BASE_URL + "chart/all", "post", () => {
    return {
        status: {
            code: 0,
            message: "获取全部图表",
        },
        data: {
            all_charts: {
                quota: 10,
                charts: mock_data.charts,
            },
        },
    };
});
