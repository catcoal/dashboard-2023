<script setup lang="ts">
import ResourceItem from "./components/resource-item.vue"
import { onMounted, computed } from 'vue';
import { UploadFile } from "@/api/common"
import { ConvertSize } from "@/utils/utils"
import { FetchResources, Resource, FetchUsage, CreateFolder } from "@/api/resource"
import { ref, h } from 'vue';
import { Upload, Button, UploadChangeParam, UploadProps, Tag, Space, Spin, Modal, Input, message } from 'ant-design-vue';
import { useResource } from "@/stores/resource";
import { CaretLeftOutlined, LoadingOutlined } from "@ant-design/icons-vue";

const resourceStore = useResource();
const resources = ref<Resource[]>([]);
const resourceLoading = ref<boolean>(false);
const resourceIndicator = h(LoadingOutlined, {
    style: {
        fontSize: '24px'
    },
    spin: true,
});
const domain = computed(() => import.meta.env.VITE_APP_RESOURCE_DOMAIN);
const resourceSizeLoading = ref<boolean>(false);
const folderSize = ref<string>('0KB');
const uploadFileList = ref<UploadProps['fileList']>();
const currentFolder = computed(() => resourceStore.currentPath.join('') || '/');
const currentPath = computed(() => domain.value + currentFolder.value + '/');
const createFolderVisible = ref<boolean>(false);
const newFolderName = ref<string>('');

onMounted(() => {
    getUsage();
    getResources();
})

const getUsage = async () => {
    resourceSizeLoading.value = true;
    folderSize.value = ConvertSize((await FetchUsage(currentFolder.value)).data);
    resourceSizeLoading.value = false;
}

const getResources = async () => {
    resourceLoading.value = true;
    resources.value = (await FetchResources({ remotePath: currentFolder.value })).data!;
    resourceLoading.value = false;
}

// 打开文件夹
const openFolder = (resource: Resource) => {
    if (resource.type === 'N') return;
    resources.value = [];
    resourceStore.push(resource.name);
    getUsage();
    getResources();
}

// 选择文件
const select = (resource: Resource) => {
    if (resource.type === 'F') return
    resourceStore.selectFile(currentPath.value + resource.name);
}

// 返回上一个目录
const backLastFolder = () => {
    resources.value = [];
    resourceStore.back().then(() => {
        getUsage();
        getResources();
    })
}

// 创建文件夹
const createFolder = async () => {
    await CreateFolder(currentFolder.value === '/' ? newFolderName.value : currentFolder.value + "/" + newFolderName.value);
    message.success('创建成功');
    createFolderVisible.value = false;
    await getResources();
}

// 上传资源
const uploadResource = async (e: UploadChangeParam) => {
    let { name, size, lastModified } = e.file;
    let file = uploadFileList.value?.filter(file => file.name == name)[0];
    if (file) {
        try {
            let res = await UploadFile({
                name: currentFolder.value + '/' + file.name,
                file: e.file as unknown as File
            });
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
                <Button @click.stop="createFolderVisible = true" type="primary">
                    新建文件夹
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
            <span>已使用:
                {{ folderSize }}
                <LoadingOutlined v-show="resourceSizeLoading" />
            </span>
        </Tag>
    </div>
    <Spin :indicator="resourceIndicator" wrapperClassName="resource-container" :spinning="resourceLoading">
        <div class="resource-list">
            <ResourceItem @click="select(item)" @dblclick="openFolder(item)" :resource="item" :select-quality="50"
                v-for="item in resources"></ResourceItem>
        </div>
    </Spin>
    <Modal v-model:open="createFolderVisible" @ok="createFolder" title="新增文件夹" ok-text="新增" cancel-text="取消" width="400px">
        <Input v-model:value="newFolderName" placeholder="文件夹名称" />
    </Modal>
</template>

<style>
.ant-modal-confirm-content {
    width: 100%;
}
</style>

<style scoped>
.header-wrap {
    margin-bottom: 10px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
}

.resource-container {
    padding-bottom: 50px;
    min-height: 200px;
}

.resource-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 15%));
    gap: 20px 10px;
    justify-content: space-between;
}
</style>