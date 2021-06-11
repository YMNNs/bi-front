<template>
    <div style="padding-top: 15vh">
        <a-result
            status="403"
            title="403"
            sub-title="Sorry, you are not authorized to access this page."
        >
            <template #extra>
                <a-button type="primary" @click.prevent="$router.push('/')"
                    >Back Home</a-button
                >
            </template>
        </a-result>
    </div>
</template>
