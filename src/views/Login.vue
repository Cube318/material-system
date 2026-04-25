<template>
  <div
    class="ap-root"
    :style="{ backgroundImage: `url(${loginBg})` }"
  >
    <div class="ap-card">
      <div class="ap-glass-inner" />
      <div class="ap-top-edge" />

      <form class="ap-form" @submit.prevent="onSubmit">
        <input
          v-model="username"
          class="ap-input"
          type="text"
          placeholder="ID"
          autocomplete="username"
          spellcheck="false"
        />
        <div class="ap-row">
          <input
            v-model="password"
            class="ap-input"
            type="password"
            placeholder="Password"
            autocomplete="current-password"
          />
          <button class="ap-btn" type="submit">Continue</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import loginBg from '@/assets/loginBg.png'

const router   = useRouter()
const username = ref('')
const password = ref('')

const onSubmit = () => {
  router.push('/attractions')
}
</script>

<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.ap-root {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text',
    'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  background-color: #000;
}

/* ── card ─────────────────────────────────────── */
.ap-card {
  position: relative;
  z-index: 10;
  width: 350px;
  padding: 15px 15px;
  border-radius: 25px;
  background: rgba(255, 255, 255, .45);
  backdrop-filter: blur(64px) saturate(180%) brightness(1.12);
  -webkit-backdrop-filter: blur(64px) saturate(180%) brightness(1.12);
  border: 1px solid rgba(255, 255, 255, .35);
  box-shadow:
    inset  0  1px 0 rgba(255, 255, 255, .22),
    inset  0 -1px 0 rgba(255, 255, 255, .04),
    inset  1px 0  0 rgba(255, 255, 255, .06),
    inset -1px 0  0 rgba(255, 255, 255, .06),
    0  2px  4px rgba(0, 0, 0, .12),
    0  8px 20px rgba(0, 0, 0, .18),
    0 24px 48px rgba(0, 0, 0, .28),
    0 52px 100px rgba(0, 0, 0, .36);
}

/* inner glass reflection */
.ap-glass-inner {
  position: absolute;
  inset: 0;
  border-radius: 30px;
  background: linear-gradient(
    165deg,
    rgba(255, 255, 255, .065)  0%,
    rgba(255, 255, 255, .015) 45%,
    rgba(255, 255, 255, .005) 100%
  );
  pointer-events: none;
}

/* top edge highlight */
.ap-top-edge {
  position: absolute;
  top: 0; left: 8%; right: 8%;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent              0%,
    rgba(255, 255, 255, .38) 25%,
    rgba(255, 255, 255, .65) 50%,
    rgba(255, 255, 255, .38) 75%,
    transparent             100%
  );
  pointer-events: none;
}

/* ── form ─────────────────────────────────────── */
.ap-form {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 13px;
}

/* ── input ────────────────────────────────────── */
.ap-input {
  width: 100%;
  height: 30px;
  padding: 0 18px;
  border-radius: 16px;
  background: rgba(255, 255, 255, .55);
  border: 1px solid rgba(0, 0, 0, .12);
  color: rgba(15, 15, 25, .88);
  font-size: 15px;
  font-family: inherit;
  font-weight: 400;
  letter-spacing: .012em;
  outline: none;
  caret-color: rgba(0, 80, 210, .9);
  transition:
    background   .22s ease,
    border-color .22s ease,
    box-shadow   .22s ease;
}
.ap-input::placeholder {
  color: rgba(15, 15, 25, .38);
}
.ap-input:hover {
  background: rgba(255, 255, 255, .72);
  border-color: rgba(0, 0, 0, .18);
}
.ap-input:focus {
  background: rgba(255, 255, 255, .82);
  border-color: rgba(0, 100, 220, .55);
  box-shadow:
    0 0 0 3.5px rgba(0, 100, 220, .14),
    0 2px 12px   rgba(0, 0, 0, .12);
}

/* ── password + button row ────────────────────── */
.ap-row {
  display: flex;
  align-items: stretch;
  gap: 10px;
  height: 30px;
}
.ap-row .ap-input {
  flex: 1;
  min-width: 0;
  height: 30px;
}

/* ── button ───────────────────────────────────── */
.ap-btn {
  flex-shrink: 0;
  height: 30px;
  padding: 0 22px;
  border-radius: 16px;
  border: none;
  outline: none;
  background: rgba(255, 255, 255, .91);
  color: rgba(5, 5, 18, .88);
  font-size: 15px;
  font-weight: 600;
  font-family: inherit;
  letter-spacing: .018em;
  cursor: pointer;
  white-space: nowrap;
  -webkit-tap-highlight-color: transparent;
  transition:
    background .20s ease,
    box-shadow  .20s ease,
    transform   .22s cubic-bezier(.34, 1.56, .64, 1);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, .55),
    0 1px  3px rgba(0, 0, 0, .18),
    0 4px 14px rgba(0, 0, 0, .30),
    0 8px 24px rgba(0, 0, 0, .20);
}
.ap-btn:hover {
  background: rgba(255, 255, 255, .98);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, .65),
    0 2px  6px rgba(0, 0, 0, .22),
    0 6px 20px rgba(0, 0, 0, .34),
    0 12px 32px rgba(0, 0, 0, .24);
}
.ap-btn:active {
  transform: scale(.955);
  background: rgba(236, 236, 245, .96);
  transition:
    background .08s ease,
    transform  .10s cubic-bezier(.4, 0, .6, 1),
    box-shadow .08s ease;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, .40),
    0 1px 4px rgba(0, 0, 0, .18),
    0 2px 8px rgba(0, 0, 0, .22);
}
.ap-btn:focus-visible {
  outline: 2.5px solid rgba(100, 155, 255, .65);
  outline-offset: 2px;
}
</style>
