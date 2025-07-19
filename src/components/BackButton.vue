<template>
  <RouterLink :to="to" class="enter-link">
    <span class="enter-home">{{ label }}</span>
    <i class="arrow-icon"></i>
  </RouterLink>
</template>

<script>
export default {
  props: {
    to: {
      type: String,
      default: '/Home'
    },
    label: {
      type: String,
      default: '返回首页'
    }
  }
}
</script>

<style scoped>
.enter-link {
  border: 2px solid aqua;
  display: inline-flex;
  align-items: center;
  padding: 12px 24px;
  border: 2px solid #3498db;
  border-radius: 8px;
  color: #dbdee1;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.enter-link::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(120deg,
      transparent,
      rgba(52, 152, 219, 0.4),
      transparent);
  transition: 0.5s;
}

.enter-link:hover {
  background: rgba(255, 255, 255, 0.05);
  transform: translateY(-2px);
}

.enter-link:hover::before {
  left: 100%;
}

.arrow-icon {
  display: inline-block;
  width: 24px;
  height: 24px;
  margin-left: 8px;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23dbdee1' d='M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z'/%3E%3C/svg%3E") no-repeat center;
}
</style>