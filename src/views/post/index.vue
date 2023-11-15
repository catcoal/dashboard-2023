<script setup lang="ts">
import { ThemeColor, ThemeColorRgb } from '@/config/app';
import { Space, Table, TableColumnsType, TableProps, Tag, Image, ImagePreviewGroup, Button, message, Switch } from 'ant-design-vue';
import { FileImageOutlined, MessageOutlined, TeamOutlined } from '@ant-design/icons-vue';
import { DelPost, FetchPostList, IPost, PostStatus, ResPost, UpdatePost } from "@/api/post";
import { onMounted, ref, h } from 'vue';
import { LemAntModal } from '@/utils/MyAnt';
import { useRouter } from 'vue-router';
import { OptimizeImageURL } from "@/utils/utils"

const router = useRouter();
const columns: TableColumnsType = [
    {
        title: "封面",
        dataIndex: "covers",
        width: 80
    },
    {
        title: "数据",
        dataIndex: "otherInfo",
        width: 80,
        ellipsis: true
    },
    {
        title: "ID",
        dataIndex: "id",
        width: 80,
    },
    {
        title: "状态",
        dataIndex: "status",
        width: 80
    },
    {
        title: "标题",
        dataIndex: "title",
        ellipsis: true
    },
    {
        title: "置顶?",
        dataIndex: "isTop",
        width: 80,
    },
    {
        title: "评论?",
        dataIndex: "commentEnabled",
        width: 80,
    },
    {
        title: "推荐?",
        dataIndex: "isRecommend",
        width: 80,
    },
    {
        title: "操作",
        dataIndex: "operation",
        fixed: 'right',
        width: 100,
    }
];

const comLoading = ref(false);
const tableData = ref<ResPost[]>();
const tableLoading = ref(false);
const pagination = ref({
    total: 0,
    current: 1,
    pageSize: 5
})

onMounted(() => {
    tableLoading.value = true;
    FetchTableData();
})

const handleTableChange: TableProps['onChange'] = (pag, filters, sorter) => {
    pagination.value.current = pag.current!;
    FetchTableData();
}

// 切换状态
const switchStatus = async (type: 'isTop' | 'commentEnabled' | 'isRecommend', data: ResPost) => {
    comLoading.value = true;
    try {
        let updateData: {
            [key: string]: any
        } = {
            id: data.id
        };
        updateData[type] = data[type];
        await UpdatePost(updateData);
    } finally {
        comLoading.value = false;
    }
}

// 切换文章发布状态
const switchPostStatus = async (type: keyof typeof PostStatus, data: ResPost) => {
    comLoading.value = true;
    data.status = type as PostStatus;
    try {
        await UpdatePost({
            id: data.id,
            status: type as PostStatus
        });
    } finally {
        comLoading.value = false;
    }
}

// 获取数据
const FetchTableData = async () => {
    try {
        const { data, meta } = await FetchPostList({
            page: pagination.value.current,
            pageSize: pagination.value.pageSize
        });
        let { totalCount } = meta;
        tableData.value = data;
        pagination.value.total = totalCount;
    } catch (err: any) {
        console.log(err)
    } finally {
        tableLoading.value = false;
    }
}

// 前往更新
const toUpadte = (post: ResPost) => {
    router.push('/post_mange/post/' + post.id)
}

// 删除文章
const handleDelPost = (post: ResPost) => {
    LemAntModal({
        title: "提示",
        content: h('span', [
            h('span', '确认删除 '),
            h('b', {
                style: {
                    color: ThemeColor
                }
            }, post.title),
            h('span', ' 吗?'),
        ]),
        okType: 'danger',
        onOk: async () => {
            try {
                await DelPost(post.id)
                message.success('删除成功')
                FetchTableData()
            } catch (err: any) {
                console.log(err)
            }
        }
    })
}
</script>

