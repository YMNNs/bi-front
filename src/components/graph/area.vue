<template>
    <div id="container"></div>
</template>

<script>
/**
 * 面积图
 */
import { defineComponent, onMounted } from "vue";
import { Area } from "@antv/g2plot";

export default defineComponent({
    props: {
        data: Object,
        xField: String,
        yField: String,
        seriesField: String,
    },
    setup(props) {
        const render = () => {
            const area = new Area("container", {
                data: props.data,
                xField: props.xField,
                yField: props.yField,
                seriesField: props.seriesField,
                xAxis: {},
                yAxis: {},
            });

            area.render();
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
