<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top shadow-sm">
    <div class="container">
      <RouterLink to="/Home" class="navbar-brand d-flex align-items-center">
        <i class="bi bi-stars me-2"></i>
        Jwz's Blog
      </RouterLink>

      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <RouterLink to="/Home" class="nav-link" active-class="active">
              <i class="bi bi-house-door me-1"></i>
              首页
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/Article" class="nav-link" active-class="active">
              <i class="bi bi-journal-text me-1"></i>
              文章目录
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/FriendLink" class="nav-link" active-class="active">
              <i class="bi bi-people me-1"></i>
              友情链接
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/About" class="nav-link" active-class="active">
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
.navbar {
  padding: 0.8rem 1rem;
  transition: all 0.3s ease;
}

.navbar-brand {
  font-family: 'Microsoft Yahei', sans-serif;
  font-weight: 500;
  font-size: 1.2rem;
  letter-spacing: 0.05em;
}

.nav-link {
  position: relative;
  margin: 0 0.8rem;
  padding: 0.5rem 1rem !important;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.nav-link:not(.active):hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.active {
  background: linear-gradient(45deg, #6378c7, #3498db);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

@media (max-width: 991px) {
  .nav-link {
    margin: 0.5rem 0;
    text-align: center;
  }
}
</style>