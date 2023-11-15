<script setup lang="ts">
import { FetchTagList, ITag } from "@/api/tag"
import { onMounted, ref, computed } from 'vue';
import TagPart from "./components/tag-part.vue";

const AllTags = ref<ITag[]>();
const Category = computed(() => AllTags.value?.filter(item => item.type === "Category"));
const ArticleTag = computed(() => AllTags.value?.filter(item => item.type === 'ArticleTag'));

onMounted(async () => {
    AllTags.value = (await FetchTagList()).data;
});

</script>

<template>
    <div class="tag-container">
        <!-- <TagPart type="Category" label="分类" :data="Category!"></TagPart> -->
        <TagPart type="ArticleTag" label="标签" :data="ArticleTag!"></TagPart>
    </div>
</template>

<style scoped>
.tag-container {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
}
</style>