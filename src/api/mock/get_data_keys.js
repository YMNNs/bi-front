import Mock from "mockjs";

Mock.mock(process.env.VUE_APP_API_BASE_URL + "data/keys", "post", (request) => {
    const { id, key_text } = JSON.parse(request.body);
    if (id === 2 && key_text === "direction") {
        return {
            status: {
                code: 0,
                message: "数据维度请求成功",
            },
            data: {
                keys: ["南", "南 北"],
            },
        };
    } else {
        return {
            status: {
                code: 1,
                message: "列名不存在或非维度列",
            },
            data: null,
        };
    }
});
