<script setup lang="ts">
import Gravatar from "@/components/Gravatar/Gravatar.vue"
import AddUserPop from './components/add-user-pop.vue';
import { Table, TableColumnsType, TableProps, Tag, Button, message } from 'ant-design-vue';
import { FetchUserList, IUser, DelUser } from "@/api/user";
import { h, onMounted, ref } from 'vue';
import { LemAntModal } from '@/utils/MyAnt';
import { ThemeColor } from "@/config/app";

const showAddUserForm = ref(false);
const columns: TableColumnsType = [
    {
        title: "ID",
        dataIndex: "id",
    },
    {
        title: "用户名",
        dataIndex: "author",
    },
    // {
    //     title: "帐号",
    //     dataIndex: "account",
    // },
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
    },
    {
        title: "操作",
        dataIndex: "operation"
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
    FetchTableData();
})

// 新增用户
const AddUser = {
    pop() {
        showAddUserForm.value = true;
    },
    success() {
        showAddUserForm.value = false;
        FetchTableData();
    }
}

// 删除用户
const handleDelUser = (user: IUser) => {
    LemAntModal({
        title: "提示",
        content: h('span', [
            h('span', '确认删除 '),
            h('b', {
                style: {
                    color: ThemeColor
                }
            }, user.email),
            h('span', ' 用户吗?'),
        ]),
        okType: 'danger',
        onOk: async () => {
            try {
                await DelUser(user.id)
                message.success('删除成功')
                FetchTableData()
            } catch (err: any) {
                console.log(err)
            }
        }
    })
}

const handleTableChange: TableProps['onChange'] = (pag, filters, sorter) => {
    pagination.value.current = pag.current!;
    FetchTableData();
}

const FetchTableData = async () => {
    tableLoading.value = true;
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
    <div class="header-wrap">
        <Button @click="AddUser.pop" type="primary">新增用户</Button>
    </div>
    <Table :loading="tableLoading" :scroll="{ x: true }" :row-key="record => record.id" :columns="columns"
        :pagination="pagination" :data-source="tableData" @change="handleTableChange">
        <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex == 'email'">
                <div class="email-wrap">
                    <div class="avatar">
                        <Gravatar :email="record.email"></Gravatar>
                    </div>
                    <span>{{ record.email }}</span>
                </div>
            </template>
            <template v-else-if="column.dataIndex == 'authorUrl'">
                <a :href="record.authorUrl" target="_blank">{{ record.authorUrl }}</a>
            </template>
            <template v-else-if="column.dataIndex == 'role'">
                <Tag :color="record.role == 'Admin' ? 'green' : 'gold'">{{ record.role == 'Admin' ? '管理员' : '游客' }}
                </Tag>
            </template>
            <template v-else-if="column.dataIndex == 'operation'">
                <Button @click="handleDelUser(record as IUser)" size="small" type="text" danger>删除</Button>
            </template>
        </template>
    </Table>
    <AddUserPop @success="AddUser.success" :open="showAddUserForm" @cancel="showAddUserForm = false"></AddUserPop>
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
</style>