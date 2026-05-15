<template>
  <div class="vrt-root">
    <main class="vrt-main">
      
      <!-- ════ LEFT PANEL ════ -->
      <div class="left-panel">
        
        <!-- 模块一：卡片配置 -->
        <div class="panel-card">
          <div class="sec-label">
            <svg width="13" height="13" fill="none" stroke="#3b82f6" stroke-width="2.2" viewBox="0 0 24 24">
              <rect x="2" y="3" width="20" height="14" rx="2"/>
              <path d="M8 21h8M12 17v4"/>
            </svg>
            卡片配置
          </div>
          <div class="fields">
            <!-- 内容类型 -->
            <div class="field-group">
              <label class="field-label">
                内容类型 &nbsp;<span class="required">*</span>
              </label>
              <el-select v-model="cardType" style="width:100%" @change="onCardTypeChange">
                <el-option label="景点卡" value="attraction">
                  <span class="opt-label">🏔️ &nbsp;景点卡</span>
                </el-option>
                <el-option label="食品卡" value="food" disabled>
                  <span class="opt-label">🍜 &nbsp;食品卡 &nbsp;<el-tag size="small" type="info">开发中</el-tag></span>
                </el-option>
                <el-option label="商品卡" value="goods">
                  <span class="opt-label">🛍️ &nbsp;商品卡</span>
                </el-option>
              </el-select>
            </div>

            <!-- 内容ID -->
            <div class="field-group">
              <label class="field-label">
                内容 ID &nbsp;<span class="required">*</span>
              </label>
              <el-select
                v-model="selectedAttractionId"
                filterable
                :placeholder="cardType === 'attraction' ? '输入景点名称快速搜索...' : cardType === 'goods' ? '输入商品名称快速搜索...' : '输入名称快速搜索...'"
                :loading="attractionLoading"
                style="width:100%"
                @change="onAttractionChange"
              >
                <el-option
                  v-for="item in attractionList"
                  :key="item.attractionId"
                  :label="item.name"
                  :value="item.attractionId"
                >
                  <div class="opt-attraction">
                    <span class="opt-name">{{ item.name }}</span>
                    <el-tag v-if="hasVideo(item)" size="small" type="success" effect="plain">有视频</el-tag>
                    <el-tag v-else size="small" type="info" effect="plain">无视频</el-tag>
                  </div>
                </el-option>
              </el-select>
            </div>
          </div>
        </div>

        <!-- 模块二：内容信息 -->
        <div v-if="selectedAttraction" class="panel-card">
          <div class="sec-label">
            <svg width="13" height="13" fill="none" stroke="#3b82f6" stroke-width="2.2" viewBox="0 0 24 24">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
            </svg>
            {{ cardType === 'attraction' ? '景点信息' : '内容信息' }}
          </div>
          
          <div class="content-info">
            <!-- 缩略图 -->
            <div class="info-thumb-row">
              <el-image
                v-if="selectedAttraction.thumbnailUrl"
                :src="selectedAttraction.thumbnailUrl"
                class="info-thumb"
                fit="cover"
                :preview-src-list="[selectedAttraction.thumbnailUrl]"
                preview-teleported
              />
              <div v-else class="info-thumb-empty">
                <svg width="20" height="20" fill="none" stroke="var(--el-text-color-secondary)" stroke-width="1.5" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
              </div>
            </div>

            <!-- 详细信息 -->
            <div class="info-details">
              <div class="info-row">
                <span class="info-label">ID：</span>
                <span class="info-value">{{ selectedAttraction.attractionId }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">名称：</span>
                <span class="info-value">{{ selectedAttraction.name }}</span>
              </div>
              <div class="info-row" v-if="selectedAttraction.title">
                <span class="info-label">标题：</span>
                <span class="info-value">{{ selectedAttraction.title }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">视频ID：</span>
                <span class="info-value">{{ selectedAttraction.videoId || '无' }}</span>
              </div>
              <div class="info-row" v-if="selectedAttraction.thumbnailUrl">
                <span class="info-label">起播图：</span>
                <a :href="selectedAttraction.thumbnailUrl" target="_blank" class="info-link" :title="selectedAttraction.thumbnailUrl">
                  {{ selectedAttraction.thumbnailUrl }}
                </a>
              </div>
              <div class="info-row" v-if="selectedAttraction.videoUrl">
                <span class="info-label">视频：</span>
                <a :href="selectedAttraction.videoUrl" target="_blank" class="info-link" :title="selectedAttraction.videoUrl">
                  {{ selectedAttraction.videoUrl }}
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- 模块三：路径预览 -->
        <div class="panel-card" v-if="generatedVideoUrl || generatedCoverUrl">
          <div class="sec-label">
            <svg width="13" height="13" fill="none" stroke="#3b82f6" stroke-width="2.2" viewBox="0 0 24 24">
              <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
              <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
            </svg>
            路径预览
          </div>
          <div class="url-preview-container">
            <!-- 视频URL -->
            <div class="url-preview-item" v-if="generatedVideoUrl">
              <label class="url-label">
                <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path d="M15 10l4.553-2.069A1 1 0 0121 8.845v6.31a1 1 0 01-1.447.894L15 14"/>
                  <rect x="3" y="6" width="12" height="12" rx="2"/>
                </svg>
                视频 URL
              </label>
              <div class="url-box">
                <input
                  type="text"
                  :value="generatedVideoUrl"
                  readonly
                  class="url-input"
                />
                <button class="url-copy-btn" @click="copyVideoUrl" title="复制视频URL">
                  <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
                  </svg>
                </button>
              </div>
            </div>
            
            <!-- 起播图URL -->
            <div class="url-preview-item" v-if="generatedCoverUrl">
              <label class="url-label">
                <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
                起播图 URL
              </label>
              <div class="url-box">
                <input
                  type="text"
                  :value="generatedCoverUrl"
                  readonly
                  class="url-input"
                />
                <button class="url-copy-btn" @click="copyCoverUrl" title="复制起播图URL">
                  <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

      </div><!-- /left-panel -->

      <!-- ════ RIGHT PANEL ════ -->
      <div class="right-panel">
        
        <!-- 视频对比区域 -->
        <div class="comparison-area" :style="{ height: comparisonHeight + 'px' }">
          <div class="comparison-grid">
            
            <!-- 旧视频 -->
            <div class="video-box">
              <div class="video-box-header">
                <span class="vbox-title">原视频</span>
                <el-tag size="small" type="info">当前</el-tag>
              </div>
              <div class="video-box-body">
                <div v-if="oldVideoUrl" class="video-player">
                  <video :src="oldVideoUrl" controls class="video-element"></video>
                </div>
                <div v-else class="video-empty">
                  <svg width="32" height="32" fill="none" stroke="var(--el-text-color-secondary)" stroke-width="1.5" viewBox="0 0 24 24">
                    <path d="M15 10l4.553-2.069A1 1 0 0121 8.845v6.31a1 1 0 01-1.447.894L15 14"/>
                    <rect x="3" y="6" width="12" height="12" rx="2"/>
                  </svg>
                  <p>暂无视频</p>
                </div>
              </div>
              <div class="video-box-footer" v-if="oldCoverUrl">
                <span class="footer-label">起播图：</span>
                <el-image
                  :src="oldCoverUrl"
                  class="footer-cover"
                  fit="cover"
                  :preview-src-list="[oldCoverUrl]"
                  preview-teleported
                />
              </div>
            </div>

            <!-- 新视频 - 集成上传功能 -->
            <div class="video-box video-box-upload">
              <div class="video-box-header">
                <span class="vbox-title">新视频</span>
                <el-tag size="small" type="success">替换</el-tag>
              </div>
              
              <!-- 视频上传区域 -->
              <div class="video-box-body">
                <div v-if="newVideoPreview" class="video-player">
                  <video :src="newVideoPreview" controls class="video-element"></video>
                </div>
                <div 
                  v-else 
                  class="video-upload-zone"
                  :class="{ over: isDragOver }"
                  @dragover.prevent="isDragOver = true"
                  @dragleave.self="isDragOver = false"
                  @drop.prevent="onDrop"
                  @click="fileInputRef?.click()"
                >
                  <input
                    ref="fileInputRef"
                    type="file"
                    accept="video/*"
                    class="hidden-input"
                    @change="onFileChange"
                  />
                  <div class="upload-placeholder">
                    <div class="upload-icon-wrap">
                      <svg width="28" height="28" fill="none" stroke="#3b82f6" stroke-width="1.6" viewBox="0 0 24 24">
                        <path d="M15 10l4.553-2.069A1 1 0 0121 8.845v6.31a1 1 0 01-1.447.894L15 14"/>
                        <rect x="3" y="6" width="12" height="12" rx="2"/>
                      </svg>
                    </div>
                    <p class="upload-hint-main">点击选择视频 或 拖拽到此处</p>
                    <p class="upload-hint-sub">支持 MP4 · MOV · AVI · MKV</p>
                  </div>
                </div>
              </div>
              
              <!-- 文件信息和起播图操作 -->
              <div class="video-box-footer" v-if="selectedFile || newCoverPreview">
                <div class="footer-content">
                  <!-- 文件信息 -->
                  <div v-if="selectedFile" class="file-info-compact">
                    <div class="file-info-main">
                      <svg width="14" height="14" fill="none" stroke="#60a5fa" stroke-width="2" viewBox="0 0 24 24">
                        <path d="M15 10l4.553-2.069A1 1 0 0121 8.845v6.31a1 1 0 01-1.447.894L15 14"/>
                        <rect x="3" y="6" width="12" height="12" rx="2"/>
                      </svg>
                      <span class="file-info-name">{{ selectedFile.name }}</span>
                      <span class="file-info-size">{{ fmtBytes(selectedFile.size) }}</span>
                      <button class="file-clear-btn-mini" @click.stop="clearFile" title="清除文件">
                        <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                          <line x1="18" y1="6" x2="6" y2="18"/>
                          <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <!-- 起播图预览和操作 -->
                  <div class="cover-operations">
                    <span class="footer-label">起播图：</span>
                    <div v-if="newCoverPreview" class="footer-cover-wrap">
                      <el-image
                        :src="newCoverPreview"
                        class="footer-cover"
                        fit="cover"
                        :preview-src-list="[newCoverPreview]"
                        preview-teleported
                      />
                    </div>
                    <span v-else class="footer-empty">未生成</span>
                    
                    <!-- 起播图操作按钮 -->
                    <div class="cover-action-btns" v-if="selectedFile">
                      <button 
                        class="cover-action-btn"
                        :class="{ active: coverMethod === 'upload' }"
                        @click="onSelectCoverMethod('upload')"
                        title="上传起播图"
                      >
                        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                          <polyline points="17 8 12 3 7 8"/>
                          <line x1="12" y1="3" x2="12" y2="15"/>
                        </svg>
                        <span>上传</span>
                      </button>
                      
                      <button 
                        class="cover-action-btn"
                        :class="{ active: coverMethod === 'capture' }"
                        @click="onSelectCoverMethod('capture')"
                        title="截取第一帧"
                      >
                        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                          <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
                          <circle cx="12" cy="13" r="4"/>
                        </svg>
                        <span>截取</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>


          </div>
        </div>

        <!-- 分隔条 -->
        <div
          class="resizer"
          @mousedown="startResize"
        >
          <div class="resizer-handle"></div>
        </div>

        <!-- 处理日志 -->
        <div class="log-area panel-card">
          <div class="log-toolbar">
            <div class="log-toolbar-left">
              <div class="tl-dots">
                <span class="tl-dot" style="background:#ff5f57;"/>
                <span class="tl-dot" style="background:#febc2e;"/>
                <span class="tl-dot" style="background:#28c840;"/>
              </div>
              <span class="log-filename">execution.log</span>
            </div>
            <div class="log-toolbar-right">
              <span class="log-count">{{ logs.length }} lines</span>
              <button class="log-btn" @click="clearLog">清空</button>
              <button class="log-btn log-btn-export" @click="exportLog">导出</button>
            </div>
          </div>

          <div ref="logBodyRef" class="terminal">
            <div v-for="(line, idx) in logs" :key="idx" class="log-line">
              <span class="l-time">{{ line.time }}</span>
              <span :class="logCls(line.type)">{{ line.text }}</span>
            </div>
          </div>

          <div class="status-bar">
            <div class="stat-row">
              <div class="stat-left">
                <span class="dot" :class="dotClass" />
                <span class="stat-label">{{ statusLabel }}</span>
                <span v-if="statusStep" class="stat-step">—&nbsp;&nbsp;{{ statusStep }}</span>
              </div>
              <div class="stat-right">
                <span class="stat-meta">进度 <em>{{ progressText }}</em></span>
                <span class="stat-meta">耗时 <em>{{ elapsedText }}</em></span>
              </div>
            </div>
            <div class="prog-track">
              <div class="prog-fill" :style="{ width: progress + '%' }" />
            </div>
          </div>
        </div>

      </div><!-- /right-panel -->

    </main>

    <!-- 底部执行按钮区 -->
    <div class="bottom-actions">
      <button class="btn-exec-bottom" @click="onExecute">
        <svg v-if="!isRunning" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <polygon points="5 3 19 12 5 21 5 3"/>
        </svg>
        <svg v-else class="spin" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="9" stroke-dasharray="28 8" stroke-linecap="round"/>
        </svg>
        <span>{{ isRunning ? '执行中…' : '开始替换视频' }}</span>
      </button>
    </div>

    <!-- 隐藏的起播图上传input -->
    <input
      ref="coverInputRef"
      type="file"
      accept="image/*"
      class="hidden-input"
      @change="onCoverChange"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

/* ═══════════════════════════════════════
   状态管理
═══════════════════════════════════════ */
const cardType = ref('attraction')
const attractionList = ref([]) // 通用列表，用于景点和商品
const attractionLoading = ref(false)
const selectedAttractionId = ref(null) // 通用ID，用于景点和商品
const selectedAttraction = ref(null) // 通用对象，用于景点和商品

const selectedFile = ref(null)
const isDragOver = ref(false)
const fileInputRef = ref(null)
const coverInputRef = ref(null)
const logBodyRef = ref(null)

const isRunning = ref(false)
const logs = ref([])
const progress = ref(0)
const statusState = ref('idle')
const statusStep = ref('')
const elapsedMs = ref(0)
const taskStartMs = ref(0)

// 视频预览
const oldVideoUrl = ref('')
const oldCoverUrl = ref('')
const newVideoPreview = ref(null)
const newCoverPreview = ref(null)

// 生成的URL
const generatedVideoUrl = ref('')
const generatedCoverUrl = ref('')

// 可调整大小
const comparisonHeight = ref(400)
const isResizing = ref(false)

// 起播图方式选择：'upload' | 'capture' | null
const coverMethod = ref(null)

/* ═══════════════════════════════════════
   Computed
═══════════════════════════════════════ */
const fileExt = computed(() =>
  selectedFile.value ? selectedFile.value.name.split('.').pop().toUpperCase() : ''
)
const dotClass = computed(() =>
  ({ idle: 'dot-idle', run: 'dot-run', ok: 'dot-ok', err: 'dot-err' }[statusState.value] || 'dot-idle')
)
const statusLabel = computed(() =>
  ({ idle: '空闲', run: '运行中', ok: '执行完成', err: '执行失败' }[statusState.value] || '空闲')
)
const progressText = computed(() =>
  statusState.value === 'idle' ? '—' : progress.value + '%'
)
const elapsedText = computed(() =>
  elapsedMs.value === 0 ? '—' : (elapsedMs.value / 1000).toFixed(1) + 's'
)

/* ═══════════════════════════════════════
   判断是否有视频
   - 景点卡：使用 videoId 判断
   - 其他卡片：使用 videoUrl 判断
═══════════════════════════════════════ */
function hasVideo(item) {
  if (cardType.value === 'attraction') {
    // 景点卡：使用 videoId 判断
    return !!item.videoId
  } else {
    // 商品卡、美食卡等：使用 videoUrl 判断
    return !!item.videoUrl
  }
}

/* ═══════════════════════════════════════
   加载景点列表
═══════════════════════════════════════ */
async function loadAttractions() {
  attractionLoading.value = true
  try {
    const res = await axios.get('/api/attraction/getAllSecondaryAttractions')
    const data = res.data?.data || []
    attractionList.value = data

    if (data.length > 0) {
      addLog('success', `[SUCCESS] 景点列表加载完成，共 ${data.length} 条`)
    }
  } catch (e) {
    addLog('error', `[ERROR] 景点列表加载失败：${e.message}`)
  } finally {
    attractionLoading.value = false
  }
}

/* ═══════════════════════════════════════
   加载商品列表
═══════════════════════════════════════ */
async function loadGoods() {
  attractionLoading.value = true
  try {
    // 调用商品分页接口，获取全部数据（不分页，size设置大一点）
    const res = await axios.get('/api/goods/page', {
      params: {
        page: 1,
        size: 100 // 获取大量数据
      }
    })
    const records = res.data?.data?.records || []
    
    // 将商品数据适配成统一格式
    attractionList.value = records.map(goods => ({
      attractionId: goods.id, // 商品ID映射为attractionId
      name: goods.name,
      title: goods.title,
      videoId: null, // 商品表没有videoId字段
      videoUrl: goods.videoUrl,
      thumbnailUrl: goods.coverImageUrl, // 商品的coverImageUrl映射为thumbnailUrl
      imageUrl: goods.imageUrl
    }))

    if (records.length > 0) {
      addLog('success', `[SUCCESS] 商品列表加载完成，共 ${records.length} 条`)
    }
  } catch (e) {
    addLog('error', `[ERROR] 商品列表加载失败：${e.message}`)
  } finally {
    attractionLoading.value = false
  }
}

function onCardTypeChange(type) {
  selectedAttractionId.value = null
  selectedAttraction.value = null
  oldVideoUrl.value = ''
  oldCoverUrl.value = ''
  const labelMap = { attraction: '景点卡', food: '食品卡', goods: '商品卡' }
  addLog('info', `[INFO] 已切换卡片类型：${labelMap[type] || type}`)
  
  // 根据卡片类型加载对应的列表
  if (type === 'attraction') {
    loadAttractions()
  } else if (type === 'goods') {
    loadGoods()
  }
}

function onAttractionChange(id) {
  selectedAttraction.value = attractionList.value.find(a => a.attractionId === id) || null
  if (selectedAttraction.value) {
    const typeName = cardType.value === 'attraction' ? '景点' : cardType.value === 'goods' ? '商品' : '内容'
    addLog('info', `[INFO] 已选择${typeName}：${selectedAttraction.value.name}（ID: ${id}）`)
    
    // 加载原视频和起播图
    if (selectedAttraction.value.videoUrl) {
      oldVideoUrl.value = selectedAttraction.value.videoUrl
      addLog('info', `[INFO] 已加载原视频：${selectedAttraction.value.videoTitle || ''}`)
    } else {
      oldVideoUrl.value = ''
      addLog('warn', `[WARN] 该${typeName}暂无视频`)
    }
    
    if (selectedAttraction.value.thumbnailUrl) {
      oldCoverUrl.value = selectedAttraction.value.thumbnailUrl
    } else {
      oldCoverUrl.value = ''
    }
  }
}

/* ═══════════════════════════════════════
   文件选择
═══════════════════════════════════════ */
function onDrop(e) {
  isDragOver.value = false
  const f = e.dataTransfer?.files?.[0]
  if (f) setFile(f)
}

function onFileChange(e) {
  const f = e.target.files?.[0]
  if (f) setFile(f)
}

function setFile(f) {
  if (!f.type.startsWith('video/')) {
    addLog('error', `[ERROR] 文件类型不支持：${f.type}`)
    ElMessage.error('文件类型不支持，请选择视频文件')
    return
  }
  
  // 前端限制视频文件大小：200MB
  const maxVideoSize = 200 * 1024 * 1024 // 200MB
  if (f.size > maxVideoSize) {
    const fileSizeStr = fmtBytes(f.size)
    const maxSizeStr = fmtBytes(maxVideoSize)
    addLog('error', `[ERROR] 视频文件过大：${fileSizeStr}，最大支持 ${maxSizeStr}`)
    ElMessage.error(`视频文件过大（${fileSizeStr}），最大支持 ${maxSizeStr}`)
    return
  }
  
  selectedFile.value = f
  addLog('info', `[INFO] 已选择文件：${f.name}（${fmtBytes(f.size)}）`)
  
  // 生成预览
  newVideoPreview.value = URL.createObjectURL(f)
  
  // 根据上传的视频文件生成视频URL
  generateVideoUrl()
}

function clearFile() {
  selectedFile.value = null
  newVideoPreview.value = null
  newCoverPreview.value = null
  generatedVideoUrl.value = ''
  generatedCoverUrl.value = ''
  coverMethod.value = null
  if (fileInputRef.value) fileInputRef.value.value = ''
  if (coverInputRef.value) coverInputRef.value.value = ''
}

/* ═══════════════════════════════════════
   URL生成 - 根据实际上传文件动态生成
═══════════════════════════════════════ */

// 生成新文件名：ID_年月日时分秒.扩展名
function generateFileName(fileExt) {
  if (!selectedAttractionId.value) return ''
  
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hour = String(now.getHours()).padStart(2, '0')
  const minute = String(now.getMinutes()).padStart(2, '0')
  const second = String(now.getSeconds()).padStart(2, '0')
  
  const timestamp = `${year}${month}${day}${hour}${minute}${second}`
  return `${selectedAttractionId.value}_${timestamp}.${fileExt}`
}

/**
 * ⚠️ OSS路径配置说明 - 视频文件路径 ⚠️
 * 
 * 根据上传的视频文件生成视频URL
 * 如需修改视频上传路径，请修改此函数中的 basePath 变量值
 * 
 * 当前配置：
 * - 景点视频：videos/attractionVideo/video/quickTools/
 * - 美食视频：videos/foodVideo/video/quickTools/
 * - 商品视频：videos/productVideo/video/quickTools/
 * 
 * 同时需要同步修改：
 * 1. 后端文件：material/src/main/java/com/cube/material/service/impl/VideoServiceImpl.java
 *    的 buildVideoObjectName() 方法中的 basePath
 * 2. API文档：material/API_SUMMARY.md 中的路径说明
 */
function generateVideoUrl() {
  if (!selectedAttractionId.value || !selectedFile.value) {
    generatedVideoUrl.value = ''
    return
  }
  
  // 获取原始文件扩展名
  const originalExt = selectedFile.value.name.split('.').pop().toLowerCase()
  const newFileName = generateFileName(originalExt)
  
  // 根据不同卡片类型生成不同的基础路径
  let basePath = ''
  if (cardType.value === 'attraction') {
    basePath = 'https://videos.biliq.com/videos/attractionVideo/video/quickTools'
  } else if (cardType.value === 'food') {
    basePath = 'https://videos.biliq.com/videos/foodVideo/video/quickTools'
  } else if (cardType.value === 'goods') {
    basePath = 'https://videos.biliq.com/videos/m3u8/goods'
  }
  generatedVideoUrl.value = `${basePath}/${newFileName}`
  addLog('info', `[INFO] 已生成视频URL：${newFileName}`)
}

/**
 * ⚠️ OSS路径配置说明 - 起播图文件路径 ⚠️
 * 
 * 根据上传的起播图文件生成起播图URL
 * 如需修改起播图上传路径，请修改此函数中的 basePath 变量值
 * 
 * 当前配置：
 * - 景点起播图：images/attractionVideo/quickTools/
 * - 美食起播图：images/foodVideo/quickTools/
 * - 商品起播图：images/productVideo/quickTools/
 * 
 * 同时需要同步修改：
 * 1. 后端文件：material/src/main/java/com/cube/material/service/impl/VideoServiceImpl.java
 *    的 buildThumbnailObjectName() 方法中的 basePath
 * 2. API文档：material/API_SUMMARY.md 中的路径说明
 */
function generateCoverUrl(file) {
  if (!selectedAttractionId.value || !file) {
    generatedCoverUrl.value = ''
    return
  }
  
  // 获取图片扩展名
  const imageExt = file.name.split('.').pop().toLowerCase()
  const newFileName = generateFileName(imageExt)
  
  // 根据不同卡片类型生成不同的基础路径
  let basePath = ''
  if (cardType.value === 'attraction') {
    basePath = 'https://images.biliq.com/images/attractionVideo/quickTools'
  } else if (cardType.value === 'food') {
    basePath = 'https://images.biliq.com/images/foodVideo/quickTools'
  } else if (cardType.value === 'goods') {
    basePath = 'https://images.biliq.com/images/goods/images'
  }
  generatedCoverUrl.value = `${basePath}/${newFileName}`
  addLog('info', `[INFO] 已生成起播图URL：${newFileName}`)
}

/* ═══════════════════════════════════════
   起播图操作
═══════════════════════════════════════ */
function onSelectCoverMethod(method) {
  if (method === 'upload') {
    coverMethod.value = 'upload'
    coverInputRef.value?.click()
  } else if (method === 'capture') {
    coverMethod.value = 'capture'
    captureFrame()
  }
}

function onCoverChange(e) {
  const f = e.target.files?.[0]
  if (!f) {
    return
  }
  
  if (!f.type.startsWith('image/')) {
    addLog('error', `[ERROR] 文件类型不支持：${f.type}`)
    ElMessage.error('文件类型不支持，请选择图片文件')
    coverMethod.value = null
    return
  }
  
  // 前端限制起播图文件大小：10MB
  const maxImageSize = 10 * 1024 * 1024 // 10MB
  if (f.size > maxImageSize) {
    const fileSizeStr = fmtBytes(f.size)
    const maxSizeStr = fmtBytes(maxImageSize)
    addLog('error', `[ERROR] 起播图文件过大：${fileSizeStr}，最大支持 ${maxSizeStr}`)
    ElMessage.error(`起播图文件过大（${fileSizeStr}），最大支持 ${maxSizeStr}`)
    coverMethod.value = null
    return
  }
  
  newCoverPreview.value = URL.createObjectURL(f)
  // 生成起播图URL
  generateCoverUrl(f)
  addLog('success', '[SUCCESS] 起播图已上传')
}

function captureFrame() {
  if (!newVideoPreview.value) return
  
  // 创建video元素截取第一帧
  const video = document.createElement('video')
  video.src = newVideoPreview.value
  video.currentTime = 0.1
  
  video.addEventListener('loadeddata', () => {
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    ctx.drawImage(video, 0, 0)
    
    canvas.toBlob(blob => {
      newCoverPreview.value = URL.createObjectURL(blob)
      // 创建一个虚拟文件对象用于生成URL
      const fakeFile = new File([blob], 'captured.jpg', { type: 'image/jpeg' })
      generateCoverUrl(fakeFile)
      addLog('success', '[SUCCESS] 已截取视频第一帧作为起播图')
    })
  })
}

function clearPreview() {
  newVideoPreview.value = null
  newCoverPreview.value = null
  clearFile()
  addLog('info', '[INFO] 预览已清除')
}

/* ═══════════════════════════════════════
   URL操作
═══════════════════════════════════════ */
function copyVideoUrl() {
  navigator.clipboard.writeText(generatedVideoUrl.value)
  ElMessage.success('视频URL已复制到剪贴板')
}

function copyCoverUrl() {
  navigator.clipboard.writeText(generatedCoverUrl.value)
  ElMessage.success('起播图URL已复制到剪贴板')
}

/* ═══════════════════════════════════════
   执行替换
═══════════════════════════════════════ */
async function onExecute() {
  if (isRunning.value) return
  if (!selectedAttractionId.value) {
    const typeName = cardType.value === 'attraction' ? '景点' : cardType.value === 'goods' ? '商品' : '内容'
    ElMessage.error(`请先选择${typeName}`)
    return
  }
  
  // 判断是新增还是替换场景
  const isNewVideo = !selectedAttraction.value?.videoId
  
  // 新增视频：必须同时上传视频 + 起播图（或截取第一帧）
  if (isNewVideo) {
    if (!selectedFile.value) {
      ElMessage.error('新增视频时必须上传视频文件')
      return
    }
    if (!coverMethod.value || !newCoverPreview.value) {
      ElMessage.error('新增视频时必须提供起播图（上传或截取视频第一帧）')
      return
    }
  }
  
  // 替换场景：至少要有一个操作
  if (!isNewVideo) {
    const hasVideoUpdate = !!selectedFile.value
    const hasCoverUpdate = coverMethod.value && newCoverPreview.value
    
    if (!hasVideoUpdate && !hasCoverUpdate) {
      ElMessage.error('请至少选择一个操作：更新视频、上传起播图或截取起播图')
      return
    }
    
    // 如果更新视频，必须同时更新起播图
    if (hasVideoUpdate && !hasCoverUpdate) {
      ElMessage.error('更新视频时必须同时更新起播图（上传或截取视频第一帧）')
      return
    }
  }

  isRunning.value = true
  taskStartMs.value = Date.now()
  progress.value = 0
  
  const typeName = cardType.value === 'attraction' ? '景点' : cardType.value === 'goods' ? '商品' : '内容'
  addLog('sep', '[────────────────────────────────────────────]')
  addLog('info', `[INFO] 任务启动 — ${typeName} ${selectedAttraction.value?.name}（ID: ${selectedAttractionId.value}）`)
  addLog('info', `[INFO] 操作类型：${isNewVideo ? '新增视频' : '替换视频'}`)
  if (selectedFile.value) {
    addLog('info', `[INFO] 视频文件：${selectedFile.value.name} | ${fmtBytes(selectedFile.value.size)}`)
  }
  if (coverMethod.value) {
    addLog('info', `[INFO] 起播图方式：${coverMethod.value === 'upload' ? '手动上传' : '自动截取'}`)
  }
  addLog('sep', '[────────────────────────────────────────────]')

  try {
    setStatus('run', '准备上传文件…', 5)
    
    // ⚠️ 重要：一次性生成时间戳，确保视频和起播图文件名中的时间戳一致
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const hour = String(now.getHours()).padStart(2, '0')
    const minute = String(now.getMinutes()).padStart(2, '0')
    const second = String(now.getSeconds()).padStart(2, '0')
    const timestamp = `${year}${month}${day}${hour}${minute}${second}`
    
    addLog('info', `[INFO] 生成统一时间戳：${timestamp}`)
    
    // 构建FormData
    const formData = new FormData()
    formData.append('videoFile', selectedFile.value)
    formData.append('cardType', cardType.value)
    formData.append('contentId', selectedAttractionId.value)
    
    // 生成视频文件名（使用统一时间戳）
    const videoExt = selectedFile.value.name.split('.').pop().toLowerCase()
    const videoFileName = `${selectedAttractionId.value}_${timestamp}.${videoExt}`
    formData.append('videoFileName', videoFileName)
    addLog('info', `[INFO] 视频文件名：${videoFileName}`)
    
    // 处理起播图（使用相同的时间戳）
    if (coverMethod.value === 'upload' && coverInputRef.value?.files?.[0]) {
      const thumbnailFile = coverInputRef.value.files[0]
      const thumbnailExt = thumbnailFile.name.split('.').pop().toLowerCase()
      const thumbnailFileName = `${selectedAttractionId.value}_${timestamp}.${thumbnailExt}`
      
      formData.append('thumbnailFile', thumbnailFile)
      formData.append('thumbnailFileName', thumbnailFileName)
      formData.append('thumbnailSource', 'upload')
      addLog('info', `[INFO] 起播图文件名：${thumbnailFileName}`)
      addLog('info', '[INFO] 已添加上传的起播图')
    } else if (coverMethod.value === 'capture' && newCoverPreview.value) {
      // 将Blob转为File（使用相同的时间戳）
      const blob = await fetch(newCoverPreview.value).then(r => r.blob())
      const thumbnailFileName = `${selectedAttractionId.value}_${timestamp}.jpg`
      const file = new File([blob], thumbnailFileName, { type: 'image/jpeg' })
      
      formData.append('thumbnailFile', file)
      formData.append('thumbnailFileName', thumbnailFileName)
      formData.append('thumbnailSource', 'capture')
      addLog('info', `[INFO] 起播图文件名：${thumbnailFileName}`)
      addLog('info', '[INFO] 已添加截取的起播图')
    } else {
      // 不提供起播图，后端不自动生成
      formData.append('autoGenerateThumbnail', 'false')
      addLog('info', '[INFO] 未提供起播图，将跳过')
    }
    
    addLog('info', '[INFO] 开始调用后端API...')
    setStatus('run', '正在上传文件到服务器…', 15)
    
    // 调用后端接口（使用代理路径）
    const response = await axios.post('/api/video/replace', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          // 上传进度占总进度的15%-75% (60个百分点)
          const totalProgress = 15 + Math.round(percentCompleted * 0.6)
          setStatus('run', `正在上传文件（${percentCompleted}%）…`, totalProgress)
        }
      }
    })
    
    setStatus('run', '处理服务器响应…', 80)
    addLog('info', '[INFO] 服务器响应接收完成')
    
    // 检查响应
    if (response.data && response.data.code === 200) {
      const result = response.data.data
      
      setStatus('run', '解析处理结果…', 90)
      
      // 显示处理步骤
      if (result.processSteps && Array.isArray(result.processSteps)) {
        for (const step of result.processSteps) {
          if (step.status === 'success') {
            addLog('success', `[SUCCESS] ${step.message}`)
          } else if (step.status === 'skipped') {
            addLog('warn', `[WARN] ${step.message}`)
          } else if (step.status === 'failed') {
            addLog('error', `[ERROR] ${step.message}`)
          }
        }
      }
      
      // 更新生成的URL
      if (result.videoUrl) {
        generatedVideoUrl.value = result.videoUrl
        addLog('info', `[INFO] 视频URL：${result.videoUrl}`)
      }
      if (result.thumbnailUrl) {
        generatedCoverUrl.value = result.thumbnailUrl
        addLog('info', `[INFO] 起播图URL：${result.thumbnailUrl}`)
      }
      if (result.videoId) {
        addLog('info', `[INFO] 视频ID：${result.videoId}`)
      }
      
      // 显示文件信息
      if (result.videoInfo) {
        addLog('info', `[INFO] 视频大小：${fmtBytes(result.videoInfo.fileSize || 0)}`)
      }
      
      setStatus('ok', '替换完成', 100)
      addLog('sep', '[────────────────────────────────────────────]')
      addLog('success', '[SUCCESS] ✓ 视频替换完成！')
      addLog('sep', '[────────────────────────────────────────────]')
      
      ElMessage.success('视频替换成功！')
      
      // 刷新列表以显示最新数据
      if (cardType.value === 'attraction') {
        await loadAttractions()
      } else if (cardType.value === 'goods') {
        await loadGoods()
      }
      
      if (selectedAttractionId.value) {
        onAttractionChange(selectedAttractionId.value)
      }
    } else {
      throw new Error(response.data?.msg || '服务器返回错误')
    }
    
  } catch (err) {
    setStatus('err', '执行失败', null)
    const errorMsg = err.response?.data?.msg || err.message || '未知错误'
    addLog('error', `[ERROR] ${errorMsg}`)
    addLog('sep', '[────────────────────────────────────────────]')
    ElMessage.error(`视频替换失败：${errorMsg}`)
  } finally {
    isRunning.value = false
    const elapsed = Date.now() - taskStartMs.value
    elapsedMs.value = elapsed
    addLog('info', `[INFO] 总耗时：${(elapsed / 1000).toFixed(2)}s`)
  }
}

