<script setup>
import {computed} from 'vue'
import {useRoute} from 'vue-router'

const route = useRoute();

const activeIndex = computed(() => {
    return route.path;
});
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
                        <el-menu-item index="/login">Login</el-menu-item>
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
