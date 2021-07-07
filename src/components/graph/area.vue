<template>
    <div :id="id" />
</template>

<script>
/**
 * 面积图
 */
import { defineComponent, onMounted, ref } from 'vue'
import { Area } from '@antv/g2plot'

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
            const area = new Area(id.value, {
                data: props.data,
                xField: props.xField,
                yField: props.yField,
                seriesField: props.seriesField,
                xAxis: {},
                yAxis: {},
            })

            area.render()
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
