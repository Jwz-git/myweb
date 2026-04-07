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
      @timeupdate="onTimeUpdate"
      @loadedmetadata="onLoadedMetadata"
      @ended="onEnded"
    ></audio>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
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
  const el = document.querySelector('.music-player')
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
  if (e.target.closest('.ctrl-btn') || e.target.closest('.vol-btn') || e.target.closest('.volume-slider') || e.target.closest('.progress-track')) return

  isDragging.value = true
  hasMoved.value = false
  const c = getCoords(e)
  dragStartMouse.value = { x: c.x, y: c.y }
  dragStartPos.value = { x: playerPos.value.x, y: playerPos.value.y }

  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
}

const onTouchStart = (e) => {
  if (e.target.closest('.ctrl-btn') || e.target.closest('.vol-btn') || e.target.closest('.volume-slider') || e.target.closest('.progress-track')) return

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

const handleBarClick = () => {
  // Only toggle expand if it was a click, not a drag
  if (!hasMoved.value) {
    isExpanded.value = !isExpanded.value
  }
}

const togglePlay = async () => {
  if (!audioEl.value) return
  try {
    if (isPlaying.value) {
      audioEl.value.pause()
      isPlaying.value = false
    } else {
      await audioEl.value.play()
      isPlaying.value = true
    }
  } catch (err) {
    console.error('Play failed:', err)
    isPlaying.value = false
  }
}

const prevSong = async () => {
  currentSongIndex.value = (currentSongIndex.value - 1 + songs.value.length) % songs.value.length
  currentSong.value = songs.value[currentSongIndex.value]
  if (audioEl.value) {
    audioEl.value.load()
    try {
      await audioEl.value.play()
      isPlaying.value = true
    } catch (e) {
      isPlaying.value = false
    }
  }
}

const nextSong = async () => {
  currentSongIndex.value = (currentSongIndex.value + 1) % songs.value.length
  currentSong.value = songs.value[currentSongIndex.value]
  if (audioEl.value) {
    audioEl.value.load()
    try {
      await audioEl.value.play()
      isPlaying.value = true
    } catch (e) {
      isPlaying.value = false
    }
  }
}

const onEnded = () => {
  nextSong()
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

onMounted(() => {
  if (audioEl.value) {
    audioEl.value.volume = volume.value
    audioEl.value.load()
  }
})

onUnmounted(() => {
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseup', onMouseUp)
  document.removeEventListener('touchmove', onTouchMove)
  document.removeEventListener('touchend', onTouchEnd)
  if (audioEl.value) {
    audioEl.value.pause()
  }
})
</script>

<style scoped>
.music-player {
  position: fixed;
  z-index: 900;
  user-select: none;
  width: 280px;
  transition: box-shadow var(--transition-normal);
}

.music-player:hover {
  z-index: 901;
}

/* Compact Bar */
.player-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  background: var(--bg-surface);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-normal);
  box-shadow: var(--shadow-md);
}

.player-bar:hover {
  border-color: var(--border-primary);
  background: var(--bg-surface-hover);
}

.player-bar-info {
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
  flex: 1;
  margin-right: 12px;
}

.song-name {
  font-size: 0.82rem;
  font-weight: 500;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.song-artist {
  font-size: 0.72rem;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.player-bar-controls {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}

.ctrl-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  color: var(--text-secondary);
  transition: all var(--transition-fast);
}

.ctrl-btn:hover {
  color: var(--text-primary);
  background: var(--bg-elevated);
}

.ctrl-btn.play-btn {
  color: var(--accent);
  width: 32px;
  height: 32px;
}

.ctrl-btn.play-btn:hover {
  background: var(--accent-muted);
  color: var(--accent-hover);
}

/* Expanded Panel */
.player-panel {
  margin-top: 8px;
  padding: 12px 14px;
  background: var(--bg-surface);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
}

.progress-section {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.time-label {
  font-size: 0.7rem;
  color: var(--text-muted);
  font-family: var(--font-mono);
  min-width: 32px;
  text-align: center;
}

.progress-track {
  flex: 1;
  height: 4px;
  background: var(--bg-elevated);
  border-radius: 2px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--accent);
  border-radius: 2px;
  transition: width 0.1s linear;
}

.progress-track:hover .progress-fill {
  background: var(--accent-hover);
}

.volume-section {
  display: flex;
  align-items: center;
  gap: 8px;
}

.vol-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  color: var(--text-muted);
  transition: color var(--transition-fast);
  flex-shrink: 0;
}

.vol-btn:hover {
  color: var(--text-primary);
}

.volume-slider {
  flex: 1;
  -webkit-appearance: none;
  appearance: none;
  height: 3px;
  background: var(--bg-elevated);
  border-radius: 2px;
  outline: none;
  cursor: pointer;
}

.volume-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--accent);
  cursor: pointer;
  transition: transform var(--transition-fast);
}

.volume-slider::-webkit-slider-thumb:hover {
  transform: scale(1.2);
}

.volume-slider::-moz-range-thumb {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--accent);
  cursor: pointer;
  border: none;
}

/* Playing indicator */
.music-player.playing .player-bar {
  border-color: rgba(201, 169, 110, 0.3);
}

/* Slide transition */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.25s ease;
  overflow: hidden;
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(8px);
  max-height: 0;
  margin-top: 0;
  padding-top: 0;
  padding-bottom: 0;
}

.slide-up-enter-to,
.slide-up-leave-from {
  max-height: 100px;
}

/* Mobile */
@media (max-width: 768px) {
  .music-player {
    width: 240px;
  }

  .player-bar {
    padding: 8px 12px;
  }

  .song-name {
    font-size: 0.78rem;
  }
}
</style>
