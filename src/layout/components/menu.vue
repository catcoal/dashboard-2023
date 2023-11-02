<script setup lang="ts">
import { MailOutlined, AppstoreOutlined, SettingOutlined } from '@ant-design/icons-vue';
import { Menu, ItemType, MenuProps } from 'ant-design-vue';
import { reactive, VueElement, h, computed, ref, onMounted } from 'vue';
import { useRouter, useRoute, RouteRecordRaw, RouteMeta } from "vue-router"

const router = useRouter();
const route = useRoute();

const routes = computed(() => router.options.routes as RouteRecordRaw[]);
const items: ItemType[] = reactive(transformRoutes(routes.value));
const selectedMenuKeys = ref<string[]>([]);

onMounted(async () => {
    await router.isReady();
    selectedMenuKeys.value = [route.name as string];
})

// 转路由
function transformRoutes(routes: RouteRecordRaw[]): ItemType[] {
    return routes
        .filter((route) => route.meta) // 存在meta则渲染
        .map((route) => {
            const { name, meta, children, path } = route;
            const { icon, label } = meta!;
            return {
                key: name,
                icon: icon || '',
                label,
                children: children && children.length > 0 ? transformRoutes(children) : undefined,
            } as ItemType;
        });
}

const handleClick: MenuProps["onClick"] = (e) => {
    selectedMenuKeys.value = [e.key as string];
    router.push({
        name: e.key as string
    })
}


// const items: ItemType[] = reactive([
//     getItem('Navigation One', 'sub1', () => h(MailOutlined), [
//         getItem('Item 1', 'g1', null, [getItem('Option 1', '1'), getItem('Option 2', '2')], 'group'),
//         getItem('Item 2', 'g2', null, [getItem('Option 3', '3'), getItem('Option 4', '4')], 'group'),
//     ]),
// ]);
</script>

<template>
    <Menu :selected-keys="selectedMenuKeys" :items="items" mode="inline" @click="handleClick"></Menu>
</template>

<style scoped></style>