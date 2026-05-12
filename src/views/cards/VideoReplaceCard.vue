<template>
  <div class="vrt-root">

    <!-- ══════════════ MAIN ══════════════ -->
    <main class="vrt-main">

      <!-- ════ LEFT PANEL ════ -->
      <div class="left-panel">

        <!-- ① 卡片配置 -->
        <div class="panel-card">
          <div class="sec-label">
            <svg width="13" height="13" fill="none" stroke="#3b82f6" stroke-width="2.2" viewBox="0 0 24 24">
              <rect x="2" y="3" width="20" height="14" rx="2"/>
              <path d="M8 21h8M12 17v4"/>
            </svg>
            卡片配置
          </div>
          <div class="fields">

            <!-- 卡片类型 -->
            <div class="field-group">
              <label class="field-label">
                卡片类型 &nbsp;<span class="required">*</span>
              </label>
              <el-select
                v-model="cardType"
                style="width:100%"
                @change="onCardTypeChange"
              >
                <el-option label="景点卡" value="attraction">
                  <span class="opt-label">🏔️ &nbsp;景点卡</span>
                </el-option>
                <el-option label="食品卡" value="food" disabled>
                  <span class="opt-label">🍜 &nbsp;食品卡 &nbsp;<el-tag size="small" type="info">开发中</el-tag></span>
                </el-option>
                <el-option label="商品卡" value="product" disabled>
                  <span class="opt-label">🛍️ &nbsp;商品卡 &nbsp;<el-tag size="small" type="info">开发中</el-tag></span>
                </el-option>
              </el-select>
            </div>

            <!-- 景点选择 -->
            <template v-if="cardType === 'attraction'">
              <div class="field-group">
                <label class="field-label">
                  选择景点 &nbsp;<span class="required">*</span>
                </label>
                <el-select
                  v-model="selectedAttractionId"
                  filterable
                  placeholder="输入景点名称快速搜索..."
                  :loading="attractionLoading"
                  loading-text="加载景点列表..."
                  no-match-text="未找到匹配的景点"
                  style="width:100%"
                  :class="{ 'select-error': attractionError }"
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
                      <el-tag v-if="item.videoId" size="small" type="success" effect="plain">有视频</el-tag>
                      <el-tag v-else size="small" type="info" effect="plain">无视频</el-tag>
                    </div>
                  </el-option>
                </el-select>
              </div>

              <!-- 已选景点信息预览 -->
              <div v-if="selectedAttraction" class="attraction-preview">
                <el-image
                  v-if="selectedAttraction.thumbnailUrl"
                  :src="selectedAttraction.thumbnailUrl"
                  class="attraction-thumb"
                  fit="cover"
                  :preview-src-list="[selectedAttraction.thumbnailUrl]"
                  preview-teleported
                />
                <div v-else class="attraction-thumb-empty">
                  <svg width="20" height="20" fill="none" stroke="#3d4f72" stroke-width="1.5" viewBox="0 0 24 24">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                </div>
                <div class="attraction-info">
                  <div class="attraction-name">{{ selectedAttraction.name }}</div>
                  <div class="attraction-meta">
                    <span class="attraction-id">ID：{{ selectedAttraction.attractionId }}</span>
                    <el-tag v-if="selectedAttraction.videoId" size="small" type="success" effect="plain">有视频</el-tag>
                    <el-tag v-else size="small" type="danger" effect="plain">无视频</el-tag>
                    <el-tag v-if="selectedAttraction.title" size="small" type="info" effect="plain">
                      {{ selectedAttraction.title }}
                    </el-tag>
                  </div>
                </div>
              </div>
            </template>

          </div>
        </div>

        <!-- ② 视频文件 -->
        <div class="panel-card">
          <div class="sec-label">
            <svg width="13" height="13" fill="none" stroke="#3b82f6" stroke-width="2.2" viewBox="0 0 24 24">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            视频文件
          </div>
          <div
            class="drop-zone"
            :class="{ over: isDragOver, 'has-file': !!selectedFile }"
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

            <!-- 空状态占位 -->
            <div v-if="!selectedFile" class="dz-placeholder">
              <div class="dz-icon-wrap">
                <svg width="24" height="24" fill="none" stroke="#3b82f6" stroke-width="1.6" viewBox="0 0 24 24">
                  <path d="M15 10l4.553-2.069A1 1 0 0121 8.845v6.31a1 1 0 01-1.447.894L15 14"/>
                  <rect x="3" y="6" width="12" height="12" rx="2"/>
                </svg>
              </div>
              <p class="dz-hint-main">点击选择视频 或 拖拽到此处</p>
              <p class="dz-hint-sub">支持 MP4 · MOV · AVI · MKV · FLV</p>
              <p class="dz-hint-tip">建议单文件 ≤ 2 GB</p>
            </div>

            <!-- 已选文件 -->
            <div v-else class="dz-preview" @click.stop>
              <div class="file-card">
                <div class="file-card-inner">
                  <div class="file-icon-wrap">
                    <svg width="18" height="18" fill="none" stroke="#60a5fa" stroke-width="2" viewBox="0 0 24 24">
                      <path d="M15 10l4.553-2.069A1 1 0 0121 8.845v6.31a1 1 0 01-1.447.894L15 14"/>
                      <rect x="3" y="6" width="12" height="12" rx="2"/>
                    </svg>
                  </div>
                  <div class="file-meta">
                    <div class="file-name">{{ selectedFile.name }}</div>
                    <div class="file-tags">
                      <span class="file-size">{{ fmtBytes(selectedFile.size) }}</span>
                      <span class="badge-blue-sm">{{ fileExt }}</span>
                    </div>
                  </div>
                  <button class="file-clear-btn" @click.stop="clearFile">
                    <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                      <line x1="18" y1="6" x2="6" y2="18"/>
                      <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ③ 操作按钮 -->
        <div class="panel-card actions-card">
          <div class="actions-row">
            <button class="btn-exec" :disabled="isRunning" @click="onExecute">
              <svg v-if="!isRunning" width="18" height="18" fill="none" stroke="currentColor"
                   stroke-width="2" viewBox="0 0 24 24">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
              <svg v-else class="spin" width="18" height="18" fill="none" stroke="currentColor"
                   stroke-width="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="9" stroke-dasharray="28 8" stroke-linecap="round"/>
              </svg>
              <span>{{ isRunning ? '执行中…' : '开始执行' }}</span>
            </button>
            <button class="btn-reset" :disabled="isRunning" @click="onReset">
              <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
                <polyline points="1 4 1 10 7 10"/>
                <path d="M3.51 15a9 9 0 102.13-9.36L1 10"/>
              </svg>
              重置
            </button>
          </div>
        </div>

      </div><!-- /left-panel -->

      <!-- ════ RIGHT PANEL: LOG ════ -->
      <div class="right-panel panel-card">

        <!-- 日志工具栏 -->
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

        <!-- 终端主体 -->
        <div ref="logBodyRef" class="terminal">
          <div v-for="(line, idx) in logs" :key="idx" class="log-line">
            <span class="l-time">{{ line.time }}</span>
            <span :class="logCls(line.type)">{{ line.text }}</span>
          </div>
        </div>

        <!-- 状态栏 -->
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
              <span class="stat-meta stat-clock">{{ clockTime }}</span>
            </div>
          </div>
          <div class="prog-track">
            <div class="prog-fill" :style="{ width: progress + '%' }" />
          </div>
        </div>

      </div><!-- /right-panel -->

    </main>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, nextTick } from 'vue'
