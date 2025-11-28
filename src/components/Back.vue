<template>
    <RouterLink :to="to" class="custom-btn" :title="text">
        <button class="button">
            <div class="state">
                <p>
                    <span style="--i:0"> <i class="btn-icon" v-if="showIcon"></i></span>
                    <span style="--i:0"><a class="temp">6</a></span>
                    <span style="--i:1">{{ text[0] }}</span>
                    <span style="--i:2">{{ text[1] }}</span>
                    <span style="--i:3">{{ text[2] }}</span>
                    <span style="--i:4">{{ text[3] }}</span>
                    <span style="--i:5">{{ text[4] }}</span>
                    <span style="--i:6">{{ text[5] }}</span>
                    <span style="--i:7">{{ text[6] }}</span>
                    <span style="--i:8">{{ text[8] }}</span>
                </p>
            </div>
        </button>
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
.temp {
    opacity: 0;
}

.custom-btn {
    overflow: hidden;
    text-decoration: none;
    border-radius: 30px;
    z-index: 1;
    position: relative;
}

.btn-icon::before {
    content: '<';
    font-size: 1.4rem;
    font-weight: bold;
    position: absolute;
    transform: translate(-50%, -50%);
}

.button {
    --primary: #ff5569;
    --neutral-1: #f7f8f7;
    --neutral-2: #e7e7e7;
    --radius: 14px;

    cursor: pointer;
    border-radius: var(--radius);
    text-shadow: 0 1px 1px rgba(0, 0, 0, 0.3);
    border: none;
    box-shadow: 0 0.5px 0.5px 1px rgba(255, 255, 255, 0.2),
        0 10px 20px rgba(0, 0, 0, 0.2), 0 4px 5px 0px rgba(0, 0, 0, 0.05);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    transition: all 0.3s ease;
    padding: 20px;
    font-family: "Galano Grotesque", Poppins, Montserrat, sans-serif;
    font-style: normal;
    font-size: 18px;
    font-weight: 600;
}

.button:hover {
    transform: scale(1.02);
    box-shadow: 0 0 1px 2px rgba(255, 255, 255, 0.3),
        0 15px 30px rgba(0, 0, 0, 0.3), 0 10px 3px -3px rgba(0, 0, 0, 0.04);
}

.button:hover::after {
    transform: scale(1.05, 1.1);
    box-shadow: inset 0 -1px 3px 0 rgba(255, 255, 255, 1);
}

.button::before {
    content: "";
    inset: 7px 6px 6px 6px;
    position: absolute;
    background: linear-gradient(to top, var(--neutral-1), var(--neutral-2));
    border-radius: 30px;
    filter: blur(0.5px);
    z-index: 2;
}

.state p {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0;

}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

.state p span {
    display: block;
    opacity: 0;
    animation: slideDown 0.8s ease forwards calc(var(--i) * 0.03s);
}

.button:hover p span {
    opacity: 1;
    animation: wave 0.5s ease forwards calc(var(--i) * 0.02s);
}

@keyframes wave {
    30% {
        opacity: 1;
        transform: translateY(4px) translateX(0) rotate(0);
    }

    50% {
        opacity: 1;
        transform: translateY(-3px) translateX(0) rotate(0);
        color: var(--primary);
    }

    100% {
        opacity: 1;
        transform: translateY(0) translateX(0) rotate(0);
    }
}

@keyframes slideDown {
    0% {
        opacity: 0;
        transform: translateY(-20px) translateX(5px) rotate(-90deg);
        color: var(--primary);
        filter: blur(5px);
    }

    30% {
        opacity: 1;
        transform: translateY(4px) translateX(0) rotate(0);
        filter: blur(0);
    }

    50% {
        opacity: 1;
        transform: translateY(-3px) translateX(0) rotate(0);
    }

    100% {
        opacity: 1;
        transform: translateY(0) translateX(0) rotate(0);
    }
}

@keyframes disapear {
    from {
        opacity: 1;
    }

    to {
        opacity: 0;
        transform: translateX(5px) translateY(20px);
        color: var(--primary);
        filter: blur(5px);
    }
}

@keyframes takeOff {
    0% {
        opacity: 1;
    }

    60% {
        opacity: 1;
        transform: translateX(70px) rotate(45deg) scale(2);
    }

    100% {
        opacity: 0;
        transform: translateX(160px) rotate(45deg) scale(0);
    }
}

@keyframes land {
    0% {
        transform: translateX(-60px) translateY(30px) rotate(-50deg) scale(2);
        opacity: 0;
        filter: blur(3px);
    }

    100% {
        transform: translateX(0) translateY(0) rotate(0);
        opacity: 1;
        filter: blur(0);
    }
}

@keyframes contrail {
    0% {
        width: 0;
        opacity: 1;
    }

    8% {
        width: 15px;
    }

    60% {
        opacity: 0.7;
        width: 80px;
    }

    100% {
        opacity: 0;
        width: 160px;
    }
}

.state {
    z-index: 2;
    display: flex;
    position: relative;
}


@keyframes appear {
    0% {
        opacity: 0;
        transform: scale(4) rotate(-40deg);
        color: var(--primary);
        filter: blur(4px);
    }

    30% {
        opacity: 1;
        transform: scale(0.6);
        filter: blur(1px);
    }

    50% {
        opacity: 1;
        transform: scale(1.2);
        filter: blur(0);
    }

    100% {
        opacity: 1;
        transform: scale(1);
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