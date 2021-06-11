<template>
    <a-row class="row">
        <a-col :span="8"></a-col>
        <a-col :span="8" class="icon">
            <DisconnectOutlined />
        </a-col>
        <a-col :span="8"></a-col>
    </a-row>
</template>
<script>
import { defineComponent } from "vue";
import { DisconnectOutlined } from "@ant-design/icons-vue";

export default defineComponent({
    components: {
        DisconnectOutlined,
    },
});
</script>
<style scoped>
.row {
    background: #ff4d4f;
    height: 45px;
    position: relative;
}

.icon {
    font-size: x-large;
    color: white;
    text-align: center;
    margin-top: 4px;
}
</style>
