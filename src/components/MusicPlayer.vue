<template>
    <div class="music-player" :class="{ 'playing': isPlaying }"
        :style="{ left: playerPosition.left + 'px', bottom: playerPosition.bottom + 'px' }" @mousedown="startDrag"
        @touchstart="startDrag">
        <!-- 播放器内容区 -->
        <div class="player-content">
            <div class="top-section">
                <div class="album-cover">
                    <img :src="currentSong.cover || '/src/assets/image/icon.png'" alt="专辑封面">
                </div>
                <div class="song-info">
                    <div class="song-title">{{ currentSong.title || '未知' }}</div>
                    <div class="song-artist">{{ currentSong.artist || '未知' }}</div>
                </div>
            </div>
            <div class="player-controls">
                <button class="control-btn" @click="prevSong">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" height="24"
                        width="24">
                        <path clip-rule="evenodd" d="M12 21.6a9.6 9.6 0 1 0 0-19.2 9.6 9.6 0 0 0 0 19.2Zm.848-12.352a1.2 1.2 0 0 
                        0-1.696-1.696l-3.6 3.6a1.2 1.2 0 0 0 0 1.696l3.6 3.6a1.2 1.2 0 0 0 1.696-1.696L11.297 13.2H15.6a1.2 1.2 
                        0 1 0 0-2.4h-4.303l1.551-1.552Z" fill-rule="evenodd"></path>
                    </svg>
                </button>
                <button class="control-btn play-btn" @click="togglePlay">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" height="24"
                        width="24" v-if="isPlaying">
                        <path clip-rule="evenodd"
                            d="M21.6 12a9.6 9.6 0 1 1-19.2 0 9.6 9.6 0 0 1 19.2 0ZM8.4 9.6a1.2 1.2 0 1 1 2.4 0v4.8a1.2 1.2 0 1 
                            1-2.4 0V9.6Zm6-1.2a1.2 1.2 0 0 0-1.2 1.2v4.8a1.2 1.2 0 1 0 2.4 0V9.6a1.2 1.2 0 0 0-1.2-1.2Z" fill-rule="evenodd">
                        </path>
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="24" width="24"
                        v-if="!isPlaying">
                        <circle cx="12" cy="12" r="9.5" fill="white" />
                        <path d="M10 8c0-.5.5-.8 1-.5l4 3.5c.4.3.4.9 0 1.2l-4 3.5c-.5.3-1 0-1-.5V8z" fill="black" />
                    </svg>

                </button>
                <button class="control-btn" @click="nextSong">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" height="24"
                        width="24">
                        <path clip-rule="evenodd" d="M12 21.6a9.6 9.6 0 1 0 0-19.2 9.6 9.6 0 0 0 0 19.2Zm4.448-10.448-3.6-3.6a1.2 1.2 0 0 0-1.696 
                            1.696l1.551 1.552H8.4a1.2 1.2 0 1 0 0 2.4h4.303l-1.551 1.552a1.2 1.2 0 1 0 1.696 1.696l3.6-3.6a1.2 
                            1.2 0 0 0 0-1.696Z" fill-rule="evenodd"></path>
                    </svg>
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
        <div class="volume-control">
            <span class="volume-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" height="20" width="24"
                    class="volume_button">
                    <path clip-rule="evenodd"
                        d="M11.26 3.691A1.2 1.2 0 0 1 12 4.8v14.4a1.199 1.199 0 0 1-2.048.848L5.503 15.6H2.4a1.2 1.2 0 0 1-1.2-1.2V9.6a1.2 
                        1.2 0 0 1 1.2-1.2h3.103l4.449-4.448a1.2 1.2 0 0 1 1.308-.26Zm6.328-.176a1.2 1.2 0 0 1 1.697 0A11.967 11.967 0 0 1 
                        22.8 12a11.966 11.966 0 0 1-3.515 8.485 1.2 1.2 0 0 1-1.697-1.697A9.563 9.563 0 0 0 20.4 12a9.565 9.565 0 0 
                        0-2.812-6.788 1.2 1.2 0 0 1 0-1.697Zm-3.394 3.393a1.2 1.2 0 0 1 1.698 0A7.178 7.178 0 0 1 18 12a7.18 7.18 0 0 
                        1-2.108 5.092 1.2 1.2 0 1 1-1.698-1.698A4.782 4.782 0 0 0 15.6 12a4.78 4.78 0 0 0-1.406-3.394 1.2 1.2 0 0 1 0-1.698Z"
                        fill-rule="evenodd"></path>
                </svg>
            </span>
            <input type="range" class="volume-slider" min="0" max="1" step="0.01" :value="volume" @input="setVolume">
        </div>

        <!-- 音频元素 -->
        <audio ref="audioPlayer" :src="currentSong.url" @timeupdate="onTimeUpdate" @loadedmetadata="onLoadedMetadata"
            @ended="onEnded">
        </audio>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { songs } from '../data/music.js'

// 播放器状态
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const progress = ref(0)

// 拖动相关
const isDragging = ref(false)
const dragStart = ref({ x: 0, y: 0 })
const playerPosition = ref({ left: 20, bottom: 50 }) // 初始位置改为左下角

// audio元素引用
const audioPlayer = ref(null)

const currentSongIndex = ref(0)
const currentSong = ref(songs.value[0])

