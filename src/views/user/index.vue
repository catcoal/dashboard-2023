<script setup lang="ts">
import { Table, TableColumnsType, TableProps, Tag } from 'ant-design-vue';
import { FetchUserList, IUser } from "@/api/user";
import { onMounted, ref } from 'vue';

const columns: TableColumnsType = [
    {
        title: "ID",
        dataIndex: "id",
    },
    {
        title: "用户名",
        dataIndex: "author",
    },
    {
        title: "帐号",
        dataIndex: "account",
    },
    {
        title: "邮箱",
        dataIndex: "email",
    },
    {
        title: "用户网页",
        dataIndex: "authorUrl"
    },
    {
        title: "ip",
        dataIndex: "authorIp",
    },
    {
        title: "规则",
        dataIndex: "role"
    }
];

const tableData = ref<IUser[]>();
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
        const { data, meta } = await FetchUserList({
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
        <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex == 'authorUrl'">
                <a :href="record.authorUrl" target="_blank">{{ record.authorUrl }}</a>
            </template>
            <template v-if="column.dataIndex == 'role'">
                <Tag :color="record.role == 'Admin' ? 'green' : 'gold'">{{ record.role == 'Admin' ? '管理员' : '游客' }}
                </Tag>
            </template>
        </template>
    </Table>
</template>

<style scoped></style>