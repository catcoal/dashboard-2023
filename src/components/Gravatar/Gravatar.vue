<template>
    <Image :width="'100%'" :src="Gravatar" />
</template>

<script setup lang="ts">
import { Image } from "ant-design-vue";
import { computed } from "vue";
import { md5 } from "js-md5";

const props = defineProps({
    email: {
        type: String
    },
    emailHash: {
        type: String
    }
})

const GravatarOptions = {
    size: 80, // 头像的大小
    // identicon:几何; monsterid:怪物; wavatar:卡通; retro:像素; robohash:机器人; 
    default: 'monsterid', // 默认图像
    rating: 'g' // 强制显示头像的特定评级
}

const Gravatar = computed(() => {
    let emailHash = props.emailHash;
    if (!emailHash) {
        emailHash = md5(props.email!.trim().toLowerCase());
    };
    return `https://seccdn.libravatar.org/gravatarproxy/${emailHash}` +
        `?size=${GravatarOptions.size}` +
        `&default=${GravatarOptions.default}` +
        `&rating=${GravatarOptions.rating}`;
})
</script>

<style scoped></style>