import axios from 'axios'

/* ═══════════════════════════════════════
   卡片配置状态
═══════════════════════════════════════ */
const cardType            = ref('attraction')
const attractionList      = ref([])
const attractionLoading   = ref(false)
const selectedAttractionId = ref(null)
const selectedAttraction  = ref(null)
const attractionError     = ref(false)

/* ═══════════════════════════════════════
   文件 & 运行状态
═══════════════════════════════════════ */
const selectedFile = ref(null)
const isDragOver   = ref(false)
const fileInputRef = ref(null)
const logBodyRef   = ref(null)

const cfg = reactive({ transcode: true, cover: true, oss: true, db: true })

const isRunning   = ref(false)
const logs        = ref([])
const progress    = ref(0)
const statusState = ref('idle')
const statusStep  = ref('')
const clockTime   = ref('--:--:--')
const taskStartMs = ref(0)
const elapsedMs   = ref(0)

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
   时钟 & 计时器
═══════════════════════════════════════ */
let clockTimer   = null
let elapsedTimer = null

function startClock() {
  const tick = () => {
    const now = new Date()
    clockTime.value = [now.getHours(), now.getMinutes(), now.getSeconds()]
      .map(n => String(n).padStart(2, '0')).join(':')
  }
  tick()
  clockTimer = setInterval(tick, 1000)
}

