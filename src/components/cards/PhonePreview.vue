<template>
  <div class="phone-shell" :style="{ transform: `scale(${scale})` }">
    <div class="preview-screen" :style="{ backgroundImage: `url(${templateImg})` }">
      <div class="content">
        <div class="media-box">
          <video
            v-if="videoUrl"
            id="previewVideo"
            class="media"
            :poster="thumbnailUrl || imageUrl"
            muted
            playsinline
          >
            <source :src="videoUrl" :type="videoType" />
          </video>
          <img v-else :src="imageUrl" :alt="name" class="media" />

          <div class="label-title">{{ name || '名称' }}</div>
          <div class="label-desc">#{{ valueDesc || '标签' }}</div>
        </div>

        <div class="bottom-btn">立即查看</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onUnmounted } from 'vue'
import templateImg from '@/assets/template.png'

const props = defineProps({
  scale:        { type: Number, default: 0.8 },
  name:         { type: String, default: '' },
  valueDesc:    { type: String, default: '' },
  imageUrl:     { type: String, default: '' },
  videoUrl:     { type: String, default: '' },
  thumbnailUrl: { type: String, default: '' },
})

const videoType = computed(() => {
  if (/\.m3u8(\?.*)?$/i.test(props.videoUrl)) return 'application/x-mpegURL'
  if (/\.webm(\?.*)?$/i.test(props.videoUrl)) return 'video/webm'
  if (/\.ogg(\?.*)?$/i.test(props.videoUrl)) return 'video/ogg'
  return 'video/mp4'
})

onUnmounted(() => {
  const video = document.getElementById('previewVideo')
  if (video) {
    video.pause()
    video.currentTime = 0
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
