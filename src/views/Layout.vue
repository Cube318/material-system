<template>
  <el-container class="common-layout">
    <!-- 左侧侧边栏 -->
    <el-aside width="auto">
      <Sidebar />
    </el-aside>

    <!-- 右侧主内容 -->
    <el-container class="content-container">
      <!-- 顶部 Header -->
      <el-header class="layout-header">
        <h2 class="page-title">{{ pageTitle }}</h2>

        <!-- <ThemeSwitch /> -->
      </el-header>

      <!-- 内容区 Main -->
      <el-main class="layout-main">
        <div class="main-view-host">
          <router-view />
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Sidebar from '@/components/common/Sidebar.vue'

const route = useRoute()
// 这里读取路由 meta 中的 title，记得在 router/index.js 中配置 meta: { title: 'xxx' }
const pageTitle = computed(() => route.meta.title || '素材管理系统')
</script>

<style scoped>
.common-layout {
  height: 100vh;
  width: 100%;
  overflow: hidden;
}

.content-container {
  min-width: 0;
  min-height: 0;
}

/* Header 样式 */
.layout-header {
  display: flex;
  align-items: center;
  padding: 0 20px;
  background-color: var(--el-bg-color); /* 自动适配暗黑模式 */
  border-bottom: 1px solid var(--el-border-color);
  transition: background-color 0.3s, border-color 0.3s;
}

.page-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--el-text-color-primary); /* 文字颜色适配 */
}

/* Main 区域样式 */
.layout-main {
  padding: 20px;
  background: var(--el-bg-color-page);
  overflow: hidden;
  min-height: 0;
  display: flex;
  transition: background-color 0.3s;
}

.main-view-host {
  flex: 1;
  min-height: 0;
  min-width: 0;
  overflow: hidden;
}
</style>