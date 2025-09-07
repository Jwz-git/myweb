<template>
    <div class="music-player" :class="{ 'playing': isPlaying }"
        :style="{ right: playerPosition.right + 'px', bottom: playerPosition.bottom + 'px' }" @mousedown="startDrag">
        <div class="player-header">
            <span class="player-title">🎵 音乐播放器</span>
            <button class="close-btn" @click="closePlayer">×</button>
        </div>
        <div class="player-content">
            <div class="album-cover">
                <img :src="currentSong.cover || '/src/assets/image/icon.png'" alt="专辑封面">
            </div>
            <div class="song-info">
                <div class="song-title">{{ currentSong.title || '未知歌曲' }}</div>
                <div class="song-artist">{{ currentSong.artist || '未知艺术家' }}</div>
            </div>
            <div class="player-controls">
                <button class="control-btn" @click="prevSong">⏮</button>
                <button class="control-btn play-btn" @click="togglePlay">{{ isPlaying ? '⏸' : '▶' }}</button>
                <button class="control-btn" @click="nextSong">⏭</button>
            </div>
            <div class="progress-container">
                <span class="time">{{ formatTime(currentTime) }}</span>
                <div class="progress-bar" @click="setProgress">
                    <div class="progress" :style="{ width: progress + '%' }"></div>
                </div>
                <span class="time">{{ formatTime(duration) }}</span>
            </div>
        </div>
        <!-- 添加audio元素 -->
        <audio ref="audioPlayer" :src="currentSong.url" @timeupdate="onTimeUpdate" @loadedmetadata="onLoadedMetadata"
            @ended="onEnded"></audio>

        <div class="volume-control">
            <span class="volume-icon">🔊</span>
            <input type="range" class="volume-slider" min="0" max="1" step="0.01" :value="volume" @input="setVolume">
        </div>
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

// 拖动相关
const isDragging = ref(false)
const dragStart = ref({ x: 0, y: 0 })
const playerPosition = ref({ right: 20, bottom: 320 }) // 初始位置

// audio元素引用
const audioPlayer = ref(null)


const currentSongIndex = ref(0)
const currentSong = ref(songs.value[0])

// 监听当前歌曲变化
watch(currentSong, () => {
    // 当歌曲改变时，重置播放状态
    if (audioPlayer.value) {
        audioPlayer.value.load(); // 重新加载音频
        isPlaying.value = false;
        currentTime.value = 0;
        progress.value = 0;
    }
});

// 拖动开始
const startDrag = (e) => {
    // 只有在标题栏上拖动才生效
    if (!e.target.classList.contains('player-header') && !e.target.classList.contains('player-title')) {
        return;
    }

    isDragging.value = true;
    dragStart.value = {
        x: e.clientX,
        y: e.clientY
    };

    // 添加全局事件监听器
    document.addEventListener('mousemove', onDrag);
    document.addEventListener('mouseup', stopDrag);
}

// 拖动中
const onDrag = (e) => {
    if (!isDragging.value) return;

    const dx = e.clientX - dragStart.value.x;
    const dy = e.clientY - dragStart.value.y;

    // 更新播放器位置
    playerPosition.value.right = Math.max(20, playerPosition.value.right - dx);
    playerPosition.value.bottom = Math.max(20, playerPosition.value.bottom - dy);

    // 更新起始位置
    dragStart.value = {
        x: e.clientX,
        y: e.clientY
    };
}

