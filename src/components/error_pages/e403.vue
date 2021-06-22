<template>
    <div style="padding-top: 15vh">
        <a-result
            status="403"
            title="403 禁止访问"
            sub-title="总有些门是对你关闭的"
        >
            <template #extra>
                <a-button
                    type="primary"
                    @click.prevent="$router.push('/dashboard')"
                    >放轻松</a-button
                >
            </template>
        </a-result>
    </div>
</template>
