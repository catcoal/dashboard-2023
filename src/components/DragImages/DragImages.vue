<template>
    <div class="drag-container">
        <div v-for="(item, index) in items" :key="index" class="drag-item Stereobox" @dragstart="startDrag(index, $event)"
            @dragover="dragOver(index, $event)" @dragend="endDrag" draggable="true">
            <span class="drag-line" :class="{ 'drag-line-highlight': showLine === index && showLineBefore }"></span>
            <div class="drag-item-inner">
                <img :src="item" alt="" srcset="">
            </div>
            <span class="drag-line" :class="{ 'drag-line-highlight': showLine === index && !showLineBefore }"></span>
        </div>
        <div class="upload-item">
            <input @change="uploadFile" multiple type="file" />
            <LoadingOutlined v-if="isUploading"></LoadingOutlined>
            <PlusOutlined v-else></PlusOutlined>
            <div class="ant-upload-text">上传{{ isUploading ? '中...' : '' }}</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, toRef } from 'vue';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue';
import { UploadFile, ResFile } from "@/api/common";
import { IResultData } from '@/utils/MyFetch';
import { LemAntModal } from '@/utils/MyAnt';

const props = defineProps<{ urls: string[] }>();
const emit = defineEmits(['Success']);
const isUploading = ref(false);
const items = toRef(props.urls);

// 上传文件
const uploadFile = async (e: Event) => {
    let target = (e as InputEvent).target as HTMLInputElement;
    let fileList = target.files as FileList;
    if (fileList.length <= 0) return;
    isUploading.value = true;
    const uploadPromises: any[] = [];
    Array.from(fileList).forEach(file => {
        uploadPromises.push(UploadFile({ file }));
    });
    try {
        let res: IResultData<ResFile>[] = await Promise.all(uploadPromises);
        items.value.push(...res.map(item => item.data!.fileUrl));
        emit('Success', items);
    } catch (err: any) {
        LemAntModal({
            title: "错误",
            content: err
        })
    } finally {
        isUploading.value = false;
    }
}

// 拖拽排序
let draggingIndex = ref(-1);
let showLine = ref(-1);
let showLineBefore = ref(true);

const startDrag = (index: number, event: DragEvent) => {
    if (event.dataTransfer) {
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', index.toString());
        draggingIndex.value = index;
    }
};

const dragOver = (index: number, event: DragEvent) => {
    event.preventDefault();
    const dragging = draggingIndex.value;
    if (index !== dragging) {
        const draggedItem = items.value[dragging];
        items.value.splice(dragging, 1);
        items.value.splice(index, 0, draggedItem);
        draggingIndex.value = index;
    }
    showLine.value = index;
    showLineBefore.value = event.offsetX < (event.target as HTMLElement).offsetWidth / 2;
};

const endDrag = () => {
    draggingIndex.value = -1;
    showLine.value = -1;
    emit('Success', items);
};
</script>
  
<style scoped>
.drag-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    justify-content: space-between;
    gap: 5px;
}

.drag-item {
    cursor: grab;
    position: relative;
    height: 0;
    padding-top: 100%;
    background-color: #eee;
    border-radius: 10px;
}

.upload-item {
    position: relative;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    flex-direction: column;
    gap: 10px;
    border: 1px dashed #999;
    color: #666;
    border-radius: 10px;
    font-weight: bold;
    min-height: 100px;
}

.upload-item>input {
    cursor: pointer;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    opacity: 0;
}

.drag-line {
    position: absolute;
    z-index: 2;
    top: 10%;
    bottom: 10%;
    width: 1px;
    background-color: #000;
    opacity: 0;
    transition: .3s ease;
    transition-property: opacity;
}

.drag-line.drag-line-highlight {
    opacity: 1;
}

.drag-line:first-child {
    left: -4px;
}

.drag-line:last-child {
    right: -4px;
}

.drag-item-inner {
    user-select: none;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 9px;
    overflow: hidden;
}

.drag-item-inner>img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
</style>
  