// 修改prevSong和nextSong函数，确保在音频加载完成后播放
const prevSong = async () => {
    currentSongIndex.value = (currentSongIndex.value - 1 + songs.value.length) % songs.value.length
    currentSong.value = songs.value[currentSongIndex.value]

    // 等待音频加载完成后播放
    if (audioPlayer.value) {
        audioPlayer.value.load()
        try {
            await audioPlayer.value.play()
            isPlaying.value = true
        } catch (error) {
            console.error('上一首播放失败:', error)
            isPlaying.value = false
        }
    }
}

const nextSong = async () => {
    currentSongIndex.value = (currentSongIndex.value + 1) % songs.value.length
    currentSong.value = songs.value[currentSongIndex.value]

    // 等待音频加载完成后播放
    if (audioPlayer.value) {
        audioPlayer.value.load()
        try {
            await audioPlayer.value.play()
            isPlaying.value = true
        } catch (error) {
            console.error('下一首播放失败:', error)
            isPlaying.value = false
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

    // 获取播放器尺寸（固定高度，不再根据折叠状态变化）
    const playerWidth = 200;
    const playerHeight = 180; // 固定高度

    // 更新播放器位置，限制所有边界（使用left定位）
    playerPosition.value.left = Math.max(
        20, // 最小左边距
        Math.min(
            windowWidth - playerWidth - 20, // 最大左边距（右边界限制）
            playerPosition.value.left + dx
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
const togglePlay = async () => {
    if (!audioPlayer.value) return;

    try {
        if (isPlaying.value) {
            audioPlayer.value.pause();
            isPlaying.value = false;
        } else {
            // 尝试播放音频
            await audioPlayer.value.play();
            isPlaying.value = true;
        }
    } catch (error) {
        console.error('播放失败:', error);
        // 如果自动播放失败，重置状态
        isPlaying.value = false;
        // 可以尝试重新加载音频
        if (audioPlayer.value) {
            audioPlayer.value.load();
        }
    }
}

// 歌曲播放结束时自动播放下一首
const onEnded = async () => {
    nextSong()
    // 自动播放下一首
    if (audioPlayer.value) {
        try {
            await audioPlayer.value.play()
        } catch (error) {
            console.error('自动播放下一首失败:', error)
        }
    }
}

onMounted(() => {
    // 添加全局事件监听器（同时支持鼠标和触摸）
    document.addEventListener('mousemove', onDrag);
    document.addEventListener('mouseup', stopDrag);
    document.addEventListener('touchmove', onDrag, { passive: false });
    document.addEventListener('touchend', stopDrag);

    // 初始化音频设置
    if (audioPlayer.value) {
        audioPlayer.value.volume = volume.value;
        audioPlayer.value.load();

        // 尝试自动播放
        audioPlayer.value.oncanplay = async () => {
            console.log('音频加载完成，尝试自动播放');
            try {
                await audioPlayer.value.play();
                isPlaying.value = true;
                console.log('自动播放成功');
            } catch (error) {
                console.log('自动播放失败，等待用户交互:', error);
                isPlaying.value = false;
                // 如果自动播放失败，可以设置静音后重试
                try {
                    audioPlayer.value.muted = true;
                    await audioPlayer.value.play();
                    isPlaying.value = true;
                    console.log('静音自动播放成功');
                    // 延迟取消静音
                    setTimeout(() => {
                        audioPlayer.value.muted = false;
                    }, 1000);
                } catch (mutedError) {
                    console.log('静音自动播放也失败，完全等待用户交互');
                    isPlaying.value = false;
                    audioPlayer.value.muted = false;
                    // 监听第一次用户交互来触发播放
                    setupUserInteractionPlay();
                }
            }
        };

        // 监听音频错误
        audioPlayer.value.onerror = (e) => {
            console.error('音频加载错误:', e);
            isPlaying.value = false;
        };
    }
})

// 设置用户交互监听器，在第一次交互时尝试播放
const setupUserInteractionPlay = () => {
    const tryPlayOnInteraction = async () => {
        if (audioPlayer.value && !isPlaying.value) {
            try {
                await audioPlayer.value.play();
                isPlaying.value = true;
                console.log('用户交互触发放播成功');
                // 移除监听器
                removeInteractionListeners();
            } catch (error) {
                console.log('用户交互触发放播失败:', error);
            }
        }
    };

    // 添加各种用户交互事件监听器
    document.addEventListener('click', tryPlayOnInteraction, { once: true });
    document.addEventListener('touchstart', tryPlayOnInteraction, { once: true });
    document.addEventListener('keydown', tryPlayOnInteraction, { once: true });
};

// 移除用户交互监听器
const removeInteractionListeners = () => {
    document.removeEventListener('click', setupUserInteractionPlay);
    document.removeEventListener('touchstart', setupUserInteractionPlay);
    document.removeEventListener('keydown', setupUserInteractionPlay);
};



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

const volume = ref(0.25) // 初始音量为0.25

const setVolume = (e) => {
    const newVolume = parseFloat(e.target.value)
    volume.value = newVolume
    if (audioPlayer.value) {
        audioPlayer.value.volume = volume.value
    }
}

onUnmounted(() => {
    // 移除全局事件监听器
    document.removeEventListener('mousemove', onDrag);
    document.removeEventListener('mouseup', stopDrag);
    document.removeEventListener('touchmove', onDrag);
    document.removeEventListener('touchend', stopDrag);

    // 移除用户交互监听器
    removeInteractionListeners();


    // 清理音频资源
    if (audioPlayer.value) {
        audioPlayer.value.pause();
        audioPlayer.value = null;
    }
})

</script>

<style scoped>
@import '../css/components/music-player.css';
</style>