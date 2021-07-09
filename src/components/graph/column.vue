<template>
    <div :id="id" />
</template>

<script>
/**
 * 柱形图
 */
import { defineComponent, onMounted, ref } from 'vue'
import { Column } from '@antv/g2plot'
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
            log.time('渲染柱状图')
            const stackedColumnPlot = new Column(id.value, {
                data: props.data,
                isGroup: true,
                xField: props.xField,
                yField: props.yField,
                seriesField: props.seriesField,
                /** 设置颜色 */
                //color: ['#1ca9e6', '#f88c24'],
                /** 设置间距 */
                // marginRatio: 0.1,
                label: {
                    // 可手动配置 label 数据标签位置
                    position: 'middle', // 'top', 'middle', 'bottom'
                    // 可配置附加的布局方法
                    layout: [
                        // 柱形图数据标签位置自动调整
                        { type: 'interval-adjust-position' },
                        // 数据标签防遮挡
                        { type: 'interval-hide-overlap' },
                        // 数据标签文颜色自动调整
                        { type: 'adjust-color' },
                    ],
                },
            })
            stackedColumnPlot.render()
            log.timeEnd('渲染柱状图')
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
