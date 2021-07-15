<template>
    <component
        :is="defineAsyncComponent(chart_meta.component)"
        :xField="xField"
        :yField="yField"
        :seriesField="seriesField"
        :data="data"
        :key="key"
        v-if="ready"
    />
</template>

<script>
/**
 * 图表统一API
 */
import { chart_types, prepare_data } from '@/constant/chart_types'
import { defineComponent, defineAsyncComponent, onBeforeMount, reactive, toRefs, onMounted } from 'vue'
import log from '@/util/logger'

export default defineComponent({
    components: {
        graph: {},
    },
    // prettier-ignore
    props: {
        data: Object,           // 数据集
        xField: String,         // 自变量
        yField: String,         // 因变量
        seriesField: String,    // 系列名
        type_id: Number,        // 类型id
        columns: Object,        // 所有指标列名
        number_keys: Object,    // 选中的指标列名
        text_keys: Object,      // 选中的维度列名
    },
    setup(props) {
        const state = reactive({
            graph: '',
            xField: '',
            yField: '',
            seriesField: '',
            data: {},
            key: '',
            type_id: NaN,
            chart_meta: {},
            ready: false,
        })
        onBeforeMount(() => {
            log.time(`初始化图表 ${props.text_keys[0]}`)
            state.type_id = props.type_id
            state.chart_meta = chart_types.find((i) => i.type_id === state.type_id)
            // 优先使用chart_types中定义的属性
            state.xField = props.text_keys[0] ? props.text_keys[0] : props.xField
            state.yField = state.chart_meta.yField ? state.chart_meta.yField : props.yField
            state.seriesField = state.chart_meta.seriesField ? state.chart_meta.seriesField : props.seriesField
            state.data = prepare_data(props.data, props.columns, props.number_keys, props.text_keys)
            log.timeEnd(`初始化图表 ${props.text_keys[0]}`)
        })
        onMounted(() => {
            state.key = new Date().getTime().toString() + Math.random()
            state.ready = true
        })
        return {
            ...toRefs(state),
            defineAsyncComponent,
        }
    },
})
</script>

<style scoped></style>