function startElapsed() {
  elapsedMs.value = 0
  elapsedTimer = setInterval(() => {
    elapsedMs.value = Date.now() - taskStartMs.value
  }, 100)
}

function stopElapsed() {
  if (elapsedTimer) { clearInterval(elapsedTimer); elapsedTimer = null }
}

/* ═══════════════════════════════════════
   卡片类型 & 景点加载
═══════════════════════════════════════ */
async function loadAttractions() {
  attractionLoading.value = true
  try {
    const res = await axios.get('/api/attraction/getAllSecondaryAttractions')
    const data = res.data?.data || []
    attractionList.value = data

    if (data.length > 0) {
      selectedAttractionId.value = data[0].attractionId
      selectedAttraction.value   = data[0]
      addLog('success', `[SUCCESS] 景点列表加载完成，共 ${data.length} 条`)
      addLog('info',    `[INFO]    默认选中：${data[0].name}（ID: ${data[0].attractionId}）`)
    } else {
      addLog('warn', '[WARN] 景点列表为空，请检查接口数据')
    }
  } catch (e) {
    addLog('error', `[ERROR] 景点列表加载失败：${e.message}`)
  } finally {
    attractionLoading.value = false
  }
}

function onCardTypeChange(type) {
  selectedAttractionId.value = null
  selectedAttraction.value   = null
  attractionList.value       = []
  const labelMap = { attraction: '景点卡', food: '食品卡', product: '商品卡' }
  addLog('info', `[INFO] 已切换卡片类型：${labelMap[type] || type}`)
  if (type === 'attraction') loadAttractions()
}

function onAttractionChange(id) {
  attractionError.value    = false
  selectedAttraction.value = attractionList.value.find(a => a.attractionId === id) || null
  if (selectedAttraction.value) {
    addLog('info', `[INFO] 已选择景点：${selectedAttraction.value.name}（ID: ${id}）`)
  }
}

