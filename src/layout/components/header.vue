<script setup lang="ts">
import { useMe } from '@/stores/me';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { LogoutOutlined } from '@ant-design/icons-vue';
import { LemAntModal } from '@/utils/MyAnt';
import { useAuth } from '@/stores/auth';
import { h } from 'vue';

const meStore = useMe();
const authStore = useAuth();
const router = useRouter();
const pageName = computed(() => router.currentRoute.value.meta.label || '');
const userInfo = computed(() => meStore.MineInfo);

const signout = () => {
    LemAntModal({
        title: '提示',
        content: h('p', [
            h('span', '确认'),
            h('b', {
                style: {
                    color: "tomato"
                }
            }, ' 退出登录 '),
            h('span', '吗?'),
        ]),
        okType: 'danger',
        onOk: () => {
            authStore.signOut();
            router.push('/');
        }
    })
}
</script>

<template>
    <div class="header-inner">
        <p class="header-plane">{{ pageName }}</p>
        <div class="header-plane">
            <p>{{ userInfo?.email }}</p>
            <LogoutOutlined @click="signout" class="logout-btn Stereobox" />
        </div>
    </div>
</template>

<style scoped>
.header-inner {
    display: flex;
    align-items: center;
    height: 100%;
    justify-content: space-between;
}

.header-plane {
    background-color: #FFF;
    display: inline-block;
    padding: 5px 10px;
    border-radius: 10px;
    font-weight: bold;
    display: flex;
    align-items: center;
    gap: 10px;
}

.logout-btn {
    cursor: pointer;
    font-size: 12px;
    padding: 3px;
    border-radius: 5px;
    transition: .3s ease;
    transition-property: color, background-color;
}

.logout-btn:hover {
    color: #FFF;
    background-color: tomato;
}
</style>