<template>
    <div style="padding: 120px">
        <a-card :bordered="true" style="width: 700px; margin: 0 auto">
            <h1>注册</h1>
            <p>
                请填写表单以注册<strong>{{ text.appTitle }}</strong>
            </p>
            <!--注册表单-->
            <a-form> </a-form>
        </a-card>
    </div>
</template>

<script>
import { defineComponent, reactive } from "vue";

export default defineComponent({
    setup() {
        const text = reactive({
            appTitle: process.env.VUE_APP_TITLE,
        });
        return {
            text,
        };
    },
});
</script>

<style scoped></style>
