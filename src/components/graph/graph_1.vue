<template>
    <div id="container"></div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import { defineComponent, onMounted, onUpdated, toRefs } from "vue";
// eslint-disable-next-line no-unused-vars
import { Line } from "@antv/g2plot";

export default defineComponent({
    props: {
        data: Object,
        xField: String,
        yField: String,
        seriesField: String,
    },
    setup(props) {
        //const { data } = toRefs(props);
        const render = () => {
            const line = new Line("container", {
                data: props.data,
                xField: "year",
                yField: "value",
                seriesField: "category",
                xAxis: {
                    type: "time",
                },
                yAxis: {
                    label: {
                        // 数值格式化为千分位
                        formatter: (v) =>
                            `${v}`.replace(
                                /\d{1,3}(?=(\d{3})+$)/g,
                                (s) => `${s},`
                            ),
                    },
                },
            });

            line.render();
        };

        onUpdated(() => {
            render();
        });

        onMounted(() => {
            render();
        });

        return {};
    },
});
</script>

<style scoped></style>
