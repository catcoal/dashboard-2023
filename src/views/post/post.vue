<script setup lang="ts">
import DragImages from "@/components/DragImages/DragImages.vue";
import Editor, { backData } from "./components/editor.vue";
import { pinyin } from "pinyin-pro"
import { IPost, NewPost, PostStatus } from "@/api/post";
import { FetchTagList, ITag } from "@/api/tag";
import { FetchUserList, FetchMeInfo, IUser } from "@/api/user";
import { FormItem, Input, Textarea, Select, SelectOption, Button, Switch, Row, Col as ColItem, Form, Space, message } from 'ant-design-vue';
import { Rule } from "ant-design-vue/es/form";
import { onMounted, ref, computed } from "vue";

const postFormRef = ref();
const submitLoading = ref(false);
const FormData = ref<IPost>({
    title: '',
    enTitle: '',
    description: '',
    content: '',
    authorId: 0,
    tagIds: [],
    covers: [],
    status: 'Private' as PostStatus.Private,
    isRecommend: false,
    isTop: false,
    commentEnabled: false
});
const rules: Record<string, Rule[]> = {
    enTitle: [{ required: true, message: '请输入文章唯一标识', trigger: 'blur' }],
    title: [{ required: true, message: '请输入文章标题', trigger: 'change' }],
    description: [{ required: true, message: '请输入文章描述', trigger: 'change' }]
};
const adminList = ref<IUser[]>();
const tagList = ref<ITag[]>();

onMounted(async () => {
    // 获取当前用户
    FormData.value.authorId = (await FetchMeInfo()).data.id;
    getAdmin();
    getTag();
})
// 中文转拼音
const handleTitle = () => FormData.value.enTitle = (pinyin(FormData.value.title, { toneType: 'none', type: 'array' })).join('-');
// 获取管理员
const getAdmin = async () => { adminList.value = (await FetchUserList({ role: "Admin" })).data };
// 获取标签
const getTag = async () => { tagList.value = (await FetchTagList()).data };

// 编辑器输出
const handleEditorOutput = (payload: backData) => {
    if (payload.type == 'image') {
        FormData.value.covers?.push(payload.data.default)
    }
}

// 发布
const Post = async () => {
    postFormRef.value.validate().then(async () => {
        submitLoading.value = true;
        try {
            await NewPost(FormData.value)
            message.success('发文成功')
        } catch (err: any) {
            message.error(err || '网络错误')
        } finally {
            submitLoading.value = false;
        }
    }).catch(() => {
        message.error("请检查表单")
    })
}

// 发布草稿
const PostDraft = () => {
    FormData.value.status = 'Draft' as PostStatus.Draft;
}

</script>
<template>
    <Form ref="postFormRef" :model="FormData" :rules="rules">
        <Row :wrap="false" :gutter="20">
            <col-item :md="{ span: 10 }" :lg="{ span: 8 }">
                <FormItem label="唯一标识" name="enTitle">
                    <Textarea v-model:value="FormData.enTitle" autoSize></Textarea>
                </FormItem>
                <FormItem label="标题" name="title">
                    <Textarea @input="handleTitle" v-model:value="FormData.title" autoSize></Textarea>
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
                        <SelectOption v-for="(value, key) in PostStatus" :key="key" :value="key">
                            <p>{{ value }}</p>
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
                    <DragImages :urls="FormData.covers!" />
                </FormItem>
            </col-item>
            <col-item :md="{ span: 14 }" :lg="{ span: 16 }">
                <FormItem>
                    <Editor v-model="FormData.content" @output="handleEditorOutput"></Editor>
                </FormItem>
            </col-item>
        </Row>
    </Form>
    <div class="post-footer-mask">
        <div class="post-footer">
            <Button :loading="submitLoading" :type="'primary'" @click="Post">发布</Button>
            <Button :loading="submitLoading" :type="'default'" @click="PostDraft">保存草稿</Button>
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
    gap: 10px;
    justify-content: flex-end;
    background-color: rgba(245, 245, 245, 0.5);
    border-top: 1px solid rgba(245, 245, 245, 0.9);
    backdrop-filter: blur(5px);
}
</style>