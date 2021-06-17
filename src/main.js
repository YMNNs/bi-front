import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";

// 本地测试使用假后端
if (process.env.VUE_APP_MOCK === "true") {
    import("@/api/mock/user_info");
    import("@/api/mock/validate_username");
    import("@/api/mock/validate_email");
    import("@/api/mock/register");
    import("@/api/mock/request_reset_password");
    import("@/api/mock/reset_password");
    import("@/api/mock/validate_reset_password_token");
    import("@/api/mock/login");
    import("@/api/mock/modify_user_profile");
    import("@/api/mock/change_password");
    import("@/api/mock/logout");
    import("@/api/mock/delete_account");
    import("@/api/mock/resend_activation_email");
    import("@/api/mock/activate_email");
    import("@/api/mock/table_content");
    import("@/api/mock/all_charts");
    import("@/api/mock/delete_chart");
    import("@/api/mock/all_tables");
}

const app = createApp(App);

app.use(Antd);
app.use(store);
app.use(router);
app.mount("#app");
