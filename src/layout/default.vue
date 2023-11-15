<script setup lang="ts">
import { Layout, LayoutSider, LayoutHeader, LayoutContent, Button } from 'ant-design-vue';
import Menu from "@/layout/components/menu.vue";
import Header from "@/layout/components/header.vue";
import { useApp } from '@/stores/app';
import { computed } from 'vue';
const appStore = useApp();
const menuCollapsed = computed(() => appStore.menuCollapsed);

</script>

<template>
    <Layout class="default-layout">
        <LayoutSider class="layout-sider" :collapsed="menuCollapsed" :collapsedWidth="0" :trigger="null" collapsible>
            <Menu></Menu>
        </LayoutSider>
        <Layout class="layout-inner" :class="{ 'Collapsed': menuCollapsed }">
            <LayoutHeader class="layout-header">
                <Header></Header>
            </LayoutHeader>
            <LayoutContent class="layout-content">
                <RouterView></RouterView>
            </LayoutContent>
        </Layout>
    </Layout>
</template>

<style scoped>
.default-layout {
    height: 100vh;
}

.layout-inner {
    margin-left: 200px;
    transition: .3s ease;
    transition-property: margin-left;
}

.layout-inner.Collapsed {
    margin-left: 0;
}

.layout-sider {
    user-select: none;
    position: fixed;
    z-index: 99;
    left: 0;
    bottom: 0;
    top: 0;
    overflow: auto;
    background-color: transparent;
    padding: 10px 0 10px 10px;
}

.layout-header {
    position: sticky;
    top: 0;
    z-index: 9;
    background-color: rgba(245, 245, 245, 0.5);
    border-bottom: 1px solid rgba(245, 245, 245, 0.9);
    backdrop-filter: blur(25px) saturate(10);
    -webkit-backdrop-filter: blur(25px) saturate(10);
    line-height: unset;
    height: auto;
    padding: 10px 20px;
}

.layout-content {
    padding: 10px 20px 20px 20px;
    background-color: transparent;
}

@media (max-width:768px) {
    .layout-sider {
        top: 40px;
    }

    .layout-inner {
        margin-left: 0;
    }
}
</style>