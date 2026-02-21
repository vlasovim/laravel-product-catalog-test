<script setup lang="ts">
import {ref, reactive} from 'vue';
import {useRouter} from 'vue-router';
import {ElMessage} from 'element-plus';
import type {FormInstance, FormRules} from 'element-plus';
import {useAuthApi} from "@/composables";
import type {LoginRequest} from "@/types";

const router = useRouter();
const {login} = useAuthApi();

const loginFormRef = ref<FormInstance>();
const loading = ref<boolean>(false);

const form = reactive<LoginRequest>({
  email: 'admin@example.com',
  password: 'password',
});

const rules = reactive<FormRules<LoginRequest>>({
  email: [
    {required: true, message: 'Please enter email address', trigger: 'blur'},
    {type: 'email', message: 'Please enter a valid email address', trigger: 'blur'}
  ],
  password: [
    {required: true, message: 'Please enter password', trigger: 'blur'},
  ],
});

const handleLogin = async (): Promise<void> => {
  if (!loginFormRef.value) return;

  await loginFormRef.value.validate(async (valid: boolean) => {
    if (!valid) return;

    try {
      await login({
        email: form.email,
        password: form.password,
      });

      ElMessage.success({
        message: 'Successful login!',
        duration: 3000
      });

      await router.push('/admin/products');
    } catch (error) {
      ElMessage.error({
        message: 'Invalid credentials',
        duration: 5000
      });
    } finally {
      loading.value = false;
    }
  });
}
</script>

<template>
  <div class="login-container">
    <el-card>
      <el-form
        ref="loginFormRef"
        :model="form"
        :rules="rules"
      >
        <el-form-item prop="email">
          <el-input
            v-model="form.email"
            placeholder="Email"
            size="large"
            type="email"
            @keyup.enter="handleLogin"
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            placeholder="Password"
            size="large"
            type="password"
            show-password
            @keyup.enter="handleLogin"
          />
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            size="large"
            @click="handleLogin"
            :loading="loading"
          >
            Login
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped>
.el-card {
  flex-basis: 350px;
}

.login-container {
  display: flex;
  justify-content: center;
}
</style>
