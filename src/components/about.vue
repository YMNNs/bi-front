<template>
    <a-page-header title="关于" @back="$router.go(-1)" />
    <a-row>
        <a-col :span="22" :offset="1">
            <a-divider />
            <a-row :gutter="32">
                <a-col :span="8"
                    ><a-typography-title :level="3">关于视易</a-typography-title>
                    <p>“在客户最需要我们的时候，视易为我们提供了最重要的技术解决方案。”</p>
                </a-col>
                <a-col :span="14"><a-typography v-html="htmlMd" /></a-col>
            </a-row>
        </a-col>
    </a-row>
    <a-row>
        <a-col :span="22" :offset="1">
            <a-divider />
            <a-row :gutter="32">
                <a-col :span="8"
                    ><a-typography-title :level="3">安装信息</a-typography-title>
                    <p>此处展示关于系统的详细信息。</p>
                </a-col>
                <a-col :span="14">
                    <table>
                        <tr>
                            <td class="td_left"><a-typography-text strong>版本:</a-typography-text></td>
                            <td>{{ config.version }}</td>
                        </tr>
                        <tr>
                            <td class="td_left"><a-typography-text strong>构建日期:</a-typography-text></td>
                            <td>{{ buildDate }}</td>
                        </tr>
                        <tr>
                            <td><br /></td>
                        </tr>
                        <tr v-for="item in dependencies" :key="item.name">
                            <td class="td_left">
                                <a-typography-text strong>{{ item.name }}:</a-typography-text>
                            </td>
                            <td>
                                <a-typography-text>{{ item.version }}</a-typography-text>
                            </td>
                        </tr>
                    </table>
                </a-col>
            </a-row>
        </a-col>
    </a-row>
</template>
<script>
import { defineComponent } from 'vue'
import config from '../../package.json'

export default defineComponent({
    components: {},
    setup() {
        const htmlMd = require('@/assets/about.md')

        const dependencies = Object.entries(config.dependencies).map((i) => {
            return {
                name: i[0],
                version: i[1].replace(/\^/g, ''),
            }
        })

        return {
            config,
            htmlMd,
            dependencies,
            buildDate: process.env.BUILD_TIME,
        }
    },
})
</script>

<style scoped>
.td_left {
    padding-right: 32px;
}
</style>
