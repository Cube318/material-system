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
        <el-table-column prop="name" label="景点名称" min-width="180"/>

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
        title="景点编辑"
        size="80%"
        direction="rtl"
    >
      <div class="drawer-container" v-if="detail">

        <!-- 左侧：表单 -->
        <div class="form-panel">
          <el-form :model="detail" label-width="80px">

            <el-form-item label="名称">
              <el-input v-model="detail.name"/>
            </el-form-item>

            <el-form-item label="图片">
              <el-input v-model="detail.imageUrl"/>
            </el-form-item>

            <el-form-item label="视频">
              <el-input v-model="detail.summaryVideoUrl"/>
            </el-form-item>

            <el-form-item label="标签">
              <el-input v-model="detail.valueDesc"/>
            </el-form-item>

            <el-form-item label="简介">
              <el-input
                  v-model="detail.introduce"
                  type="textarea"
                  rows="4"
              />
            </el-form-item>

            <el-form-item label="地址">
              <el-input v-model="detail.poi.address"/>
            </el-form-item>

          </el-form>
          <el-divider>完整数据</el-divider>

          <!-- 主字段 -->
          <el-divider>景点基础信息</el-divider>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="ID">{{ detail.id }}</el-descriptions-item>
            <el-descriptions-item label="POI对象ID">{{ detail.poiObjId }}</el-descriptions-item>
            <el-descriptions-item label="景点名称">{{ detail.name }}</el-descriptions-item>
            <el-descriptions-item label="卡片标题">{{ detail.title }}</el-descriptions-item>
            <el-descriptions-item label="景点评级">{{ detail.scenicRating }}</el-descriptions-item>
            <el-descriptions-item label="景点分级">{{ detail.grade }}</el-descriptions-item>
            <el-descriptions-item label="景点优先级">{{ detail.recPriority }}</el-descriptions-item>
            <el-descriptions-item label="价值标签">{{ detail.valueDesc }}</el-descriptions-item>
            <el-descriptions-item label="所在区域">{{ detail.locationArea }}</el-descriptions-item>
            <el-descriptions-item label="景点优势">{{ detail.advantage }}</el-descriptions-item>
            <el-descriptions-item label="评论量">{{ detail.reviewNum }}</el-descriptions-item>
            <el-descriptions-item label="收藏量">{{ detail.favorite }}</el-descriptions-item>
            <el-descriptions-item label="评分">{{ detail.rating }}</el-descriptions-item>
            <el-descriptions-item label="描述">{{ detail.description }}</el-descriptions-item>
            <el-descriptions-item label="开放时间">{{ detail.openTime }}</el-descriptions-item>
            <el-descriptions-item label="闭园时间">{{ detail.closeTime }}</el-descriptions-item>
            <el-descriptions-item label="最晚入园">{{ detail.lastEntryTime }}</el-descriptions-item>
            <el-descriptions-item label="地址">{{ detail.address }}</el-descriptions-item>
            <el-descriptions-item label="景点图片">{{ detail.imageUrl }}</el-descriptions-item>
            <el-descriptions-item label="导览图">{{ detail.guideMapUrl }}</el-descriptions-item>
            <el-descriptions-item label="导览标识">{{ detail.guideMapFlag }}</el-descriptions-item>
            <el-descriptions-item label="线路icon">{{ detail.routeIconUrl }}</el-descriptions-item>
            <el-descriptions-item label="短视频">{{ detail.summaryVideoUrl }}</el-descriptions-item>
            <el-descriptions-item label="票价">{{ detail.ticketPrice }}</el-descriptions-item>
            <el-descriptions-item label="景点介绍">{{ detail.introduce }}</el-descriptions-item>
            <el-descriptions-item label="介绍语音">{{ detail.introduceAudio }}</el-descriptions-item>
            <el-descriptions-item label="讲解词">{{ detail.explanation }}</el-descriptions-item>
            <el-descriptions-item label="讲解词语音">{{ detail.explanationUrl }}</el-descriptions-item>
            <el-descriptions-item label="特征类型">{{ detail.featuresType }}</el-descriptions-item>
            <el-descriptions-item label="景点类型">{{ detail.attractionType }}</el-descriptions-item>
            <el-descriptions-item label="规模">{{ detail.scale }}</el-descriptions-item>
            <el-descriptions-item label="服务类型">{{ detail.serviceType }}</el-descriptions-item>
            <el-descriptions-item label="创建人">{{ detail.createBy }}</el-descriptions-item>
            <el-descriptions-item label="创建时间">{{ detail.createTime }}</el-descriptions-item>
            <el-descriptions-item label="修改人">{{ detail.updateBy }}</el-descriptions-item>
            <el-descriptions-item label="修改时间">{{ detail.updateTime }}</el-descriptions-item>
            <el-descriptions-item label="备注">{{ detail.info }}</el-descriptions-item>
            <el-descriptions-item label="租户ID">{{ detail.tenantId }}</el-descriptions-item>
          </el-descriptions>

          <el-divider>POI信息</el-divider>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="POI名称">{{ detail.poi?.name }}</el-descriptions-item>
            <el-descriptions-item label="地址">{{ detail.poi?.address }}</el-descriptions-item>
            <el-descriptions-item label="联系电话">{{ detail.poi?.tel }}</el-descriptions-item>
            <el-descriptions-item label="经度">{{ detail.poi?.longitude }}</el-descriptions-item>
            <el-descriptions-item label="纬度">{{ detail.poi?.latitude }}</el-descriptions-item>
            <el-descriptions-item label="类型">{{ detail.poi?.categoryType }}</el-descriptions-item>
            <el-descriptions-item label="POI类型">{{ detail.poi?.poiType }}</el-descriptions-item>
            <el-descriptions-item label="评论量">{{ detail.poi?.reviewNum }}</el-descriptions-item>
            <el-descriptions-item label="收藏量">{{ detail.poi?.favorite }}</el-descriptions-item>
            <el-descriptions-item label="状态">{{ detail.poi?.status }}</el-descriptions-item>
            <el-descriptions-item label="描述">{{ detail.poi?.description }}</el-descriptions-item>
            <el-descriptions-item label="创建人">{{ detail.poi?.createBy }}</el-descriptions-item>
            <el-descriptions-item label="创建时间">{{ detail.poi?.createTime }}</el-descriptions-item>
            <el-descriptions-item label="修改人">{{ detail.poi?.updateBy }}</el-descriptions-item>
            <el-descriptions-item label="修改时间">{{ detail.poi?.updateTime }}</el-descriptions-item>
            <el-descriptions-item label="备注">{{ detail.poi?.info }}</el-descriptions-item>
          </el-descriptions>

          <el-divider>视频信息列表</el-divider>
          <el-table :data="detail.videos || []" border size="small">
            <el-table-column prop="id" label="ID" width="80"/>
            <el-table-column prop="userId" label="达人ID" width="80"/>
            <el-table-column prop="title" label="标题"/>
            <el-table-column prop="description" label="描述"/>
            <el-table-column prop="orientationType" label="类型" width="80"/>
            <el-table-column prop="thumbnailUrl" label="封面图"/>
            <el-table-column prop="themeColor" label="主题色"/>
            <el-table-column prop="videoUrl" label="视频地址"/>
            <el-table-column prop="createDate" label="创建时间"/>
            <el-table-column prop="updateDate" label="修改时间"/>
            <el-table-column label="状态">
              <template #default="scope">
                <el-tag :type="scope.row.flag === '1' ? 'success' : 'info'">
                  {{ scope.row.flag === '1' ? '发布' : '草稿' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="createBy" label="创建人"/>
            <el-table-column prop="updateBy" label="修改人"/>
            <el-table-column prop="info" label="备注"/>
          </el-table>

          <el-divider>原始数据 JSON</el-divider>
          <pre class="json-view">
            {{ JSON.stringify(detail, null, 2) }}
          </pre>
        </div>

        <!-- 右侧：手机预览 -->
        <div class="preview-panel">
          <div class="phone">
            <div class="preview-screen"
                 :style="{ backgroundImage: `url(${templateImg})` }">

              <!-- 内容区 -->
              <div class="content">

                <!-- 媒体卡片 -->
                <div class="media-box">

                  <img
                      v-if="detail.imageUrl"
                      :src="detail.imageUrl"
                      class="media"
                  />

                  <video
                      v-if="detail.summaryVideoUrl"
                      class="media"
                      controls
                  >
                    <source :src="detail.summaryVideoUrl"/>
                  </video>

                  <!-- 标题 -->
                  <div class="title">
                    {{ detail.name || '景点名称' }}
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

      <el-skeleton v-else rows="6" animated/>
    </el-drawer>
  </div>
</template>

<script setup>
import {ref, onMounted} from "vue"
import axios from "axios"
import templateImg from '@/assets/template.png'

const drawerVisible = ref(false)
const detail = ref(null)
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
const openDrawer = async (id) => {
  drawerVisible.value = true
  detail.value = null

  try {
    const res = await axios.get(`/api/attraction/${id}`)
    detail.value = res.data.data
  } catch (e) {
    console.error(e)
  }
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

/* Drawer 内布局 */
.drawer-container {
  display: flex;
  height: 100%;
}

/* 左侧表单 */
.form-panel {
  width: 40%;
  padding: 20px;
  overflow-y: auto;
  border-right: 1px solid #eee;
  flex: 1;   /* ❌ 不要写死 40% */
  min-width: 500px;
}

/* 右侧预览 */
.preview-panel {
  width: 420px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: auto; /* 防止挤压 */
}

/* 手机外壳 */
.phone {
  width: 375px;
  height: 812px;

  //transform: scale(0.7);  /* 👈 推荐 0.65~0.8 */
  transform-origin: top center;
  flex-shrink: 0; /* 防止被压缩 */

  border-radius: 30px;
  background: #000;
  padding: 7px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
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

  padding-top: 90px;  /* 控制上间距 */
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
  bottom: 20px;
  left: 16px;

  font-size: 16px;
  font-weight: bold;
  color: #fff;
}

/* 底部按钮 */
.bottom-btn {
  width: 85%;
  height: 50px;

  margin-top: auto;   /* 自动贴底 */
  margin-bottom: 100px; /* 控制底部距离 */;

  background: #E0ED42;
  border-radius: 25px;

  display: flex;
  align-items: center;
  justify-content: center;

  font-weight: bold;
}
</style>