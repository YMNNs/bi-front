<template>
    <div id="container"></div>
</template>

<script>
/**
 * 柱形图
 */
import { defineComponent, onMounted } from "vue";
import { Column } from "@antv/g2plot";

export default defineComponent({
    props: {
        data: Object,
        xField: String,
        yField: String,
        seriesField: String,
    },
    setup(props) {
        const render = () => {
            const stackedColumnPlot = new Column("container", {
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
                    position: "middle", // 'top', 'middle', 'bottom'
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
            stackedColumnPlot.render();
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
