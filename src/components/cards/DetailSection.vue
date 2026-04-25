<template>
  <div class="detail-section">
    <div class="section-title">{{ title }}</div>
    <el-divider />
    <slot />
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
})
</script>

<style scoped>
.detail-section {
  margin-bottom: 24px;
  padding: 16px;
  background: var(--el-fill-color-light);
  border-radius: 8px;
  border: 1px solid #ebeef5;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
}

/* 统一所有子表单项的间距 */
:deep(.el-form-item) {
  margin-bottom: 16px;
}
</style>