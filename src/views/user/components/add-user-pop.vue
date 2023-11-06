<script setup lang="ts">
import { UserOutlined, MailOutlined, KeyOutlined } from "@ant-design/icons-vue";
import { UserRole } from "@/api/user";
import { Modal, Form, FormItem, Input, InputPassword, Select, SelectOption, message } from "ant-design-vue";
import { Rule } from "ant-design-vue/es/form";
import { computed, reactive, ref } from "vue";
import { AddUser, NewUser } from "@/api/user"

const emit = defineEmits(["success"]);
const submitLoading = ref(false);
const userForm = ref();
const FormData = reactive<NewUser>({
    author: '',
    email: '',
    password: '',
    role: 'Admin'
})

const rules: Record<string, Rule[]> = {
    author: [
        { required: true, message: '请输入别名', trigger: 'change' },
        { min: 1, max: 12, message: '长度至少1到12', trigger: 'blur' },
    ],
    email: [{ required: true, type: 'email', message: "请输入正确的邮箱地址", trigger: "change" }],
    password: [{ required: true, message: "密码长度为6-12位", min: 6, max: 12, trigger: "change" }],
};

const handleAddUser = () => {
    userForm.value.validate().then(async () => {
        submitLoading.value = true;
        try {
            await AddUser(FormData);
            message.success('新增成功');
            emit("success");
            userForm.value.resetFields();
        } catch (err: any) {
            message.error(err || '服务器错误');
        } finally {
            submitLoading.value = false;
        }
    }).catch(() => {
        message.error("请检查表单")
    })
}

const resetForm = () => {

}
</script>

<template>
    <Modal :width="350" v-bind="$attrs" :confirm-loading="submitLoading" @ok="handleAddUser" title="新增用户" ok-text="新增"
        cancel-text="取消">
        <div class="form-wrap">
            <Form ref="userForm" :model="FormData" :rules="rules">
                <FormItem>
                    <Select v-model:value="FormData.role">
                        <SelectOption value="Admin">管理员</SelectOption>
                        <SelectOption value="Custom">游客</SelectOption>
                    </Select>
                </FormItem>
                <FormItem name="author">
                    <Input v-model:value="FormData.author">
                    <template #prefix>
                        <UserOutlined style="color: #d9d9d9" />
                    </template>
                    </Input>
                </FormItem>
                <FormItem name="email">
                    <Input v-model:value="FormData.email">
                    <template #prefix>
                        <MailOutlined style="color: #d9d9d9" />
                    </template>
                    </Input>
                </FormItem>
                <FormItem name="password">
                    <InputPassword v-model:value="FormData.password">
                        <template #prefix>
                            <KeyOutlined style="color: #d9d9d9" />
                        </template>
                    </InputPassword>
                </FormItem>
            </Form>
        </div>
    </Modal>
</template>

<style scoped>
:deep(.ant-form-item-explain-error) {
    font-size: 12px;
}

.form-wrap {
    padding: 20px 0 0 0;
}
</style>