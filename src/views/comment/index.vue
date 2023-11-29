<script setup lang="ts">
import { Table, TableColumnsType, TableProps, Tag, Button, message, Space } from 'ant-design-vue';
import { FetchComments, UpdateComment, DeleteComment, CommentStatus, Comment, CommentStatusType } from "@/api/comment";
import { h, onMounted, ref } from 'vue';
import { LemAntModal } from '@/utils/MyAnt';
import { ThemeColor } from "@/config/app";
import { ParseTime } from "@/utils/date";

const columns: TableColumnsType = [
    {
        title: "ID",
        dataIndex: "id",
    },
    {
        title: "评论",
        dataIndex: "content"
    },
    {
        title: "作者",
        dataIndex: "user",
    },
    {
        title: "文章",
        dataIndex: "post",
    },
    {
        title: "评论时间",
        dataIndex: "createdAt",
    },
    {
        title: "状态",
        dataIndex: "status",
    },
    {
        title: "操作",
        dataIndex: "operation"
    }
];

const statusLoading = ref<boolean>(false);
const tableData = ref<Comment[]>();
const tableLoading = ref<boolean>(false);
const pagination = ref({
    total: 0,
    current: 1,
    pageSize: 5
})

onMounted(() => {
    FetchTableData();
})

const Comment = {
    // 更新状态
    async UpdateStatus(data: Comment, status: CommentStatusType) {
        statusLoading.value = true;
        try {
            await UpdateComment({
                id: data.id,
                status: status,
            })
            data.status = status;
        } catch (err: any) {

        } finally {
            statusLoading.value = false;
        }
    },
    // 删除
    del(data: Comment) {
        LemAntModal({
            title: "提示",
            content: h('span', [
                h('span', '确认删除评论 '),
                h('b', {
                    style: {
                        color: ThemeColor
                    }
                }, data.content),
                h('span', ' 吗?'),
            ]),
            okType: 'danger',
            onOk: async () => {
                try {
                    await DeleteComment(data.id);
                    tableData.value = tableData.value?.filter(item => item.id !== data.id);
                    message.error('删除成功')
                } catch (err: any) {
                    message.error('删除失败')
                }
            }
        })
    }
}


const handleTableChange: TableProps['onChange'] = (pag, filters, sorter) => {
    pagination.value.current = pag.current!;
    FetchTableData();
}

const FetchTableData = async () => {
    tableLoading.value = true;
    try {
        const { data, meta } = await FetchComments({
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


</script>

<template>
    <Table :loading="tableLoading" :scroll="{ x: true }" :row-key="record => record.id" :columns="columns"
        :pagination="pagination" :data-source="tableData" @change="handleTableChange">
        <template #expandedRowRender="{ record }">
            <div class="detail-wrap">
                <div class="parent-info">
                    <span>父ID:{{ record.parent?.id || '空' }}</span>
                    <span>父评论:{{ record.parent?.content || '空' }}</span>
                </div>
                <p>回复：{{ record.content }}</p>
            </div>
        </template>
        <template #bodyCell="{ column, record, text }">
            <template v-if="column.dataIndex == 'email'">
                <div class="email-wrap">
                    <div class="avatar">
                        <Gravatar :email="text"></Gravatar>
                    </div>
                    <span>{{ text }}</span>
                </div>
            </template>
            <template v-else-if="column.dataIndex == 'content'">
                <p class="comment-text">{{ record.content }}</p>
            </template>
            <template v-else-if="column.dataIndex == 'user'">
                <p>{{ record.author?.author || '该账户已删除' }}</p>
            </template>
            <template v-else-if="column.dataIndex == 'post'">
                <p>{{ record.post.title }}</p>
            </template>
            <template v-else-if="column.dataIndex == 'status'">
                <Tag :color="text === 'Show' ? 'green' : 'default'">{{ CommentStatus[text as keyof typeof CommentStatus] }}
                </Tag>
            </template>
            <template v-else-if="column.dataIndex == 'createdAt'">
                <p>{{ ParseTime(text) }}</p>
            </template>
            <template v-else-if="column.dataIndex == 'operation'">
                <Space :size="5">
                    <Button :loading="statusLoading" @click="Comment.UpdateStatus(record as Comment, 'Show')"
                        v-if="['Rubbish', 'Hide', 'Unreviewed'].includes(record.status)" size="small"
                        type="primary">展示</Button>
                    <Button :loading="statusLoading" @click="Comment.UpdateStatus(record as Comment, 'Rubbish')"
                        v-if="record.status === 'Unreviewed'" size="small" type="dashed" danger>垃圾</Button>
                    <Button :loading="statusLoading" @click="Comment.UpdateStatus(record as Comment, 'Hide')"
                        v-if="record.status === 'Show'" size="small" type="dashed" danger>隐藏</Button>
                    <Button @click="Comment.del(record as Comment)" size="small" type="text" danger>删除</Button>
                </Space>
            </template>
        </template>
    </Table>
</template>

<style scoped>
.header-wrap {
    margin-bottom: 10px;
}

.email-wrap {
    display: flex;
    align-items: center;
    gap: 5px;
}

.avatar {
    width: 30px;
    height: 30px;
    border-radius: 5px;
    overflow: hidden;
}

.detail-wrap>p {
    font-weight: bold;
    white-space: pre-wrap;
    word-break: break-word;
}

.parent-info {
    font-size: 12px;
    display: flex;
    gap: 10px;
    opacity: 0.8;
}

.comment-text {
    font-weight: bold;
    max-width: 200px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>