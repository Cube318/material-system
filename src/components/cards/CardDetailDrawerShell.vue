<template>
  <el-drawer
    :model-value="modelValue"
    :title="title"
    :size="size"
    :direction="direction"
    :lock-scroll="false"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div class="drawer-container">
      <div class="form-panel">
        <slot name="left" />
      </div>

      <div class="preview-panel">
        <div class="preview-toolbar">
          <span class="label">缩放%</span>
          <el-slider
            :model-value="scalePercent"
            :min="30"
            :max="100"
            :step="1"
            style="width: 140px"
            @update:model-value="emit('update:scalePercent', $event)"
          />
          <el-input-number
            :model-value="scalePercent"
            :min="30"
            :max="100"
            :step="1"
            size="small"
            style="width: 90px"
            @update:model-value="emit('update:scalePercent', $event)"
          />
          <el-divider direction="vertical" />
          <el-button size="small" @click="emit('refresh')">刷新</el-button>
        </div>

        <div class="phone-stage">
          <slot name="phone" />
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<script setup>
defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: "详情",
  },
  size: {
    type: String,
    default: "80%",
  },
  direction: {
    type: String,
    default: "rtl",
  },
  scalePercent: {
    type: Number,
    default: 80,
  },
})

const emit = defineEmits(["update:modelValue", "update:scalePercent", "refresh"])
</script>

<style scoped>
.drawer-container {
  display: flex;
  height: 100%;
  background: var(--el-bg-color);
}

.form-panel {
  width: 40%;
  padding: 20px;
  overflow-y: auto;
  border-right: 1px solid #eee;
  flex: 1;
  min-width: 500px;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.form-panel::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.preview-panel {
  width: 420px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
}

.preview-toolbar {
  height: 48px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 12px;
  margin-bottom: 12px;
  background: var(--el-bg-color);
}

.preview-toolbar .label {
  font-size: 12px;
  color: #666;
}

.phone-stage {
  width: 100%;
  height: 820px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  overflow: hidden;
}
</style>
