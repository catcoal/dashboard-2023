<script setup lang="ts">
import { Layout, LayoutSider, LayoutHeader, LayoutContent, Button } from 'ant-design-vue';
import Menu from "@/layout/components/menu.vue";
import Header from "@/layout/components/header.vue";

</script>

<template>
    <Layout class="default-layout">
        <LayoutSider class="layout-sider">
            <Menu></Menu>
        </LayoutSider>
        <Layout class="layout-inner">
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
}

.layout-sider {
    user-select: none;
    position: fixed;
    left: 0;
    bottom: 0;
    top: 0;
    overflow: auto;
    background-color: #FFF;
}

.layout-header {
    user-select: none;
    padding: 0 20px;
    background-color: #f5f5f5;
    line-height: unset;
}

.layout-content {
    padding: 0 20px 20px 20px;
    background-color: #f5f5f5;
}
</style>