function onReset() {
  // 清空视频文件和生成的URL
  selectedFile.value = null
  newVideoPreview.value = null
  newCoverPreview.value = null
  generatedVideoUrl.value = ''
  generatedCoverUrl.value = ''
  coverMethod.value = null
  if (fileInputRef.value) fileInputRef.value.value = ''
  if (coverInputRef.value) coverInputRef.value.value = ''
  addLog('info', '[INFO] 已重置上传状态')
}

/* ═══════════════════════════════════════
   调整大小
═══════════════════════════════════════ */
function startResize(e) {
  isResizing.value = true
  const startY = e.clientY
  const startHeight = comparisonHeight.value

  const onMouseMove = (e) => {
    const delta = e.clientY - startY
    const newHeight = Math.max(200, Math.min(600, startHeight + delta))
    comparisonHeight.value = newHeight
  }

  const onMouseUp = () => {
    isResizing.value = false
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
  }

  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
}

/* ═══════════════════════════════════════
   状态与日志
═══════════════════════════════════════ */
function setStatus(state, step, prog) {
  statusState.value = state
  statusStep.value = step || ''
  if (prog !== null && prog !== undefined) progress.value = prog
}

function addLog(type, text) {
  const now = new Date()
  const time = [now.getHours(), now.getMinutes(), now.getSeconds()]
    .map(n => String(n).padStart(2, '0')).join(':')
  logs.value.push({ time, type, text })
  nextTick(() => {
    if (logBodyRef.value) logBodyRef.value.scrollTop = logBodyRef.value.scrollHeight
  })
}

