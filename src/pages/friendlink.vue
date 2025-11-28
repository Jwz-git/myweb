<template>
    <NavBar />
    <div class="friendlink-container stroll">
        <div class="row justify-content-center">
            <div v-for="(link, index) in friendLinks" :key="index"
                class="col-12 mb-3 animate__animated animate__fadeInUp" :style="`animation-delay: ${index * 0.1}s`">
                <div class="friend-card card h-100 shadow-sm">
                    <div class="card-body d-flex flex-column align-items-center">
                        <img :src="link.avatar" class="avatar rounded-circle mb-3" alt="图片加载失败">
                        <div class="text-center flex-grow-1">
                            <h5 class="card-title mb-2">{{ link.name }}</h5>
                            <p class="card-text text-muted small mb-3">{{ link.description }}</p>
                            <a :href="link.url" target="_blank" title="访问博客">
                                <button>
                                    <i class="bi bi-box-arrow-up-right me-1"></i>
                                    访问博客
                                </button>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="button-container">
            <Back />
        </div>
    </div>
</template>

<script setup>
import { friendLinks } from '../data/friendlink.js'
import NavBar from '../components/NavBar.vue'
import Back from '../components/Back.vue'
</script>

<style scoped>
.stroll {
    padding: 0;
    height: 100vh;
    overflow-y: auto;
    scroll-behavior: auto;
    padding: 6rem 1rem 2rem;
}

.stroll::-webkit-scrollbar {
    width: 3px;
    height: 16px;
    background-color: #383333;
}

.stroll::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    border-radius: 10px;
    background-color: rgb(27, 23, 23);
}

.stroll::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: #4e5153;
}

.stroll::-webkit-scrollbar-thumb:hover {
    border-radius: 10px;
    background-color: #acb3b7;
}

.friendlink-container {
    min-height: 100vh;
    padding: 6rem 1rem;
}

.friend-card {
    position: relative;
    width: 52%;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    border: 1px solid rgba(52, 152, 219, 0.1);
    margin: 0 auto;
}

.friend-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(52, 152, 219, 0.15);
}

.friend-card .card-body {
    padding: 1.5rem;
}

.avatar {
    width: 80px;
    height: 80px;
    margin-top: -40px;
    object-fit: cover;
    border: 2px solid #6378c7;
    box-shadow: 0 4px 12px rgba(52, 152, 219, 0.2);
}

button {
    width: 9em;
    height: 3em;
    border-radius: 30em;
    font-size: 15px;
    font-family: inherit;
    border: none;
    position: relative;
    overflow: hidden;
    z-index: 1;
    box-shadow: 6px 6px 12px #c5c5c5,
        -6px -6px 12px #ffffff;
}

button::before {
    content: '';
    width: 0;
    height: 3em;
    border-radius: 30em;
    position: absolute;
    top: 0;
    left: 0;
    background-image: linear-gradient(to right, #0fd850 0%, #f9f047 100%);
    transition: .5s ease;
    display: block;
    z-index: -1;
}

button:hover::before {
    width: 9em;
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
</style>