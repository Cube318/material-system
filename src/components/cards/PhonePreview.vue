<template>
  <div class="phone-shell" :style="{ transform: `scale(${scale})` }">
    <slot />
  </div>
</template>

<script setup>
defineProps({
  scale: {
    type: Number,
    default: 0.8,
  },
})
</script>

<style scoped>
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
</style>