/* ═══════════════════════════════════════
   文件选择 / 拖拽
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
    addLog('error', `[ERROR] 文件类型不支持：${f.type}，请选择视频文件`)
    return
  }
  selectedFile.value = f
  addLog('info', `[INFO] 已选择文件：${f.name}（${fmtBytes(f.size)}）`)
}

function clearFile() {
  selectedFile.value = null
  if (fileInputRef.value) fileInputRef.value.value = ''
}

/* ═══════════════════════════════════════
   执行主流程
═══════════════════════════════════════ */
async function onExecute() {
  if (isRunning.value) return

  if (!selectedAttractionId.value) {
    attractionError.value = true
    setTimeout(() => { attractionError.value = false }, 2000)
    addLog('error', '[ERROR] 请先选择景点')
    return
  }
  if (!selectedFile.value) {
    addLog('error', '[ERROR] 请先选择视频文件')
    return
  }

  isRunning.value   = true
  taskStartMs.value = Date.now()
  startElapsed()

  const id    = String(selectedAttractionId.value)
  const name  = selectedAttraction.value?.name || ''
  const label = name ? `${name}（ID: ${id}）` : `ID: ${id}`

  addLog('sep',  '[────────────────────────────────────────────]')
  addLog('info', `[INFO]    任务启动 — 景点 ${label}`)
  addLog('info', `[INFO]    文件：${selectedFile.value.name} | ${fmtBytes(selectedFile.value.size)}`)
  addLog('info', `[INFO]    步骤：${buildSteps()}`)
  addLog('sep',  '[────────────────────────────────────────────]')

  try {
    /* Step 1 — 上传文件 */
    setStatus('run', '上传文件中…', 5)
    addLog('info', '[INFO] 正在上传视频文件至服务器...')
    const up = await fakeApi(1800)
    addLog('success', `[SUCCESS] 文件上传完成，Task ID: ${up.taskId}`)
    addLog('link',    `[INFO]    临时路径：${up.tempPath}`)

    /* Step 2 — 创建任务 */
    setStatus('run', '创建处理任务…', 14)
    addLog('info', '[INFO] 正在创建处理任务...')
    await fakeApi(700)
    addLog('success', '[SUCCESS] 任务创建成功，进入处理队列')

    /* Step 3 — 转码 */
    if (cfg.transcode) {
      setStatus('run', '视频转码中…', 18)
      addLog('info', '[INFO] 开始视频转码（目标：H.264 · 1080P · AAC）...')
      await animProg(18, 58, '[INFO] 转码进度', 3800)
      addLog('success', '[SUCCESS] 视频转码完成')
    }

    /* Step 4 — 封面 */
    if (cfg.cover) {
      setStatus('run', '生成封面图…', cfg.transcode ? 60 : 25)
      addLog('info', '[INFO] 正在截取封面帧（00:00:01）...')
      await fakeApi(900)
      addLog('success', '[SUCCESS] 封面生成完成（1920×1080 JPG）')
    }

    /* Step 5 — OSS */
    if (cfg.oss) {
      const ossBase = cfg.transcode ? 62 : cfg.cover ? 40 : 25
      setStatus('run', '上传 OSS…', ossBase)
      addLog('info', '[INFO] 正在上传视频至阿里云 OSS...')
      await animProg(ossBase, ossBase + 22, '[INFO] OSS 上传', 2400)
      addLog('success', '[SUCCESS] 视频 OSS 上传完成')

      if (cfg.cover) {
        addLog('info', '[INFO] 正在上传封面至阿里云 OSS...')
        await fakeApi(600)
        addLog('success', '[SUCCESS] 封面 OSS 上传完成')
      }

      addLog('link', `[INFO]    视频地址：https://oss-cn-hangzhou.aliyuncs.com/scenic/spots/${id}/video_${Date.now()}.mp4`)
      if (cfg.cover)
        addLog('link', `[INFO]    封面地址：https://oss-cn-hangzhou.aliyuncs.com/scenic/spots/${id}/cover_${Date.now()}.jpg`)
    }

    /* Step 6 — 数据库 */
    if (cfg.db) {
      setStatus('run', '更新数据库…', 90)
      addLog('info', '[INFO] 正在更新数据库记录...')
      await fakeApi(650)
      addLog('success', `[SUCCESS] 数据库更新成功 — 景点 ${label}`)
    }

    const elapsed = (elapsedMs.value / 1000).toFixed(1)
    setStatus('ok', '执行完成', 100)
    addLog('sep',     '[────────────────────────────────────────────]')
    addLog('success', `[SUCCESS] ✓ 全部步骤执行完成！总耗时 ${elapsed}s`)
    addLog('sep',     '[────────────────────────────────────────────]')

  } catch (err) {
    setStatus('err', '执行失败', null)
    addLog('error', `[ERROR] 执行中断：${err.message}`)
    addLog('error', '[ERROR] 请检查网络连接或联系管理员')
  } finally {
    isRunning.value = false
    stopElapsed()
  }
}

