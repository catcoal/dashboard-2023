<script setup lang="ts">
import Gravatar from "@/components/Gravatar/Gravatar.vue"
import { useMe } from "@/stores/me"
import { computed } from "vue";

const meStore = useMe();
const nickname = computed(() => meStore.MineInfo?.author);
const email = computed(() => meStore.MineInfo?.email);
</script>

<template>
    <div class="user-box Stereobox">
        <div class="avatar-wrap">
            <Gravatar class="avatar" :email="'1622455251@qq.com'"></Gravatar>
        </div>
        <div class="user-infos">
            <h2>{{ nickname }}</h2>
            <p>{{ email }}</p>
        </div>
    </div>
</template>

<style scoped>
.user-box {
    display: inline-flex;
    align-items: center;
    gap: 15px;
    background-color: #FFF;
    padding: 15px 25px;
    border-radius: 20px;
}

.user-infos {
    display: flex;
    flex-direction: column;
    gap: 3px;
}

.user-infos>h2 {
    font-size: 16px;
    letter-spacing: 1px;
    font-weight: 500;
}

.user-infos>p {
    font-size: 12px;
    opacity: 0.7;
}

.avatar-wrap {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
}
</style>