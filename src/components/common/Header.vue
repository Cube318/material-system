<template>
  <header class="h-16 bg-white border-b flex items-center px-8 justify-between shadow-sm">
    <div class="flex items-center gap-6">
      <h2 class="text-2xl font-semibold text-gray-900">
        {{ title }}
      </h2>
    </div>

    <div class="flex items-center gap-6">
      <div v-if="showSearch" class="w-80 relative">
        <input
            v-model="searchText"
            @input="handleSearch"
            type="text"
            placeholder="搜索景点名称、地点..."
            class="w-full bg-gray-100 border border-transparent focus:border-blue-400 rounded-3xl py-3 px-5 pl-12 text-sm outline-none"
        >
        <span class="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
      </div>

      <div class="flex items-center gap-3">
        <div class="text-right text-sm">
          <div class="font-medium">管理员</div>
          <div class="text-xs text-green-500">在线</div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['search'])

const searchText = ref('')
const title = ref('景点管理')
const showSearch = ref(true)

const handleSearch = () => {
  emit('search', searchText.value)
}
</script>