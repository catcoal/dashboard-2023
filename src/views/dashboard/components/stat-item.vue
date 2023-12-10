<script setup lang="ts">
defineProps<{
    title: string,
    count: number,
    unread?: boolean
}>()
</script>

<template>
    <div class="stat-box Stereobox">
        <div class="stat-header">
            <div class="stat-infos">
                <h2>{{ title }}</h2>
                <p>{{ count }}</p>
            </div>
            <div class="stat-icon" :class="{ 'unread': unread }">
                <slot name="icon"></slot>
            </div>
        </div>
        <div class="stat-footer">
            <slot name="footer"></slot>
        </div>
    </div>
</template>

<style scoped>
.stat-box {
    position: relative;
    display: inline-flex;
    flex-direction: column;
    gap: 15px;
    min-width: 180px;
    background-color: #FFF;
    padding: 15px 25px;
    border-radius: 20px;
    overflow: hidden;
}

.stat-icon.unread::after {
    content: '';
    position: absolute;
    top: -5px;
    right: -5px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: red;
    box-shadow: 0 0 5px red;
}

.stat-box::after {
    content: '';
    position: absolute;
    z-index: -1;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, transparent 50%, rgba(83, 182, 114, 0.2) 100%);
}

.stat-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
}

.stat-infos {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.stat-infos>h2 {
    font-size: 16px;
}

.stat-infos>p {
    font-size: 14px;
    opacity: 0.8;
}

.stat-icon {
    position: relative;
    font-size: 25px;
    opacity: 0.7;
}

.stat-footer {
    display: flex;
    gap: 5px;
}
</style>