/* ═══════════════════════════════════════
   重置
═══════════════════════════════════════ */
function onReset() {
  if (isRunning.value) {
    addLog('warn', '[WARN] 任务执行中，请等待任务完成后再重置')
    return
  }
  clearFile()
  setStatus('idle', '', 0)
  progress.value  = 0
  elapsedMs.value = 0
  addLog('info', '[INFO] 页面已重置，等待下次任务')
}

/* ═══════════════════════════════════════
   状态 / 进度
═══════════════════════════════════════ */
function setStatus(state, step, prog) {
  statusState.value = state
  statusStep.value  = step || ''
  if (prog !== null && prog !== undefined) progress.value = prog
}

/* ═══════════════════════════════════════
   日志
═══════════════════════════════════════ */
function addLog(type, text) {
  const now  = new Date()
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
  addLog('info', '[INFO] 日志已清空')
}

function exportLog() {
  let txt = `景点视频替换工具 — 执行日志\n导出时间：${new Date().toLocaleString()}\n${'='.repeat(60)}\n`
  logs.value.forEach(l => { txt += `${l.time}  ${l.text}\n` })
  const a = document.createElement('a')
  a.href     = URL.createObjectURL(new Blob([txt], { type: 'text/plain;charset=utf-8' }))
  a.download = `exec_log_${Date.now()}.txt`
  a.click()
}

/* ═══════════════════════════════════════
   Mock API（替换为真实请求）
═══════════════════════════════════════ */
function fakeApi(ms) {
  return new Promise(resolve => {
    setTimeout(() => resolve({
      taskId:   'TASK_' + Math.random().toString(36).substr(2, 8).toUpperCase(),
      tempPath: `oss://scenic-tmp/upload/${Date.now()}.mp4`,
    }), ms)
  })
}

async function animProg(from, to, label, dur) {
  const steps = 24, iv = dur / steps, inc = (to - from) / steps
  for (let i = 0; i <= steps; i++) {
    await wait(iv)
    const p = Math.round(from + inc * i)
    progress.value = p
    if (i === Math.round(steps * 0.5)) addLog('info', `${label}：${p}%`)
  }
}

const wait = ms => new Promise(r => setTimeout(r, ms))

/* ═══════════════════════════════════════
   工具函数
═══════════════════════════════════════ */
function fmtBytes(b) {
  if (b < 1024)       return b + ' B'
  if (b < 1048576)    return (b / 1024).toFixed(1) + ' KB'
  if (b < 1073741824) return (b / 1048576).toFixed(1) + ' MB'
  return (b / 1073741824).toFixed(2) + ' GB'
}

function buildSteps() {
  return [
    cfg.transcode && '转码',
    cfg.cover     && '生成封面',
    cfg.oss       && '上传OSS',
    cfg.db        && '更新数据库',
  ].filter(Boolean).join(' → ')
}

/* ═══════════════════════════════════════
   生命周期
═══════════════════════════════════════ */
onMounted(() => {
  startClock()
  addLog('info', '[INFO] 系统初始化完成，等待任务执行...')
  loadAttractions()
})

onUnmounted(() => {
  if (clockTimer) clearInterval(clockTimer)
  stopElapsed()
})
</script>

<!-- 非 scoped：字体引入 + webkit 滚动条 -->
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

