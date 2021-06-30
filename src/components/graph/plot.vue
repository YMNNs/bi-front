<template>
    <div :id="id"></div>
</template>

<script>
/**
 * 折线图
 */
import { defineComponent, onMounted, ref } from "vue";
import { Line } from "@antv/g2plot";

export default defineComponent({
    props: {
        data: Object,
        xField: String,
        yField: String,
        seriesField: String,
    },
    setup(props) {
        // 此处随机生成div-id的原因是同一个页面中出现2个同id图表容器将会陷入渲染死循环
        const id = ref(new Date().getTime().toString() + Math.random());
        const render = () => {
            const line = new Line(id.value, {
                data: props.data,
                xField: props.xField,
                yField: props.yField,
                seriesField: props.seriesField,
                xAxis: {},
                yAxis: {},
            });

            console.log("渲染折线图");
            line.render();
        };

        onMounted(() => {
            render();
        });

        return {
            id,
            render,
        };
    },
});
</script>

<style scoped></style>
