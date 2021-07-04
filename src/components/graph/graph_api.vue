<template>
    <component
        :is="graph"
        :xField="xField"
        :yField="yField"
        :seriesField="seriesField"
        :data="data"
        :key="key"
    />
</template>

<script>
/**
 * 图表统一API
 */
import { chart_types } from "@/constant/chart_types";
import {
    defineComponent,
    defineAsyncComponent,
    onBeforeMount,
    reactive,
    toRefs,
    getCurrentInstance,
    computed,
} from "vue";

export default defineComponent({
    components: {
        graph: {},
    },
    props: {
        data: Object, // 数据集
        xField: String, // 自变量
        yField: String, // 因变量
        seriesField: String, // 系列名
        type_id: Number, // 类型id
        key: Number, // key更新时图表重新渲染
        columns: Object, // 所有指标列名
        number_keys: Object, // 选中的指标列名
        text_keys: Object, // 选中的维度列名
    },
    setup(props) {
        // 支持访问内部组件实例，用于高阶用法或库的开发。
        const internalInstance = getCurrentInstance();
        const state = reactive({
            graph: "",
            xField: "",
            yField: "",
            seriesField: "",
            data: {},
            key: new Date().getTime() + "_",
        });
        onBeforeMount(() => {
            console.log("初始化图表");

            const chart_meta = chart_types.find(
                (i) => i.type_id === props.type_id
            );
            // 此名称应与components里的属性对应
            state.graph = "graph";
            // 优先使用chart_types中定义的属性
            state.xField = props.text_keys[0]
                ? props.text_keys[0]
                : props.xField;
            state.yField = chart_meta.yField ? chart_meta.yField : props.yField;
            state.seriesField = chart_meta.seriesField
                ? chart_meta.seriesField
                : props.seriesField;
            state.data = computed(() =>
                chart_meta.prepare_data(
                    props.data,
                    props.columns,
                    props.number_keys,
                    props.text_keys
                )
            );
            // 动态注册组件，访问setup()外面的components
            internalInstance.components.graph = defineAsyncComponent(
                chart_meta.component
            );
        });
        return {
            ...toRefs(state),
        };
    },
});
</script>

<style scoped></style>
