<template>
    <div :id="id" />
</template>

<script>
/**
 * 饼图
 */
import { defineComponent, onMounted, ref } from 'vue'
import { Pie } from '@antv/g2plot'

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
            console.time('渲染饼图')
            const piePlot = new Pie(id.value, {
                appendPadding: 10,
                data: props.data,
                angleField: props.yField,
                colorField: props.xField,
                radius: 0.75,
                label: {
                    type: 'spider',
                    labelHeight: 28,
                    content: '{name}\n{percentage}',
                },
                interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
            })

            piePlot.render()
            console.timeEnd('渲染饼图')
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
