<template>
    <NavBar />
    <div class="friendlink-container">
        <div class="row justify-content-center">
            <div v-for="(link, index) in friendLinks" :key="index"
                class="col-12 mb-3 animate__animated animate__fadeInUp" :style="`animation-delay: ${index * 0.1}s`">
                <div class="friend-card card h-100 shadow-sm">
                    <div class="card-body d-flex flex-column align-items-center">
                        <img :src="link.avatar" class="avatar rounded-circle mb-3" alt="avatar">
                        <div class="text-center flex-grow-1">
                            <h5 class="card-title mb-2">{{ link.name }}</h5>
                            <p class="card-text text-muted small mb-3">{{ link.description }}</p>
                            <a :href="link.url" target="_blank" class="btn btn-outline-primary btn-sm">
                                访问博客 <i class="bi bi-box-arrow-up-right ms-1"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="button-container">
            <BackToHome />
        </div>
    </div>
</template>

<script setup>
const friendLinks = [
    {
        name: "ℱluorine's Blog",
        url: "https://lemoon1206.github.io",
        description: "技术笔记 | 学习感悟 | 心得分享",
        avatar: "https://avatars.githubusercontent.com/u/199727471?v=4"
    },
    {
        name: "Away's Blog",
        url: "https://awayc.github.io",
        description: "前端开发 | 交互设计 | 技术漫谈",
        avatar: "https://awayc.github.io/img/Away.6660bd31.jpg"
    }
]

import NavBar from '../components/NavBar.vue'
import BackToHome from '../components/BackToHome.vue'
</script>

<style scoped>
.friendlink-container {
    min-height: 100vh;
    padding: 6rem 1rem;
}

.friend-card {
    position: relative;
    width: 52%;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    border: 1px solid rgba(52, 152, 219, 0.1);
}

.friend-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(52, 152, 219, 0.15);
}

.avatar {
    width: 80px;
    height: 80px;
    margin-top: -40px;
    object-fit: cover;
    border: 2px solid #6378c7;
    box-shadow: 0 4px 12px rgba(52, 152, 219, 0.2);
}

.friend-card .card-body {
    padding: 1.5rem;
}

@media (max-width: 768px) {
    .avatar {
        width: 60px;
        height: 60px;
        margin-top: -30px;
    }
    .friend-card {
        width: 95%;
        max-width: 100%;
    }
}

.friend-card {
    max-width: 1200px;
    margin: 0 auto;
}

.button-container {
    margin-top: auto;
    width: 100%;
    max-width: 800px;
    margin: 2rem auto 0;
    display: flex;
    justify-content: center;
}

</style>