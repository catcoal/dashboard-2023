<script setup lang="ts">
import DragImages from "@/components/DragImages/DragImages.vue";
import Gravatar from "@/components/Gravatar/Gravatar.vue";
import Editor, { backData } from "./components/editor.vue";
import { pinyin } from "pinyin-pro"
import { IPost, NewPost, PostStatus, FetchPostDetail, UpdatePost } from "@/api/post";
import { FetchTagList, ITag } from "@/api/tag";
import { FetchUserList, FetchMineInfo, IUser } from "@/api/user";
import { FormItem, Spin, Textarea, Select, SelectOption, Button, Switch, Row, Col as ColItem, Form, Space, message } from 'ant-design-vue';
import { Rule } from "ant-design-vue/es/form";
import { onMounted, ref, computed } from "vue";
import { useRoute } from "vue-router";
import { useMe } from "@/stores/me";

const meStore = useMe()
const route = useRoute();
const postFormRef = ref();
const submitLoading = ref(false);
const pageLoading = ref(false);
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
    commentEnabled: true
});
const rules: Record<string, Rule[]> = {
    enTitle: [{ required: true, message: '请输入文章唯一标识', trigger: 'blur' }],
    title: [{ required: true, message: '请输入文章标题', trigger: 'change' }],
    description: [{ required: true, message: '请输入文章描述', trigger: 'change' }]
};
const adminList = ref<IUser[]>();
const tagList = ref<ITag[]>();
const isUpdate = computed(() => route.params.id || false);

onMounted(async () => {
    // 获取当前用户
    FormData.value.authorId = meStore.MineInfo?.id!;
    getAdmin();
    getTag();
    // 编辑
    if (isUpdate.value) {
        getDetail();
    }
})
// 中文转拼音
const handleTitle = () => FormData.value.enTitle = (pinyin(FormData.value.title, { toneType: 'none', type: 'array' })).join('-');
// 获取管理员
const getAdmin = async () => { adminList.value = (await FetchUserList({ role: "Admin" })).data };
// 获取标签
const getTag = async () => { tagList.value = (await FetchTagList()).data };
// 监听富文本编辑器输出内容
const handleEditorOutput = (payload: backData) => {
    if (payload.type == 'image') {
        FormData.value.covers?.push(payload.data.default)
    }
}

// 获取文章详情
const getDetail = async () => {
    pageLoading.value = true;
    try {
        let res = await FetchPostDetail(Number(route.params.id));
        FormData.value = res.data as IPost;
        FormData.value.tagIds = res.data?.tags?.map(tag => tag.id) as number[];
    } catch (err: any) {

    } finally {
        pageLoading.value = false;
    }

}

// 提交
const Submit = async () => {
    postFormRef.value.validate().then(async () => {
        submitLoading.value = true;
        if (isUpdate.value) {
            Update();
        } else {
            Post();
        }
    }).catch(() => {
        message.error("请检查表单")
    })
}

// 发布
const Post = async () => {
    try {
        await NewPost(FormData.value)
        message.success('发文成功')
    } catch (err: any) {
        message.error(err || '网络错误')
    } finally {
        submitLoading.value = false;
    }
}

// 更新
const Update = async () => {
    try {
        await UpdatePost(FormData.value)
        message.success('更新成功')
    } catch (err: any) {
        message.error(err || '网络错误')
    } finally {
        submitLoading.value = false;
    }
}

// 提交草稿
const SubmitDraft = () => {
    FormData.value.status = 'Draft' as PostStatus.Draft;
}

</script>
<template>
    <Spin tip="Loading..." :spinning="pageLoading">
        <Form ref="postFormRef" :model="FormData" :rules="rules">
            <Row :wrap="true" :gutter="20">
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
                                <div class="user-wrap">
                                    <div class="user-avatar">
                                        <Gravatar :email="user.email"></Gravatar>
                                    </div>
                                    <div class="user-info">
                                        <h2>{{ user.author }}</h2>
                                        <p>{{ user.email }}</p>
                                    </div>
                                </div>
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
                    <Space :size="[30, 0]" :wrap="true">
                        <FormItem label="评论?">
                            <Switch v-model:checked="FormData.commentEnabled"></Switch>
                        </FormItem>
                        <FormItem label="置顶?">
                            <Switch v-model:checked="FormData.isTop"></Switch>
                        </FormItem>
                        <FormItem label="推荐?">
                            <Switch v-model:checked="FormData.isRecommend"></Switch>
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
                <Button :loading="submitLoading" :type="'primary'" @click="Submit">{{ isUpdate ? '修改' : '发布' }}</Button>
                <Button :loading="submitLoading" :type="'default'" @click="SubmitDraft">保存草稿</Button>
            </div>
        </div>
    </Spin>
</template>

<style scoped>
.user-wrap {
    display: flex;
    align-items: center;
    gap: 5px;
}

.user-avatar {
    width: 20px;
    height: 20px;
    border-radius: 5px;
    overflow: hidden;
    line-height: normal;
}

.ant-select-selection-item .user-info>p {
    display: inline;
    opacity: 0.6;
    font-size: 12px;
}

.ant-select-selection-item .user-info>h2 {
    font-size: 14px;
    font-weight: 400;
    display: inline;
    margin-right: 10px;
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
    z-index: 2;
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