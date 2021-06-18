<template>
    <a-page-header @back="$router.go(-1)">
        <template #title>编辑图表</template>
    </a-page-header>
    <a-row :gutter="[16, 16]">
        <a-col :span="4">
            <a-typography-title
                :level="4"
                v-model:content="chart_name"
                :editable="true"
            />
        </a-col>
    </a-row>
    <a-row :gutter="[16, 16]">
        <a-col :span="4">
            <a-row :gutter="[16, 16]">
                <a-col :span="24">
                    <a-input-search
                        placeholder="搜索字段"
                        @search="onSearch_field"
                        v-model:value="search.field"
                    />
                </a-col>
            </a-row>
            <a-row :gutter="[16, 16]">
                <a-col :span="24" style="margin-top: 16px">
                    <a-card size="small">
                        <template #title>
                            维度&nbsp;&nbsp;<a-tag
                                color="default"
                                closable
                                @close="clear_filter_field"
                                v-if="
                                    columns.text.length !==
                                    columns.text_display.length
                                "
                                >已过滤
                            </a-tag></template
                        >
                        <a-tree
                            checkable
                            v-model:checkedKeys="checkedKeys.text"
                            :tree-data="columns.text_display"
                            show-icon
                            style="margin-left: -16px"
                        >
                            <template #icon><FieldStringOutlined /></template>
                        </a-tree>
                    </a-card>
                </a-col>
            </a-row>
            <a-row :gutter="[16, 16]">
                <a-col :span="24" style="margin-top: 16px">
                    <a-card size="small">
                        <template #title>
                            指标&nbsp;&nbsp;<a-tag
                                color="default"
                                closable
                                @close="clear_filter_field"
                                v-if="
                                    columns.number.length !==
                                    columns.number_display.length
                                "
                                >已过滤
                            </a-tag></template
                        >
                        <a-tree
                            checkable
                            v-model:checkedKeys="checkedKeys.number"
                            :tree-data="columns.number_display"
                            show-icon
                            style="margin-left: -16px"
                        >
                            <template #icon><FieldNumberOutlined /></template>
                        </a-tree>
                    </a-card>
                </a-col>
            </a-row>
        </a-col>
        <a-col :span="6">
            <a-row :gutter="[16, 16]">
                <a-col :span="24">
                    <a-input-search
                        @search="onSearch_chart_type"
                        v-model:value="search.chart_type"
                        placeholder="搜索图表类型"
                    />
                </a-col>
            </a-row>
            <a-row :gutter="[16, 16]">
                <a-col :span="24" style="margin-top: 16px">
                    <a-radio-group v-model:value="type_id" style="width: 100%"
                        ><a-card size="small">
                            <template #title>
                                图表类型&nbsp;&nbsp;<a-tag
                                    color="default"
                                    closable
                                    @close="clear_filter_chart_type"
                                    v-if="
                                        chart_types.length !==
                                        chart_types_display.length
                                    "
                                    >已过滤
                                </a-tag></template
                            >

                            <a-card-grid
                                style="
                                    width: calc(1 / 3 * 100%);
                                    text-align: center;
                                "
                                v-for="item in chart_types_display"
                                v-bind:key="item"
                                ><div class="cover-icon">
                                    <icon-font :type="item.icon_type" />
                                </div>
                                <div style="margin-top: 4px">
                                    <a-typography-text strong>{{
                                        item.type_name
                                    }}</a-typography-text>
                                </div>
                                <div style="margin-top: 8px">
                                    <a-radio
                                        :value="item.type_id"
                                        style="margin-left: 8px"
                                    />
                                </div>
                            </a-card-grid>
                        </a-card> </a-radio-group
                ></a-col>
            </a-row>
        </a-col>
        <a-col :span="14">
            <a-row :gutter="[16, 16]">
                <a-col :span="24">
                    <a-card size="small">
                        <template #title> 预览 </template>
                        <graph_1 :data="graph_data" />
                    </a-card>
                </a-col>
            </a-row>
        </a-col>
    </a-row>
</template>