function logCls(type) {
  return { info:'l-info', success:'l-success', warn:'l-warn', error:'l-error', link:'l-link', sep:'l-sep' }[type] || 'l-info'
}

function clearLog() {
  logs.value = []
}

function exportLog() {
  let txt = `视频替换工具日志\n导出时间：${new Date().toLocaleString()}\n${'='.repeat(60)}\n`
  logs.value.forEach(l => { txt += `${l.time}  ${l.text}\n` })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([txt], { type: 'text/plain;charset=utf-8' }))
  a.download = `exec_log_${Date.now()}.txt`
  a.click()
}

/* ═══════════════════════════════════════
   工具函数
═══════════════════════════════════════ */
function fmtBytes(b) {
  if (b < 1024) return b + ' B'
  if (b < 1048576) return (b / 1024).toFixed(1) + ' KB'
  if (b < 1073741824) return (b / 1048576).toFixed(1) + ' MB'
  return (b / 1073741824).toFixed(2) + ' GB'
}

const wait = ms => new Promise(r => setTimeout(r, ms))

/* ═══════════════════════════════════════
   生命周期
═══════════════════════════════════════ */
onMounted(() => {
  addLog('info', '[INFO] 系统初始化完成')
  loadAttractions()
})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

.terminal::-webkit-scrollbar { width: 5px; }
.terminal::-webkit-scrollbar-track { background: var(--el-fill-color-blank); }
.terminal::-webkit-scrollbar-thumb { background: var(--el-border-color-dark); border-radius: 3px; }

