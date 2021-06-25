<template>
    <a-page-header title="仪表盘">
        <template v-slot:extra>
            <a-button key="1" type="primary" v-if="!edit" @click="edit = true"
                >编辑</a-button
            >
            <a-button key="2" type="primary" v-if="edit" @click="edit = false"
                >完成</a-button
            >
        </template>
    </a-page-header>
    <a-spin :spinning="!ready" :indicator="indicator">
        <a-list
            :grid="{ gutter: 16, xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 3 }"
            :data-source="instruments"
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
                            :data="item.data.dataSource"
                            :columns="item.columns"
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
                            <setting-outlined key="setting" />
                            <edit-outlined key="edit" />
                            <ellipsis-outlined key="ellipsis" />
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
    SettingOutlined,
    EditOutlined,
    EllipsisOutlined,
} from "@ant-design/icons-vue";
import Graph_api from "@/components/graph/graph_api";

export default defineComponent({
    components: {
        Graph_api,
        SettingOutlined,
        EditOutlined,
        EllipsisOutlined,
    },
    setup() {
        const state = reactive({
            instruments: [],
            charts: [],
            dataSources: [],
            ready: false,
            edit: false,
        });

        const indicator = h(LoadingOutlined, {
            style: {
                fontSize: "24px",
            },
            spin: true,
        });

        onMounted(() => {
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
                    console.log("instruments");
                    console.log(instruments);
                    // 汇总图表id
                    const chart_ids = new Set();
                    instruments.forEach((i) => {
                        chart_ids.add(i.chart_id);
                    });
                    console.log("chart_ids");
                    console.log(chart_ids);
                    // 请求图表信息
                    for (const i of chart_ids) {
                        await view_chart(i).then((response) => {
                            if (response.data.status.code === 0) {
                                // 请求图表信息成功并加入图表列表
                                // 添加图表id属性
                                console.log(response.data.data.chart);
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
                    console.log("state.charts");
                    console.log(state.charts);
                    // 汇总数据id
                    const data_ids = new Set();
                    state.charts.forEach((_chart) => {
                        data_ids.add(_chart.data_id);
                    });
                    console.log("data_ids");
                    console.log(data_ids);
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
                    console.log("state.dataSources");
                    console.log(state.dataSources);
                    // 组装仪表
                    instruments.forEach((instrument) => {
                        // 加入图表信息
                        instrument.chart = state.charts.find(
                            (_chart) => _chart.id === instrument.chart_id
                        );
                        // 加入数据
                        instrument.data = state.dataSources.find(
                            (_data) => _data.id === instrument.chart.data_id
                        );
                        // 加入数据中的全部指标列名（用于处理数据）
                        instrument.columns = instrument.data.columns.filter(
                            (column) => column.type === "number"
                        );
                    });
                    state.instruments = instruments;
                    console.log(state.instruments);
                    state.ready = true;
                } else {
                    notification["error"]({
                        message: "错误",
                        description: response.data.status.message,
                    });
                }
            });
        });

        return {
            ...toRefs(state),
            indicator,
        };
    },
});
</script>

<style scoped></style>
