<script setup lang="ts">
import { Button } from "ant-design-vue"
import { CommentOutlined, BookOutlined, FileSearchOutlined, TeamOutlined, UserAddOutlined } from '@ant-design/icons-vue';
import UserBox from './components/user-box.vue';
import StatItem from './components/stat-item.vue';
import { FetchDashboardBasic, ResDashboardBasic } from "@/api/common";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const DashboardBasic = ref<ResDashboardBasic>();
onMounted(async () => {
    DashboardBasic.value = (await FetchDashboardBasic()).data;
})

const Post = {
    goWrite() {
        router.push('/post_mange/post');
    },
    goData() {
        router.push('/post_mange');
    }
}

const Comment = {
    goData(type: 'all' | 'unreviewed') {
        router.push('/comment?type=' + type);
    }
}
</script>

<template>
    <div class="dashboard-container">
        <div class="flex-warp">
            <UserBox class="box-item Stereobox"></UserBox>
        </div>
        <div class="flex-warp">
            <StatItem title="文章" :count="DashboardBasic?.post_count || 0">
                <template #icon>
                    <BookOutlined />
                </template>
                <template #footer>
                    <Button @click="Post.goWrite" type="primary" shape="round" size="small">撰写</Button>
                    <Button @click="Post.goData" type="text" shape="round" size="small">管理</Button>
                </template>
            </StatItem>
            <StatItem title="全部评论" :count="DashboardBasic?.comment_count || 0">
                <template #icon>
                    <CommentOutlined />
                </template>
                <template #footer>
                    <Button @click="Comment.goData('all')" type="primary" shape="round" size="small">管理</Button>
                </template>
            </StatItem>
            <StatItem :unread="DashboardBasic?.unreviewed_comment_count ? true : false" title="未审评论"
                :count="DashboardBasic?.unreviewed_comment_count || 0">
                <template #icon>
                    <FileSearchOutlined />
                </template>
                <template #footer>
                    <Button @click="Comment.goData('unreviewed')" type="primary" shape="round" size="small">查看</Button>
                </template>
            </StatItem>
            <StatItem title="友联" :count="0">
                <template #icon>
                    <TeamOutlined />
                </template>
                <template #footer>
                    <Button type="primary" shape="round" size="small">管理</Button>
                </template>
            </StatItem>
            <StatItem title="友联申请" :count="0">
                <template #icon>
                    <UserAddOutlined />
                </template>
                <template #footer>
                    <Button type="primary" shape="round" size="small">查看</Button>
                </template>
            </StatItem>
        </div>
    </div>
</template>

<style scoped>
.flex-warp {
    display: flex;
    /* grid-template-columns: repeat(auto-fill, 300px); */
    flex-wrap: wrap;
    margin-bottom: 20px;
    gap: 20px;
}
</style>