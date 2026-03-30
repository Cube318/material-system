<template>
  <div class="flex h-screen bg-gray-100">
    <!-- 侧边栏 -->
    <Sidebar />

    <!-- 主内容 -->
    <div class="flex-1 flex flex-col min-h-0 overflow-auto">
      <!-- 顶部栏 -->
      <div class="h-16 bg-white border-b flex items-center px-6">
        <h2 class="text-lg font-semibold">{{ pageTitle }}</h2>
      </div>

      <!-- 内容区 -->
      <div class="flex-1 overflow-auto p-6">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Sidebar from '@/components/common/Sidebar.vue'

// 获取当前路由，动态显示页面标题
const route = useRoute()
const pageTitle = computed(() => route.meta.title || '')
</script>

<style scoped>
/* 保证 flex 布局撑开 */
html, body, #app {
  height: 100%;
  margin: 0;
}
</style>