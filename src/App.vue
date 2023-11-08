<script setup lang="ts">
import { ConfigProvider } from "ant-design-vue";
import { ThemeColor } from "@/config/app";
</script>

<template>
  <ConfigProvider :theme="{ token: { colorPrimary: ThemeColor } }">
    <RouterView></RouterView>
  </ConfigProvider>
</template>

<style></style>