// 停止拖动
const stopDrag = () => {
    isDragging.value = false;

    // 移除全局事件监听器
    document.removeEventListener('mousemove', onDrag);
    document.removeEventListener('mouseup', stopDrag);
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

const prevSong = () => {
    currentSongIndex.value = (currentSongIndex.value - 1 + songs.value.length) % songs.value.length
    currentSong.value = songs.value[currentSongIndex.value]
}

const nextSong = () => {
    currentSongIndex.value = (currentSongIndex.value + 1) % songs.value.length
    currentSong.value = songs.value[currentSongIndex.value]
}

const closePlayer = () => {
    // 可以在这里添加关闭播放器的逻辑
    console.log('关闭音乐播放器')
    // 停止播放并重置状态
    if (audioPlayer.value) {
        audioPlayer.value.pause();
        isPlaying.value = false;
    }
}

const setProgress = (e) => {
    if (!audioPlayer.value) return;

    const progressBar = e.target
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

const onEnded = () => {
    // 歌曲播放结束时自动播放下一首
    nextSong()
    // 如果还有下一首歌，则自动播放
    if (isPlaying.value && audioPlayer.value) {
        // 等待下一首歌加载完成后再播放
        setTimeout(() => {
            audioPlayer.value.play()
        }, 100)
    }
}

const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
}

// 在data部分添加
const volume = ref(1) // 初始音量为1 (最大)

// 添加设置音量的方法
const setVolume = (e) => {
    const newVolume = parseFloat(e.target.value)
    volume.value = newVolume
    if (audioPlayer.value) {
        audioPlayer.value.volume = newVolume
    }
}

// 在onMounted中初始化音量
onMounted(() => {
    // 添加全局事件监听器
    document.addEventListener('mousemove', onDrag);
    document.addEventListener('mouseup', stopDrag);
})

onUnmounted(() => {
    // 移除全局事件监听器
    document.removeEventListener('mousemove', onDrag);
    document.removeEventListener('mouseup', stopDrag);

    // 清理音频资源
    if (audioPlayer.value) {
        audioPlayer.value.pause();
        audioPlayer.value = null;
    }
})
</script>

<style scoped>

.music-player {
    position: fixed;
    width: 200px;
    /* 从250px减小到200px */
    background: rgba(0, 0, 0, 0.8);
    border-radius: 10px;
    backdrop-filter: blur(10px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    z-index: 1000;
    color: white;
    font-family: 'Arial', sans-serif;
    transform: translateY(0);
    transition: transform 0.3s ease;
    cursor: move;
    /* 显示拖动光标 */
}

.music-player.playing {
    transform: translateY(0);
}

.player-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 12px;
    /* 调整内边距 */
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    cursor: move;
    /* 确保标题栏可以拖动 */
}

.player-title {
    font-size: 12px;
    /* 减小字体大小 */
    font-weight: bold;
    cursor: move;
    /* 确保标题可以拖动 */
}

.close-btn {
    background: none;
    border: none;
    color: white;
    font-size: 16px;
    /* 调整关闭按钮字体大小 */
    cursor: pointer;
    padding: 0;
    width: 18px;
    /* 调整关闭按钮尺寸 */
    height: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.player-content {
    padding: 12px;
    /* 调整内边距 */
}

.album-cover {
    text-align: center;
    margin-bottom: 12px;
    /* 调整间距 */
}

.album-cover img {
    width: 80px;
    /* 从100px减小到80px */
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid rgba(255, 255, 255, 0.2);
}

.song-info {
    text-align: center;
    margin-bottom: 12px;
    /* 调整间距 */
}

.song-title {
    font-weight: bold;
    font-size: 14px;
    /* 调整字体大小 */
    margin-bottom: 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.song-artist {
    font-size: 12px;
    /* 调整字体大小 */
    color: #ccc;
}

.player-controls {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 12px;
    /* 调整间距 */
    margin-bottom: 12px;
    /* 调整间距 */
}

.control-btn {
    background: none;
    border: none;
    color: white;
    font-size: 16px;
    /* 调整字体大小 */
    cursor: pointer;
    width: 35px;
    /* 调整按钮尺寸 */
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
    /* 调整播放按钮尺寸 */
    height: 40px;
    font-size: 18px;
    /* 调整字体大小 */
}

.progress-container {
    display: flex;
    align-items: center;
    gap: 8px;
    /* 调整间距 */
}

.time {
    font-size: 10px;
    /* 调整字体大小 */
    color: #ccc;
    min-width: 30px;
    /* 调整最小宽度 */
}

.progress-bar {
    flex: 1;
    height: 4px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 2px;
    cursor: pointer;
    position: relative;
}

.progress {
    position: absolute;
    height: 100%;
    background: #1db954;
    border-radius: 2px;
    transition: width 0.1s;
}

/* 添加音量控制样式 */
.volume-control {
    display: flex;
    align-items: center;
    padding: 0 12px 12px 12px;
    width: calc(100% - 24px); /* 减去左右padding */
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
}

.volume-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #46cee0;
    cursor: pointer;
}

</style>