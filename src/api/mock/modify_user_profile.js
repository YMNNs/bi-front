import Mock from "mockjs";
import { mock_data } from "@/api/mock/mock_data";

Mock.mock(
    process.env.VUE_APP_API_BASE_URL + "user/modify",
    "post",
    (request) => {
        const { info } = JSON.parse(request.body);
        const errors = [];
        info.forEach((entry) => {
            switch (entry.key) {
                case "nickname": {
                    if (entry.value.length < 3 || entry.value.length > 16) {
                        errors.push({
                            key: entry.key,
                            value: "昵称格式不正确",
                        });
                    }
                    break;
                }
                case "username": {
                    if (entry.value === mock_data.username) {
                        errors.push({
                            key: entry.key,
                            value: "用户名已被占用",
                        });
                    } else if (
                        entry.value.length < 5 ||
                        entry.value.length > 16
                    ) {
                        errors.push({
                            key: entry.key,
                            value: "用户名格式不正确",
                        });
                    }
                    break;
                }
                case "email": {
                    if (entry.value === mock_data.email) {
                        errors.push({
                            key: entry.key,
                            value: "电子邮件地址已被占用",
                        });
                    } else if (
                        !entry.value.match(
                            "^\\w+([-+.]\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*$"
                        )
                    ) {
                        errors.push({
                            key: entry.key,
                            value: "电子邮件地址格式不正确",
                        });
                    }
                    break;
                }
            }
        });
        const code = errors.length;
        return {
            status: {
                code: code,
                message: "有" + code + "个字段修改失败",
            },
            data: {
                errors: errors,
            },
        };
    }
);
