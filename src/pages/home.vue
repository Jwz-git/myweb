<template>
  <div class="container-fluid px-0">
    <h1 class="text-center pt-4">
      欢迎来到我的博客
    </h1>
    <nav class="nav flex-column col-md-6 mx-auto">
      <RouterLink 
        to="/Article"
        class="nav-link btn btn-outline-primary mb-3"
      >
        <i class="bi bi-journal-text me-2"></i>
        文章目录
      </RouterLink>
      
      <RouterLink 
        to="/FriendLink"
        class="nav-link btn btn-outline-success mb-3"
      >
        <i class="bi bi-people-fill me-2"></i>
        友情链接
      </RouterLink>
      
      <RouterLink 
        to="/About"
        class="nav-link btn btn-outline-info"
      >
        <i class="bi bi-info-circle me-2"></i>
        关于本站
      </RouterLink>
    </nav>
  </div>
</template>