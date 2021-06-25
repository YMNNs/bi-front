<template>
    <a-page-header title="仪表盘">
        <template v-slot:extra>
            <a-button key="1" type="primary" v-if="!edit" @click="edit = true"
                >编辑</a-button
            >
            <a-button key="2" type="primary" v-if="edit">添加</a-button>
            <a-button
                key="3"
                type="default"
                v-if="edit"
                :disabled="!edited"
                @click="handleReset"
                >重置</a-button
            >
            <a-button
                key="4"
                type="primary"
                v-if="edit && edited"
                @click="onFinish"
                >完成</a-button
            >
            <a-button
                key="5"
                type="default"
                v-if="edit && !edited"
                @click="edit = false"
                >取消</a-button
            >
        </template>
    </a-page-header>
    <a-spin :spinning="!ready" :indicator="indicator">
        <a-list
            :grid="{ gutter: 16, xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 3 }"
            :data-source="instruments_display"
        >
            <template #renderItem="{ item }">
                <a-list-item>
                    <a-card size="small">
                        <template #title
                            ><strong>{{
                                item.chart.chart_name
                            }}</strong></template
                        >

                        <Graph_api
                            :data="
                                dataSources.find(
                                    (i) => i.id === item.chart.data_id
                                ).dataSource
                            "
                            :columns="
                                dataSources
                                    .find((i) => i.id === item.chart.data_id)
                                    .columns.filter((j) => j.type === 'number')
                            "
                            :number_keys="item.chart.keys_number"
                            :text_keys="item.chart.keys_text"
                            :type_id="item.chart.type_id"
                            :key="new Date().getTime()"
                            :x-field="item.chart.xField"
                            :y-field="item.chart.yField"
                            :series-field="item.chart.seriesField"
                            style="max-height: 50vh"
                        />

                        <template class="ant-card-actions" #actions v-if="edit">
                            <LeftOutlined
                                key="left"
                                v-if="instruments_display.indexOf(item) !== 0"
                                @click="moveLeft(item.no)"
                            />
                            <a-popconfirm @confirm="handleDelete(item.no)"
                                ><template #title>
                                    您可以通过页面上方的
                                    <strong>重置</strong> 按钮撤销此操作。
                                </template>
                                <DeleteOutlined key="delete" />
                            </a-popconfirm>
                            <RightOutlined
                                key="right"
                                v-if="
                                    instruments_display.indexOf(item) !==
                                    instruments_display.length - 1
                                "
                                @click="moveRight(item.no)"
                            />
                        </template>
                    </a-card>
                </a-list-item>
            </template>
        </a-list>
    </a-spin>
</template>

<script>
import { defineComponent, h, onMounted, reactive, toRefs } from "vue";
import { view_dashboard } from "@/api/post/view_dashboard";
import { view_chart } from "@/api/post/view_chart";
import { notification } from "ant-design-vue";
import { table_content } from "@/api/post/table_content";
import {
    LoadingOutlined,
    DeleteOutlined,
    LeftOutlined,
    RightOutlined,
} from "@ant-design/icons-vue";
import Graph_api from "@/components/graph/graph_api";
import { edit_dashboard } from "@/api/post/edit_dashboard";

export default defineComponent({
    components: {
        Graph_api,
        DeleteOutlined,
        LeftOutlined,
        RightOutlined,
    },
    setup() {
        const state = reactive({
            instruments: [],
            instruments_display: [],
            charts: [],
            dataSources: [],
            ready: false,
            edit: false,
            edited: false,
        });

        const indicator = h(LoadingOutlined, {
            style: {
                fontSize: "24px",
            },
            spin: true,
        });

        const update = () => {
            state.ready = false;
            state.edit = false;
            state.edited = false;
            state.charts = [];
            state.dataSources = [];
            view_dashboard().then(async (response) => {
                if (response.data.status.code === 0) {
                    // 请求成功并按照no排序
                    const instruments = response.data.data.instruments.sort(
                        (a, b) => {
                            return a.no - b.no;
                        }
                    );
                    // 汇总图表id
                    const chart_ids = new Set();
                    instruments.forEach((i) => {
                        chart_ids.add(i.chart_id);
                    });
                    // 请求图表信息
                    for (const i of chart_ids) {
                        await view_chart(i).then((response) => {
                            if (response.data.status.code === 0) {
                                // 请求图表信息成功并加入图表列表
                                // 添加图表id属性
                                response.data.data.chart.id = i;
                                state.charts.push(response.data.data.chart);
                            } else {
                                notification["error"]({
                                    message: "错误",
                                    description: response.data.status.message,
                                });
                            }
                        });
                    }
                    // 汇总数据id
                    const data_ids = new Set();
                    state.charts.forEach((_chart) => {
                        data_ids.add(_chart.data_id);
                    });
                    // 请求数据
                    for (const i of data_ids) {
                        await table_content(i, -1, 0).then((response) => {
                            if (response.data.status.code === 0) {
                                // 请求数据成功并加入数据列表
                                // 添加数据id属性
                                response.data.data.table.id = i;
                                state.dataSources.push(
                                    response.data.data.table
                                );
                            } else {
                                notification["error"]({
                                    message: "错误",
                                    description: response.data.status.message,
                                });
                            }
                        });
                    }
                    // 组装仪表
                    instruments.forEach((instrument, index) => {
                        // 加入图表信息
                        instrument.chart = state.charts.find(
                            (_chart) => _chart.id === instrument.chart_id
                        );
                        // 重置no
                        instrument.no = index;
                    });
                    state.instruments = instruments;
                    // 复制为展示图表
                    handleReset();
                    state.ready = true;
                } else {
                    notification["error"]({
                        message: "错误",
                        description: response.data.status.message,
                    });
                }
            });
        };

        onMounted(() => {
            update();
        });

        const handleDelete = (no) => {
            state.instruments_display.splice(no, 1);
            rearrangeNo(state.instruments_display);
        };

        const moveLeft = (no) => {
            const i = state.instruments_display[no];
            state.instruments_display.splice(no, 1);
            state.instruments_display.splice(no - 1, 0, i);
            rearrangeNo(state.instruments_display);
        };

        const moveRight = (no) => {
            const i = state.instruments_display[no];
            state.instruments_display.splice(no, 1);
            state.instruments_display.splice(no + 1, 0, i);
            rearrangeNo(state.instruments_display);
        };

        const handleReset = () => {
            state.instruments_display = JSON.parse(
                JSON.stringify(state.instruments)
            );
            assessEdit();
        };

        const rearrangeNo = (array) => {
            array.forEach((i, index) => {
                i.no = index;
            });
            assessEdit();
        };

        // 评估是否有已经修改的项目
        const assessEdit = () => {
            state.edited =
                JSON.stringify(state.instruments_display) !==
                JSON.stringify(state.instruments);
        };

        const onFinish = () => {
            edit_dashboard(state.instruments_display).then((response) => {
                if (response.data.status.code === 0) {
                    if (response.data.status.code === 0) {
                        notification["success"]({
                            message: "成功",
                            description: response.data.status.message,
                        });
                        update();
                    } else {
                        notification["error"]({
                            message: "错误",
                            description: response.data.status.message,
                        });
                    }
                }
            });
            state.edit = false;
        };

        return {
            ...toRefs(state),
            indicator,
            moveLeft,
            moveRight,
            handleDelete,
            handleReset,
            onFinish,
        };
    },
});
</script>

<style scoped></style>
