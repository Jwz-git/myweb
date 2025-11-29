<template>
  <NavBar />
  <div class="container-fluid px-0 min-vh-100 d-flex flex-column justify-content-center align-items-center py-5">
    <div class="welcome-section text-center mb-5 animate__animated animate__fadeIn">
      <h1 class="blog-title display-4 mb-4">
        欢迎来到我的博客
      </h1>
      <div>
        <a href="https://github.com/Jwz-git" class="nav-link web-link" target="_blank" title="GitHub">
          <svg xmlns="http://www.w3.org/2000/svg" width="2rem" height="2rem" fill="white" class="bi bi-github"
            viewBox="0 0 16 16">
            <path
              d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 
              7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 
              1.08.58 1.23.82.72 
              1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 
              0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 
              1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 
              3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
          </svg>
        </a>
        <a href="https://space.bilibili.com/454733262" class="nav-link web-link" target="_blank" title="bilibili">
          <svg xmlns="http://www.w3.org/2000/svg" width="2rem" height="2rem" fill="white" class="bi bi-github"
            viewBox="0 0 18 18">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M3.73252 2.67094C3.33229 2.28484 3.33229 1.64373 3.73252 1.25764C4.11291 0.890684 4.71552 
              0.890684 5.09591 1.25764L7.21723 3.30403C7.27749 3.36218 7.32869 3.4261 7.37081 
              3.49407H10.5789C10.6211 3.4261 10.6723 3.36218 10.7325 3.30403L12.8538 1.25764C13.2342 0.890684 
              13.8368 0.890684 14.2172 1.25764C14.6175 1.64373 14.6175 2.28484 14.2172 2.67094L13.364 
              3.49407H14C16.2091 3.49407 18 5.28493 18 7.49407V12.9996C18 15.2087 16.2091 16.9996 14 
              16.9996H4C1.79086 16.9996 0 15.2087 0 12.9996V7.49406C0 5.28492 1.79086 3.49407 4 
              3.49407H4.58579L3.73252 2.67094ZM4 5.42343C2.89543 5.42343 2 6.31886 2 7.42343V13.0702C2 14.1748 
              2.89543 15.0702 4 15.0702H14C15.1046 15.0702 16 14.1748 16 13.0702V7.42343C16 6.31886 15.1046 
              5.42343 14 5.42343H4ZM5 9.31747C5 8.76519 5.44772 8.31747 6 8.31747C6.55228 8.31747 7 8.76519 7 
              9.31747V10.2115C7 10.7638 6.55228 11.2115 6 11.2115C5.44772 11.2115 5 10.7638 5 
              10.2115V9.31747ZM12 8.31747C11.4477 8.31747 11 8.76519 11 9.31747V10.2115C11 10.7638 11.4477 
              11.2115 12 11.2115C12.5523 11.2115 13 10.7638 13 10.2115V9.31747C13 8.76519 12.5523 8.31747 12 8.31747Z"
              fill="white" data-v-41458b80="" data-v-55a16cbd="" />
          </svg>
        </a>
      </div>
      <div class="divider mx-auto my-4"></div>
    </div>

    <nav class="web-lists">
      <RouterLink to="/Article">
        <button>
          <i class="bi bi-journal-text me-1"></i>
          文章目录
          <div id="clip">
            <div id="leftTop" class="corner"></div>
            <div id="rightBottom" class="corner"></div>
            <div id="rightTop" class="corner"></div>
            <div id="leftBottom" class="corner"></div>
          </div>
          <span id="rightArrow" class="arrow"></span>
          <span id="leftArrow" class="arrow"></span>
        </button>
      </RouterLink>

      <RouterLink to="/FriendLink">
        <button>
          <i class="bi bi-people me-1"></i>
          友情链接
          <div id="clip">
            <div id="leftTop" class="corner"></div>
            <div id="rightBottom" class="corner"></div>
            <div id="rightTop" class="corner"></div>
            <div id="leftBottom" class="corner"></div>
          </div>
          <span id="rightArrow" class="arrow"></span>
          <span id="leftArrow" class="arrow"></span>
        </button>
      </RouterLink>

      <RouterLink to="/About">
        <button>
          <i class="bi bi-info-circle me-1"></i>
          关于本站
          <div id="clip">
            <div id="leftTop" class="corner"></div>
            <div id="rightBottom" class="corner"></div>
            <div id="rightTop" class="corner"></div>
            <div id="leftBottom" class="corner"></div>
          </div>
          <span id="rightArrow" class="arrow"></span>
          <span id="leftArrow" class="arrow"></span>
        </button>
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
  font-weight: normal;
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

