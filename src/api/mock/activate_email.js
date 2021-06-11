import Mock from "mockjs";
import { mock_data } from "@/api/mock/mock_data";

Mock.mock(
    process.env.VUE_APP_API_BASE_URL + "user/activate_email",
    "post",
    (request) => {
        const { activation_token } = JSON.parse(request.body);
        console.log(request.body);
        if (activation_token === mock_data.activation_token) {
            console.log("激活成功");
            return {
                status: {
                    code: 0,
                    message: "电子邮件地址已激活",
                },
                data: {},
            };
        } else {
            console.log("激活失败");
            return {
                status: {
                    code: 1,
                    message: "激活电子邮件地址令牌过期或无效",
                },
                data: {},
            };
        }
    }
);
