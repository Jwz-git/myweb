<template>
    <div class="music-player" :class="{ 'playing': isPlaying, 'folded': isFolded }"
        :style="{ right: playerPosition.right + 'px', bottom: playerPosition.bottom + 'px' }" @mousedown="startDrag"
        @touchstart="startDrag">
        <!-- 播放器头部 -->
        <div class="player-header">
            <span class="player-title">🎵 音乐播放器</span>
            <button class="fold-btn" @click="foldPlayer">
                <i class="bi" :class="isFolded ? 'bi-chevron-down' : 'bi-chevron-up'" style="color: white;"></i>
            </button>
        </div>

        <!-- 播放器内容区 -->
        <div class="player-content" v-if="!isFolded">
            <div class="album-cover">
                <img :src="currentSong.cover || '/src/assets/image/icon.png'" alt="专辑封面">
            </div>
            <div class="song-info">
                <div class="song-title">{{ currentSong.title || '未知' }}</div>
                <div class="song-artist">{{ currentSong.artist || '未知' }}</div>
            </div>
            <div class="player-controls">
                <button class="control-btn" @click="prevSong"><i class="bi bi-skip-start-fill"></i></button>
                <button class="control-btn play-btn" @click="togglePlay">
                    <i class="bi bi-pause-fill" v-if="isPlaying"></i>
                    <i class="bi bi-play-fill" v-else></i>
                </button>
                <button class="control-btn" @click="nextSong"><i class="bi bi-skip-end-fill"></i></button>
            </div>
        </div>

        <!-- 折叠状态下的简化显示 -->
        <div class="folded-content" v-if="isFolded">
            <div class="folded-song-info">
                {{ currentSong.title || '未知' }} - {{ currentSong.artist || '未知' }}
            </div>
            <div class="folded-controls">
                <button class="control-btn" @click="togglePlay">
                    <i class="bi bi-pause-fill" v-if="isPlaying"></i>
                    <i class="bi bi-play-fill" v-else></i>
                </button>
            </div>
        </div>

        <!-- 进度条 -->
        <div class="progress-container">
            <span class="time">{{ formatTime(currentTime) }}</span>
            <div class="progress-bar" @click="setProgress">
                <div class="progress" :style="{ width: progress + '%' }"></div>
            </div>
            <span class="time">{{ formatTime(duration) }}</span>
        </div>

        <!-- 音量控制 -->
        <div class="volume-control" v-if="!isFolded">
            <span class="volume-icon">🔊</span>
            <input type="range" class="volume-slider" min="0" max="1" step="0.01" :value="volume" @input="setVolume">
        </div>

        <!-- 音频元素 -->
        <audio ref="audioPlayer" :src="currentSong.url" @timeupdate="onTimeUpdate" @loadedmetadata="onLoadedMetadata"
            @ended="onEnded">
        </audio>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { songs } from '../data/music.js'

// 播放器状态
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const progress = ref(0)
const isFolded = ref(false) // 新增折叠状态

// 拖动相关
const isDragging = ref(false)
const dragStart = ref({ x: 0, y: 0 })
const playerPosition = ref({ right: 20, bottom: 320 }) // 初始位置

// audio元素引用
const audioPlayer = ref(null)

const currentSongIndex = ref(0)
const currentSong = ref(songs.value[0])

// 修改prevSong和nextSong函数，确保在音频加载完成后播放
const prevSong = () => {
    currentSongIndex.value = (currentSongIndex.value - 1 + songs.value.length) % songs.value.length
    currentSong.value = songs.value[currentSongIndex.value]
    
    // 等待音频加载完成后播放
    if (audioPlayer.value) {
        audioPlayer.value.load()
        audioPlayer.value.oncanplay = () => {
            audioPlayer.value.play()
            isPlaying.value = true
        }
    }
}

const nextSong = () => {
    currentSongIndex.value = (currentSongIndex.value + 1) % songs.value.length
    currentSong.value = songs.value[currentSongIndex.value]
    
    // 等待音频加载完成后播放
    if (audioPlayer.value) {
        audioPlayer.value.load()
        audioPlayer.value.oncanplay = () => {
            audioPlayer.value.play()
            isPlaying.value = true
        }
    }
}

// 获取事件坐标（支持鼠标和触摸）
const getEventCoordinates = (e) => {
    if (e.type.includes('touch')) {
        const touch = e.touches[0] || e.changedTouches[0];
        return { x: touch.clientX, y: touch.clientY };
    }
    return { x: e.clientX, y: e.clientY };
};

