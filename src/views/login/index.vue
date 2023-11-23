<script setup lang="ts">
import { Form, FormItem, Input, InputPassword, Button, message } from 'ant-design-vue';
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';
import { ref } from 'vue';
import { Authorizations, IAuth } from "@/api/auth"
import { useRouter, useRoute } from 'vue-router';
import { useAuth } from '@/stores/auth';

const router = useRouter();
const route = useRoute();
const authStore = useAuth();
const authLoading = ref(false);
const AuthForm = ref<IAuth>({
    account: "",
    password: ""
});

const Auth = async () => {
    authLoading.value = true;
    try {
        let res = await Authorizations(AuthForm.value);
        authStore.signIn(res.token);
        router.push(route.query.redirect as string || '/');
        message.success('登录成功')
    } catch (err: any) {
        message.warning(err)
    } finally {
        authLoading.value = false;
    }
}

</script>

<template>
    <div class="auth-container">
        <div class="auth-box Stereobox">
            <Form :model="AuthForm">
                <FormItem>
                    <Input @keydown.enter="Auth" v-model:value="AuthForm.account" placeholder="账户名">
                    <template #prefix>
                        <UserOutlined style="color: #d9d9d9" />
                    </template>
                    </Input>
                </FormItem>
                <FormItem>
                    <InputPassword @keydown.enter="Auth" v-model:value="AuthForm.password" placeholder="密码">
                        <template #prefix>
                            <LockOutlined style="color: #d9d9d9" />
                        </template>
                    </InputPassword>
                </FormItem>
                <Button style="width: 100%;" :loading="authLoading" @click="Auth" :type="'primary'">登录</Button>
            </Form>
        </div>
    </div>
</template>

<style scoped>
.auth-container {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
}

.auth-box {
    width: 100%;
    max-width: 250px;
    padding: 20px;
    border-radius: 10px;
    background-color: #FFF;
}
</style>