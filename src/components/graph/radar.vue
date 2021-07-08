<template>
    <div :id="id" />
</template>

<script>
/**
 * 雷达图
 */
import { defineComponent, onMounted, ref } from 'vue'
import { Radar } from '@antv/g2plot'

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
            console.time('渲染雷达图')
            const radarPlot = new Radar(id.value, {
                data: props.data,
                xField: props.xField,
                yField: props.yField,
                seriesField: props.seriesField,
                xAxis: {
                    line: null,
                    tickLine: null,
                    grid: {
                        line: {
                            style: {
                                lineDash: null,
                            },
                        },
                    },
                },
                // 开启面积
                area: {},
                // 开启辅助点
                point: {
                    size: 2,
                },
            })
            radarPlot.render()
            console.timeEnd('渲染雷达图')
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
