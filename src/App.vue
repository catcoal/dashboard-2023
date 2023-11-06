<script setup lang="ts">
import Layout from "@/layout/default.vue"
import { ConfigProvider } from "ant-design-vue";
</script>

<template>
  <ConfigProvider :theme="{ token: { colorPrimary: '#00b96b' } }">
    <RouterView></RouterView>
    <!-- <Layout></Layout> -->
  </ConfigProvider>
</template>

<style scoped></style>
