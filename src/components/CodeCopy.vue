<template>
    <div class="copy-content">
        <!-- 复制按钮 -->
        <div :ref="buttonRef" class="copy-btn" @click="copyMessage" @mouseleave="resetIcon">
            <!-- 复制图标 -->
            <svg v-if="!success" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
                p-id="1590" width="400" height="400">
                <path d="M96.1 575.7a32.2 32.1 0 1 0 64.4 0 32.2 32.1 0 1 0-64.4 0Z" fill="aqua" p-id="1591"></path>
                <path
                    d="M742.1 450.7l-269.5-2.1c-14.3-0.1-26 13.8-26 31s11.7 31.3 26 31.4l269.5 
                    2.1c14.3 0.1 26-13.8 26-31s-11.7-31.3-26-31.4zM742.1 577.7l-269.5-2.1c-14.3-0.1-26 
                    13.8-26 31s11.7 31.3 26 31.4l269.5 2.1c14.3 0.2 26-13.8 26-31s-11.7-31.3-26-31.4z"
                    fill="aqua" p-id="1592"></path>
                <path
                    d="M736.1 63.9H417c-70.4 0-128 57.6-128 128h-64.9c-70.4 0-128 57.6-128 
                    128v128c-0.1 17.7 14.4 32 32.2 32 17.8 0 32.2-14.4 32.2-32.1V320c0-35.2 
                    28.8-64 64-64H289v447.8c0 70.4 57.6 128 128 128h255.1c-0.1 35.2-28.8 
                    63.8-64 63.8H224.5c-35.2 0-64-28.8-64-64V703.5c0-17.7-14.4-32.1-32.2-32.1-17.8 
                    0-32.3 14.4-32.3 32.1v128.3c0 70.4 57.6 128 128 128h384.1c70.4 0 128-57.6 
                    128-128h65c70.4 0 128-57.6 128-128V255.9l-193-192z m0.1 63.4l127.7 128.3H800c-35.2 
                    0-64-28.8-64-64v-64.3h0.2z m64 641H416.1c-35.2 0-64-28.8-64-64v-513c0-35.2 28.8-64 
                    64-64H671V191c0 70.4 57.6 128 128 128h65.2v385.3c0 35.2-28.8 64-64 64z"
                    fill="aqua" p-id="1593"></path>
            </svg>

            <!-- 成功勾号图标 -->
            <svg v-if="success" class="icon success-icon" viewBox="0 0 1024 1024" version="1.1"
                xmlns="http://www.w3.org/2000/svg" width="400" height="400">
                <path
                    d="M953.472 174.976L385.152 759.168l-275.328-282.794667-53.290667 50.346667L385.194667 
                    857.6l616.021333-632.32z"
                    fill="#219F68" p-id="2417"></path>
            </svg>
        </div>
    </div>
</template>

<script>
export default {
    name: 'CodeCopy',
    props: {
        code: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            success: false,
            buttonRef: `copy-btn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            successTimer: null,
            minDisplayTime: 2000, // 最小显示时间2秒
            successStartTime: 0
        }
    },
    methods: {
        async copyMessage() {
            try {
                // 优先使用现代浏览器的Clipboard API
                if (navigator.clipboard && window.isSecureContext) {
                    await navigator.clipboard.writeText(this.code);
                    console.log('使用Clipboard API复制成功');
                    this.showSuccess();
                    return;
                }

                // 备选方案：使用document.execCommand
                this.useExecCommandFallback();
            } catch (err) {
                console.error('Clipboard API复制失败:', err);
                // 如果Clipboard API失败，使用execCommand
                this.useExecCommandFallback();
            }
        },

        useExecCommandFallback() {
            const textArea = document.createElement('textarea');
            textArea.value = this.code;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();

            try {
                const successful = document.execCommand('copy');
                if (successful) {
                    console.log('使用execCommand复制成功');
                    this.showSuccess();
                } else {
                    console.log('execCommand复制失败');
                }
            } catch (err) {
                console.error('execCommand复制失败:', err);
            } finally {
                document.body.removeChild(textArea);
            }
        },

        showSuccess() {
            // 清除之前的定时器
            if (this.successTimer) {
                clearTimeout(this.successTimer);
            }

            this.success = true;
            this.successStartTime = Date.now();

            // 设置2秒后自动重置的定时器
            this.successTimer = setTimeout(() => {
                // 只有在已经显示超过2秒的情况下才重置
                if (this.success && (Date.now() - this.successStartTime >= this.minDisplayTime)) {
                    this.success = false;
                }
            }, this.minDisplayTime);
        },

        resetIcon() {
            if (this.success) {
                const elapsedTime = Date.now() - this.successStartTime;

                // 如果已经显示超过2秒，立即重置
                if (elapsedTime >= this.minDisplayTime) {
                    this.success = false;
                    if (this.successTimer) {
                        clearTimeout(this.successTimer);
                    }
                } else {
                    // 如果还没到2秒，设置定时器在剩余时间后重置
                    const remainingTime = this.minDisplayTime - elapsedTime;
                    if (this.successTimer) {
                        clearTimeout(this.successTimer);
                    }
                    this.successTimer = setTimeout(() => {
                        this.success = false;
                    }, remainingTime);
                }
            }
        }
    },
    beforeDestroy() {
        // 组件销毁前清除定时器
        if (this.successTimer) {
            clearTimeout(this.successTimer);
        }
    }
}
</script>

<style lang="scss" scoped>
.copy-content {
    position: absolute; // 相对于 pre.hljs（定位容器）
    top: 0;
    right: 0;
    width: auto; // 避免继承 100% 宽度导致占位问题
}

.icon {
    width: 1.2rem;
    height: 1.2rem;
    fill: rgb(6, 244, 204);
}

.success-icon {
    fill: #4CAF50 !important;
    width: 1.4rem;
    height: 1.4rem;
}

.copy-btn {
    user-select: none;
    opacity: 0;
    position: absolute;
    right: 2px;
    top: 2px;
    width: 36px;
    height: 36px;
    cursor: pointer;
    padding: 8px;
    border-radius: 4px;
    transition: all 0.3s ease;
    background: rgba(255, 255, 255, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.2);
    z-index: 10;

    /* 添加Flex布局实现图标居中 */
    display: flex;
    align-items: center;
    justify-content: center;

    &:active {
        background: rgba(255, 255, 255, 0.35);
        transform: scale(0.95);
    }
}

/* 移除原来的复制成功文字样式 */
.copy-success-text {
    display: none;
}

/* 确保在代码块中正确显示 */
::v-deep pre.hljs {
    position: relative !important; // 强制生效，避免被其他样式覆盖
    padding-top: 40px !important; // 预留按钮空间（根据按钮大小调整）
}

::v-deep pre.hljs .copy-content {
    position: absolute;
    top: 5px;
    right: 5px;
    width: auto;
    height: auto;
}
</style>