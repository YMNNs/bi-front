import Mock from "mockjs";
import { mock_data } from "@/api/mock/mock_data";

Mock.mock(process.env.VUE_APP_API_BASE_URL + "dashboard/size", "post", () => {
    return {
        status: {
            code: 0,
            message: "仪表盘大小请求成功",
        },
        data: {
            size: mock_data.dashboard_size,
        },
    };
});
