<script setup lang="ts">
import ResourceItem from "./components/resource-item.vue"
import { onMounted } from 'vue';
import { UploadFile } from "@/api/common"
import { FetchResources, Resource } from "@/api/resource"
import { ref } from 'vue';
import { Upload, Button, UploadChangeParam, UploadProps } from 'ant-design-vue';

const resources = ref<Resource[]>([]);
const uploadFileList = ref<UploadProps['fileList']>();
const currentFolder = ref<string>('/blog');

onMounted(async () => {
    resources.value = (await FetchResources({ remotePath: currentFolder.value })).data!;
})

// 上传资源
const uploadResource = async (e: UploadChangeParam) => {
    let { name, size, lastModified } = e.file;
    let file = uploadFileList.value?.filter(file => file.name == name)[0];
    if (file) {
        try {
            file.status = 'uploading';
            let res = await UploadFile({ file: e.file as unknown as File });
            // 上传完成
            resources.value.push({
                name,
                url: res.data?.fileUrl,
                size: size as number,
                time: lastModified! / 1000 as number,
                type: 'N'
            })
            file.status = 'done';
        } catch (err: any) {
            // 上传失败
            file.status = 'error';
            file.error = err || '上传失败';
        }
    }
}
</script>

<template>
    <div class="header-wrap">
        <Upload name="file" v-model:file-list="uploadFileList" @change="uploadResource" multiple
            :beforeUpload="() => { return false }" :listType="'picture'">
            <Button type="primary">
                上传素材
            </Button>
        </Upload>
    </div>
    <div class="resource-container">
        <div class="resource-list">
            <ResourceItem :resource="item" v-for="item in resources"></ResourceItem>
        </div>
    </div>
</template>

<style scoped>
.header-wrap {
    margin-bottom: 10px;
}

.resource-container {
    padding-bottom: 100px;
}

.resource-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 15%));
    gap: 20px 10px;
    justify-content: space-between;
}
</style>