<template>
    <!--语言设置-->
    <a-config-provider :locale="zhCN">
        <ConnectionStatus v-if="network" />
        <router-view />
    </a-config-provider>
</template>

<script>
import zhCN from "ant-design-vue/es/locale/zh_CN";
import { defineComponent, onMounted, reactive, toRefs, watch } from "vue";
import ConnectionStatus from "@/components/widget/ConnectionStatus";
import { useStore } from "vuex";
import { notification } from "ant-design-vue";

export default defineComponent({
    components: { ConnectionStatus },
    setup() {
        const store = useStore();
        const state = reactive({
            network: false,
        });

        watch(
            () => store.state.network,
            () => {
                state.network = !store.state.network;
                if (state.network) {
                    // 断网
                    notification["warning"]({
                        message: "无法连接到服务器",
                        description:
                            process.env.VUE_APP_TITLE +
                            "已经发送了网络请求，但未收到来自服务器的响应。请刷新页面重试。",
                    });
                } else {
                    // 恢复
                    notification["success"]({
                        message: "已连接到服务器",
                        description:
                            process.env.VUE_APP_TITLE +
                            "现已成功连接到服务器。",
                    });
                }
            }
        );

        onMounted(() => {
            window.addEventListener("offline", () => {
                // console.log("已断网");
                store.commit("SET_NETWORK_STATUS", false);
            });
            window.addEventListener("online", () => {
                // console.log("网络已连接");
                store.commit("SET_NETWORK_STATUS", true);
            });
        });
        return {
            zhCN,
            store,
            ...toRefs(state),
        };
    },
});
</script>

<style>
#nprogress .bar {
    background: #1890ff !important;
}
</style>
