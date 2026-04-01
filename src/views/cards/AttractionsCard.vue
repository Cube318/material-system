<template>
  <div class="page-container">
    <el-card shadow="never" class="card">

      <!-- 🔍 搜索区 -->
      <div class="toolbar">
        <el-input
            v-model="query.name"
            placeholder="请输入景点名称"
            clearable
            class="search-input"
            @keyup.enter="handleSearch"
        />
        <el-button type="primary" @click="handleSearch">
          搜索
        </el-button>
      </div>

      <!-- 📋 表格 -->
      <el-table
          :data="list"
          v-loading="loading"
          stripe
          border
          highlight-current-row
      >

        <!-- 封面 -->
        <el-table-column label="封面" width="100">
          <template #default="scope">
            <el-image
                :src="scope.row.imageUrl"
                style="width: 60px; height: 60px; border-radius: 6px"
                fit="cover"
                preview-src-list="[scope.row.imageUrl]"
            />
          </template>
        </el-table-column>

        <!-- 名称 -->
        <el-table-column prop="name" label="景点名称" min-width="180" />

        <!-- 标签 -->
        <el-table-column label="标签" width="100">
          <template #default="scope">
            <el-tag v-if="scope.row.valueDesc" type="success">
              {{ scope.row.valueDesc }}
            </el-tag>
          </template>
        </el-table-column>

        <!-- 等级 -->
        <el-table-column label="等级" width="80">
          <template #default="scope">
            <el-tag type="warning">
              {{ scope.row.grade }}A
            </el-tag>
          </template>
        </el-table-column>

        <!-- 简介（截断） -->
        <el-table-column label="简介" min-width="300">
          <template #default="scope">
            <div class="ellipsis">
              {{ scope.row.introduce }}
            </div>
          </template>
        </el-table-column>

        <!-- 更新时间 -->
        <el-table-column prop="updateTime" label="更新时间" width="180" />

        <!-- 操作 -->
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="scope">
            <el-button type="primary" link @click="goDetail(scope.row.id)">
              查看
            </el-button>
          </template>
        </el-table-column>

        <template #empty>
          <el-empty description="暂无数据" />
        </template>

      </el-table>

      <!-- 📄 分页 -->
      <div class="pagination">
        <el-pagination
            background
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            :page-size="query.size"
            :page-sizes="[10, 20, 50, 100]"
            v-model:current-page="query.page"
            v-model:page-size="query.size"
            @current-change="loadData"
            @size-change="handleSizeChange"
        />
      </div>

    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import axios from "axios"
import { useRouter } from "vue-router"

const router = useRouter()

const list = ref([])
const total = ref(0)
const loading = ref(false)

const query = ref({
  page: 1,
  size: 10,
  name: ""
})

/**
 * 查询
 */
const handleSearch = () => {
  query.value.page = 1
  loadData()
}

/**
 * 分页 size 改变
 */
const handleSizeChange = (size) => {
  query.value.page = 1
  query.value.size = size
  loadData()
}

/**
 * 加载数据
 */
const loadData = async () => {
  loading.value = true
  try {
    const res = await axios.get("/api/attraction/page", {
      params: query.value
    })

    const data = res.data.data
    list.value = data.records
    total.value = data.total

  } finally {
    loading.value = false
  }
}

/**
 * 跳转详情
 */
const goDetail = (id) => {
  router.push(`/attraction/${id}`)
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.page-container {
  padding: 16px;
  background: #f5f7fa;
  height: 100%;
  box-sizing: border-box;
  overflow: auto; /* 关键：只让这里滚 */
}

.card {
  border-radius: 8px;
}

/* 搜索区 */
.toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.search-input {
  width: 240px;
}

/* 分页 */
.pagination {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}

.ellipsis {
  display: -webkit-box;
  -webkit-line-clamp: 2; /* 显示2行 */
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>