<template>
  <div
    class="music-player"
    :class="{ expanded: isExpanded, playing: isPlaying }"
    :style="{ right: playerPos.x + 'px', bottom: playerPos.y + 'px' }"
    @mousedown="onMouseDown"
    @touchstart.prevent="onTouchStart"
  >
    <!-- Compact bar -->
    <div class="player-bar" @click.stop="handleBarClick">
      <div class="player-bar-info">
        <span class="song-name">{{ currentSong.title || '未知' }}</span>
        <span class="song-artist">{{ currentSong.artist || '' }}</span>
      </div>
      <div class="player-bar-controls">
        <button class="ctrl-btn" @click.stop="prevSong" title="上一首">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z"/>
          </svg>
        </button>
        <button class="ctrl-btn play-btn" @click.stop="togglePlay" :title="isPlaying ? '暂停' : '播放'">
          <svg v-if="isPlaying" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 4h4v16H6zM14 4h4v16h-4z"/>
          </svg>
          <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z"/>
          </svg>
        </button>
        <button class="ctrl-btn" @click.stop="nextSong" title="下一首">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Expanded panel -->
    <transition name="slide-up">
      <div class="player-panel" v-if="isExpanded" @click.stop>
        <!-- Progress -->
        <div class="progress-section">
          <span class="time-label">{{ formatTime(currentTime) }}</span>
          <div class="progress-track" @click="setProgress" ref="progressTrack">
            <div class="progress-fill" :style="{ width: progress + '%' }"></div>
          </div>
          <span class="time-label">{{ formatTime(duration) }}</span>
        </div>

        <!-- Volume -->
        <div class="volume-section">
          <button class="vol-btn" @click="toggleMute">
            <svg v-if="volume > 0 && !isMuted" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
            </svg>
            <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
            </svg>
          </button>
          <input
            type="range"
            class="volume-slider"
            min="0"
            max="1"
            step="0.01"
            :value="isMuted ? 0 : volume"
            @input="setVolume"
          />
        </div>
      </div>
    </transition>

    <!-- Audio -->
    <audio
      ref="audioEl"
      :src="currentSong.url"
      autoplay
      preload="auto"
      playsinline
      @play="onPlay"
      @pause="onPause"
      @timeupdate="onTimeUpdate"
      @loadedmetadata="onLoadedMetadata"
      @ended="onEnded"
    ></audio>
  </div>
</template>

<script setup>
import { nextTick, ref, onMounted, onUnmounted } from 'vue'
import { songs } from '../data/music.js'

const isPlaying = ref(false)
const isExpanded = ref(false)
const isMuted = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const progress = ref(0)
const volume = ref(0.25)

const audioEl = ref(null)
const progressTrack = ref(null)
const currentSongIndex = ref(0)
const currentSong = ref(songs.value[0])
let retryAutoplayOnInteraction = false
let playRequestInFlight = false

// --- Drag system ---
const isDragging = ref(false)
const hasMoved = ref(false)
const dragStartMouse = ref({ x: 0, y: 0 })
const dragStartPos = ref({ x: 0, y: 0 })
const playerPos = ref({ x: 20, y: 20 })

const DRAG_THRESHOLD = 5 // px — below this, treat as click

const getCoords = (e) => {
  if (e.touches) {
    const t = e.touches[0] || e.changedTouches[0]
    return { x: t.clientX, y: t.clientY }
  }
  return { x: e.clientX, y: e.clientY }
}

const clampPos = (x, y) => {
  const el = audioEl.value?.closest('.music-player')
  const pw = el ? el.offsetWidth : 280
  const ph = el ? el.offsetHeight : 48
  const ww = window.innerWidth
  const wh = window.innerHeight
  return {
    x: Math.max(0, Math.min(ww - pw, x)),
    y: Math.max(0, Math.min(wh - ph, y))
  }
}

const onMouseDown = (e) => {
  // Don't start drag from interactive controls
  if (e.target.closest('button, input, .progress-track')) return

  isDragging.value = true
  hasMoved.value = false
  const c = getCoords(e)
  dragStartMouse.value = { x: c.x, y: c.y }
  dragStartPos.value = { x: playerPos.value.x, y: playerPos.value.y }

  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
}

const onTouchStart = (e) => {
  if (e.target.closest('button, input, .progress-track')) return

  isDragging.value = true
  hasMoved.value = false
  const c = getCoords(e)
  dragStartMouse.value = { x: c.x, y: c.y }
  dragStartPos.value = { x: playerPos.value.x, y: playerPos.value.y }

  document.addEventListener('touchmove', onTouchMove, { passive: false })
  document.addEventListener('touchend', onTouchEnd)
}

const onMouseMove = (e) => {
  if (!isDragging.value) return
  const c = getCoords(e)
  const dx = c.x - dragStartMouse.value.x
  const dy = c.y - dragStartMouse.value.y

  if (!hasMoved.value && Math.abs(dx) < DRAG_THRESHOLD && Math.abs(dy) < DRAG_THRESHOLD) return

  hasMoved.value = true
  // right/bottom positioning: moving mouse right → decrease right value; moving mouse down → decrease bottom value
  const newX = dragStartPos.value.x - dx
  const newY = dragStartPos.value.y - dy
  const clamped = clampPos(newX, newY)
  playerPos.value.x = clamped.x
  playerPos.value.y = clamped.y
}