.terminal::-webkit-scrollbar       { width: 5px; }
.terminal::-webkit-scrollbar-track { background: #060810; }
.terminal::-webkit-scrollbar-thumb { background: #1d2d50; border-radius: 3px; }
.terminal::-webkit-scrollbar-thumb:hover { background: #3b82f6; }

.left-panel::-webkit-scrollbar       { width: 4px; }
.left-panel::-webkit-scrollbar-track { background: transparent; }
.left-panel::-webkit-scrollbar-thumb { background: #1d2d50; border-radius: 3px; }
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
  background: #0b0d16;
  color: #c9d1e0;
  font-family: 'Inter', system-ui, sans-serif;
}

/* ═══════════════════════════════════════
   Main layout
═══════════════════════════════════════ */
.vrt-main {
  flex: 1;
  min-height: 0;
  display: flex;
  gap: 20px;
  padding: 20px 24px;
}

/* ═══════════════════════════════════════
   Left panel
═══════════════════════════════════════ */
.left-panel {
  width: 440px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
  overflow-y: auto;
  padding-right: 4px;
}

/* ═══════════════════════════════════════
   卡片
═══════════════════════════════════════ */
.panel-card {
  background: #161b2e;
  border: 1px solid #1d2540;
  border-radius: 12px;
  box-shadow: 0 2px 16px rgba(0,0,0,.4);
  padding: 16px 18px;
  flex-shrink: 0;
}
.actions-card { padding: 14px 18px; }

/* ═══════════════════════════════════════
   Section label
═══════════════════════════════════════ */
.sec-label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: .08em;
  text-transform: uppercase;
  color: #3d4f72;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 14px;
}
.sec-label::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #1d2540;
}

/* ═══════════════════════════════════════
   Fields
═══════════════════════════════════════ */
.fields { display: flex; flex-direction: column; gap: 12px; }
.field-group { display: flex; flex-direction: column; }
.field-label {
  font-size: 11.5px;
  font-weight: 500;
  color: #3d4f72;
  margin-bottom: 6px;
}
.required { color: #ef4444; }

/* ── Element Plus Select 暗色适配 ── */
.panel-card :deep(.el-select .el-input__wrapper) {
  background-color: #0b0d16;
  box-shadow: 0 0 0 1px #1d2540 inset;
  border-radius: 8px;
  transition: box-shadow .2s;
}
.panel-card :deep(.el-select .el-input__wrapper:hover),
.panel-card :deep(.el-select .el-input__wrapper.is-hovering:not(.is-focus)) {
  box-shadow: 0 0 0 1px #3b82f6 inset;
}
.panel-card :deep(.el-select .el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #3b82f6 inset, 0 0 0 3px rgba(59,130,246,.12);
}
.panel-card :deep(.el-input__inner) {
  color: #c9d1e0;
  font-size: 13.5px;
  font-family: inherit;
}
.panel-card :deep(.el-input__inner::placeholder) { color: #2e3a56; }
.panel-card :deep(.el-select__caret)             { color: #4a5f82; }
.panel-card :deep(.el-select__placeholder)       { color: #2e3a56; font-size: 13.5px; }

/* error 状态 */
.panel-card :deep(.select-error .el-input__wrapper) {
  box-shadow: 0 0 0 1px #ef4444 inset, 0 0 0 3px rgba(239,68,68,.12) !important;
}

/* Select option 内容布局 */
.opt-label   { display: flex; align-items: center; font-size: 13.5px; }
.opt-attraction {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  font-size: 13.5px;
}
.opt-name { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

/* ═══════════════════════════════════════
   景点预览卡
═══════════════════════════════════════ */
.attraction-preview {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(59,130,246,.05);
  border: 1px solid rgba(59,130,246,.18);
  border-radius: 10px;
  padding: 10px 12px;
  margin-top: 2px;
}
.attraction-thumb {
  width: 52px;
  height: 52px;
  border-radius: 8px;
  flex-shrink: 0;
  object-fit: cover;
  border: 1px solid rgba(59,130,246,.2);
}
.attraction-thumb-empty {
  width: 52px;
  height: 52px;
  border-radius: 8px;
  flex-shrink: 0;
  background: rgba(59,130,246,.05);
  border: 1px dashed #1d2540;
  display: flex;
  align-items: center;
  justify-content: center;
}
.attraction-info { flex: 1; min-width: 0; }
.attraction-name {
  font-size: 13px;
  font-weight: 600;
  color: #e2e8f0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 5px;
}
.attraction-meta { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.attraction-id   { font-size: 11.5px; color: #3d4f72; font-family: 'JetBrains Mono', monospace; }

/* ═══════════════════════════════════════
   Badge（文件格式标签）
═══════════════════════════════════════ */
.badge-blue-sm {
  display: inline-flex;
  align-items: center;
  font-size: 10.5px;
  font-weight: 500;
  padding: 1px 6px;
  border-radius: 4px;
  background: rgba(59,130,246,.1);
  color: #60a5fa;
  border: 1px solid rgba(59,130,246,.25);
  font-family: 'JetBrains Mono', monospace;
}

/* ═══════════════════════════════════════
   Drop zone
═══════════════════════════════════════ */
.drop-zone {
  border: 2px dashed #1d2540;
  border-radius: 12px;
  background: #0b0d16;
  cursor: pointer;
  transition: border-color .25s, background .25s, box-shadow .25s;
  padding: 32px 20px;
  text-align: center;
}
.drop-zone:hover, .drop-zone.over {
  border-color: #3b82f6;
  background: rgba(59,130,246,.04);
}
.drop-zone.over {
  box-shadow: 0 0 0 4px rgba(59,130,246,.1), inset 0 0 40px rgba(6,182,212,.04);
  border-color: #06b6d4;
}
.drop-zone.has-file {
  border-style: solid;
  border-color: rgba(59,130,246,.3);
  padding: 14px;
}
.hidden-input { display: none; }

.dz-placeholder  { text-align: center; }
.dz-icon-wrap {
  width: 50px; height: 50px;
  border-radius: 14px;
  background: rgba(59,130,246,.09);
  border: 1px solid rgba(59,130,246,.18);
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 12px;
}
.dz-hint-main { font-size: 13px; font-weight: 500; color: #8fa3c8; margin-bottom: 4px; }
.dz-hint-sub  { font-size: 11.5px; color: #2e3a56; }
.dz-hint-tip  { font-size: 11px;   color: #1d2d50; margin-top: 3px; }

.dz-preview { cursor: default; }
.file-card  { background: rgba(59,130,246,.05); border: 1px solid rgba(59,130,246,.18); border-radius: 10px; padding: 10px 12px; }
.file-card-inner { display: flex; align-items: flex-start; gap: 10px; }
.file-icon-wrap  {
  width: 36px; height: 36px;
  border-radius: 8px;
  background: rgba(59,130,246,.12);
  border: 1px solid rgba(59,130,246,.2);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.file-meta { flex: 1; min-width: 0; }
.file-name  { font-size: 12.5px; font-weight: 500; color: #e2e8f0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.file-tags  { display: flex; align-items: center; gap: 8px; margin-top: 4px; }
.file-size  { font-size: 11.5px; color: #3d4f72; }
.file-clear-btn {
  color: #2e3a56; background: none; border: none; cursor: pointer;
  padding: 2px; transition: color .2s; flex-shrink: 0;
}
.file-clear-btn:hover { color: #ef4444; }

/* ═══════════════════════════════════════
   操作按钮
═══════════════════════════════════════ */
.actions-row { display: flex; gap: 10px; }

.btn-exec {
  flex: 1;
  display: flex; align-items: center; justify-content: center; gap: 9px;
  padding: 11px 20px;
  font-size: 14px; font-weight: 600; color: #fff;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border: none; border-radius: 10px; cursor: pointer;
  transition: box-shadow .25s, transform .15s, opacity .2s;
  font-family: inherit;
}
.btn-exec:hover:not(:disabled) { box-shadow: 0 4px 22px rgba(59,130,246,.4); transform: translateY(-1px); }
.btn-exec:active:not(:disabled) { transform: translateY(0); }
.btn-exec:disabled { opacity: .55; cursor: not-allowed; }

.btn-reset {
  padding: 11px 20px;
  font-size: 13.5px; font-weight: 500;
  color: #4a5f82; background: transparent;
  border: 1px solid #1d2540; border-radius: 10px; cursor: pointer;
  display: flex; align-items: center; gap: 6px;
  transition: border-color .2s, color .2s, background .2s;
  font-family: inherit;
}
.btn-reset:hover:not(:disabled) { border-color: #3b82f6; color: #3b82f6; background: rgba(59,130,246,.05); }
.btn-reset:disabled { opacity: .45; cursor: not-allowed; }

@keyframes spin { to { transform: rotate(360deg); } }
.spin { animation: spin .8s linear infinite; }

/* ═══════════════════════════════════════
   Right panel
═══════════════════════════════════════ */
.right-panel {
  flex: 1; min-width: 0;
  display: flex; flex-direction: column;
  overflow: hidden; padding: 0;
}

.log-toolbar {
  flex-shrink: 0;
  display: flex; align-items: center; justify-content: space-between;
  padding: 10px 16px;
  border-bottom: 1px solid #1d2540;
  background: #0d101f;
  border-radius: 12px 12px 0 0;
}
.log-toolbar-left  { display: flex; align-items: center; gap: 12px; }
.log-toolbar-right { display: flex; align-items: center; gap: 10px; }
.tl-dots    { display: flex; gap: 6px; }
.tl-dot     { width: 10px; height: 10px; border-radius: 50%; display: inline-block; }
.log-filename { font-size: 12px; color: #3d4f72; font-family: 'JetBrains Mono', Consolas, monospace; }
.log-count    { font-size: 11px; color: #253050; font-family: 'JetBrains Mono', Consolas, monospace; }

.log-btn {
  font-size: 11.5px; color: #2e3a56;
  background: none; border: 1px solid transparent; border-radius: 5px;
  padding: 3px 8px; cursor: pointer; transition: all .2s; font-family: inherit;
}
.log-btn:hover         { color: #7a8faf; border-color: #1d2540; }
.log-btn-export:hover  { color: #3b82f6; border-color: rgba(59,130,246,.3); }

/* 终端 */
.terminal {
  flex: 1; min-height: 0;
  background: #060810;
  font-family: 'JetBrains Mono', 'Fira Code', Consolas, monospace;
  font-size: 12px; line-height: 1.75;
  padding: 14px 16px; overflow-y: auto;
}
.log-line {
  display: flex; gap: 10px; padding: 1px 0;
  animation: logIn .18s ease forwards;
}
@keyframes logIn {
  from { opacity: 0; transform: translateY(3px); }
  to   { opacity: 1; transform: translateY(0); }
}
.l-time    { color: #253050; flex-shrink: 0; user-select: none; }
.l-info    { color: #7a8faf; }
.l-success { color: #10b981; }
.l-warn    { color: #f59e0b; }
.l-error   { color: #ef4444; }
.l-link    { color: #38bdf8; }
.l-sep     { color: #1d2d50; }

/* 状态栏 */
.status-bar {
  flex-shrink: 0;
  background: #0d101f; border-top: 1px solid #1d2540;
  padding: 10px 16px; border-radius: 0 0 12px 12px;
}
.stat-row   { display: flex; align-items: center; justify-content: space-between; margin-bottom: 7px; }
.stat-left  { display: flex; align-items: center; gap: 8px; }
.stat-right { display: flex; align-items: center; gap: 18px; }
.stat-label { font-size: 12px; color: #3d4f72; }
.stat-step  { font-size: 11.5px; color: #1d2d50; }
.stat-meta  { font-size: 11.5px; color: #253050; font-family: 'JetBrains Mono', Consolas, monospace; }
.stat-meta em { color: #3d4f72; font-style: normal; }
.stat-clock { color: #1d2d50; }

.dot        { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; margin-top: 1px; }
.dot-idle   { background: #2e3a56; }
.dot-run    { background: #3b82f6; animation: dotPulse 1.4s ease infinite; }
.dot-ok     { background: #10b981; }
.dot-err    { background: #ef4444; }
@keyframes dotPulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(59,130,246,.5); }
  50%       { box-shadow: 0 0 0 5px rgba(59,130,246,0); }
}

.prog-track { height: 3px; background: #111420; border-radius: 3px; overflow: hidden; }
.prog-fill  {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #06b6d4);
  border-radius: 3px; transition: width .35s ease;
}
</style>