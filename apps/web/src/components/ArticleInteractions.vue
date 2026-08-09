<template>
  <section v-if="enabled" class="interactions">
    <div class="stats"><span>{{ stats.views }} 次阅读</span><button type="button" @click="toggleLike">{{ stats.liked ? '已赞' : '点赞' }} · {{ stats.likes }}</button></div>
    <div class="comments">
      <h2>评论</h2>
      <a v-if="!me" :href="`${api}/auth/github`">使用 GitHub 登录后评论</a>
      <form v-else @submit.prevent="submitComment"><small v-if="replyTo">正在回复 {{ replyTo.author.login }} · <button type="button" @click="replyTo = null">取消</button></small><textarea v-model="draft" maxlength="2000" required placeholder="写下你的评论…"></textarea><button>发布评论</button></form>
      <article v-for="comment in comments" :key="comment.id"><img :src="comment.author.avatarUrl" alt="" loading="lazy"><div><strong>{{ comment.author.login }}</strong><time>{{ new Date(comment.createdAt).toLocaleString() }}</time><template v-if="editingId === comment.id"><textarea v-model="editDraft" maxlength="2000"></textarea><button @click="saveEdit(comment)">保存</button><button @click="editingId = ''">取消</button></template><p v-else>{{ comment.body }}</p><div v-if="me" class="comment-actions"><button @click="replyTo = comment">回复</button><button v-if="comment.author.id === me.id" @click="startEdit(comment)">编辑</button><button v-if="comment.author.id === me.id || me.role === 'admin'" class="danger" @click="removeComment(comment)">删除</button></div></div></article>
    </div>
  </section>
</template>
<script setup>
import { onMounted, ref, watch } from 'vue'
import { apiBase as api, serverFeaturesEnabled as enabled } from '../config/server.js'
const props = defineProps({ slug: { type:String, required:true } })
const me=ref(null), comments=ref([]), draft=ref(''), replyTo=ref(null), editingId=ref(''), editDraft=ref(''), stats=ref({views:0,likes:0,liked:false})
const request = async (path, options={}) => { const response=await fetch(api+path,{credentials:'include',headers:{'content-type':'application/json'},...options}); if(!response.ok) throw new Error(String(response.status)); return response.status===204?null:response.json() }
const load=async()=>{if(!enabled||!props.slug)return; try{[me.value,comments.value,stats.value]=await Promise.all([request('/me'),request(`/articles/${props.slug}/comments`),request(`/articles/${props.slug}/stats`)]); await request(`/articles/${props.slug}/views`,{method:'POST',body:'{}'})}catch(error){console.warn('互动服务暂不可用',error)}}
const toggleLike=async()=>{if(!me.value){location.href=`${api}/auth/github`;return} await request(`/articles/${props.slug}/like`,{method:stats.value.liked?'DELETE':'PUT',body:'{}'}); stats.value.liked=!stats.value.liked; stats.value.likes+=stats.value.liked?1:-1}
const submitComment=async()=>{await request(`/articles/${props.slug}/comments`,{method:'POST',body:JSON.stringify({body:draft.value,parentId:replyTo.value?.id||null})});draft.value='';replyTo.value=null;comments.value=await request(`/articles/${props.slug}/comments`)}
const startEdit=comment=>{editingId.value=comment.id;editDraft.value=comment.body}
const saveEdit=async comment=>{await request(`/comments/${comment.id}`,{method:'PATCH',body:JSON.stringify({body:editDraft.value})});comment.body=editDraft.value;editingId.value=''}
const removeComment=async comment=>{await request(`/comments/${comment.id}`,{method:'DELETE',body:'{}'});comments.value=comments.value.filter(item=>item.id!==comment.id)}
onMounted(load);watch(()=>props.slug,load)
</script>
<style scoped>.interactions{margin:48px 0;border-top:1px solid var(--border-subtle);padding-top:24px}.stats{display:flex;gap:18px;align-items:center}.stats button,.comments button{border:1px solid var(--border-primary);background:var(--bg-surface);color:var(--text-primary);padding:8px 14px;border-radius:999px}.comments textarea{display:block;width:100%;min-height:100px;margin:12px 0;background:var(--bg-surface);color:var(--text-primary);border:1px solid var(--border-primary);padding:12px}.comments article{display:flex;gap:12px;padding:18px 0;border-bottom:1px solid var(--border-subtle)}.comments article>div{min-width:0;flex:1}.comments img{width:36px;height:36px;border-radius:50%}.comments time{margin-left:10px;color:var(--text-muted);font-size:.8rem}.comment-actions{display:flex;gap:6px}.comment-actions button{padding:4px 9px;font-size:.72rem}.danger{color:#bd5555!important}</style>