const onTouchMove = (e) => {
  if (!isDragging.value) return
  e.preventDefault()
  onMouseMove(e)
}

const onMouseUp = () => {
  isDragging.value = false
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseup', onMouseUp)
}

const onTouchEnd = () => {
  isDragging.value = false
  document.removeEventListener('touchmove', onTouchMove)
  document.removeEventListener('touchend', onTouchEnd)
}

const keepPlayerInViewport = () => {
  const clamped = clampPos(playerPos.value.x, playerPos.value.y)
  playerPos.value = clamped
}

const handleBarClick = () => {
  // Only toggle expand if it was a click, not a drag
  if (!hasMoved.value) {
    isExpanded.value = !isExpanded.value
  }
}

const togglePlay = async () => {
  if (!audioEl.value) return
  if (!audioEl.value.paused) {
    audioEl.value.pause()
    return
  }
  await playCurrentSong()
}

const playCurrentSong = async ({ retryOnInteraction = false } = {}) => {
  if (!audioEl.value || playRequestInFlight) return false
  playRequestInFlight = true
  try {
    await audioEl.value.play()
    clearAutoplayFallback()
    return true
  } catch (err) {
    if (retryOnInteraction && err?.name === 'NotAllowedError') {
      armAutoplayFallback()
    } else {
      console.warn('Playback failed:', err)
    }
    return false
  } finally {
    playRequestInFlight = false
  }
}

const armAutoplayFallback = () => {
  if (retryAutoplayOnInteraction) return
  retryAutoplayOnInteraction = true
  document.addEventListener('pointerdown', retryAutoplay, { once: true, capture: true })
  document.addEventListener('keydown', retryAutoplay, { once: true, capture: true })
}

const clearAutoplayFallback = () => {
  retryAutoplayOnInteraction = false
  document.removeEventListener('pointerdown', retryAutoplay, true)
  document.removeEventListener('keydown', retryAutoplay, true)
}

const retryAutoplay = (event) => {
  if (!retryAutoplayOnInteraction) return
  if (event?.type === 'pointerdown' && event.target?.closest('.music-player button, .music-player input')) {
    document.addEventListener('pointerdown', retryAutoplay, { once: true, capture: true })
    return
  }
  if (event?.type === 'keydown' && !['Enter', ' ', 'Spacebar'].includes(event.key)) {
    document.addEventListener('keydown', retryAutoplay, { once: true, capture: true })
    return
  }
  clearAutoplayFallback()
  playCurrentSong()
}

const prevSong = async () => {
  currentSongIndex.value = (currentSongIndex.value - 1 + songs.value.length) % songs.value.length
  currentSong.value = songs.value[currentSongIndex.value]
  // Wait for Vue to update :src before loading and playing the new song.
  await nextTick()
  audioEl.value?.load()
  await playCurrentSong()
}

const nextSong = async () => {
  currentSongIndex.value = (currentSongIndex.value + 1) % songs.value.length
  currentSong.value = songs.value[currentSongIndex.value]
  // Wait for Vue to update :src before loading and playing the new song.
  await nextTick()
  audioEl.value?.load()
  await playCurrentSong()
}

const onEnded = () => {
  nextSong()
}

const onPlay = () => {
  isPlaying.value = true
  clearAutoplayFallback()
}

const onPause = () => {
  isPlaying.value = false
}

const onTimeUpdate = () => {
  if (audioEl.value) {
    currentTime.value = audioEl.value.currentTime
    if (duration.value > 0) {
      progress.value = (currentTime.value / duration.value) * 100
    }
  }
}

const onLoadedMetadata = () => {
  if (audioEl.value) {
    duration.value = audioEl.value.duration
  }
}

const setProgress = (e) => {
  if (!progressTrack.value || !audioEl.value) return
  const rect = progressTrack.value.getBoundingClientRect()
  const clientX = e.touches ? e.touches[0].clientX : e.clientX
  const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
  audioEl.value.currentTime = pct * duration.value
  currentTime.value = pct * duration.value
  progress.value = pct * 100
}

const toggleMute = () => {
  isMuted.value = !isMuted.value
  if (audioEl.value) {
    audioEl.value.volume = isMuted.value ? 0 : volume.value
  }
}

const setVolume = (e) => {
  const v = parseFloat(e.target.value)
  volume.value = v
  isMuted.value = v === 0
  if (audioEl.value) {
    audioEl.value.volume = v
  }
}

const formatTime = (s) => {
  if (!s || isNaN(s)) return '0:00'
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec < 10 ? '0' : ''}${sec}`
}

onMounted(async () => {
  window.addEventListener('resize', keepPlayerInViewport, { passive: true })
  if (audioEl.value) {
    audioEl.value.volume = volume.value
    audioEl.value.load()
    await playCurrentSong({ retryOnInteraction: true })
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', keepPlayerInViewport)
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseup', onMouseUp)
  document.removeEventListener('touchmove', onTouchMove)
  document.removeEventListener('touchend', onTouchEnd)
  document.removeEventListener('pointerdown', retryAutoplay, true)
  document.removeEventListener('keydown', retryAutoplay, true)
  if (audioEl.value) {
    audioEl.value.pause()
  }
})
</script>

<style scoped src="../styles/music-player.css"></style>