// 拖动开始
const startDrag = (e) => {
    // 防止默认行为，避免页面滚动
    if (e.target.closest('.volume-control') || e.target.closest('.progress-container')) {
        return;
    }

    isDragging.value = true;
    const coords = getEventCoordinates(e);
    dragStart.value = {
        x: coords.x,
        y: coords.y
    };

    // 添加全局事件监听器（同时支持鼠标和触摸）
    if (e.type.includes('touch')) {
        document.addEventListener('touchmove', onDrag, { passive: false });
        document.addEventListener('touchend', stopDrag);
    } else {
        document.addEventListener('mousemove', onDrag);
        document.addEventListener('mouseup', stopDrag);
    }
}

// 拖动中
const onDrag = (e) => {
    if (!isDragging.value) return;

    // 防止默认行为，避免页面滚动
    e.preventDefault();

    const coords = getEventCoordinates(e);
    const dx = coords.x - dragStart.value.x;
    const dy = coords.y - dragStart.value.y;

    // 获取窗口尺寸
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // 获取播放器尺寸（假设宽度200px，高度根据折叠状态变化）
    const playerWidth = 200;
    const playerHeight = isFolded.value ? 80 : 200; // 根据实际情况调整

    // 更新播放器位置，限制所有边界
    playerPosition.value.right = Math.max(
        20, // 最小右边距
        Math.min(
            windowWidth - playerWidth - 20, // 最大右边距（左边界限制）
            playerPosition.value.right - dx
        )
    );

    playerPosition.value.bottom = Math.max(
        20, // 最小下边距
        Math.min(
            windowHeight - playerHeight - 20, // 最大下边距（上边界限制）
            playerPosition.value.bottom - dy
        )
    );

    // 更新起始位置
    dragStart.value = {
        x: coords.x,
        y: coords.y
    };
}

// 停止拖动
const stopDrag = () => {
    isDragging.value = false;

    // 移除全局事件监听器（同时支持鼠标和触摸）
    document.removeEventListener('mousemove', onDrag);
    document.removeEventListener('mouseup', stopDrag);
    document.removeEventListener('touchmove', onDrag);
    document.removeEventListener('touchend', stopDrag);
}

// 实际播放控制
const togglePlay = () => {
    if (audioPlayer.value) {
        if (isPlaying.value) {
            audioPlayer.value.pause();
        } else {
            audioPlayer.value.play();
        }
        isPlaying.value = !isPlaying.value;
    }
}

// 歌曲播放结束时自动播放下一首
const onEnded = () => {
    nextSong()
    // 自动播放下一首
    if (audioPlayer.value) {
        audioPlayer.value.play()
    }
}

onMounted(() => {
    // 添加全局事件监听器（同时支持鼠标和触摸）
    document.addEventListener('mousemove', onDrag);
    document.addEventListener('mouseup', stopDrag);
    document.addEventListener('touchmove', onDrag, { passive: false });
    document.addEventListener('touchend', stopDrag);
    
    // 页面加载时自动播放（添加等待音频加载完成的逻辑）
    if (audioPlayer.value) {
        audioPlayer.value.oncanplay = () => {
            audioPlayer.value.play();
            isPlaying.value = true;
        };
        // 确保音频开始加载
        audioPlayer.value.load();
    }
})

const foldPlayer = () => {
    isFolded.value = !isFolded.value
}

const setProgress = (e) => {
    if (!audioPlayer.value) return;

    const progressBar = e.target.closest('.progress-bar')
    const rect = progressBar.getBoundingClientRect()
    const percent = (e.clientX - rect.left) / rect.width

    // 设置音频播放位置
    const newTime = percent * duration.value
    audioPlayer.value.currentTime = newTime

    // 更新状态
    currentTime.value = newTime
    progress.value = percent * 100
}

// 音频事件处理
const onTimeUpdate = () => {
    if (audioPlayer.value) {
        currentTime.value = audioPlayer.value.currentTime
        // 只有在播放时才更新进度条
        if (isPlaying.value) {
            progress.value = (currentTime.value / duration.value) * 100
        }
    }
}

const onLoadedMetadata = () => {
    if (audioPlayer.value) {
        duration.value = audioPlayer.value.duration
    }
}

const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
}

const volume = ref(1) // 初始音量为1 (最大)

const setVolume = (e) => {
    const newVolume = parseFloat(e.target.value)
    volume.value = newVolume
    if (audioPlayer.value) {
        audioPlayer.value.volume = newVolume
    }
}

onUnmounted(() => {
    // 移除全局事件监听器
    document.removeEventListener('mousemove', onDrag);
    document.removeEventListener('mouseup', stopDrag);
    document.removeEventListener('touchmove', onDrag);
    document.removeEventListener('touchend', stopDrag);

    // 清理音频资源
    if (audioPlayer.value) {
        audioPlayer.value.pause();
        audioPlayer.value = null;
    }
})
</script>

