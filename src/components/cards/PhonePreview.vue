<template>
  <div class="phone-shell" :style="{ transform: `scale(${scale})` }">
    <div class="preview-screen" :style="{ backgroundImage: `url(${templateImg})` }">
      <div class="content">
        <div class="media-box">
          <!--
            showVideo 为 true 时挂载 <video>（v-if 保证 ended/ref 精确管控）；
            showVideo 为 false 时显示封面图，poster 效果由 img 实现。
          -->
          <video
            v-if="videoUrl && showVideo"
            ref="videoRef"
            id="previewVideo"
            class="media"
            muted
            playsinline
          />
          <img
            v-else
            :src="thumbnailUrl || imageUrl"
            :alt="name"
            class="media"
          />

          <div class="label-title">{{ name || '名称' }}</div>
          <div class="label-desc">#{{ valueDesc || '标签' }}</div>
        </div>

        <div class="bottom-btn">立即查看</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue'
import Hls from 'hls.js'
import templateImg from '@/assets/template.png'

const props = defineProps({
  scale:        { type: Number, default: 0.8 },
  active:       { type: Boolean, default: true },
  name:         { type: String, default: '' },
  valueDesc:    { type: String, default: '' },
  imageUrl:     { type: String, default: '' },
  videoUrl:     { type: String, default: '' },
  thumbnailUrl: { type: String, default: '' },
})

const videoRef  = ref(null)
const showVideo = ref(false)

let hlsInstance = null
let playTimer   = null

// ── 工具 ────────────────────────────────────────

const clearTimer = () => {
  if (playTimer !== null) {
    clearTimeout(playTimer)
    playTimer = null
  }
}

const destroyHls = () => {
  if (hlsInstance) {
    hlsInstance.destroy()
    hlsInstance = null
  }
}

// ── 播放循环 ─────────────────────────────────────

/** 视频播放结束 → 回封面 → 3 秒后再次播放 */
const onVideoEnded = () => {
  const video = videoRef.value
  if (video) {
    video.removeEventListener('ended', onVideoEnded)
    video.pause()
    video.currentTime = 0
  }
  destroyHls()
  showVideo.value = false              // v-if 销毁 <video> 元素，回到封面
  playTimer = setTimeout(startPlayback, 3000)
}

/** 切换到视频 → 初始化 HLS / 设置 src → 播放 */
const startPlayback = async () => {
  if (!props.videoUrl || !props.active) return

  showVideo.value = true               // 挂载 <video> 元素
  await nextTick()                     // 等待 DOM 就绪

  const video = videoRef.value
  if (!video) return

  video.addEventListener('ended', onVideoEnded)

  const isHls = /\.m3u8(\?.*)?$/i.test(props.videoUrl)
  if (isHls) {
    if (Hls.isSupported()) {
      destroyHls()
      hlsInstance = new Hls()
      hlsInstance.loadSource(props.videoUrl)
      hlsInstance.attachMedia(video)
      hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(() => {})
      })
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = props.videoUrl
      video.play().catch(() => {})
    }
  } else {
    video.src = props.videoUrl
    video.play().catch(() => {})
  }
}

/** 重置定时器并在 3 秒后开始播放 */
const schedulePlay = () => {
  clearTimer()
  playTimer = setTimeout(startPlayback, 3000)
}

/** 停止一切播放并回到封面（timer、HLS、video 元素三重清理） */
const cleanup = () => {
  clearTimer()
  const video = videoRef.value
  if (video) {
    video.removeEventListener('ended', onVideoEnded)
    video.pause()
    video.currentTime = 0
    video.src = ''
    video.load()   // 中止所有网络请求
  }
  destroyHls()
  showVideo.value = false
}

// ── 生命周期 ─────────────────────────────────────

onMounted(() => {
  if (props.videoUrl && props.active) schedulePlay()
})

onUnmounted(() => {
  cleanup()
})

// 抽屉关闭（active=false）时暂停；重新打开时重新调度
watch(() => props.active, (active) => {
  if (!active) {
    cleanup()
  } else if (props.videoUrl) {
    schedulePlay()
  }
})
</script>

<style scoped>
/* ── 手机外壳 ──────────────────────────── */
.phone-shell {
  width: 375px;
  height: 812px;
  transform-origin: top center;
  flex-shrink: 0;
  border-radius: 30px;
  background: linear-gradient(135deg, #3a3a3a 0%, #222222 100%);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.03);
  border: 1px solid #333;
  padding: 7px;
  transition: transform 0.2s ease;
}

:root.dark .phone-shell {
  background: linear-gradient(135deg, #5a5a5a 0%, #7a7a7a 50%, #4a4a4a 100%);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.03);
  border: 1px solid #333;
}

/* ── 屏幕 ──────────────────────────────── */
.preview-screen {
  width: 100%;
  height: 100%;
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: linear-gradient(0deg, #eff0eb 70%, #ffffff 85%);
  background-size: cover;
  background-position: center;
}

/* ── 内容区 ─────────────────────────────── */
.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 98px;
}

/* ── 媒体盒 ─────────────────────────────── */
.media-box {
  width: 272px;
  height: 492px;
  border-radius: 25px;
  border: 4px solid #fff;
  overflow: hidden;
  position: relative;
  margin-bottom: 40px;
}

.media {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* ── 文字叠层 ───────────────────────────── */
.label-title {
  position: absolute;
  bottom: 35px;
  left: 10px;
  font-size: 16px;
  font-weight: bold;
  color: #fff;
}

.label-desc {
  position: absolute;
  bottom: 20px;
  left: 10px;
  font-size: 13px;
  font-weight: bold;
  color: #fff;
}

/* ── 底部按钮 ───────────────────────────── */
.bottom-btn {
  width: 80%;
  height: 50px;
  margin-top: auto;
  margin-bottom: 100px;
  background: #e0ed42;
  border-radius: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: #000;
}
</style>
