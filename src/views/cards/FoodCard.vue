<template>
  <div class="page-container">
    <el-card shadow="never" class="card">
      <div class="toolbar">
        <el-input
          v-model="query.name"
          placeholder="请输入美食名称"
          clearable
          class="search-input"
          @keyup.enter="handleSearch"
        />
        <el-input
          v-model="query.title"
          placeholder="请输入美食标题"
          clearable
          class="search-input"
          @keyup.enter="handleSearch"
        />
        <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
        <el-button :icon="Refresh" @click="handleReset">重置</el-button>
      </div>

      <div class="table-wrap">
        <el-table
          :data="list"
          v-loading="loading"
          stripe
          border
          highlight-current-row
          height="100%"
        >
          <el-table-column label="封面" width="100">
            <template #default="scope">
              <el-image
                :src="scope.row.imageUrl"
                style="width: 60px; height: 60px; border-radius: 6px"
                fit="cover"
                :preview-src-list="[scope.row.imageUrl]"
                preview-teleported
              />
            </template>
          </el-table-column>

          <el-table-column label="美食名称" min-width="120">
            <template #default="scope">
              <div>
                <div class="name">{{ scope.row.name || "-" }}</div>
                <div class="sub-text">ID：{{ scope.row.id }}</div>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="title" label="标题" min-width="180" show-overflow-tooltip />

          <el-table-column label="标签" width="170">
            <template #default="scope">
              <el-tag v-if="scope.row.valueDesc" type="success">{{ scope.row.valueDesc }}</el-tag>
              <span v-else class="empty-text">—</span>
            </template>
          </el-table-column>

          <el-table-column label="价格" width="140" align="right">
            <template #default="scope">
              <span>{{ formatPrice(scope.row.price) }}</span>
            </template>
          </el-table-column>

          <el-table-column label="活动价" width="140" align="right">
            <template #default="scope">
              <span>{{ formatPrice(scope.row.promoPrice) }}</span>
            </template>
          </el-table-column>

          <el-table-column prop="updateTime" label="更新时间" width="180" />

          <el-table-column label="操作" width="120" fixed="right">
            <template #default="scope">
              <el-button type="primary" link @click="openDrawer(scope.row)">查看</el-button>
            </template>
          </el-table-column>

          <template #empty>
            <el-empty description="暂无数据" />
          </template>
        </el-table>
      </div>

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

    <CardDetailDrawerShell
      v-model="drawerVisible"
      title="美食详情"
      size="80%"
      direction="rtl"
      v-model:scale-percent="scalePercent"
      @refresh="handleRefresh"
    >
      <template #left>
        <el-form v-if="detail" :model="detail" label-width="100px" class="detail-form">
          <DetailSection title="基础信息">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="美食名称">
                  <el-input :model-value="detail.name" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="标题">
                  <el-input :model-value="detail.title" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="标签">
                  <el-input :model-value="detail.valueDesc || '-'" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="POI ID">
                  <el-input :model-value="detail.poiId ?? '-'" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="原价">
                  <el-input :model-value="formatPrice(detail.price)" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="活动价">
                  <el-input :model-value="formatPrice(detail.promoPrice)" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="排序">
                  <el-input :model-value="detail.orderSort ?? '-'" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="主题色">
                  <div class="theme-wrap">
                    <span
                      class="theme-color"
                      :style="{ background: detail.themeBg || '#ffffff' }"
                    />
                    <span class="theme-text">{{ detail.themeBg || '-' }}</span>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="描述">
                  <el-input type="textarea" :rows="6" :model-value="detail.description || '-'" disabled />
                </el-form-item>
              </el-col>
            </el-row>
          </DetailSection>

          <DetailSection title="媒体与链接">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="菜品图">
                  <el-image
                    :src="detail.imageUrl"
                    style="width: 80px; height: 80px; border-radius: 6px"
                    fit="cover"
                    :preview-src-list="[detail.imageUrl]"
                    preview-teleported
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="封面图">
                  <el-image
                    v-if="detail.coverImageUrl"
                    :src="detail.coverImageUrl"
                    style="width: 80px; height: 80px; border-radius: 6px"
                    fit="cover"
                    :preview-src-list="[detail.coverImageUrl]"
                    preview-teleported
                  />
                  <span v-else class="empty-text">—</span>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="视频">
                  <el-button
                    v-if="isVideoUrl(detail.videoUrl)"
                    type="primary"
                    link
                    @click="playVideo(detail.videoUrl)"
                  >
                    ▶ 播放视频
                  </el-button>
                  <span v-else class="empty-text">—</span>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="跳转链接">
                  <el-input :model-value="detail.link || '-'" disabled />
                </el-form-item>
              </el-col>
            </el-row>
          </DetailSection>

          <DetailSection title="系统信息">
            <DetailTable :fields="systemInfoFields" />
          </DetailSection>
        </el-form>
        <el-skeleton v-else rows="6" animated />
      </template>

      <template #phone>
        <PhonePreview
          v-if="detail"
          :scale="scale"
          :key="previewKey"
          :name="detail.name"
          :value-desc="detail.title"
          :image-url="detail.imageUrl"
          :video-url="isVideoUrl(detail.videoUrl) ? detail.videoUrl : ''"
          :thumbnail-url="detail.coverImageUrl || detail.imageUrl"
        />
      </template>
    </CardDetailDrawerShell>

    <el-dialog
      v-model="videoVisible"
      width="60%"
      top="5vh"
      :show-close="true"
      class="video-dialog"
      @close="handleVideoClose"
    >
      <div class="video-wrapper">
        <video
          v-if="currentVideo"
          ref="videoPlayerRef"
          :src="currentVideo"
          controls
          autoplay
          class="video-player"
        />
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, nextTick } from "vue"
import axios from "axios"
import Hls from "hls.js"
import { Search, Refresh } from "@element-plus/icons-vue"
import CardDetailDrawerShell from "@/components/cards/CardDetailDrawerShell.vue"
import PhonePreview from "@/components/cards/PhonePreview.vue"
import DetailSection from "@/components/cards/DetailSection.vue"
import DetailTable from "@/components/cards/DetailTable.vue"

