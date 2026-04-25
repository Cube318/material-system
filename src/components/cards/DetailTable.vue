<template>
  <el-row :gutter="20">
    <el-col
      v-for="(field, i) in fields"
      :key="field.key ?? i"
      :span="field.span ?? 12"
    >
      <el-form-item :label="field.label" :label-width="labelWidth">
        <!-- 具名插槽覆盖：#field-{key} 或 #field-{index} -->
        <slot :name="`field-${field.key ?? i}`" :field="field">
          <el-input
            v-if="!field.type || field.type === 'text'"
            :model-value="toStr(field.value)"
            disabled
          />
          <el-input
            v-else-if="field.type === 'textarea'"
            type="textarea"
            :rows="field.rows ?? 3"
            :model-value="toStr(field.value)"
            disabled
          />
        </slot>
      </el-form-item>
    </el-col>
  </el-row>
</template>

<script setup>
defineProps({
  fields: {
    type: Array,
    default: () => [],
  },
  labelWidth: {
    type: String,
    default: '100px',
  },
})

const toStr = (v) => (v === null || v === undefined ? '-' : String(v))
</script>