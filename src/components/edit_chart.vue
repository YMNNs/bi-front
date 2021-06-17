<template>
    <a-layout>
        <a-layout-sider
            width="200"
            style="background: #fff; padding-right: 16px"
        >
            <a-row :gutter="[16, 16]">
                <a-col :span="24">
                    <a-typography-title :level="5">{{
                        chart_name
                    }}</a-typography-title>
                </a-col>
            </a-row>
            <a-row :gutter="[16, 16]">
                <a-col :span="24">
                    <a-input-search />
                </a-col>
            </a-row>
            <a-row :gutter="[16, 16]" style="min-height: 240px">
                <a-col :span="24">
                    <a-list bordered :data-source="columns_text" size="small">
                        <template #renderItem="{ item }">
                            <a-list-item
                                ><FieldStringOutlined />
                                {{ item.title }}</a-list-item
                            >
                        </template>
                    </a-list>
                </a-col>
            </a-row>
            <a-row :gutter="[16, 16]" style="min-height: 240px">
                <a-col :span="24">
                    <a-list bordered :data-source="columns_number" size="small">
                        <template #renderItem="{ item }">
                            <a-list-item
                                ><FieldNumberOutlined />&nbsp;{{
                                    item.title
                                }}</a-list-item
                            >
                        </template>
                    </a-list>
                </a-col>
            </a-row>
        </a-layout-sider>
        <a-layout-content>
            <a-layout>
                <a-layout-sider width="200" style="background: #fff">
                    456
                </a-layout-sider>
                <a-layout-content>
                    <div
                        :style="{
                            padding: '24px',
                            background: '#fff',
                            minHeight: '360px',
                        }"
                    ></div>
                </a-layout-content>
            </a-layout>
        </a-layout-content>
    </a-layout>
</template>

<script>
import { defineComponent, onMounted, reactive, toRefs } from "vue";
import { useRoute, useRouter } from "vue-router";
import { view_chart } from "@/api/post/view_chart";
import {
    FieldStringOutlined,
    FieldNumberOutlined,
} from "@ant-design/icons-vue";

export default defineComponent({
    components: {
        FieldStringOutlined,
        FieldNumberOutlined,
    },
    setup() {
        const state = reactive({
            chart_id: NaN,
            type_id: null,
            chart_name: null,
            columns_text: [
                {
                    title: "电影名称",
                    dataIndex: "name",
                    key: "name",
                    type: "string",
                },
                {
                    title: "类型",
                    dataIndex: "type",
                    key: "type",
                    type: "string",
                },
                {
                    title: "地区",
                    dataIndex: "country",
                    key: "country",
                    type: "string",
                },
                {
                    title: "上映时间",
                    dataIndex: "year",
                    key: "year",
                    type: "string",
                },
            ],
            columns_number: [
                {
                    title: "评分",
                    dataIndex: "rate",
                    key: "rate",
                    type: "number",
                },
                {
                    title: "评论数",
                    dataIndex: "comment",
                    key: "comment",
                    type: "number",
                },
            ],
        });
        // 注入route
        const route = useRoute();
        const router = useRouter();

        const update = () => {
            view_chart(state.chart_id).then((response) => {
                if (response.data.status.code === 0) {
                    state.type_id = response.data.data.chart.type_id;
                    state.chart_name = response.data.data.chart.chart_name;
                } else {
                    // 没有取到图表
                    router.push("/chart_management");
                }
            });
        };

        onMounted(() => {
            // 取参数
            state.chart_id = parseInt(route.params.id[0]);
            // 参数格式不正确
            if (isNaN(state.chart_id)) {
                router.push("/chart_management");
            }
            update();
        });
        return {
            ...toRefs(state),
        };
    },
});
</script>

<style scoped></style>
