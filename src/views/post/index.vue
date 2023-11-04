<script setup lang="ts">
import { Table, TableColumnsType, TableProps, Tag } from 'ant-design-vue';
import { FetchPostList, PostStatus, ResPost } from "@/api/post";
import { onMounted, ref } from 'vue';

const columns: TableColumnsType = [
    {
        title: "封面",
        dataIndex: "covers",
        // width: "1000px"
    },
    {
        title: "ID",
        dataIndex: "id",
    },
    {
        title: "状态",
        dataIndex: "status",
    },
    {
        title: "标题",
        dataIndex: "title",
        // width: "60%",
    },
    {
        title: "置顶?",
        dataIndex: "isTop",
    },
    {
        title: "评论?",
        dataIndex: "commentEnabled",
    },
    {
        title: "推荐?",
        dataIndex: "isRecommend"
    }
];

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
</script>

<template>
    <Table :loading="tableLoading" :scroll="{ x: true }" :row-key="record => record.id" :columns="columns"
        :pagination="pagination" :data-source="tableData" @change="handleTableChange" :expand-column-width="60">
        <template #expandColumnTitle>
            更多
        </template>
        <template #expandedRowRender="{ record }">
            <span>
                {{ record.description }}
            </span>
        </template>
        <template #bodyCell="{ column, record, text }">
            <template v-if="column.dataIndex == 'status'">
                <Tag :color="text === 'Publish' ? 'green' : 'default'">{{ PostStatus[text as keyof typeof PostStatus] }}
                </Tag>
            </template>
            <template v-if="column.dataIndex == 'authorUrl'">
                <a :href="text" target="_blank">{{ text }}</a>
            </template>
            <template v-if="column.dataIndex == 'isTop'">
                <Tag :color="text ? 'success' : 'default'">{{ text ? '已置顶' : '未置顶' }}
                </Tag>
            </template>
            <template v-if="column.dataIndex == 'commentEnabled'">
                <Tag :color="text ? 'success' : 'default'">{{ text ? '已开启' : '未开启' }}
                </Tag>
            </template>
            <template v-if="column.dataIndex == 'isRecommend'">
                <Tag :color="text ? 'success' : 'default'">{{ text ? '已推荐' : '未推荐' }}
                </Tag>
            </template>
        </template>
    </Table>
</template>

<style scoped></style>