<template>
    <div id="container"></div>
</template>

<script>
/**
 * 折线图
 */
import { defineComponent, onMounted } from "vue";
import { Line } from "@antv/g2plot";

export default defineComponent({
    props: {
        data: Object,
        xField: String,
        yField: String,
        seriesField: String,
    },
    setup(props) {
        const render = () => {
            console.log("render");
            const line = new Line("container", {
                data: props.data,
                xField: props.xField,
                yField: props.yField,
                seriesField: props.seriesField,
                xAxis: {},
                yAxis: {},
            });

            line.render();
        };

        onMounted(() => {
            render();
        });

        return {
            render,
        };
    },
});
</script>

<style scoped></style>
