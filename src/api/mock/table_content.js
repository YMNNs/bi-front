import Mock from "mockjs";

Mock.mock(
    process.env.VUE_APP_API_BASE_URL + "data/table_content",
    "post",
    (request) => {
        const { offset } = JSON.parse(request.body);
        if (offset % 2 != 0) {
            return {
                status: {
                    code: 0,
                    message: "当前页内容信息获取成功",
                },
                data: {
                    table: {
                        table_name: "豆瓣电影数据",
                        total: 100,
                        columns: [
                            {
                                title: "电影名称",
                                dataIndex: "name",
                                key: "name",
                            },
                            {
                                title: "评分",
                                dataIndex: "rate",
                                key: "rate",
                            },
                            {
                                title: "类型",
                                dataIndex: "type",
                                key: "type",
                            },
                            {
                                title: "地区",
                                dataIndex: "country",
                                key: "country",
                            },
                            {
                                title: "上映时间",
                                dataIndex: "year",
                                key: "year",
                            },
                            {
                                title: "评论数",
                                dataIndex: "comment",
                                key: "comment",
                            },
                        ],
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
                            {
                                key: "4",
                                name: "控方证人",
                                rate: 9.6,
                                type: "剧情 犯罪",
                                country: "美国",
                                year: "1957-12",
                                comment: 371881,
                            },
                            {
                                key: "5",
                                name: "伊丽莎白",
                                rate: 9.6,
                                type: "剧情 歌舞",
                                country: "奥地利",
                                year: "2005-12",
                                comment: 5639,
                            },
                            {
                                key: "6",
                                name: "阿甘正传",
                                rate: 9.5,
                                type: "剧情 爱情",
                                country: "美国",
                                year: "1994-6",
                                comment: 1782286,
                            },
                            {
                                key: "7",
                                name: "辛德勒的名单",
                                rate: 9.5,
                                type: "剧情 爱情",
                                country: "美国",
                                year: "1994-6",
                                comment: 1782286,
                            },
                            {
                                key: "8",
                                name: "茶馆",
                                rate: 9.5,
                                type: "剧情 历史",
                                country: "中国大陆",
                                year: "1982",
                                comment: 68805,
                            },
                            {
                                key: "9",
                                name: "控方证人",
                                rate: 9.5,
                                type: "剧情 犯罪",
                                country: "美国 英国",
                                year: "1982-12",
                                comment: 32436,
                            },
                            {
                                key: "10",
                                name: "十二怒汉",
                                rate: 9.5,
                                type: "剧情 犯罪",
                                country: "美国",
                                year: "1954-9",
                                comment: 19810,
                            },
                        ],
                    },
                },
            };
        } else {
            return {
                status: {
                    code: 0,
                    message: "当前页内容信息获取成功",
                },
                data: {
                    table: {
                        table_name: "豆瓣电影数据",
                        total: 100,
                        columns: [
                            {
                                title: "电影名称",
                                dataIndex: "name",
                                key: "name",
                            },
                            {
                                title: "评分",
                                dataIndex: "rate",
                                key: "rate",
                            },
                            {
                                title: "类型",
                                dataIndex: "type",
                                key: "type",
                            },
                            {
                                title: "地区",
                                dataIndex: "country",
                                key: "country",
                            },
                            {
                                title: "上映时间",
                                dataIndex: "year",
                                key: "year",
                            },
                            {
                                title: "评论数",
                                dataIndex: "comment",
                                key: "comment",
                            },
                        ],
                        dataSource: [
                            {
                                key: "11",
                                name: "这个杀手不太冷",
                                rate: 9.4,
                                type: "剧情 动作",
                                country: "法国 美国",
                                year: "1994-9",
                                comment: 1955035,
                            },
                            {
                                key: "12",
                                name: "千与千寻",
                                rate: 9.4,
                                type: "动画 剧情",
                                country: "日本",
                                year: "2019-6",
                                comment: 1858575,
                            },
                            {
                                key: "13",
                                name: "泰坦尼克号",
                                rate: 9.4,
                                type: "剧情 爱情",
                                country: "美国 墨西哥",
                                year: "1998-4",
                                comment: 1743250,
                            },
                            {
                                key: "14",
                                name: "忠犬八公的故事",
                                rate: 9.4,
                                type: "剧情",
                                country: "美国",
                                year: "2009-6",
                                comment: 1181004,
                            },
                            {
                                key: "15",
                                name: "十二怒汉",
                                rate: 9.4,
                                type: "剧情",
                                country: "美国",
                                year: "1957-4",
                                comment: 381813,
                            },
                            {
                                key: "16",
                                name: "泰坦尼克号",
                                rate: 9.4,
                                type: "剧情 爱情",
                                country: "美国",
                                year: "2012-4",
                                comment: 199138,
                            },
                            {
                                key: "17",
                                name: "背靠背，脸对脸",
                                rate: 9.4,
                                type: "剧情",
                                country: "中国大陆",
                                year: "1994-9",
                                comment: 72237,
                            },
                            {
                                key: "18",
                                name: "灿烂人生",
                                rate: 9.4,
                                type: "剧情 爱情",
                                country: "意大利",
                                year: "2003-6",
                                comment: 52298,
                            },
                            {
                                key: "19",
                                name: "横空出世",
                                rate: 9.4,
                                type: "剧情 历史",
                                country: "中国大陆",
                                year: "1999-12",
                                comment: 46387,
                            },
                            {
                                key: "20",
                                name: "巴黎圣母院",
                                rate: 9.4,
                                type: "剧情 爱情",
                                country: "法国",
                                year: "1998",
                                comment: 10918,
                            },
                        ],
                    },
                },
            };
        }
    }
);
