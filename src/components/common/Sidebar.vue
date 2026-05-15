<template>
  <div :class="['sidebar-container', { collapsed }]">
    <!-- Logo -->
    <div class="sidebar-header">
      <div class="logo-wrapper" v-if="!collapsed">
        <div class="logo-icon"><img src="/favicon.png"></div>
        <div>
          <h1 class="logo-title">素材管理</h1>
          <p class="logo-subtitle">Material System</p>
        </div>
      </div>
      
      <!-- 收缩状态下只显示 Logo 图标 -->
      <div class="logo-icon-mini" v-if="collapsed">
        <img src="/favicon.png">
      </div>
      
      <div class="header-actions" v-if="!collapsed">
        <!-- 暗黑模式切换按钮 -->
        <div class="theme-toggle-btn" @click="toggleTheme" :title="isDark ? '切换到亮色模式' : '切换到暗黑模式'">
          <el-icon v-if="isDark"><Moon /></el-icon>
          <el-icon v-else><Sunny /></el-icon>
        </div>
        
        <!-- 折叠按钮 -->
        <div class="collapse-btn" @click="toggleCollapse" title="收起侧边栏">
          <el-icon><DArrowLeft /></el-icon>
        </div>
      </div>
      
      <!-- 收缩状态下的操作按钮 -->
      <div class="header-actions-mini" v-if="collapsed">
        <div class="theme-toggle-btn" @click="toggleTheme" :title="isDark ? '切换到亮色模式' : '切换到暗黑模式'">
          <el-icon v-if="isDark"><Moon /></el-icon>
          <el-icon v-else><Sunny /></el-icon>
        </div>
        
        <div class="collapse-btn" @click="toggleCollapse" title="展开侧边栏">
          <el-icon><DArrowRight /></el-icon>
        </div>
      </div>
    </div>

    <!-- 菜单 -->
    <div class="sidebar-menu flex-1 overflow-auto">
      <div
          v-for="item in menus"
          :key="item.key"
          @click="handleMenuSelect(item.key)"
          class="menu-item"
          :class="{ active: activeMenu === item.key }"
      >
        <span class="menu-icon">{{ item.icon }}</span>
        <span v-if="!collapsed">{{ item.label }}</span>
      </div>
    </div>

    <!-- 底部 -->
    <div class="sidebar-footer" v-if="!collapsed">
      <div class="user-avatar"></div>
      <div class="user-info">
        <div class="user-name">管理员</div>
        <div class="user-status">在线</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const collapsed = ref(false)
const activeMenu = ref('attractions')

const menus = [
  { key: 'attractions',   label: '景点管理',   icon: '🏔️', path: '/attractions' },
  { key: 'products',      label: '商品管理',   icon: '🛍️', path: '/products' },
  { key: 'food',          label: '美食管理',   icon: '🍜', path: '/food' },
  { key: 'video-replace', label: '视频替换工具', icon: '🎬', path: '/video-replace' }
]

const handleMenuSelect = (key) => {
  const menu = menus.find(m => m.key === key)
  if (menu && menu.path) {
    router.push(menu.path)
    activeMenu.value = key
  }
}

onMounted(() => {
  const currentPath = route.path.slice(1)
  const menu = menus.find(m => m.path.slice(1) === currentPath)
  if (menu) activeMenu.value = menu.key
})

const toggleCollapse = () => {
  collapsed.value = !collapsed.value
}

// --- 暗黑模式逻辑 ---
import { useDark, useToggle } from '@vueuse/core'
import { Moon, Sunny, DArrowLeft, DArrowRight } from '@element-plus/icons-vue'

const isDark = useDark({
  storageKey: 'app-theme-mode',
  valueDark: 'dark',
  valueLight: 'light',
})

const toggleFunc = useToggle(isDark)
const toggleTheme = () => {
  toggleFunc()
  console.log('主题切换:', isDark.value ? '暗黑模式' : '亮色模式')
}
</script>

<!-- 👇 移除了 scoped，以便能够覆盖全局的 Element Plus 变量 -->
<style>
.sidebar-container {
  display: flex;
  flex-direction: column;
  width: 280px;
  height: 100vh;
  background-color: var(--el-bg-color);
  border-right: 1px solid var(--el-border-color);
  flex-shrink: 0;
  transition: width 0.3s, background-color 0.3s, border-color 0.3s;
  overflow-x: hidden; /* 防止横向滚动条 */
}

.sidebar-container.collapsed {
  width: 80px;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 80px;
  padding: 0 16px;
  border-bottom: 1px solid var(--el-border-color);
  transition: all 0.3s;
  flex-shrink: 0;
}

.collapsed .sidebar-header {
  min-height: auto;
  padding: 16px 12px;
  justify-content: center;
  flex-direction: column;
  gap: 16px;
  border-bottom: none; /* 移除收缩状态下的横线 */
}

.logo-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
  flex: 1;
}

.logo-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
}

.logo-icon img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.logo-title {
  font-size: 18px;
  font-weight: bold;
  margin: 0;
  color: var(--el-text-color-primary);
  white-space: nowrap;
  overflow: hidden;
}

.logo-subtitle {
  font-size: 12px;
  color: #909399;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
}

.logo-icon-mini {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
}

.logo-icon-mini img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
}

.header-actions-mini {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.theme-toggle-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  cursor: pointer;
  background-color: var(--el-fill-color-light);
  color: var(--el-text-color-regular);
  transition: all 0.3s;
  font-size: 16px;
}

.theme-toggle-btn:hover {
  background-color: var(--el-fill-color);
  color: var(--el-color-primary);
  transform: scale(1.05);
}

.collapse-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  cursor: pointer;
  background-color: var(--el-fill-color-light);
  color: var(--el-text-color-regular);
  transition: all 0.3s;
  font-size: 16px;
}

.collapse-btn:hover {
  background-color: var(--el-fill-color);
  color: var(--el-color-primary);
  transform: scale(1.05);
}

.sidebar-menu {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-y: auto;
  padding: 20px 0;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  cursor: pointer;
  border-radius: 8px;
  margin: 4px 12px;
  color: var(--el-text-color-regular);
  transition: all 0.2s;
  white-space: nowrap;
  overflow: hidden;
}

.collapsed .menu-item {
  padding: 12px;
  margin: 4px 8px;
  justify-content: center;
}

.menu-item .menu-icon {
  font-size: 20px;
  flex-shrink: 0;
}

.menu-item:hover {
  background-color: var(--el-bg-color-overlay);
}

.menu-item.active {
  background-color: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
}

.sidebar-footer {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  border-top: 1px solid var(--el-border-color);
  transition: border-color 0.3s;
  flex-shrink: 0;
}

.collapsed .sidebar-footer {
  display: none;
}

.user-avatar {
  width: 40px;
  height: 40px;
  background-color: var(--el-color-info-light-5);
  border-radius: 50%;
}

.user-info {
  display: flex;
  flex-direction: column;
  margin-left: 10px;
}

.user-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--el-text-color-primary);
}

.user-status {
  font-size: 12px;
  color: var(--el-color-success);
}
</style>