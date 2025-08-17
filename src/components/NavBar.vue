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
          <!-- 在这里添加 GitHub 图标 -->
          <li class="nav-item">
            <a href="https://github.com/Jwz-git" 
               class="nav-link" 
               target="_blank"
               title="GitHub">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-github" viewBox="0 0 16 16">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
              </svg>
            </a>
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

@media (max-width: 768px) {
  .nav-link {
    margin: 0.5rem 0;
    text-align: center;
  }
}
</style>