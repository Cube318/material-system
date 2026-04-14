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
        <el-select
            v-model="query.grade"
            placeholder="景点等级"
            clearable
            style="width: 140px"
        >
          <el-option label="2级" value="2"/>
          <el-option label="3级" value="3"/>
        </el-select>
        <el-button type="primary" :icon="Search" @click="handleSearch">
          搜索
        </el-button>
        <el-button :icon="Refresh" @click="handleReset">
          重置
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
        <el-table-column label="景点名称" min-width="100">
          <template #default="scope">
            <div>
              <div style="font-weight: 500;">
                {{ scope.row.name }}
              </div>
              <div style="font-size: 12px; color: #999;">
                ID：{{ scope.row.id }}
              </div>
            </div>
          </template>
        </el-table-column>

        <!-- 标签 -->
        <el-table-column label="标签" width="150">
          <template #default="scope">
            <el-tag v-if="scope.row.valueDesc" type="success">
              {{ scope.row.valueDesc }}
            </el-tag>
          </template>
        </el-table-column>

        <!-- 等级 -->
        <el-table-column label="等级" width="100">
          <template #default="scope">
            <el-tag type="warning">
              {{ scope.row.grade }}级景点
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
        <el-table-column prop="updateTime" label="更新时间" width="180"/>

        <!-- 操作 -->
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="scope">
            <el-button type="primary" link @click="openDrawer(scope.row.id)">
              查看
            </el-button>
          </template>
        </el-table-column>

        <template #empty>
          <el-empty description="暂无数据"/>
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
    <el-drawer
        v-model="drawerVisible"
        title="景点详情"
        size="80%"
        direction="rtl"
    >
      <div class="drawer-container" v-if="detail">

        <!-- 左侧：表单 -->
        <div class="form-panel">
          <el-form :model="detail" label-width="100px" class="detail-form">

            <!-- 🧩 基础数据 -->
            <div class="block">
              <div class="block-title">📌 基础数据</div>
              <el-divider/>

              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="景点名称">
                    <el-input :model-value="detail.name" disabled/>
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="景点等级">
                    <el-tag type="warning">{{ detail.grade }}级</el-tag>
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="评分">
                    <el-rate v-model="detail.rating" disabled/>
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="标签">
                    <el-tag type="success">{{ detail.valueDesc }}</el-tag>
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="推荐优先级">
                    <el-input :model-value="detail.recPriority" disabled/>
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="景点ID">
                    <el-input :model-value="detail.poiObjId" disabled/>
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="开放时间">
                    <el-input :model-value="detail.openTime" disabled/>
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="关闭时间">
                    <el-input :model-value="detail.closeTime" disabled/>
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="最后入园时间">
                    <el-input :model-value="detail.lastEntryTime" disabled/>
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="票价">
                    <el-input :model-value="detail.ticketPrice" disabled/>
                  </el-form-item>
                </el-col>

                <el-col :span="24">
                  <el-form-item label="优势/特色">
                    <el-input :model-value="detail.advantage" disabled/>
                  </el-form-item>
                </el-col>

                <el-col :span="24">
                  <el-form-item label="简介">
                    <el-input
                        type="textarea"
                        :rows="8"
                        v-model="detail.introduce"
                        disabled
                    />
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="封面图">
                    <el-image
                        :src="detail.imageUrl"
                        style="width: 80px; border-radius: 6px"
                    />
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="视频">

                    <!-- 有视频：点击播放 -->
                    <div v-if="detail.summaryVideoUrl">
                      <el-button
                          type="primary"
                          link
                          @click="playVideo(detail.summaryVideoUrl)"
                      >
                        ▶ 播放视频
                      </el-button>
                    </div>

                    <!-- 空值 -->
                    <span v-else class="empty-text">—</span>

                  </el-form-item>
                </el-col>
              </el-row>
            </div>

            <!-- 🧩 POI 数据 -->
            <div class="block">
              <div class="block-title">📍 POI 数据</div>
              <el-divider/>

              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="POI名称">
                    <el-input :model-value="detail.poi.name" disabled/>
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="电话">
                    <el-input :model-value="detail.poi.tel" disabled/>
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="经度">
                    <el-input :model-value="detail.poi.longitude" disabled/>
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="纬度">
                    <el-input :model-value="detail.poi.latitude" disabled/>
                  </el-form-item>
                </el-col>

                <el-col :span="24">
                  <el-form-item label="地址">
                    <el-input :model-value="detail.poi.address" disabled/>
                  </el-form-item>
                </el-col>

                <el-col :span="24">
                  <el-form-item label="描述">
                    <el-input
                        type="textarea"
                        :rows="3"
                        :model-value="detail.poi.description"
                        disabled
                    />
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="POI类型">
                    <el-input :model-value="detail.poi.poiType" disabled/>
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="状态">
                    <el-tag>{{ detail.poi.status === 1 ? '启用' : '禁用' }}</el-tag>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>

            <!-- 🧩 视频数据 -->
            <div class="block">
              <div class="block-title">🎬 视频数据</div>
              <el-divider/>

              <el-table :data="detail.videos || []" border size="small">
                <el-table-column prop="id" label="ID"/>
                <el-table-column prop="title" label="标题"/>
                <el-table-column prop="description" label="描述"/>
                <el-table-column label="封面" width="100">
                  <template #default="scope">
                    <el-image
                        :src="scope.row.thumbnailUrl"
                        style="width: 60px; border-radius: 4px"
                    />
                  </template>
                </el-table-column>

                <el-table-column label="视频">
                  <template #default="scope">
                    <el-button type="primary" link @click="playVideo(scope.row.videoUrl)">
                      ▶ 播放视频
                    </el-button>
                  </template>
                </el-table-column>

                <el-table-column label="状态" width="80">
                  <template #default="scope">
                    <el-tag :type="scope.row.flag === '1' ? 'success' : 'info'">
                      {{ scope.row.flag === '1' ? '发布' : '草稿' }}
                    </el-tag>
                  </template>
                </el-table-column>

                <el-table-column label="方向" width="80">
                  <template #default="scope">
                    <el-tag>{{ scope.row.orientationType === 1 ? '横屏' : '竖屏' }}</el-tag>
                  </template>
                </el-table-column>
              </el-table>
            </div>

            <!-- 🧩 音频与讲解 -->
            <div class="block">
              <div class="block-title">🎧 音频与讲解</div>
              <el-divider/>

              <el-row :gutter="20">

                <el-col :span="12">
                  <el-form-item label="讲解音频">
                    <audio
                        v-if="detail.explanationUrl"
                        :src="detail.explanationUrl"
                        controls
                        style="width: 100%;"
                    />
                    <span v-else class="empty-text">—</span>
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="讲解词">
                    <el-input
                        type="textarea"
                        :rows="2"
                        :model-value="detail.explanation"
                        disabled
                    />
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="介绍音频">
                    <audio
                        v-if="detail.introduceAudio"
                        :src="detail.introduceAudio"
                        controls
                        style="width: 100%;"
                    />
                    <span v-else class="empty-text">—</span>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>

            <!-- 🧩 分类信息 -->
            <div class="block">
              <div class="block-title">🏷 分类信息</div>
              <el-divider/>

              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="特征类型">
                    <el-input
                        :model-value="formatValue(detail.featuresType, featuresTypeMap)"
                        disabled
                    />
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="景点类型">
                    <el-input
                        :model-value="formatValue(detail.attractionType, attractionTypeMap)"
                        disabled
                    />
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="规模">
                    <el-input
                        :model-value="formatValue(detail.scale, scaleMap)"
                        disabled
                    />
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="服务类型">
                    <div>
                      <template v-if="detail.serviceType">
                        <el-tag
                            v-for="item in detail.serviceType.split(',')"
                            :key="item"
                            style="margin-right: 6px"
                        >
                          {{ serviceTypeMap[item] || item }}
                        </el-tag>
                      </template>
                      <span v-else class="empty-text">—</span>
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>

            <!-- 🧩 系统信息（可折叠） -->
            <div class="block">
              <div class="block-title">🖥 系统信息</div>
              <el-divider/>

              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="创建人">
                    <el-input :model-value="detail.createBy" disabled/>
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="创建时间">
                    <el-input :model-value="detail.createTime" disabled/>
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="更新人">
                    <el-input :model-value="detail.updateBy" disabled/>
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="更新时间">
                    <el-input :model-value="detail.updateTime" disabled/>
                  </el-form-item>
                </el-col>

                <el-col :span="24">
                  <el-form-item label="额外信息">
                    <el-input type="textarea" :model-value="detail.info" disabled/>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-form>
        </div>

        <!-- 右侧：手机预览 -->
        <div class="preview-panel">
          <!-- 🧰 工具栏 -->
          <div class="preview-toolbar">
            <span class="label">缩放%</span>

            <!-- 无极滑块 -->
            <el-slider
                v-model="scalePercent"
                :min="30"
                :max="100"
                :step="1"
                style="width: 140px"
            />

            <!-- 输入框 -->
            <el-input-number
                v-model="scalePercent"
                :min="30"
                :max="100"
                :step="1"
                size="small"
                style="width: 90px"
            />

            <el-divider direction="vertical"/>

            <el-button size="small" @click="handleRefresh">刷新</el-button>
          </div>
          <div class="phone-stage">
            <div
                class="phone"
                :key="previewKey"
                :class="{ 'no-border': !showBorder }"
                :style="{ transform: `scale(${scale})` }"
            >
              <div class="preview-screen"
                   :style="{ backgroundImage: `url(${templateImg})` }">

                <!-- 内容区 -->
                <div class="content">

                  <!-- 媒体卡片 -->
                  <div class="media-box">

                    <!-- 有视频：优先播放 videos[0] -->
                    <video
                        v-if="detail.videos && detail.videos.length > 0"
                        id="previewVideo"
                        class="media"
                        :poster="detail.videos[0].thumbnailUrl"
                        muted
                        playsinline
                    >
                      <source :src="detail.videos[0].videoUrl" type="application/x-mpegURL"/>
                    </video>

                    <!-- 没视频：兜底用图片 -->
                    <img
                        v-else-if="detail.imageUrl"
                        :src="detail.imageUrl"
                        class="media"
                    />

                    <!-- 标题 -->
                    <div class="title">
                      {{ detail.name || '景点名称' }}
                    </div>
                    <div class="valueDesc">
                      #{{ detail.valueDesc || '景点标签' }}
                    </div>

                  </div>

                  <!-- 底部按钮 -->
                  <div class="bottom-btn">
                    立即查看
                  </div>

                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      <el-skeleton v-else rows="6" animated/>
    </el-drawer>
    <el-dialog
        v-model="videoVisible"
        width="60%"
        top="5vh"
        :show-close="true"
        class="video-dialog"
    >
      <div class="video-wrapper">
        <video
            v-if="currentVideo"
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
import { ref, onMounted, computed } from "vue"
import axios from "axios"
import Hls from "hls.js"
import {nextTick} from "vue"
import templateImg from '@/assets/template.png'
import {Search, Refresh} from '@element-plus/icons-vue'
const drawerVisible = ref(false)
const list = ref([])
const total = ref(0)
const loading = ref(false)

