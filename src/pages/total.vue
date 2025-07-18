<template>
    <div class="container">
        <!-- 标题区域 -->
        <div class="welcome-section">
            <h1 class="blog-title">
                Welcome to My Blog
            </h1>
            <div class="divider"></div>
        </div>

        <!-- 导航链接 -->
        <RouterLink to="/Home" class="enter-link" active-class="active">
            <span class="enter-home">
                进入首页
            </span>
        <i class="arrow-icon"></i>
        </RouterLink>
    </div>
</template>

<style scoped>
.container {
    min-height: 100vh;
    width: 100%;
    padding: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    box-sizing: border-box;
}

.welcome-section {
    text-align: center;
    margin-bottom: 3rem;
    animation: fadeIn 1.2s ease-out;
}

.blog-title {
    font-family: 'Playfair Display', serif;
    font-size: 2.8rem;
    color: #dbdee1;
    margin: 0 0 1.5rem;
    position: relative;
    display: inline-block;
    animation: float 3s ease-in-out infinite; /* 新增浮动动画 */
}

@keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
}

.divider {
    width: 80px;
    height: 2px;
    background: linear-gradient(90deg, 
        transparent 0%, 
        #3498db 50%, 
        transparent 100%);
    margin: 0 auto;
    animation: flow 2s linear infinite;
}

@keyframes flow {
    from { background-position: -200% 0; }
    to { background-position: 200% 0; }
}

.blog-title::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 15%;
    width: 70%;
    height: 3px;
    background: #3498db;
    border-radius: 3px;
}

.divider {
    width: 80px;
    height: 2px;
    background: #3498db;
    margin: 0 auto;
}

.enter-link {
    display: inline-flex;
    align-items: center;
    gap: 0.8rem;
    padding: 0.9rem 2.2rem;
    background: #3498db;
    color: white;
    text-decoration: none;
    border-radius: 30px;
    font-size: 1.1rem;
    font-weight: 500;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
}

.enter-link:hover {
    background: #58b0eb;
    transform: translateY(-3px);
    box-shadow: 0 6px 16px rgba(52, 152, 219, 0.4);
}

.enter-link:active {
    transform: translateY(-1px);
    box-shadow: 0 3px 8px rgba(52, 152, 219, 0.3);
}

.arrow-icon {
    width: 18px;
    height: 18px;
    border-right: 2px solid white;
    border-bottom: 2px solid white;
    transform: rotate(-45deg);
    transition: transform 0.3s ease;
}

.enter-link:hover .arrow-icon {
    transform: rotate(-45deg) translateX(5px) translateY(5px);
}

.active {
    background: #2980b9;
}

.enter-home {
    font-family: 'Playfair Display', SimSun;
    font-size: large;
    font-weight: bolder;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* 响应式设计 */
@media (max-width: 768px) {
    .blog-title {
        font-size: 2.2rem;
    }

    .enter-link {
        padding: 0.8rem 1.8rem;
        font-size: 1rem;
    }
}

@media (max-width: 480px) {
    .blog-title {
        font-size: 1.8rem;
    }

    .welcome-section {
        margin-bottom: 2rem;
    }
}
</style>