<script setup lang="ts">
import DragImages from "@/components/DragImages/DragImages.vue";
import { IPost, NewPost, PostStatus } from "@/api/post";
import { FetchTagList, ITag } from "@/api/tag";
import { FetchUserList, FetchMeInfo, IUser } from "@/api/user";
import { FormItem, Input, Textarea, Select, SelectOption, Button, Switch, Row, Col as ColItem, Form, Space } from 'ant-design-vue';
import { onMounted, ref, computed } from "vue";
import Editor from "./components/editor.vue";

const FormData = ref<IPost>({
    title: '',
    description: '',
    content: '',
    authorId: 0,
    tagIds: [],
    covers: '',
    status: PostStatus['Draft'],
    isRecommend: false,
    isTop: false,
    commentEnabled: false
});
const covers = ref<string[]>([]);
const adminList = ref<IUser[]>();
const tagList = ref<ITag[]>();

onMounted(async () => {
    // 获取当前用户
    FormData.value.authorId = (await FetchMeInfo()).data.id;
    getAdmin();
    getTag();
})

// 获取管理员
const getAdmin = async () => {
    try {
        adminList.value = (await FetchUserList({
            role: "Admin"
        })).data
    } catch (err: any) {

    }
}

// 获取标签
const getTag = async () => {
    tagList.value = (await FetchTagList()).data;
}

const Post = () => {
    FormData.value.covers = covers.value.join(',');
    console.log(FormData.value)
    // NewPost(FormData.value)
}

</script>
<template>
    <Form :model="FormData">
        <Row :gutter="10">
            <col-item :flex="1">
                <FormItem label="标题">
                    <Input v-model:value="FormData.title" />
                </FormItem>
                <FormItem label="描述">
                    <Textarea v-model:value="FormData.description" autoSize></Textarea>
                </FormItem>

                <FormItem label="标签">
                    <Select placeholder="请选择标签" :allowClear="true" :showArrow="true" mode="multiple"
                        v-model:value="FormData.tagIds">
                        <SelectOption v-for="tag in tagList" :key="tag.id" :value="tag.id">
                            <p>{{ tag.name }}</p>
                        </SelectOption>
                    </Select>
                </FormItem>
                <FormItem label="作者">
                    <Select v-model:value="FormData.authorId">
                        <SelectOption v-for="user in adminList" :key="user.id" :value="user.id">
                            <h2>{{ user.author }}</h2>
                            <p>{{ user.email }}</p>
                        </SelectOption>
                    </Select>
                </FormItem>
                <FormItem label="状态">
                    <Select v-model:value="FormData.status">
                        <SelectOption v-for="statu in PostStatus" :key="statu" :value="statu">
                            <p>{{ statu }}</p>
                        </SelectOption>
                    </Select>
                </FormItem>
                <Space :size="30">
                    <FormItem label="置顶?">
                        <Switch v-model:checked="FormData.isTop"></Switch>
                    </FormItem>
                    <FormItem label="推荐?">
                        <Switch v-model:checked="FormData.isRecommend"></Switch>
                    </FormItem>
                    <FormItem label="评论?">
                        <Switch v-model:checked="FormData.commentEnabled"></Switch>
                    </FormItem>
                </Space>
                <FormItem label="封面">
                    <DragImages :urls="covers" />
                </FormItem>
            </col-item>
            <col-item :flex="9">
                <FormItem>
                    <Editor></Editor>
                    <!-- <Textarea v-model:value="FormData.content" autosize></Textarea> -->
                </FormItem>
            </col-item>
        </Row>
    </Form>
    <div class="post-footer-mask">
        <div class="post-footer">
            <Button :type="'primary'" @click="Post">发布</Button>
        </div>
    </div>
</template>

<style scoped>
.ant-select-selection-item>h2 {
    font-size: 14px;
    font-weight: 400;
    display: inline;
    margin-right: 10px;
}

.ant-select-selection-item>p {
    display: inline;
    opacity: 0.6;
    font-size: 12px;
}

.ant-select-item h2 {
    font-size: 16px;
    font-weight: 500;
}

.ant-select-item p {
    font-size: 12px;
    opacity: 0.5;
}

.post-footer-mask {
    height: 50px;
}

.post-footer {
    position: fixed;
    bottom: 10px;
    margin-right: 20px;
    border-radius: 10px;
    overflow: hidden;
    height: 50px;
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    background-color: rgba(245, 245, 245, 0.5);
    border-top: 1px solid rgba(245, 245, 245, 0.9);
    backdrop-filter: blur(5px);
}
</style>