const query = ref({
  page: 1,
  size: 10,
  name: "",
  grade: "",
})
let hlsInstance = null

const detail = ref({
  poi: {},
  videos: []
})

const videoVisible = ref(false)
const currentVideo = ref('')

const playVideo = (url) => {
  currentVideo.value = url
  videoVisible.value = true
}

const featuresTypeMap = {
  1: '山',
  2: '水',
  3: '林',
  4: '草原',
  5: '特殊地貌',
  6: '主题公园',
  7: '城市地标建筑'
}

const attractionTypeMap = {
  1: '历史遗迹',
  2: '宗教文化',
  3: '民俗风情',
  4: '红色旅游',
  5: '博物馆',
  6: '非遗馆'
}

const scaleMap = {
  1: '超大',
  2: '大',
  3: '中',
  4: '小',
  5: '微'
}

const serviceTypeMap = {
  1: '观光车',
  2: '园内公交',
  3: '缆车',
  4: '游船',
  5: '餐饮',
  6: '住宿'
}
const scalePercent = ref(80) // 50~100
const scale = computed(() => scalePercent.value / 100)

// 🔄 刷新预览
const handleRefresh = async () => {
  await nextTick()
  initVideo()
}


const initVideo = () => {
  const video = document.getElementById("previewVideo")
  const url = detail.value?.videos?.[0]?.videoUrl

  if (!video || !url) return

  if (hlsInstance) {
    hlsInstance.destroy()
    hlsInstance = null
  }

  if (Hls.isSupported()) {
    hlsInstance = new Hls()
    hlsInstance.loadSource(url)
    hlsInstance.attachMedia(video)
  } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = url
  }

  setTimeout(() => {
    video.play().catch(err => {
      console.warn("自动播放失败:", err)
    })
  }, 3000)
}