.left-panel::-webkit-scrollbar { width: 4px; }
.left-panel::-webkit-scrollbar-track { background: transparent; }
.left-panel::-webkit-scrollbar-thumb { background: var(--el-border-color-dark); border-radius: 3px; }
</style>

<style scoped>
/* ═══════════════════════════════════════
   根容器
═══════════════════════════════════════ */
.vrt-root {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--el-bg-color-page);
  color: var(--el-text-color-primary);
  font-family: 'Inter', system-ui, sans-serif;
}

.vrt-main {
  flex: 1;
  min-height: 0;
  display: flex;
  gap: 20px;
  padding: 20px 24px 0;
}

/* ═══════════════════════════════════════
   Left panel
═══════════════════════════════════════ */
.left-panel {
  width: 420px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
  overflow-y: auto;
  padding-right: 4px;
  padding-bottom: 20px;
}

/* ═══════════════════════════════════════
   卡片
═══════════════════════════════════════ */
.panel-card {
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,.1);
  padding: 16px 18px;
  flex-shrink: 0;
  transition: all .3s;
}

.upload-card {
  padding: 16px 18px 16px;
}

.upload-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.sec-label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: .08em;
  text-transform: uppercase;
  color: var(--el-text-color-secondary);
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 0;
}
.panel-card > .sec-label {
  margin-bottom: 14px;
}
.sec-label::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--el-border-color-lighter);
}

