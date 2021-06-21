<template>
    <component
        :is="graph"
        :xField="xField"
        :yField="yField"
        :seriesField="seriesField"
        :data="data"
        :key="key"
    ></component>
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
} from "vue";

export default defineComponent({
    components: {
        graph: {},
    },
    props: {
        data: Object,
        xField: String,
        yField: String,
        seriesField: String,
        type_id: Number,
        key: Number,
        columns: Object,
        number_keys: Object,
        text_keys: Object,
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
            key: 0,
        });
        onBeforeMount(() => {
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
            state.data = chart_meta.prepare_data(
                props.data,
                props.columns,
                props.number_keys,
                props.text_keys
            );
            // 动态注册组件，访问setup()外面的components
            internalInstance.components.graph = defineAsyncComponent(
                chart_meta.component
            );
        });
        // TODO 更多类型图表
        return {
            ...toRefs(state),
        };
    },
});
</script>

<style scoped></style>
