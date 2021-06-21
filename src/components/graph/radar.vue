<template>
    <div id="container"></div>
</template>

<script>
/**
 * 雷达图
 */
import { defineComponent, onMounted } from "vue";
import { Radar } from "@antv/g2plot";

export default defineComponent({
    props: {
        data: Object,
        xField: String,
        yField: String,
        seriesField: String,
    },
    setup(props) {
        const render = () => {
            const radarPlot = new Radar("container", {
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
            });
            radarPlot.render();
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