/* 内联重置按钮 */
.btn-reset-inline {
  padding: 6px 12px;
  font-size: 11.5px;
  font-weight: 500;
  color: var(--el-text-color-secondary);
  background: var(--el-fill-color-lighter);
  border: 1px solid var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all .2s;
  font-family: inherit;
}
.btn-reset-inline:hover:not(:disabled) {
  border-color: var(--el-color-primary);
  color: var(--el-color-primary);
  background: var(--el-color-primary-light-9);
}
.btn-reset-inline:disabled {
  opacity: .4;
  cursor: not-allowed;
}

/* ═══════════════════════════════════════
   Fields
═══════════════════════════════════════ */
.fields { display: flex; flex-direction: column; gap: 12px; }
.field-group { display: flex; flex-direction: column; }
.field-label {
  font-size: 11.5px;
  font-weight: 500;
  color: var(--el-text-color-secondary);
  margin-bottom: 6px;
}
.required { color: var(--el-color-danger); }

.panel-card :deep(.el-select .el-input__wrapper) {
  transition: box-shadow .2s;
}
.panel-card :deep(.el-input__inner) {
  font-size: 13.5px;
}

.opt-label { display: flex; align-items: center; font-size: 13.5px; }
.opt-attraction {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  font-size: 13.5px;
}
.opt-name { flex: 1; overflow: hidden; text-overflow: ellipsis; }

