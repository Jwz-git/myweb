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
        </RouterLink>
    </div>
</template>

<style scoped>
@import '../css/pages/total.css';
</style>