<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top shadow-sm">
    <div class="container">
      <RouterLink to="/home" class="navbar-brand d-flex align-items-center">
        <i class="bi bi-stars me-2"></i>
        Jwz's Blog
      </RouterLink>

      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <RouterLink to="/home" class="nav-link" active-class="active">
              <i class="bi bi-house-door me-1"></i>
              首页
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/article" class="nav-link" active-class="active">
              <i class="bi bi-journal-text me-1"></i>
              文章目录
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/friendlink" class="nav-link" active-class="active">
              <i class="bi bi-people me-1"></i>
              友情链接
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/about" class="nav-link" active-class="active">
              <i class="bi bi-info-circle me-1"></i>
              关于本站
            </RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<style scoped>
@import '../css/components/nav-bar.css';
</style>