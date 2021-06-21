<template>
    <div id="container"></div>
</template>

<script>
/**
 * 散点图
 */
import { defineComponent, onMounted } from "vue";
import { Scatter } from "@antv/g2plot";

export default defineComponent({
    props: {
        data: Object,
        xField: String,
        yField: String,
        seriesField: String,
    },
    setup(props) {
        const render = () => {
            const scatterPlot = new Scatter("container", {
                appendPadding: 10,
                data: props.data,
                xField: props.xField,
                yField: props.yField,
                shape: "circle",
                colorField: props.seriesField,
                size: 4,
                yAxis: {
                    nice: true,
                    line: {
                        style: {
                            stroke: "#aaa",
                        },
                    },
                },
                xAxis: {
                    min: -100,
                    grid: {
                        line: {
                            style: {
                                stroke: "#eee",
                            },
                        },
                    },
                    line: {
                        style: {
                            stroke: "#aaa",
                        },
                    },
                },
            });
            scatterPlot.render();
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
