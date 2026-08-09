<template>
  <div v-if="serverFeaturesEnabled" class="user-menu">
    <a v-if="!currentUser && !sessionLoading" class="login-link" :href="`${apiBase}/auth/github`">GitHub 登录</a>
    <button v-else-if="currentUser" class="user-trigger" type="button" :aria-expanded="open" @click="open = !open">
      <img :src="currentUser.avatarUrl" alt="" />
      <span>{{ currentUser.login }}</span>
    </button>
    <div v-if="open && currentUser" class="user-popover">
      <router-link v-if="currentUser.role === 'admin'" to="/write" @click="open = false">写作</router-link>
      <router-link v-if="currentUser.role === 'admin'" to="/admin" @click="open = false">管理后台</router-link>
      <button type="button" @click="handleLogout">退出登录</button>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import { apiBase, serverFeaturesEnabled } from '../config/server.js'
import { currentUser, loadSession, logout, sessionLoading } from '../composables/useSession.js'
const open = ref(false)
const handleLogout = async () => { await logout(); open.value = false }
onMounted(loadSession)
</script>
<style scoped>
.user-menu{position:relative;margin-left:10px}.login-link,.user-trigger{display:flex;align-items:center;gap:7px;min-height:36px;padding:7px 11px;border:1px solid var(--border-primary);border-radius:999px;background:var(--bg-surface);font-size:.78rem}.user-trigger img{width:22px;height:22px;border-radius:50%}.user-popover{position:absolute;right:0;top:44px;z-index:20;display:grid;min-width:130px;padding:6px;border:1px solid var(--border-primary);border-radius:var(--radius-sm);background:var(--bg-elevated);box-shadow:var(--shadow-md)}.user-popover a,.user-popover button{padding:8px 10px;text-align:left;border-radius:6px}.user-popover a:hover,.user-popover button:hover{background:var(--bg-surface-hover)}
@media(max-width:768px){.user-menu{margin-left:auto}.user-trigger span{display:none}.login-link{font-size:.7rem;padding-inline:8px}}
</style>
