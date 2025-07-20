<template>
  <NavBar />
  <div class="container-fluid px-0 min-vh-100 d-flex flex-column justify-content-center align-items-center py-5">
    <div class="welcome-section text-center mb-5 animate__animated animate__fadeIn">
      <h1 class="blog-title display-4 mb-4">
        欢迎来到我的博客
      </h1>
      <div class="divider mx-auto my-4"></div>
    </div>

    <nav class="nav flex-column col-10 col-sm-8 col-md-6 col-lg-4 mx-auto">
      <RouterLink to="/Article"
        class="nav-link btn btn-outline-primary mb-3 shadow-sm transition-all duration-300 hover:scale-105">
        <i class="bi bi-journal-text me-2"></i>
        文章目录
      </RouterLink>

      <RouterLink to="/FriendLink"
        class="nav-link btn btn-outline-success mb-3 shadow-sm transition-all duration-300 hover:scale-105">
        <i class="bi bi-people-fill me-2"></i>
        友情链接
      </RouterLink>

      <RouterLink to="/About"
        class="nav-link btn btn-outline-info shadow-sm transition-all duration-300 hover:scale-105">
        <i class="bi bi-info-circle me-2"></i>
        关于本站
      </RouterLink>
    </nav>
  </div>
</template>

<script setup>
import NavBar from '../components/NavBar.vue'
</script>

<style scoped>
.welcome-section {
  margin-bottom: 2rem;
}

.blog-title {
  font-family: 'Playfair Display', serif;
  color: #fefefe;
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

.divider {
  width: 80px;
  height: 2px;
  background: linear-gradient(90deg,
      transparent 0%,
      #ffffff 50%,
      transparent 100%);
}

.btn {
  font-weight: bolder;
  font-family: SimSun;
  color: aquamarine;
  position: relative;
  overflow: hidden;
  z-index: 1;
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
}

.btn::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg,
      transparent 25%,
      rgba(52, 152, 219, 0.8) 50%,
      transparent 75%);
  animation: flow 6s linear infinite;
  z-index: -1;
}

@keyframes flow {
  0% {
    transform: rotate(0deg) translateX(-25%);
  }

  100% {
    transform: rotate(360deg) translateX(25%);
  }
}

.btn:hover .bi {
  transform: scale(1.2) rotate(15deg);
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.btn:hover {
  text-shadow: 0 2px 8px rgba(52, 152, 219, 0.4);
  box-shadow: 0 0 15px rgba(52, 152, 219, 0.6), 0 10px 30px rgba(0, 0, 0, 0.15);
  border-width: 2px;
  padding: 0.8rem 1.5rem;
  font-size: 1.1rem;
  border-radius: 50px;
}

.btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 0px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .blog-title {
    font-size: 2.2rem;
  }

  .btn::before {
    animation-duration: 8s;
  }
}

@media (max-width: 576px) {
  .blog-title {
    font-size: 1.8rem;
  }

  .btn {
    padding: 0.6rem 1.2rem;
    font-size: 1rem;
  }

  .btn:hover .bi {
    transform: scale(1.1) rotate(10deg);
  }
}
</style>