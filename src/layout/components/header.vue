<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const pageName = computed(() => router.currentRoute.value.meta.label || '');
</script>

<template>
    <div class="header-inner">
        <p>{{ pageName }}</p>
    </div>
</template>

<style scoped>
.header-inner {
    display: flex;
    align-items: center;
    height: 100%;
}

p {
    background-color: #FFF;
    display: inline-block;
    padding: 5px 10px;
    border-radius: 10px;
    font-weight: bold;
}
</style>