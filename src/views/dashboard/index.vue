<script setup lang="ts">
import UserBox from './components/user-box.vue';
</script>

<template>
    <div class="dashboard-container">
        <div class="box-item Stereobox">
            <UserBox></UserBox>
        </div>
    </div>
</template>

<style scoped>
.box-item {
    display: inline-block;
    background-color: #FFF;
    padding: 15px 25px;
    border-radius: 20px;
}
</style>