<script>
import { defineComponent, onMounted, reactive, toRefs, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { chart_types } from "@/constant/chart_types";
import { view_chart } from "@/api/post/view_chart";
import {
    FieldStringOutlined,
    FieldNumberOutlined,
    createFromIconfontCN,
} from "@ant-design/icons-vue";
import { icon_url } from "@/util/iconfont";
import graph_1 from "@/components/graph/graph_1";
import { table_content } from "@/api/post/table_content";
import { notification } from "ant-design-vue";

const IconFont = createFromIconfontCN({
    scriptUrl: icon_url,
});

export default defineComponent({
    components: {
        IconFont,
        FieldStringOutlined,
        FieldNumberOutlined,
        graph_1,
    },
    setup() {
        const state = reactive({
            search: {
                field: "",
                chart_type: "",
            },
            chart_id: NaN,
            checkedKeys: {
                number: [],
                text: [],
            },
            type_id: null,
            data_id: null,
            chart_name: "豆瓣",
            chart_types: [],
            chart_types_display: [],
            graph_data: [
                {
                    year: "1850",
                    value: 0,
                    category: "Liquid fuel",
                },
                {
                    year: "1850",
                    value: 54,
                    category: "Solid fuel",
                },
            ],
            columns: {
                number: [],
                number_display: [],
                text: [],
                text_display: [],
            },
        });
        // 注入路由
        const route = useRoute();
        const router = useRouter();

        const onSearch_field = () => {
            state.columns.number_display = state.columns.number.filter(
                (i) => i.title.indexOf(state.search.field) !== -1
            );
            state.columns.text_display = state.columns.text.filter(
                (i) => i.title.indexOf(state.search.field) !== -1
            );
        };

        const onSearch_chart_type = () => {
            state.chart_types_display = state.chart_types.filter(
                (i) => i.type_name.indexOf(state.search.chart_type) !== -1
            );
        };

        const update = () => {
            view_chart(state.chart_id).then((response) => {
                if (response.data.status.code === 0) {
                    state.type_id = response.data.data.chart.type_id;
                    state.data_id = response.data.data.data_id;
                    state.chart_name = response.data.data.chart.chart_name;
                } else {
                    // 没有取到图表
                    router.push("/chart_management");
                }
            });

            table_content(state.data_id, 0, 0).then((response) => {
                if (response.data.status.code === 0) {
                    console.log(response.data.data);
                    state.columns.number = [];
                    state.columns.number_display = [];
                    state.columns.text = [];
                    state.columns.text_display = [];
                    response.data.data.table.columns.forEach((i) => {
                        i.slots = {
                            icon: "icon",
                        };
                        if (i.type === "number") {
                            state.columns.number.push(i);
                            state.columns.number_display.push(i);
                            console.log(i.title);
                        }
                        if (i.type === "string") {
                            state.columns.text.push(i);
                            state.columns.text_display.push(i);
                            console.log(i.title);
                        }
                    });
                } else {
                    notification["error"]({
                        message: "错误",
                        description: response.data.status.message,
                    });
                }
            });
        };

        watch(state.checkedKeys.text, () => {
            // todo 根据图表类型限制勾选列数量，考虑第三个属性“类别”
        });

        const clear_filter_chart_type = () => {
            state.search.chart_type = "";
            onSearch_chart_type();
        };

        const clear_filter_field = () => {
            state.search.field = "";
            onSearch_field();
        };

        onMounted(() => {
            // 取参数
            state.chart_id = parseInt(route.params.id[0]);
            // 参数格式不正确
            if (isNaN(state.chart_id)) {
                router.push("/chart_management");
            }
            state.chart_types = chart_types;
            state.chart_types_display = state.chart_types;
            update();
        });

        return {
            ...toRefs(state),
            onSearch_field,
            clear_filter_field,
            onSearch_chart_type,
            clear_filter_chart_type,
        };
    },
});
</script>

<style scoped>
.cover-icon {
    font-size: 40px;
    text-align: center;
    margin-top: -16px;
}
</style>
