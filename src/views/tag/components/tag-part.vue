<script setup lang="ts">
import { ITag, PostTag, DelTag, TagType } from "@/api/tag"
import { Tag, Space, Input, Button, Divider, Spin } from "ant-design-vue";
import { PresetColors } from "ant-design-vue/es/theme/internal";
import { LemAntModal } from "@/utils/MyAnt";
import { ref, watch } from "vue";

const RandomColor = () => { return PresetColors[Math.floor(Math.random() * PresetColors.length)] };
const props = defineProps<{
    type: TagType,
    label: string,
    data: ITag[]
}>();
const spinning = ref(true);
const postLoading = ref(false);
const inputValue = ref('');
const tagData = ref<ITag[]>([]);

watch(() => props.data, (nValue) => {
    spinning.value = false;
    tagData.value = nValue;
})

const addTag = async () => {
    postLoading.value = true;
    try {
        const tag = (await PostTag({
            type: props.type!,
            name: inputValue.value
        })).data;
        tagData.value.push(tag as ITag);
        inputValue.value = '';
    } catch (err: any) {

    } finally {
        postLoading.value = false;
    }
}

const handleDel = (item: ITag, index: number) => {
    LemAntModal({
        title: "确认删除 <" + item.name + "/> 标签吗?",
        cancelText: '取消',
        okText: '删除',
        okType: 'danger',
        onOk: async () => {
            await DelTag(item.id!);
            tagData.value.splice(index, 1);
        }
    });
}
</script>

<template>
    <Spin :spinning="spinning">
        <div class="tag-part Stereobox">
            <div class="part-header">
                <h2>{{ label }}</h2>
                <Divider type="vertical"></Divider>
                <Space :size="10">
                    <Input @keydown.enter="addTag" v-model:value="inputValue" placeholder="标签名" />
                    <Button :loading="postLoading" @click="addTag" type="primary">添加</Button>
                </Space>
            </div>
            <div class="tag-list">
                <Tag @close.prevent="handleDel(item, index)" closable v-for="(item, index) in tagData"
                    :color="RandomColor()" :key="item.id">{{ item.name }}</Tag>
            </div>
        </div>
    </Spin>
</template>

<style scoped>
.tag-part {
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
    background-image: linear-gradient(120deg, #e6f9ec -100%, transparent);
    padding: 10px;
    border-radius: var(--Stereo-radius);
}

.part-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.part-header>h2 {
    font-size: 20px;
    font-weight: bold;
    opacity: 0.9;
}

.tag-list {
    display: flex;
    flex-wrap: wrap;
    gap: 10px 0;
}

.ant-tag {
    font-size: 16px;
    line-height: 30px;
    padding: 0 10px;
}
</style>