// 分类信息转换
const formatValue = (value, map, isMulti = false) => {
  if (!value) return ''

  if (isMulti) {
    return value
        .split(',')
        .map(v => map[v] || v)
        .join(' / ')
  }

  return map[value] || value
}


/**
 * 查询
 */
const handleSearch = () => {
  query.value.page = 1
  loadData()

}
/**
 * 重置
 */
const handleReset = () => {
  query.value = {
    page: 1,
    size: 10,
    name: "",
    grade: "",
  }

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

    const params = {}
    Object.keys(query.value).forEach(key => {
      const val = query.value[key]
      if (val !== '' && val !== null && val !== undefined) {
        params[key] = val
      }
    })

    const res = await axios.get("/api/attraction/page", {
      params
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
const openDrawer = async (id) => {
  drawerVisible.value = true
  detail.value = null

  try {
    const res = await axios.get(`/api/attraction/${id}`)

    const data = res.data.data

    detail.value = {
      ...data,
      poi: data.poi || {},
      videos: data.videos || []
    }

    await nextTick()
    initVideo()

  } catch (e) {
    console.error(e)
  }
}

onMounted(() => {
  loadData()
})
</script>

<style>
.page-container {
  padding: 16px;
  background: var(--el-bg-color-page);
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

/* Drawer 内布局 */
.drawer-container {
  display: flex;
  height: 100%;
  background: var(--el-bg-color);
}

/* 左侧表单 */
.form-panel {
  width: 40%;
  padding: 20px;
  overflow-y: auto;
  border-right: 1px solid #eee;
  flex: 1;
  min-width: 500px;
}

/* 右侧预览 */
.preview-panel {
  width: 420px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  overflow: auto; /* 防止挤压 */
}

/* 工具栏 */
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

.scale-text {
  font-size: 12px;
  color: #999;
}



.phone-stage {
  width: 100%;
  height: 820px; /* 固定舞台高度 */
  display: flex;
  justify-content: center;
  align-items: flex-start;

  overflow: hidden; /* 👈 防止撑开 */
}

/* 手机外壳 */
.phone {
  width: 375px;
  height: 812px;

  //transform: scale(0.7);  /* 👈 推荐 0.65~0.8 */
  transform-origin: top center;
  flex-shrink: 0; /* 防止被压缩 */

  border-radius: 30px;
  background: linear-gradient(135deg, #3a3a3a 0%, #222222 100%);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.03);
  border: 1px solid #333;
  padding: 7px;
  transition: transform 0.2s ease; /* 手机缩放动画更丝滑 */
}

/* 🌙 黑暗模式 → 反转成白 */
:root.dark .phone {
  background: linear-gradient(135deg, #5a5a5a 0%, #7a7a7a 50%, #4a4a4a 100%);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.03);
  border: 1px solid #333;
}

/* 屏幕 */
.screen {
  width: 100%;
  height: 100%;
  background: #fff;
  border-radius: 20px;
  overflow-y: auto;
  padding: 10px;
}

/* 内容 */
/* 新的屏幕（蓝湖背景） */
.preview-screen {
  width: 100%;
  height: 100%;
  border-radius: 20px;
  overflow: hidden;

  display: flex;
  flex-direction: column;

  background: linear-gradient(0deg, #EFF0EB 70%, #FFFFFF 85%);
  background-size: cover;
  background-position: center;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;

  padding-top: 90px; /* 控制上间距 */
}

/* 媒体区域（560x996 → 除2） */
.media-box {
  width: 270px;
  height: 498px;

  border-radius: 25px;
  border: 4px solid #fff;
  overflow: hidden;

  position: relative;
  margin-bottom: 40px; /* 控制和按钮间距 */
}

/* 图片/视频填充 */
.media {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 标题（34px → 17px） */
.title {
  position: absolute;
  bottom: 35px;
  left: 10px;

  font-size: 16px;
  font-weight: bold;
  color: #fff;
}

.valueDesc {
  position: absolute;
  bottom: 20px;
  left: 10px;

  font-size: 13px;
  font-weight: bold;
  color: #ffffff;
}

/* 底部按钮 */
.bottom-btn {
  width: 85%;
  height: 50px;

  margin-top: auto; /* 自动贴底 */
  margin-bottom: 100px; /* 控制底部距离 */;

  background: #E0ED42;
  border-radius: 25px;

  display: flex;
  align-items: center;
  justify-content: center;

  font-weight: bold;
  color: #000000;
}

.block {
  margin-bottom: 24px;
  padding: 16px;
  background: var(--el-fill-color-light);
  border-radius: 8px;
  border: 1px solid #ebeef5;
}

.block-title {
  font-size: 16px;
  font-weight: 600;
  background: var(--el-fill-color-light);
  margin-bottom: 4px;
}

.detail-form :deep(.el-form-item) {
  margin-bottom: 16px;
}

/*dialog*/
.video-dialog :deep(.el-dialog) {
  max-width: 900px;
  border-radius: 12px;
  overflow: hidden;
  width: fit-content;
}

.video-wrapper {
  width: 100%;
  background: var(--el-fill-color-light);
  /* 保持居中，防止小视频贴边 */
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 视频本体 */
.video-player {
  max-width: 100%;
  max-height: 80vh; /* 限制最大高度，防止视频太高超出屏幕 */
  width: auto; /* 宽度自适应 */
  height: auto; /* 高度自适应 */
  display: block;
  border-radius: 8px;
}
</style>