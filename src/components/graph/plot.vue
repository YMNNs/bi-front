<template>
    <div :id="id" />
</template>

<script>
/**
 * 折线图
 */
import { defineComponent, onMounted, ref } from 'vue'
import { Line } from '@antv/g2plot'
import log from '@/util/logger'

export default defineComponent({
    props: {
        data: Object,
        xField: String,
        yField: String,
        seriesField: String,
    },
    setup(props) {
        // 此处随机生成div-id的原因是同一个页面中出现2个同id图表容器将会陷入渲染死循环
        const id = ref(new Date().getTime().toString() + Math.random())
        const render = () => {
            log.time('渲染折线图')
            const line = new Line(id.value, {
                data: props.data,
                xField: props.xField,
                yField: props.yField,
                seriesField: props.seriesField,
                xAxis: {},
                yAxis: {},
            })

            line.render()
            log.timeEnd('渲染折线图')
        }

        onMounted(() => {
            render()
        })

        return {
            id,
            render,
        }
    },
})
</script>

<style scoped></style>
