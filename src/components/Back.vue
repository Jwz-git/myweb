<template>
    <RouterLink :to="to" class="custom-btn" active-class="active" :style="{ '--main-color': mainColor }">
        <i class="btn-icon" v-if="showIcon"></i>
        <span class="btn-text">{{ text }}</span>
    </RouterLink>
</template>

<script>
export default {
    props: {
        text: {
            type: String,
            default: '返回首页'
        },
        to: {
            type: String,
            default: '/Home'
        },
        mainColor: {
            type: String,
            default: '#5db2eb'
        },
        showIcon: {
            type: Boolean,
            default: true
        }
    }
}
</script>

<style scoped>
.custom-btn {
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

.custom-btn::before {
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

.custom-btn::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 30px;
    border: 2px solid transparent;
    animation: borderGlow 2s ease-in-out infinite;
    filter: blur(2px);
}

.btn-text {
    font-family: SimSun;
    font-weight: bold;
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

.btn-icon {
    width: 18px;
    height: 18px;
    position: relative;
}

.btn-icon::before {
    content: '<';
    color: white;
    font-size: 1.4rem;
    font-weight: bold;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-shadow: 0 0 4px rgba(255, 255, 255, 0.8);
}

.custom-btn:hover {
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 8px 20px var(--main-color, rgba(52, 152, 255, 0.5));
}

.custom-btn:hover .btn-text {
    text-shadow:
        2px 2px 3px rgba(0, 0, 0, 0.3),
        0 0 6px rgba(255, 255, 255, 0.5),
        3px 3px 6px rgba(0, 0, 0, 0.2);
}

.custom-btn:hover .btn-icon::before {
    transform: translate(-50%, -50%) translateX(-8px);
    filter: drop-shadow(-2px 2px 2px rgba(0, 0, 0, 0.1));
    transition: transform 0.3s ease, filter 0.3s ease;
}

@keyframes flow {
    from {
        background-position: -200% 0;
    }

    to {
        background-position: 200% 0;
    }
}

@keyframes borderGlow {

    0%,
    100% {
        border-color: rgba(255, 255, 255, 0.3);
        box-shadow: 0 0 8px var(--main-color, rgba(93, 178, 235, 0.5));
    }

    50% {
        border-color: rgba(255, 255, 255, 0.8);
        box-shadow: 0 0 20px var(--main-color, rgba(93, 178, 235, 0.9));
    }
}
</style>