<template>
    <div class="container">
        <div class="welcome-section">
            <h1 class="blog-title">
                Welcome to My Blog
            </h1>
            <div class="divider"></div>
        </div>

        <RouterLink to="/Home" class="enter-link" active-class="active" title="进入首页">
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
    animation: float 3s ease-in-out infinite;
}

@keyframes float {

    0%,
    100% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-10px);
    }
}

@keyframes flow {
    from {
        background-position: -200% 0;
    }

    to {
        background-position: 200% 0;
    }
}

.blog-title::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 15%;
    width: 70%;
    height: 3px;
    background: #5db2eb;
    border-radius: 3px;
}

.divider {
    width: 80px;
    height: 2px;
    background: #5db2eb;
    margin: 0 auto;
}

.enter-link {
    position: relative;
    overflow: hidden;
    display: inline-flex;
    align-items: center;
    gap: 0.8rem;
    padding: 0.9rem 2.2rem;
    background: transparent;
    color: white;
    text-decoration: none;
    border-radius: 30px;
    font-size: 1.1rem;
    font-weight: 500;
    transition: all 0.3s ease 0.1s;
    box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
    z-index: 1;
}

.enter-link::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(45deg,
            rgba(255, 255, 255, 0.3) 25%,
            transparent 50%,
            rgba(255, 255, 255, 0.3) 75%);
    animation: flow 3s linear infinite;
    z-index: -1;
}

.enter-link::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 30px;
    border: 2px solid transparent;
    animation: borderGlow 2s ease-in-out infinite;
    filter: blur(2px);
}

@keyframes borderGlow {

    0%,
    100% {
        border-color: rgba(255, 255, 255, 0.3);
        box-shadow: 0 0 8px rgba(93, 178, 235, 0.5);
    }

    50% {
        border-color: rgba(255, 255, 255, 0.8);
        box-shadow: 0 0 20px rgba(93, 178, 235, 0.9);
    }
}

.enter-link:hover {
    background-size: 200% auto;
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 8px 20px rgba(52, 152, 219, 0.5);
}

.enter-link:hover .arrow-icon {
    transform: rotate(-45deg) translateX(8px) translateY(8px);
    filter: drop-shadow(2px 2px 2px rgba(0, 0, 0, 0.1));
}

.enter-home {
    position: relative;
    font-family: 'Playfair Display', SimSun;
    font-size: 1.2rem;
    text-shadow:
        0 0 8px rgba(255, 255, 255, 0.5),
        1px 1px 3px rgba(0, 0, 0, 0.3),
        0 0 6px rgba(255, 255, 255, 0.4),
        2px 2px 6px rgba(0, 0, 0, 0.25);
    transition: text-shadow 0.3s ease;
}

.enter-link:hover .enter-home {
    text-shadow:
        2px 2px 3px rgba(0, 0, 0, 0.3),
        0 0 6px rgba(255, 255, 255, 0.5),
        3px 3px 6px rgba(0, 0, 0, 0.2);
}
</style>