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
      <!--  将 Switch 放在 Header 右侧 -->
      <div class="header-right">
        <el-switch
            v-model="isDark"
            inline-prompt
            :active-icon="Moon"
            :inactive-icon="Sunny"
            @change="toggle"
            style="--el-switch-on-color: #4a4a4a; --el-switch-off-color: #fff;"
        />
      </div>
      <div class="collapse-btn" @click="toggleCollapse">
        <span>{{ collapsed ? '▶' : '◀' }}</span>
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
  { key: 'attractions', label: '景点管理', icon: '🏔️', path: '/attractions' },
  { key: 'products', label: '商品管理', icon: '🛍️', path: '/products' },
  { key: 'food', label: '美食管理', icon: '🍜', path: '/food' }
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
import { Moon, Sunny } from '@element-plus/icons-vue'

const isDark = useDark({
  storageKey: 'app-theme-mode',
  valueDark: 'dark',
  valueLight: 'light',
})

const toggle = useToggle(isDark)
</script>

<!-- 👇 移除了 scoped，以便能够覆盖全局的 Element Plus 变量 -->
<style>
.sidebar-container {
  display: flex;
  flex-direction: column;
  width: 280px;
  height: 100vh;
  /* 👇 使用 CSS 变量，跟随主题变化 */
  background-color: var(--el-bg-color);
  border-right: 1px solid var(--el-border-color);
  flex-shrink: 0;
  /* 过渡动画，让切换更丝滑 */
  transition: background-color 0.3s, border-color 0.3s;
}

.sidebar-container.collapsed {
  width: 64px;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80px;
  padding: 0 20px;
  border-bottom: 1px solid var(--el-border-color);
  transition: border-color 0.3s;
}

.logo-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  width: 48px;
  height: 48px;
  background-color: #409EFF;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 24px;
  overflow: hidden;
}

.logo-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}

.logo-title {
  font-size: 18px;
  font-weight: bold;
  margin: 0;
  color: var(--el-text-color-primary);
}

.logo-subtitle {
  font-size: 12px;
  color: #909399;
  margin: 0;
}

/* 👇 新增：将 Switch 挤到最右边 */
.header-right {
  margin-left: auto;
  padding: 0 10px;
}

.collapse-btn {
  cursor: pointer;
  font-size: 18px;
  color: #606266;
  margin-left: 10px;
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
  gap: 8px;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 8px;
  margin: 0 8px;
  color: var(--el-text-color-regular);
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
  padding: 10px 20px;
  border-top: 1px solid var(--el-border-color);
  transition: border-color 0.3s;
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