<template>
    <div id="container"></div>
</template>

<script>
/**
 * 条形图
 */
import { defineComponent, onMounted } from "vue";
import { Bar } from "@antv/g2plot";

export default defineComponent({
    props: {
        data: Object,
        xField: String,
        yField: String,
        seriesField: String,
    },
    setup(props) {
        const render = () => {
            const stackedBarPlot = new Bar("container", {
                data: props.data,
                isGroup: true,
                /** 交换x,y的次序*/
                xField: props.yField,
                yField: props.xField,
                /** 自定义颜色 */
                // color: ['#1383ab', '#c52125'],
                seriesField: props.seriesField,
                marginRatio: 0,
                label: {
                    // 可手动配置 label 数据标签位置
                    position: "middle", // 'left', 'middle', 'right'
                    // 可配置附加的布局方法
                    layout: [
                        // 柱形图数据标签位置自动调整
                        { type: "interval-adjust-position" },
                        // 数据标签防遮挡
                        { type: "interval-hide-overlap" },
                        // 数据标签文颜色自动调整
                        { type: "adjust-color" },
                    ],
                },
            });
            stackedBarPlot.render();
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
