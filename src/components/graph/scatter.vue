<template>
    <div :id="id" />
</template>

<script>
/**
 * 散点图
 */
import { defineComponent, onMounted, ref } from 'vue'
import { Scatter } from '@antv/g2plot'
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
            log.time('渲染散点图')
            const scatterPlot = new Scatter(id.value, {
                appendPadding: 10,
                data: props.data,
                xField: props.xField,
                yField: props.yField,
                shape: 'circle',
                colorField: props.seriesField,
                size: 4,
                yAxis: {
                    nice: true,
                    line: {
                        style: {
                            stroke: '#aaa',
                        },
                    },
                },
                xAxis: {
                    grid: {
                        line: {
                            style: {
                                stroke: '#eee',
                            },
                        },
                    },
                    line: {
                        style: {
                            stroke: '#aaa',
                        },
                    },
                },
            })

            scatterPlot.render()
            log.timeEnd('渲染散点图')
        }

        onMounted(() => {
            render()
        })

        return {
            render,
            id,
        }
    },
})
</script>

<style scoped></style>
