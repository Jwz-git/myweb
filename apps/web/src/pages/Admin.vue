<template>
  <div class="admin-page page-enter">
    <div class="container">
      <header><span class="eyebrow">VPS / CONTROL PANEL</span><h1>管理后台</h1><p>管理互动数据、评论和用户状态。</p></header>
      <div v-if="loading" class="state">正在加载服务端数据…</div>
      <div v-else-if="error" class="state error">{{ error }}</div>
      <template v-else-if="currentUser?.role === 'admin'">
        <section class="stats"><article v-for="(value,key) in overview" :key="key"><strong>{{ value }}</strong><span>{{ labels[key] || key }}</span></article></section>
        <section><h2>评论管理</h2><div class="table-wrap"><table><thead><tr><th>用户</th><th>文章</th><th>内容</th><th>状态</th><th>操作</th></tr></thead><tbody><tr v-for="item in comments" :key="item.id"><td>{{ item.author.login }}</td><td>{{ item.articleSlug }}</td><td class="comment-body">{{ item.body }}</td><td>{{ item.status }}</td><td><button @click="moderate(item,'visible')">显示</button><button @click="moderate(item,'hidden')">隐藏</button><button class="danger" @click="moderate(item,'deleted')">删除</button></td></tr></tbody></table></div></section>
        <section><h2>用户管理</h2><div class="users"><article v-for="user in users" :key="user.id"><img :src="user.avatarUrl" alt=""><div><strong>{{ user.login }}</strong><small>{{ user.role }} · {{ user.bannedAt ? '已封禁' : '正常' }}</small></div><button v-if="!user.bannedAt && user.role !== 'admin'" class="danger" @click="ban(user)">封禁</button></article></div></section>
      </template>
      <div v-else class="state">此页面仅对管理员开放。</div>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import { apiBase, serverFeaturesEnabled } from '../config/server.js'
import { currentUser, loadSession } from '../composables/useSession.js'
const loading=ref(true),error=ref(''),overview=ref({}),comments=ref([]),users=ref([])
const labels={users:'用户',comments:'可见评论',likes:'点赞',views:'浏览记录'}
const request=async(path,options={})=>{const response=await fetch(apiBase+path,{credentials:'include',headers:{'content-type':'application/json'},...options});if(!response.ok)throw new Error(response.status===403?'管理员权限校验失败':`服务请求失败 (${response.status})`);return response.json()}
const reload=async()=>{loading.value=true;error.value='';try{if(!serverFeaturesEnabled)throw new Error('当前是静态部署，管理后台未启用');await loadSession(true);if(currentUser.value?.role!=='admin')return;[overview.value,comments.value,users.value]=await Promise.all([request('/admin/overview'),request('/admin/comments'),request('/admin/users')])}catch(err){error.value=err.message}finally{loading.value=false}}
const moderate=async(item,status)=>{await request(`/admin/comments/${item.id}/moderation`,{method:'PATCH',body:JSON.stringify({status})});item.status=status}
const ban=async user=>{await request(`/admin/users/${user.id}/ban`,{method:'POST',body:'{}'});user.bannedAt=new Date().toISOString()}
onMounted(reload)
</script>
<style scoped>
.admin-page{padding:70px 0 100px}.admin-page header{margin-bottom:36px}.eyebrow{font: .7rem var(--font-mono);color:var(--accent)}h1{margin:8px 0;font:700 2.5rem var(--font-serif)}h2{margin:34px 0 16px;font:600 1.35rem var(--font-serif)}header p,.state{color:var(--text-secondary)}.state{padding:28px;border:1px solid var(--border-subtle);border-radius:var(--radius-md);background:var(--bg-surface)}.error{color:#b44747}.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}.stats article{display:grid;padding:22px;border:1px solid var(--border-subtle);border-radius:var(--radius-md);background:var(--bg-surface)}.stats strong{font:600 2rem var(--font-serif);color:var(--accent)}.stats span{color:var(--text-muted);font-size:.8rem}.table-wrap{overflow:auto;border:1px solid var(--border-subtle);border-radius:var(--radius-md)}table{width:100%;border-collapse:collapse;background:var(--bg-surface)}th,td{padding:12px;text-align:left;border-bottom:1px solid var(--border-subtle);font-size:.8rem}.comment-body{min-width:280px;max-width:480px}td button,.users button{margin:2px;padding:5px 8px;border:1px solid var(--border-primary);border-radius:5px}.danger{color:#c35f5f!important}.users{display:grid;gap:8px}.users article{display:flex;align-items:center;gap:12px;padding:12px;border:1px solid var(--border-subtle);border-radius:var(--radius-sm);background:var(--bg-surface)}.users img{width:36px;height:36px;border-radius:50%}.users div{display:grid;flex:1}.users small{color:var(--text-muted)}@media(max-width:700px){.stats{grid-template-columns:repeat(2,1fr)}.admin-page{padding-top:38px}}
</style>