/* ═══════════════════════════════════════
   内容信息
═══════════════════════════════════════ */
.content-info { display: flex; flex-direction: column; gap: 12px; }
.info-thumb-row { display: flex; justify-content: center; }
.info-thumb {
  width: 120px;
  height: 80px;
  border-radius: 8px;
  object-fit: cover;
  border: 1px solid rgba(59,130,246,.2);
}
.info-thumb-empty {
  width: 120px;
  height: 80px;
  border-radius: 8px;
  background: var(--el-color-primary-light-9);
  border: 1px dashed var(--el-border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--el-text-color-secondary);
}

.info-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: rgba(59,130,246,.05);
  border: 1px solid rgba(59,130,246,.18);
  border-radius: 8px;
  padding: 10px 12px;
}
.info-row {
  display: flex;
  align-items: center;
  font-size: 12.5px;
}
.info-label {
  color: var(--el-text-color-secondary);
  width: 70px;
  flex-shrink: 0;
}
.info-value {
  color: var(--el-text-color-regular);
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.info-link {
  color: var(--el-color-primary);
  text-decoration: none;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
  transition: color .2s;
}
.info-link:hover {
  color: var(--el-color-primary-light-3);
  text-decoration: underline;
}

/* ═══════════════════════════════════════
   Drop zone
═══════════════════════════════════════ */
.drop-zone {
  border: 2px dashed var(--el-border-color);
  border-radius: 12px;
  background: var(--el-fill-color-darker);
  cursor: pointer;
  transition: all .25s;
  padding: 24px 16px;
  text-align: center;
}
.drop-zone:hover, .drop-zone.over {
  border-color: var(--el-color-primary);
  background: var(--el-color-primary-light-9);
}
.drop-zone.has-file {
  border-style: solid;
  padding: 12px;
}
.hidden-input { display: none; }

.dz-icon-wrap {
  width: 50px;
  height: 50px;
  border-radius: 14px;
  background: var(--el-color-primary-light-9);
  border: 1px solid var(--el-color-primary-light-7);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px;
}
.dz-hint-main { font-size: 13px; font-weight: 500; color: var(--el-text-color-regular); margin-bottom: 4px; }
.dz-hint-sub { font-size: 11.5px; color: var(--el-text-color-secondary); }

.dz-preview { cursor: default; }
.file-card {
  background: rgba(59,130,246,.05);
  border: 1px solid rgba(59,130,246,.18);
  border-radius: 10px;
  padding: 10px 12px;
}
.file-card-inner { display: flex; align-items: flex-start; gap: 10px; }
.file-icon-wrap {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: rgba(59,130,246,.12);
  display: flex;
  align-items: center;
  justify-content: center;
}
.file-meta { flex: 1; min-width: 0; }
.file-name {
  font-size: 12.5px;
  font-weight: 500;
  color: var(--el-text-color-primary);
  overflow: hidden;
  text-overflow: ellipsis;
}
.file-tags { display: flex; gap: 8px; margin-top: 4px; }
.file-size { font-size: 11.5px; color: var(--el-text-color-secondary); }
.file-clear-btn {
  color: var(--el-text-color-secondary);
  background: none;
  border: none;
  cursor: pointer;
  padding: 2px;
  transition: color .2s;
}
.file-clear-btn:hover { color: var(--el-color-danger); }

.badge-blue-sm {
  font-size: 10.5px;
  font-weight: 500;
  padding: 1px 6px;
  border-radius: 4px;
  background: rgba(59,130,246,.1);
  color: #60a5fa;
  border: 1px solid rgba(59,130,246,.25);
}

/* ═══════════════════════════════════════
   URL预览
═══════════════════════════════════════ */
.url-preview-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.url-preview-item {
  background: rgba(59,130,246,.05);
  border: 1px solid rgba(59,130,246,.18);
  border-radius: 8px;
  padding: 10px 12px;
}

.url-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 600;
  color: var(--el-text-color-secondary);
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.url-box { 
  display: flex; 
  gap: 6px; 
}

.url-input {
  flex: 1;
  background: var(--el-fill-color-darker);
  border: 1px solid var(--el-border-color);
  border-radius: 6px;
  padding: 6px 10px;
  font-size: 11.5px;
  color: var(--el-color-info);
  font-family: 'JetBrains Mono', monospace;
}

.url-copy-btn {
  background: var(--el-color-primary-light-9);
  border: 1px solid var(--el-color-primary-light-7);
  border-radius: 6px;
  padding: 6px 10px;
  color: var(--el-color-primary);
  cursor: pointer;
  transition: all .2s;
  flex-shrink: 0;
}

.url-copy-btn:hover {
  background: var(--el-color-primary-light-8);
  border-color: var(--el-color-primary-light-5);
}

/* ═══════════════════════════════════════
   底部执行按钮
═══════════════════════════════════════ */
.bottom-actions {
  flex-shrink: 0;
  padding: 16px 24px;
  border-top: 1px solid var(--el-border-color);
  background: var(--el-bg-color);
}

.btn-exec-bottom {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 16px 48px;
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all .25s;
  font-family: inherit;
  box-shadow: 0 4px 16px rgba(59,130,246,.25);
}
.btn-exec-bottom:hover:not(:disabled) {
  box-shadow: 0 6px 24px rgba(59,130,246,.4);
  transform: translateY(-1px);
}
.btn-exec-bottom:disabled { 
  opacity: .5; 
  cursor: not-allowed;
  transform: none;
}

@keyframes spin { to { transform: rotate(360deg); } }
.spin { animation: spin .8s linear infinite; }

/* ═══════════════════════════════════════
   Right panel
═══════════════════════════════════════ */
.right-panel {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding-bottom: 20px;
}

/* ═══════════════════════════════════════
   视频对比区域
═══════════════════════════════════════ */
.comparison-area {
  flex-shrink: 0;
  background: var(--el-fill-color-darker);
  border: 1px solid var(--el-border-color);
  border-radius: 12px;
  padding: 16px;
  overflow: hidden;
}

.comparison-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  height: 100%;
}

