<template>
    <div style="padding-top: 15vh">
        <a-result
            status="404"
            title="404 资源不存在"
            sub-title="生活总归带点荒谬"
        >
            <template #extra>
                <a-button
                    type="primary"
                    @click.prevent="$router.push('/dashboard')"
                    >找点乐子吧</a-button
                >
            </template>
        </a-result>
    </div>
</template>