const drawerVisible = ref(false)
const list = ref([])
const total = ref(0)
const loading = ref(false)
const detail = ref(null)
const drawerLoading = ref(false)
const previewKey = ref(0)

const videoVisible = ref(false)
const currentVideo = ref("")
const videoPlayerRef = ref(null)
let hlsInstance = null

const query = ref({
  page: 1,
  size: 10,
  name: "",
  title: "",
})

const scalePercent = ref(80)
const scale = computed(() => scalePercent.value / 100)

const systemInfoFields = computed(() => [
  { label: '创建人',   value: detail.value?.createBy },
  { label: '创建时间', value: detail.value?.createTime },
  { label: '更新人',   value: detail.value?.updateBy },
  { label: '更新时间', value: detail.value?.updateTime },
])

const formatPrice = (value) => {
  if (value === null || value === undefined || value === "") return "-"
  const price = Number(value) / 100
  return `¥${price.toFixed(2)}`
}

const isVideoUrl = (url) => {
  if (!url) return false
  return /\.(m3u8|mp4|webm|ogg)(\?.*)?$/i.test(url)
}

const playVideo = (url) => {
  if (!isVideoUrl(url)) return
  currentVideo.value = url
  videoVisible.value = true
}

const handleVideoClose = () => {
  if (videoPlayerRef.value) {
    videoPlayerRef.value.pause()
    videoPlayerRef.value.currentTime = 0
  }
  currentVideo.value = ''
}

const handleSearch = () => {
  query.value.page = 1
  loadData()
}

const handleReset = () => {
  query.value = {
    page: 1,
    size: 10,
    name: "",
    title: "",
  }
  loadData()
}

