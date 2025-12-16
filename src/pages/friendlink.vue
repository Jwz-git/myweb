<template>
    <NavBar />
    <div class="friendlink-container scroll">
        <div class="row justify-content-center">
            <div v-for="(link, index) in friendLinks" :key="index"
                class="col-12 mb-3 animate__animated animate__fadeInUp" :style="`animation-delay: ${index * 0.1}s`">
                <div class="friend-card card h-100 shadow-sm">
                    <div class="card-body d-flex flex-column align-items-center">
                        <img :src="link.avatar" class="avatar rounded-circle mb-3" alt="图片加载失败">
                        <div class="text-center flex-grow-1">
                            <h5 class="card-title mb-2">{{ link.name }}</h5>
                            <p class="card-text small mb-3">{{ link.description }}</p>
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
@import '../css/pages/friendlink.css';
</style>