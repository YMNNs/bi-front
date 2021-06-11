<template>
    <div style="padding-top: 15vh">
        <a-result
            status="404"
            title="404"
            sub-title="Sorry, the page you visited does not exist."
        >
            <template #extra>
                <a-button type="primary" @click.prevent="$router.push('/')"
                    >Back Home</a-button
                >
            </template>
        </a-result>
    </div>
</template>