<template>
    <Table :loading="tableLoading" :scroll="{ x: true }" :row-key="record => record.id" :columns="columns"
        :pagination="pagination" :data-source="tableData" @change="handleTableChange" :expand-column-width="60">
        <template #expandColumnTitle></template>
        <template #expandedRowRender="{ record }">
            <div class="post-detail-wrap">
                <div class="covers-wrap" v-if="record.covers.length">
                    <ImagePreviewGroup>
                        <Image :width="80" v-for="cover in record.covers" :src="OptimizeImageURL(cover, 20)"></Image>
                    </ImagePreviewGroup>
                </div>
                <p>{{ record.description }}</p>
            </div>
        </template>
        <template #bodyCell="{ column, record, text }">
            <template v-if="column.dataIndex == 'covers'">
                <div class="cover-wrap">
                    <p class="Stereobox" v-if="text.length > 1">{{ text.length }}</p>
                    <Image v-if="text.length" :width="80" :src="OptimizeImageURL(text[0], 20)"></Image>
                    <FileImageOutlined v-else />
                </div>
            </template>
            <template v-if="column.dataIndex == 'otherInfo'">
                <Space :direction="'vertical'">
                    <Tag>
                        <template #icon>
                            <TeamOutlined />
                        </template>
                        {{ record.viewCount }}
                    </Tag>
                    <Tag>
                        <template #icon>
                            <MessageOutlined />
                        </template>
                        {{ record.commentCount }}
                    </Tag>
                </Space>
            </template>
            <template v-if="column.dataIndex == 'status'">
                <Tag :color="text === 'Publish' ? 'green' : 'default'">{{ PostStatus[text as keyof typeof PostStatus] }}
                </Tag>
            </template>
            <template v-if="column.dataIndex == 'authorUrl'">
                <a :href="text" target="_blank">{{ text }}</a>
            </template>
            <template v-if="column.dataIndex == 'isTop'">
                <Switch :loading="comLoading" @click="switchStatus('isTop', record as ResPost)"
                    v-model:checked="record.isTop" checked-children="YES" un-checked-children="NO" />
            </template>
            <template v-if="column.dataIndex == 'commentEnabled'">
                <Switch :loading="comLoading" @click="switchStatus('commentEnabled', record as ResPost)"
                    v-model:checked="record.commentEnabled" checked-children="YES" un-checked-children="NO" />
            </template>
            <template v-if="column.dataIndex == 'isRecommend'">
                <Switch :loading="comLoading" @click="switchStatus('isRecommend', record as ResPost)"
                    v-model:checked="record.isRecommend" checked-children="YES" un-checked-children="NO" />
            </template>
            <template v-if="column.dataIndex == 'operation'">
                <Space>
                    <Button @click="switchPostStatus('Publish', record as ResPost)" v-if="record.status !== 'Publish'"
                        type="primary" size="small">发布</Button>
                    <Button @click="switchPostStatus('Draft', record as ResPost)" v-else type="dashed" danger
                        size="small">下撤</Button>
                    <Button @click="toUpadte(record as ResPost)" size="small">修改</Button>
                    <Button @click="handleDelPost(record as ResPost)" size="small" type="text" danger>删除</Button>
                </Space>
            </template>
        </template>
    </Table>
</template>

<style scoped>
:deep(.ant-image) {
    background-color: #eee;
    overflow: hidden;
    position: relative;
    border: 1px solid rgba(0, 0, 0, 0.08);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
    z-index: 2;
    --Stereo-radius: 5px;
    border-radius: var(--Stereo-radius);
}

:deep(.ant-image::before) {
    content: "";
    position: absolute;
    top: 0px;
    left: 0px;
    bottom: 0px;
    right: 0px;
    border-radius: calc(var(--Stereo-radius) - 1px);
    border: 1px solid hsla(0, 0%, 100%, 0.22);
    pointer-events: none;
    mask-image: linear-gradient(0deg, transparent, #000);
    -webkit-mask-image: linear-gradient(0deg, transparent, #000);
    z-index: 1;
}

.cover-wrap {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
}

.cover-wrap>p {
    position: absolute;
    top: 5px;
    right: 5px;
    z-index: 5;
    height: 20px;
    min-width: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #FFF;
    border-radius: 50%;
    background-color: rgba(v-bind(ThemeColorRgb), 1);
    font-size: 12px;
}

.cover-wrap>span {
    background-color: #eee;
    padding: 10px;
    opacity: 0.5;
}

.post-detail-wrap {
    display: flex;
    flex-direction: column;
    gap: 10px;
    font-size: 12px;
    font-weight: bold;
}

.covers-wrap {
    display: flex;
    align-items: center;
    gap: 10px;
}
</style>