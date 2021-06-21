<template>
    <div id="container"></div>
</template>

<script>
/**
 * 饼图
 */
import { defineComponent, onMounted } from "vue";
import { Pie } from "@antv/g2plot";

export default defineComponent({
    props: {
        data: Object,
        xField: String,
        yField: String,
        seriesField: String,
    },
    setup(props) {
        const render = () => {
            const piePlot = new Pie("container", {
                appendPadding: 10,
                data: props.data,
                angleField: props.yField,
                colorField: props.xField,
                radius: 0.75,
                label: {
                    type: "spider",
                    labelHeight: 28,
                    content: "{name}\n{percentage}",
                },
                interactions: [
                    { type: "element-selected" },
                    { type: "element-active" },
                ],
            });

            piePlot.render();
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
