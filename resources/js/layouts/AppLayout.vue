<script setup lang="ts">
import {computed} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {useAuthStore} from "@/stores";
import {useAuthApi} from "@/composables";
import {storeToRefs} from "pinia";

const {isAuthenticated} = storeToRefs(useAuthStore());
const {logout} = useAuthApi();
const route = useRoute();
const router = useRouter();

const activeIndex = computed<string>(() => {
  return route.path;
});

const handleLogout = async () => {
  await logout();
  await router.push('/');
}
</script>

<template>
  <el-container>
    <el-header>
      <el-row justify="center">
        <el-col :xs="24" :sm="22" :md="20" :lg="18" :xl="16">
          <el-menu
            mode="horizontal"
            :ellipsis="false"
            :router="true"
            :default-active="activeIndex"
          >
            <el-menu-item index="/">Home</el-menu-item>
            <el-menu-item v-if="!isAuthenticated" index="/login">Login</el-menu-item>

            <template v-if="isAuthenticated">
              <el-menu-item index="/admin/products">Product management</el-menu-item>
              <el-menu-item index="" @click="handleLogout">Logout</el-menu-item>
            </template>
          </el-menu>
        </el-col>
      </el-row>
    </el-header>

    <el-main>
      <el-row justify="center">
        <el-col :xs="24" :sm="22" :md="20" :lg="18" :xl="16">
          <router-view/>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>
