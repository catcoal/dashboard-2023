<script setup lang="ts">
import ResourceItem from "./components/resource-item.vue"
import { onMounted, computed } from 'vue';
import { UploadFile } from "@/api/common"
import { ConvertSize } from "@/utils/utils"
import { FetchResources, Resource, FetchUsage } from "@/api/resource"
import { ref } from 'vue';
import { Upload, Button, UploadChangeParam, UploadProps, Tag, Space, Spin } from 'ant-design-vue';
import { useResource } from "@/stores/resource";
import { CaretLeftOutlined } from "@ant-design/icons-vue";

const resourceStore = useResource();
const resources = ref<Resource[]>([]);
const resourceLoading = ref<boolean>(false);
const folderSize = ref<string>('0KB');
const uploadFileList = ref<UploadProps['fileList']>();
const currentFolder = computed(() => resourceStore.currentPath.join('') || '/');

onMounted(() => {
    getUsage();
    getResources();
})

const getUsage = async () => {
    folderSize.value = ConvertSize((await FetchUsage(currentFolder.value)).data);
}

const getResources = async () => {
    resourceLoading.value = true;
    resources.value = (await FetchResources({ remotePath: currentFolder.value })).data!;
    resourceLoading.value = false;
}

// 打开文件夹
const openFolder = (resource: Resource) => {
    if (resource.type === 'F') {
        resourceStore.push(resource.name);
        getUsage();
        getResources();
    }
}

// 返回上一个目录
const backLastFolder = () => {
    resources.value = [];
    resourceStore.back().then(() => {
        getUsage();
        getResources();
    })
}

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
            <Space>
                <Button type="primary">
                    上传素材
                </Button>
                <Tag @click.stop color="orange">
                    <span style="cursor: pointer;" @click="backLastFolder" v-show="resourceStore.hasBack">
                        <CaretLeftOutlined />
                    </span>
                    {{ currentFolder }}
                </Tag>
            </Space>
        </Upload>
        <Tag color="volcano">
            <a href="https://www.upyun.com/" target="_blank">upyun服务</a>
            <span>已使用:{{ folderSize }}</span>
        </Tag>
    </div>
    <div class="resource-container">
        <Spin :spinning="resourceLoading">
            <div class="resource-list">
                <ResourceItem @dblclick="openFolder(item)" :resource="item" v-for="item in resources"></ResourceItem>
            </div>
        </Spin>
    </div>
</template>

<style scoped>
.header-wrap {
    margin-bottom: 10px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
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