<style scoped>
/* 播放器主容器 */
.music-player {
    position: fixed;
    width: 200px;
    background: rgba(0, 0, 0, 0.8);
    border-radius: 10px;
    backdrop-filter: blur(10px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    z-index: 1000;
    color: white;
    font-family: 'Arial', sans-serif;
    transition: transform 0.3s ease;
    cursor: move;
    /* 防止触摸时的文本选择 */
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    /* 防止触摸时的默认行为 */
    -webkit-touch-callout: none;
    -webkit-tap-highlight-color: transparent;
    /* 使用Flex布局确保垂直排列 */
    display: flex;
    flex-direction: column;
}

/* 隐藏原生音频控件 */
audio {
    display: none !important;
}

/* 播放器头部 */
.player-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 12px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    cursor: move;
}

.player-title {
    font-size: 12px;
    font-weight: bold;
    cursor: move;
}

.fold-btn {
    background: none;
    border: none;
    color: white;
    font-size: 16px;
    cursor: pointer;
    padding: 0;
    width: 18px;
    height: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* 播放器内容区 */
.player-content {
    padding: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.album-cover {
    text-align: center;
    margin-bottom: 12px;
}

.album-cover img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid rgba(255, 255, 255, 0.2);
}

.song-info {
    text-align: center;
    margin-bottom: 12px;
    width: 100%;
}

.song-title {
    font-weight: bold;
    font-size: 14px;
    margin-bottom: 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.song-artist {
    font-size: 12px;
    color: #ccc;
}

/* 控制按钮 */
.player-controls {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 12px;
    margin-bottom: 8px;
    height: 0.6rem;
}

.control-btn {
    background: none;
    border: none;
    color: white;
    font-size: 16px;
    cursor: pointer;
    width: 35px;
    height: 35px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s;
}

.control-btn:hover {
    background: rgba(255, 255, 255, 0.1);
}

.play-btn {
    width: 40px;
    height: 40px;
    font-size: 18px;
}

/* 进度条 */
.progress-container {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0 12px;
    margin-bottom: 10px;
    position: relative;
    width: 100%;
}

.time {
    font-size: 10px;
    color: #ccc;
    min-width: 30px;
}

.progress-bar {
    flex: 1;
    height: 4px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 2px;
    cursor: pointer;
    position: relative;
    width: 100%;
}

.progress {
    position: absolute;
    height: 100%;
    background: #1db954;
    border-radius: 2px;
    transition: width 0.1s;
}

/* 音量控制 */
.volume-control {
    display: flex;
    align-items: center;
    padding: 0 12px 12px 12px;
    width: calc(100% - 24px);
}

.volume-icon {
    font-size: 14px;
    margin-right: 8px;
    flex-shrink: 0;
}

.volume-slider {
    flex: 1;
    height: 4px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 2px;
    outline: none;
    width: 100%;
}

.volume-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #46cee0;
    cursor: pointer;
}

.music-player.folded {
    height: 5.5rem;
    width: 12rem;
}

.folded-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 12px;
    height: 2.5rem;
    width: auto;
}

.folded-song-info {
    font-size: 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
    margin-right: 8px;
}

.folded-controls {
    flex-shrink: 0;
}

.folded-controls .control-btn {
    width: 30px;
    height: 30px;
    font-size: 14px;
}

@keyframes rotate {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}

.album-cover img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid rgba(255, 255, 255, 0.2);
    transition: transform 0.3s ease;
}

.music-player.playing .album-cover img {
    animation: rotate 12s linear infinite;
}

/* 响应式设计 - 手机界面 */
@media screen and (max-width: 768px) {
    .music-player {
        width: 12rem;
    }

    .player-title {
        font-size: 10px;
    }

    .plager-container {
        height: 0.5rem;
    }

    .fold-btn {
        font-size: 14px;
        width: 16px;
        height: 16px;
    }

    .album-cover img {
        width: 60px;
        height: 60px;
    }

    .song-title {
        font-size: 12px;
    }

    .song-artist {
        font-size: 10px;
    }

    .control-btn {
        width: 30px;
        height: 30px;
        font-size: 14px;
    }

    .play-btn {
        width: 35px;
        height: 35px;
        font-size: 16px;
    }

    .time {
        font-size: 8px;
        min-width: 25px;
    }

    .volume-control {
        padding: 0 10px 10px 10px;
    }

    .volume-icon {
        font-size: 12px;
    }

    .folded-song-info {
        font-size: 10px;
    }

    .folded-controls .control-btn {
        width: 25px;
        height: 25px;
        font-size: 12px;
    }

    .folded-content {
        height: 3rem;
    }

    .music-player.folded {
        height: 6rem;
        width: 12rem;
    }

    .album-cover img {
        width: 60px;
        height: 60px;
    }
}
</style>