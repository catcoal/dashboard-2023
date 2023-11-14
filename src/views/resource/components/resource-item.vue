<script setup lang="ts">
import FolderIcon from "@/assets/icons/folder.svg"
import { Resource, DeleteResource } from '@/api/resource';
import { ref, computed, h } from 'vue';
import { OptimizeImageURL, ConvertSize } from "@/utils/utils"
import { ThemeColor } from '@/config/app';
import { ParseTime } from "@/utils/date";
import { DeleteOutlined, LinkOutlined } from '@ant-design/icons-vue';
import { LemAntModal } from '@/utils/MyAnt';
import { message } from 'ant-design-vue';
import useClipboard from "vue-clipboard3";
import { useResource } from "@/stores/resource";


const resourceStore = useResource();
const { toClipboard } = useClipboard();
const props = defineProps<{
    resource: Resource
}>()
const currentFolder = computed(() => resourceStore.currentPath.join(''));
const domain = import.meta.env.VITE_APP_RESOURCE_DOMAIN;
const imageUrl = computed(() => {
    if (props.resource.type === 'N') {
        return props.resource.url || OptimizeImageURL(domain + currentFolder.value + '/' + props.resource.name, 20)
    } else {
        return FolderIcon;
    }
});

// 复制地址
const copyUrl = async () => {
    try {
        await toClipboard(props.resource.url || domain + currentFolder.value + '/' + props.resource.name);
        message.success('已复制地址到剪贴板')
    } catch (err: any) {
        message.error('复制失败')
    }
}

// 删除资源
const delResource = () => {
    LemAntModal({
        title: "提示",
        content: h('span', [
            h('span', '确认删除 '),
            h('b', {
                style: {
                    color: ThemeColor
                }
            }, props.resource.name),
            h('span', ' 吗?'),
            h('p', {
                style: {
                    color: 'tomato',
                    fontSize: '12px',
                }
            }, '此操作将会影响已发布文章内的资源，并且删除后将无法恢复!'),
        ]),
        okType: 'danger',
        okText: "删除",
        onOk: () => {
            // 二次确认
            LemAntModal({
                title: "再次确认",
                content: h('span', [
                    h('span', '再次确认删除 '),
                    h('b', {
                        style: {
                            color: 'tomato'
                        }
                    }, props.resource.name),
                    h('span', ' 吗?'),
                    h('p', {
                        style: {
                            color: 'tomato',
                            fontSize: '12px',
                        }
                    }),
                ]),
                okType: 'danger',
                okText: "确认删除",
                onOk: async () => {
                    try {
                        await DeleteResource(currentFolder.value + '/' + props.resource.name)
                        message.success('删除成功')
                    } catch (err: any) {
                        message.error('删除失败')
                    }
                }
            })
        }
    })
}
</script>

<template>
    <div class="resource-wrap" :title="resource.name">
        <div class="resource-cover">
            <div class="image-cover">
                <img :src="imageUrl" :alt="resource.name" srcset="">
            </div>
            <div class="cover-mask">
                <div class="resource-control">
                    <span @click="copyUrl" class="copy btn-active Stereobox">
                        <LinkOutlined />
                    </span>
                    <span @click="delResource" v-if="resource.type === 'N'" class="del btn-active Stereobox">
                        <DeleteOutlined />
                    </span>
                </div>
                <p class="size Stereobox">{{ resource.type === 'N' ? ConvertSize(resource.size) : '文件夹' }}</p>
            </div>
        </div>
        <div class="resource-infos">
            <p>{{ resource.name }}</p>
            <span>{{ ParseTime(resource.time * 1000) }}</span>
        </div>
    </div>
</template>

<style scoped>
.resource-wrap {
    /* overflow: hidden; */
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.resource-cover {
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 100%;
    user-select: none;
}

.resource-cover>.image-cover {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.image-cover>img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    display: block;
    border-radius: 10px;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
}

.cover-mask {
    position: absolute;
    z-index: 2;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
}

.resource-wrap:hover .btn-active {
    opacity: 1;
}

.resource-control {
    position: absolute;
    top: 5px;
    right: 5px;
    color: #FFF;
    display: flex;
    align-items: center;
    gap: 5px;
}

.resource-control>span {
    cursor: pointer;
    width: 25px;
    height: 25px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    --Stereo-radius: 50%;
}

.resource-control>.copy {
    background-color: #eee;
    color: #000;
}

.resource-control>.del {
    background-color: tomato;
}

.cover-mask>.size {
    position: absolute;
    right: 5px;
    bottom: 5px;
    font-size: 12px;
    background-color: v-bind(ThemeColor);
    color: #FFF;
    padding: 2px 5px;
    border-radius: 5px;
    --Stereo-radius: 5px;
}

.btn-active {
    opacity: 0;
    transition: .3s ease;
    transition-property: transform, opacity;
}

.btn-active:active {
    transform: scale(0.95);
}

.resource-infos {
    white-space: nowrap;
    text-overflow: ellipsis;
    width: 100%;
    overflow: hidden;
    text-align: center;
    opacity: 0.8;
}

.resource-infos>p {
    font-weight: 500;
    font-size: 12px;
    overflow: hidden;
    text-overflow: ellipsis;
}

.resource-infos>span {
    font-size: 10px;
    background-color: #ffffff;
    padding: 2px 5px;
    border-radius: 5px;
}
</style>