button {
  position: relative;
  width: 11em;
  height: 4em;
  outline: none;
  transition: 0.1s;
  background-color: transparent;
  border: none;
  font-size: 13px;
  font-weight: bold;
  color: #ddebf0;
}

#clip {
  --color: #2799c3;
  position: absolute;
  top: 0;
  overflow: hidden;
  width: 100%;
  height: 100%;
  border: 5px double var(--color);
  box-shadow: inset 0px 0px 15px #197480;
  -webkit-clip-path: polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%);
}

.arrow {
  position: absolute;
  transition: 0.2s;
  background-color: #2799c3;
  top: 35%;
  width: 11%;
  height: 30%;
}

#leftArrow {
  left: -15%;
  -webkit-clip-path: polygon(100% 0, 100% 100%, 0 50%);
}

#rightArrow {
  -webkit-clip-path: polygon(100% 49%, 0 0, 0 100%);
  left: 112.5%;
}

button:hover #rightArrow {
  background-color: #27c39f;
  left: -15%;
  animation: 0.6s ease-in-out both infinite alternate rightArrow8;
}

button:hover #leftArrow {
  background-color: #27c39f;
  left: 112.5%;
  animation: 0.6s ease-in-out both infinite alternate leftArrow8;
}

.corner {
  position: absolute;
  width: 4em;
  height: 4em;
  background-color: #2799c3;
  box-shadow: inset 1px 1px 8px #2781c3;
  transform: scale(1) rotate(45deg);
  transition: 0.2s;
}

#rightTop {
  top: -1.98em;
  left: 91%;
}

#leftTop {
  top: -1.96em;
  left: -3.0em;
}

#leftBottom {
  top: 2.10em;
  left: -2.15em;
}

#rightBottom {
  top: 45%;
  left: 88%;
}



button:hover #leftTop {
  animation: 0.1s ease-in-out 0.05s both changeColor8,
      0.2s linear 0.4s both lightEffect8;
}

button:hover #rightTop {
  animation: 0.1s ease-in-out 0.15s both changeColor8,
      0.2s linear 0.4s both lightEffect8;
}

button:hover #rightBottom {
  animation: 0.1s ease-in-out 0.25s both changeColor8,
      0.2s linear 0.4s both lightEffect8;
}

button:hover #leftBottom {
  animation: 0.1s ease-in-out 0.35s both changeColor8,
      0.2s linear 0.4s both lightEffect8;
}

button:hover .corner {
  transform: scale(1.25) rotate(45deg);
}

button:hover #clip {
  animation: 0.2s ease-in-out 0.55s both greenLight8;
  --color: #27c39f;
}





@keyframes changeColor8 {
  from {
    background-color: #2781c3;
  }

  to {
    background-color: #27c39f;
  }
}

@keyframes lightEffect8 {
  from {
    box-shadow: 1px 1px 5px #27c39f;
  }

  to {
    box-shadow: 0 0 2px #27c39f;
  }
}

@keyframes greenLight8 {
  from {}

  to {
    box-shadow: inset 0px 0px 32px #27c39f;
  }
}

@keyframes leftArrow8 {
  from {
    transform: translate(0px);
  }

  to {
    transform: translateX(10px);
  }
}

@keyframes rightArrow8 {
  from {
    transform: translate(0px);
  }

  to {
    transform: translateX(-10px);
  }
}

.web-link {
  display: inline-block;
  padding: 0.25rem;
  border-radius: 50%;
  transition: background-color 0.3s ease;
}

.web-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
  transform: scale(1.1);
}

.web-lists {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.web-lists a {
  text-decoration: none;
}

.web-lists button {
  font-size: 1rem;
  font-weight: bolder;
  color: #19ca51;
}

@media (max-width: 768px) {
  .blog-title {
    font-size: 2.2rem;
  }

  .btn::before {
    animation-duration: 8s;
  }
}
</style>