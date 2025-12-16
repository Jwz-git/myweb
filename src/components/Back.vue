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
@import '../css/components/back.css';
</style>