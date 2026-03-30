<template>
  <el-container :class="['sidebar-container', { collapsed }]">
    <!-- 顶部 Logo -->
    <el-header height="80px" class="sidebar-header">
      <div class="logo-wrapper" v-if="!collapsed">
        <div class="logo-icon">🏞️</div>
        <div>
          <h1 class="logo-title">旅游后台</h1>
          <p class="logo-subtitle">Material System</p>
        </div>
      </div>
      <div class="collapse-btn" @click="toggleCollapse">
        <el-icon :class="collapsed ? 'el-icon-arrow-right' : 'el-icon-arrow-left'" />
      </div>
    </el-header>

    <!-- 菜单 -->
    <el-main class="sidebar-menu">
      <el-menu
          :default-active="activeMenu"
          class="el-menu-vertical-demo"
          :collapse="collapsed"
          background-color="transparent"
          text-color="#606266"
          active-text-color="#409EFF"
          unique-opened
          @select="handleMenuSelect"
      >
        <el-menu-item
            v-for="item in menus"
            :key="item.key"
            :index="item.key"
        >
          <span class="menu-icon">{{ item.icon }}</span>
          <span v-if="!collapsed">{{ item.label }}</span>
        </el-menu-item>
      </el-menu>
    </el-main>

    <!-- 底部用户栏 -->
    <el-footer class="sidebar-footer" v-if="!collapsed">
      <el-avatar size="40" class="user-avatar"></el-avatar>
      <div class="user-info">
        <div class="user-name">管理员</div>
        <div class="user-status">在线</div>
      </div>
    </el-footer>
  </el-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const collapsed = ref(false)
const activeMenu = ref('attractions')

// 菜单列表，对应你的 views/cards 下的文件
const menus = [
  { key: 'attractions', label: '景点管理', icon: '🏔️', path: '/attractions' },
  { key: 'products', label: '商品管理', icon: '🛍️', path: '/products' },
  { key: 'food', label: '美食管理', icon: '🍜', path: '/food' }
]

// 点击菜单跳转
const handleMenuSelect = (key) => {
  const menu = menus.find(m => m.key === key)
  if (menu && menu.path) {
    router.push(menu.path)
    activeMenu.value = key
  }
}

// 刷新页面保持高亮
onMounted(() => {
  const currentPath = route.path.slice(1)
  const menu = menus.find(m => m.path.slice(1) === currentPath)
  if (menu) activeMenu.value = menu.key
})

// 切换折叠
const toggleCollapse = () => {
  collapsed.value = !collapsed.value
}
</script>

<style scoped>
.sidebar-container {
  width: 280px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border-right: 1px solid #ebeef5;
  box-shadow: 2px 0 8px rgba(0,0,0,0.05);
  transition: width 0.2s;
}
.sidebar-container.collapsed {
  width: 64px;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
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
  flex: 1;
  overflow-y: auto;
  padding: 20px 0;
}

.el-menu-vertical-demo {
  border-right: none;
}

.menu-icon {
  margin-right: 8px;
}

.sidebar-footer {
  display: flex;
  align-items: center;
  padding: 10px 20px;
  border-top: 1px solid #ebeef5;
  gap: 10px;
}

.user-avatar {
  background-color: #c0c4cc;
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