const handleSizeChange = (size) => {
  query.value.page = 1
  query.value.size = size
  loadData()
}

const loadData = async () => {
  loading.value = true
  try {
    const params = {}
    Object.keys(query.value).forEach((key) => {
      const val = query.value[key]
      if (val !== "" && val !== null && val !== undefined) {
        params[key] = val
      }
    })

    const res = await axios.get("/api/dish/page", { params })
    const data = res?.data?.data || {}
    list.value = data.records || []
    total.value = data.total || 0
  } finally {
    loading.value = false
  }
}

const buildDetail = (raw) => ({
  id: raw?.id ?? null,
  poiId: raw?.poiId ?? null,
  name: raw?.name ?? "",
  title: raw?.title ?? "",
  price: raw?.price ?? null,
  valueDesc: raw?.valueDesc ?? "",
  promoPrice: raw?.promoPrice ?? null,
  imageUrl: raw?.imageUrl ?? "",
  themeBg: raw?.themeBg ?? "",
  coverImageUrl: raw?.coverImageUrl ?? "",
  videoUrl: raw?.videoUrl ?? "",
  orderSort: raw?.orderSort ?? null,
  link: raw?.link ?? "",
  description: raw?.description ?? "",
  createBy: raw?.createBy ?? null,
  createTime: raw?.createTime ?? null,
  updateBy: raw?.updateBy ?? null,
  updateTime: raw?.updateTime ?? null,
  info: raw?.info ?? null,
})

const openDrawer = async (row) => {
  drawerVisible.value = true
  drawerLoading.value = true
  detail.value = null

  try {
    const res = await axios.get(`/api/dish/${row.id}`)
    detail.value = buildDetail(res?.data?.data || row)
  } catch (e) {
    detail.value = buildDetail(row)
  } finally {
    drawerLoading.value = false
  }

  await nextTick()
  initVideo()
}

const handleRefresh = async () => {
  previewKey.value += 1
  await nextTick()
  initVideo()
}

const initVideo = () => {
  const video = document.getElementById("previewVideo")
  const url = detail.value?.videoUrl
  if (!video || !isVideoUrl(url)) return

  if (hlsInstance) {
    hlsInstance.destroy()
    hlsInstance = null
  }

  const isHls = /\.m3u8(\?.*)?$/i.test(url)
  if (isHls) {
    if (Hls.isSupported()) {
      hlsInstance = new Hls()
      hlsInstance.loadSource(url)
      hlsInstance.attachMedia(video)
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = url
    }
  } else {
    video.src = url
  }

  setTimeout(() => {
    video.play().catch(() => {})
  }, 300)
}

watch(drawerVisible, (visible) => {
  if (!visible) {
    if (hlsInstance) {
      hlsInstance.destroy()
      hlsInstance = null
    }
    const previewVideo = document.getElementById('previewVideo')
    if (previewVideo) {
      previewVideo.pause()
      previewVideo.currentTime = 0
    }
  }
})

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.page-container {
  padding: 16px;
  background: var(--el-bg-color-page);
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
  min-height: 0;
}

.card {
  border-radius: 8px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.search-input {
  width: 220px;
}

.table-wrap {
  flex: 1;
  min-height: 0;
}

.pagination {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}

.name {
  font-weight: 500;
}

.sub-text {
  font-size: 12px;
  color: #999;
}

.empty-text {
  color: #999;
}

.theme-wrap {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.theme-color {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1px solid #dcdfe6;
}

.theme-text {
  color: #606266;
}

.video-dialog :deep(.el-dialog) {
  max-width: 900px;
  border-radius: 12px;
  overflow: hidden;
  width: fit-content;
}

.video-wrapper {
  width: 100%;
  background: var(--el-fill-color-light);
  display: flex;
  align-items: center;
  justify-content: center;
}

.video-player {
  max-width: 100%;
  max-height: 80vh;
  width: auto;
  height: auto;
  display: block;
  border-radius: 8px;
}
</style>