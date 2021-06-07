import { createRouter, createWebHistory } from "vue-router";
import store from "@/store";
import { message } from "ant-design-vue";
// 页面加载进度条
import NProgress from "nprogress";
import "nprogress/nprogress.css";
NProgress.configure({
    easing: "ease", // 动画方式
    speed: 500, // 递增进度条的速度
    showSpinner: false, // 是否显示加载ico
    trickleSpeed: 200, // 自动递增间隔
    minimum: 0.3, // 初始化时的最小百分比
});
// const baseTitle = " > " + process.env.VUE_APP_TITLE;

/**
 * 路由表
 * @type {[{path: string, component: (function(): Promise<*>), hidden: boolean, meta: {title: string}, name: string}, {path: string, component: (function(): Promise<*>), hidden: boolean, meta: {title: string}, name: string}, {path: string, component: (function(): Promise<*>), hidden: boolean, meta: {title: string}, name: string}, {path: string, component: (function(): Promise<*>)}]}
 */
const routes = [
    {
        path: "/login",
        name: "login",
        component: () => import("@/components/login"),
        meta: { title: "登录" },
        hidden: true,
    },
    {
        path: "/register",
        name: "register",
        component: () => import("@/components/register"),
        meta: { title: "注册" },
        hidden: true,
    },
    {
        path: "/403",
        name: "e403",
        component: () => import("@/components/error_pages/e403"),
        meta: { title: "403错误" },
        hidden: true,
    },
    {
        path: "/404",
        name: "e404",
        component: () => import("@/components/error_pages/e404"),
        meta: { title: "404错误" },
        hidden: true,
    },
    {
        path: "/",
        component: () => import("@/components/layout"),
        name: "layout",
        redirect: "/dashboard",
        meta: { role: ["user"], requireAuth: true },
        children: [
            {
                path: "/dashboard",
                component: () => import("@/components/dashboard"),
                name: "dashboard",
                meta: {
                    title: "仪表盘",
                    role: ["user"],
                    requireAuth: true,
                    icon: "icon-yibiaopan",
                },
            },
            {
                path: "/d2",
                component: () => import("@/components/d2"),
                name: "d2",
                meta: {
                    title: "d2",
                    role: ["user"],
                    requireAuth: true,
                },
            },
        ],
    },
    {
        path: "/:catchAll(.*)",
        redirect: "/404",
    },
];

const router = createRouter({
    // history: createWebHistory(process.env.BASE_URL),
    history: createWebHistory(),
    routes: routes,
});

/**
 * 路由守卫
 */
router.beforeEach((to, from, next) => {
    NProgress.start();
    if (to.meta.title) {
        // 在router中设置的页面标题
        document.title = to.meta.title;
    }
    const token = store.state.token;
    const role = store.state.role;
    if (to.meta.requireAuth) {
        if (!token) {
            message.warning("需要登录，正在跳转至登录页面。");
            next("/login");
        }
        if (!to.meta.role || to.meta.role.isInArray(role)) {
            console.log("to.meta.role = " + to.meta.role);
            console.log("role = " + role);
            next();
        } else {
            console.log("to.meta.role = " + to.meta.role);
            console.log("role = " + role);
            next("/403");
        }
    } else {
        if (to.path === "/login" && token && !store.state.logout) {
            next("/");
        } else {
            next();
        }
    }
});

router.afterEach(() => {
    NProgress.done();
});
export default router;
