<template>
  <el-container class="common-layout" style="height: 100vh;">
    <!-- 左侧侧边栏 -->
    <Sidebar />

    <!-- 右侧主内容 -->
    <el-container>
      <!-- 顶部 Header -->
      <el-header height="64px" class="flex items-center px-6 bg-white border-b">
        <h2 class="text-lg font-semibold">{{ pageTitle }}</h2>
      </el-header>

      <!-- 内容区 Main -->
      <el-main class="overflow-auto p-6">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Sidebar from '@/components/common/Sidebar.vue'

const route = useRoute()
const pageTitle = computed(() => route.meta.title || '')
</script>

<style scoped>
/* 保证 el-container 撑满屏幕 */
html, body, #app {
  height: 100%;
  margin: 0;
}
</style>


<!--<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="200px">Aside</el-aside>
      <el-container>
        <el-header>Header</el-header>
        <el-main>Main</el-main>
      </el-container>
    </el-container>
  </div>
</template>
-->