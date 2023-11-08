<template>
    <div class="drag-container">
        <div v-for="(item, index) in urls" :key="index" class="drag-item Stereobox" @dragstart="startDrag(index, $event)"
            @dragover="dragOver(index, $event)" @dragend="endDrag" draggable>
            <DeleteOutlined @click.stop="delImage(index)" class="del" />
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
            <div class="ant-upload-text">
                <p>上传{{ isUploading ? '中...' : '' }}</p>
                <span>(拖放上传)</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, toRef, computed } from 'vue';
import { PlusOutlined, LoadingOutlined, DeleteOutlined } from '@ant-design/icons-vue';
import { UploadFile, ResFile } from "@/api/common";
import { IResultData } from '@/utils/MyFetch';
import { LemAntModal } from '@/utils/MyAnt';
import { ThemeColorRgb } from '@/config/app';

const props = defineProps<{ urls: string[] }>();
const emit = defineEmits(['Success']);
const isUploading = ref(false);
const items = computed(() => props.urls);

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
        props.urls.push(...res.map(item => item.data!.fileUrl));
        emit('Success', props.urls);
    } catch (err: any) {
        LemAntModal({
            title: "错误",
            content: err
        })
    } finally {
        isUploading.value = false;
    }
}

// 删除图片
const delImage = (index: number) => {
    props.urls.splice(index, 1);
}

// 拖拽排序
let draggingIndex = ref(-1);
let showLine = ref(-1);
let showLineBefore = ref(true);

const startDrag = (index: number, event: DragEvent) => {
    let target = event.target as HTMLElement;
    let dragItemEl = target.closest('.drag-item');
    if (event.dataTransfer && dragItemEl) {
        event.dataTransfer.effectAllowed = 'copy';
        event.dataTransfer.dropEffect = 'link';
        event.dataTransfer.setDragImage(dragItemEl, 0, 0);
        draggingIndex.value = index;
    }
};
// https://gw.alipayobjects.com/zos/k/mi/152.jpg?x-oss-process=image/resize,w_640/format,webp
const dragOver = (index: number, event: DragEvent) => {
    event.preventDefault();
    const dragging = draggingIndex.value;
    if (index !== dragging && dragging >= 0) {
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

.del {
    position: absolute;
    z-index: 2;
    color: #FFF;
    padding: 5px;
    border-radius: 50%;
    top: 5px;
    right: 5px;
    background-color: tomato;
}

.upload-item {
    position: relative;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    flex-direction: column;
    gap: 5px;
    border: 1px dashed #999;
    color: #666;
    border-radius: 10px;
    font-weight: bold;
    min-height: 100px;
}

.upload-item:hover {
    border-color: rgba(v-bind(ThemeColorRgb), 1);
    background-color: rgba(v-bind(ThemeColorRgb), 0.1);
}

.upload-item>span {
    margin-top: 20px;
}


.ant-upload-text {
    text-align: center;
    font-size: 12px;
}

.ant-upload-text>span {
    opacity: 0.5;
    font-size: 12px;
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
  