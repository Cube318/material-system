<template>
  <div :class="['sidebar-container', { collapsed }]">
    <!-- Logo -->
    <div class="sidebar-header">
      <div class="logo-wrapper" v-if="!collapsed">
        <div class="logo-icon">🏞️</div>
        <div>
          <h1 class="logo-title">素材管理</h1>
          <p class="logo-subtitle">Material System</p>
        </div>
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
</script>

<style scoped>
.sidebar-container {
  display: flex;
  flex-direction: column;
  width: 280px;
  height: 100vh;
  background-color: #fff;
  border-right: 1px solid #ebeef5;
  flex-shrink: 0;
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
  border-bottom: 1px solid #ebeef5;
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
}

.logo-title {
  font-size: 18px;
  font-weight: bold;
  margin: 0;
}

.logo-subtitle {
  font-size: 12px;
  color: #909399;
  margin: 0;
}

.collapse-btn {
  cursor: pointer;
  font-size: 18px;
  color: #606266;
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
}

.menu-item.active {
  background-color: #f0f9ff;
  color: #409EFF;
}

.sidebar-footer {
  display: flex;
  align-items: center;
  padding: 10px 20px;
  border-top: 1px solid #ebeef5;
  gap: 10px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  background-color: #c0c4cc;
  border-radius: 50%;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 14px;
  font-weight: 500;
}

.user-status {
  font-size: 12px;
  color: #67C23A;
}
</style>