.video-box {
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.video-box-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  border-bottom: 1px solid var(--el-border-color);
  background: var(--el-fill-color-lighter);
}
.vbox-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--el-text-color-regular);
}

.video-box-body {
  flex: 1;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
}

.video-player {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.video-element {
  max-width: 100%;
  max-height: 100%;
  border-radius: 8px;
}

.video-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  color: var(--el-text-color-placeholder);
}
.video-empty p {
  font-size: 12px;
  margin: 0;
}

.video-box-footer {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-top: 1px solid var(--el-border-color);
  background: var(--el-fill-color-lighter);
}
.footer-label {
  font-size: 11.5px;
  color: var(--el-text-color-secondary);
}
.footer-cover {
  width: 60px;
  height: 40px;
  border-radius: 4px;
  object-fit: cover;
}
.footer-cover-wrap {
  display: flex;
}
.footer-empty {
  font-size: 11.5px;
  color: var(--el-text-color-placeholder);
}

/* ═══════════════════════════════════════
   视频上传区域
═══════════════════════════════════════ */
.video-upload-zone {
  width: 100%;
  height: 100%;
  min-height: 200px;
  border: 2px dashed var(--el-border-color);
  border-radius: 10px;
  background: var(--el-fill-color-darker);
  cursor: pointer;
  transition: all .25s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.video-upload-zone:hover,
.video-upload-zone.over {
  border-color: var(--el-color-primary);
  background: var(--el-color-primary-light-9);
}

.upload-placeholder {
  text-align: center;
  padding: 20px;
}

.upload-icon-wrap {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  background: var(--el-color-primary-light-9);
  border: 1px solid var(--el-color-primary-light-7);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 14px;
}

.upload-hint-main {
  font-size: 13px;
  font-weight: 500;
  color: var(--el-text-color-regular);
  margin-bottom: 6px;
}

.upload-hint-sub {
  font-size: 11.5px;
  color: var(--el-text-color-secondary);
}

/* ═══════════════════════════════════════
   文件信息紧凑展示
═══════════════════════════════════════ */
.file-info-compact {
  padding: 8px 0;
}

.file-info-main {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(59,130,246,.06);
  border: 1px solid rgba(59,130,246,.15);
  border-radius: 6px;
  padding: 6px 10px;
}

.file-info-name {
  flex: 1;
  font-size: 12px;
  font-weight: 500;
  color: var(--el-text-color-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-info-size {
  font-size: 11px;
  color: var(--el-text-color-secondary);
  flex-shrink: 0;
}

.file-clear-btn-mini {
  color: var(--el-text-color-secondary);
  background: none;
  border: none;
  cursor: pointer;
  padding: 2px;
  transition: color .2s;
  flex-shrink: 0;
}

.file-clear-btn-mini:hover {
  color: var(--el-color-danger);
}

/* ═══════════════════════════════════════
   起播图操作区域
═══════════════════════════════════════ */
.footer-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.cover-operations {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.cover-action-btns {
  display: flex;
  gap: 6px;
  margin-left: auto;
}

.cover-action-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  background: var(--el-fill-color-lighter);
  border: 1px solid var(--el-border-color);
  border-radius: 6px;
  color: var(--el-text-color-regular);
  cursor: pointer;
  transition: all .2s;
  font-size: 11px;
  font-weight: 500;
}

.cover-action-btn:hover:not(.active) {
  background: rgba(59,130,246,.08);
  border-color: rgba(59,130,246,.3);
  color: var(--el-color-primary);
}

.cover-action-btn.active {
  background: var(--el-color-primary-light-9);
  border-color: var(--el-color-primary);
  color: var(--el-color-primary);
  box-shadow: 0 0 0 2px rgba(59,130,246,.1);
  font-weight: 600;
}

/* ═══════════════════════════════════════
   分隔条
═══════════════════════════════════════ */
.resizer {
  height: 8px;
  cursor: ns-resize;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  position: relative;
}
.resizer-handle {
  width: 40px;
  height: 3px;
  background: var(--el-border-color-dark);
  border-radius: 3px;
  transition: background .2s;
}
.resizer:hover .resizer-handle {
  background: var(--el-color-primary);
}

/* ═══════════════════════════════════════
   日志区域
═══════════════════════════════════════ */
.log-area {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  padding: 0;
}

.log-toolbar {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  border-bottom: 1px solid var(--el-border-color);
  background: var(--el-fill-color-darker);
  border-radius: 12px 12px 0 0;
}
.log-toolbar-left { display: flex; align-items: center; gap: 12px; }
.log-toolbar-right { display: flex; align-items: center; gap: 10px; }
.tl-dots { display: flex; gap: 6px; }
.tl-dot { width: 10px; height: 10px; border-radius: 50%; }
.log-filename {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  font-family: 'JetBrains Mono', monospace;
}
.log-count {
  font-size: 11px;
  color: var(--el-text-color-placeholder);
  font-family: 'JetBrains Mono', monospace;
}

.log-btn {
  font-size: 11.5px;
  color: var(--el-text-color-secondary);
  background: none;
  border: 1px solid transparent;
  border-radius: 5px;
  padding: 3px 8px;
  cursor: pointer;
  transition: all .2s;
}
.log-btn:hover { color: var(--el-text-color-regular); border-color: var(--el-border-color); }
.log-btn-export:hover { color: var(--el-color-primary); }

.terminal {
  flex: 1;
  min-height: 0;
  background: var(--el-fill-color-blank);
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  line-height: 1.75;
  padding: 14px 16px;
  overflow-y: auto;
}
.log-line { display: flex; gap: 10px; padding: 1px 0; }
.l-time { color: var(--el-text-color-placeholder); flex-shrink: 0; }
.l-info { color: var(--el-text-color-regular); }
.l-success { color: var(--el-color-success); }
.l-warn { color: var(--el-color-warning); }
.l-error { color: var(--el-color-danger); }
.l-link { color: var(--el-color-info); }
.l-sep { color: var(--el-text-color-disabled); }

.status-bar {
  flex-shrink: 0;
  background: var(--el-fill-color-darker);
  border-top: 1px solid var(--el-border-color);
  padding: 10px 16px;
  border-radius: 0 0 12px 12px;
}
.stat-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 7px;
}
.stat-left { display: flex; align-items: center; gap: 8px; }
.stat-right { display: flex; align-items: center; gap: 18px; }
.stat-label { font-size: 12px; color: var(--el-text-color-secondary); }
.stat-step { font-size: 11.5px; color: var(--el-text-color-placeholder); }
.stat-meta {
  font-size: 11.5px;
  color: var(--el-text-color-placeholder);
  font-family: 'JetBrains Mono', monospace;
}
.stat-meta em { color: var(--el-text-color-secondary); font-style: normal; }

.dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
.dot-idle { background: var(--el-text-color-disabled); }
.dot-run {
  background: var(--el-color-primary);
  animation: dotPulse 1.4s ease infinite;
}
.dot-ok { background: var(--el-color-success); }
.dot-err { background: var(--el-color-danger); }

@keyframes dotPulse {
  0%, 100% { box-shadow: 0 0 0 0 var(--el-color-primary-light-5); }
  50% { box-shadow: 0 0 0 5px transparent; }
}

.prog-track {
  height: 3px;
  background: var(--el-fill-color);
  border-radius: 3px;
  overflow: hidden;
}
.prog-fill {
  height: 100%;
  background: var(--el-color-primary);
  border-radius: 3px;
  transition: width .35s ease;
}
</style>
