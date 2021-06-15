import Mock from "mockjs";

Mock.mock(
    process.env.VUE_APP_API_BASE_URL + "data/table_content",
    "post",
    () => {
        return {
            status: {
                code: 0,
                message: "当前页内容信息获取成功",
            },
            data: {
                columns: [],
                dataSource: [
                    {
                        key: "1",
                        name: "肖申克的救赎",
                        rate: 9.7,
                        type: "犯罪 剧情",
                        country: "美国",
                        year: "1994-9",
                        comment: 2365224,
                    },
                    {
                        key: "2",
                        name: "霸王别姬",
                        rate: 9.6,
                        type: "爱情 剧情",
                        country: "中国大陆 中国香港",
                        year: "1993-7",
                        comment: 1761207,
                    },
                    {
                        key: "3",
                        name: "美丽人生",
                        rate: 9.6,
                        type: "剧情 喜剧",
                        country: "意大利",
                        year: "2020-1",
                        comment: 1095584,
                    },
                ],
            },
        };
    }
);
