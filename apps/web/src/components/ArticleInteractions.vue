<template>
  <section v-if="enabled" class="interactions">
    <div class="stats">
      <span>{{ stats.views }} 次阅读</span>
      <button type="button" @click="toggleLike">{{ stats.liked ? '已赞' : '点赞' }} · {{ stats.likes }}</button>
    </div>

    <div class="comments">
      <h2>评论</h2>
      <a v-if="!me" :href="`${api}/auth/github`">使用 GitHub 登录后评论</a>
      <form v-else @submit.prevent="submitComment">
        <div v-if="replyTo" class="replying">
          <span>回复 @{{ replyTo.author.login }}</span>
          <button type="button" @click="replyTo = null">取消</button>
        </div>
        <textarea v-model="draft" maxlength="2000" required :placeholder="replyTo ? `回复 @${replyTo.author.login}…` : '写下你的评论…'"></textarea>
        <button>发布评论</button>
      </form>

      <div v-if="!displayComments.length" class="empty">还没有评论，来留下第一条吧。</div>
      <article v-for="comment in displayComments" :key="comment.id" :class="{ reply: comment.depth > 0 }">
        <img :src="comment.author.avatarUrl" :alt="`${comment.author.login} 的头像`" loading="lazy">
        <div class="comment-content">
          <div class="comment-head">
            <strong>{{ comment.author.login }}</strong>
            <span v-if="comment.parent" class="reply-target">回复 @{{ comment.parent.author.login }}</span>
          </div>

          <template v-if="editingId === comment.id">
            <textarea v-model="editDraft" maxlength="2000"></textarea>
            <div class="comment-actions"><button @click="saveEdit(comment)">保存</button><button @click="editingId = ''">取消</button></div>
          </template>
          <p v-else>{{ comment.body }}</p>

          <div class="comment-footer">
            <div class="comment-times">
              <time :datetime="comment.createdAt" :title="exactTime(comment.createdAt)">{{ relativeTime(comment.createdAt) }}</time>
              <time v-if="wasEdited(comment)" :datetime="comment.updatedAt" :title="exactTime(comment.updatedAt)">编辑于 {{ relativeTime(comment.updatedAt) }}</time>
            </div>
            <div v-if="me" class="comment-actions">
              <button @click="beginReply(comment)">回复</button>
              <button v-if="comment.author.id === me.id" @click="startEdit(comment)">编辑</button>
              <button v-if="comment.author.id === me.id || me.role === 'admin'" class="danger" @click="removeComment(comment)">删除</button>
            </div>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { apiBase as api, serverFeaturesEnabled as enabled } from '../config/server.js'

const props = defineProps({ slug: { type: String, required: true } })
const me = ref(null)
const comments = ref([])
const draft = ref('')
const replyTo = ref(null)
const editingId = ref('')
const editDraft = ref('')
const stats = ref({ views: 0, likes: 0, liked: false })

const displayComments = computed(() => {
  const byId = new Map(comments.value.map(comment => [comment.id, comment]))
  const children = new Map()
  const roots = []
  for (const comment of comments.value) {
    if (comment.parentId && byId.has(comment.parentId)) {
      const group = children.get(comment.parentId) || []
      group.push(comment)
      children.set(comment.parentId, group)
    } else roots.push(comment)
  }
  const result = []
  const append = (comment, depth = 0) => {
    result.push({ ...comment, depth, parent: comment.parentId ? byId.get(comment.parentId) : null })
    for (const child of children.get(comment.id) || []) append(child, depth + 1)
  }
  roots.forEach(comment => append(comment))
  return result
})

const request = async (path, options = {}) => {
  const response = await fetch(api + path, { credentials: 'include', headers: { 'content-type': 'application/json' }, ...options })
  if (!response.ok) throw new Error(String(response.status))
  return response.status === 204 ? null : response.json()
}
const load = async () => {
  if (!enabled || !props.slug) return
  try {
    [me.value, comments.value, stats.value] = await Promise.all([request('/me'), request(`/articles/${props.slug}/comments`), request(`/articles/${props.slug}/stats`)])
    await request(`/articles/${props.slug}/views`, { method: 'POST', body: '{}' })
  } catch (error) { console.warn('互动服务暂不可用', error) }
}
const toggleLike = async () => {
  if (!me.value) { location.href = `${api}/auth/github`; return }
  await request(`/articles/${props.slug}/like`, { method: stats.value.liked ? 'DELETE' : 'PUT', body: '{}' })
  stats.value.liked = !stats.value.liked
  stats.value.likes += stats.value.liked ? 1 : -1
}
const submitComment = async () => {
  await request(`/articles/${props.slug}/comments`, { method: 'POST', body: JSON.stringify({ body: draft.value, parentId: replyTo.value?.id || null }) })
  draft.value = ''
  replyTo.value = null
  comments.value = await request(`/articles/${props.slug}/comments`)
}
const beginReply = comment => {
  replyTo.value = comment
  document.querySelector('.comments form textarea')?.focus()
}
const startEdit = comment => { editingId.value = comment.id; editDraft.value = comment.body }
const saveEdit = async comment => {
  await request(`/comments/${comment.id}`, { method: 'PATCH', body: JSON.stringify({ body: editDraft.value }) })
  comment.body = editDraft.value
  comment.updatedAt = new Date().toISOString()
  editingId.value = ''
}
const removeComment = async comment => {
  await request(`/comments/${comment.id}`, { method: 'DELETE', body: '{}' })
  comments.value = await request(`/articles/${props.slug}/comments`)
  if (replyTo.value?.id === comment.id) replyTo.value = null
}
const wasEdited = comment => Math.abs(new Date(comment.updatedAt) - new Date(comment.createdAt)) > 1000
const exactTime = value => new Intl.DateTimeFormat('zh-CN', { dateStyle: 'long', timeStyle: 'medium' }).format(new Date(value))
const relativeTime = value => {
  const date = new Date(value)
  const seconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000))
  if (seconds < 60) return '刚刚'
  if (seconds < 3600) return `${Math.floor(seconds / 60)} 分钟前`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} 小时前`
  const now = new Date()
  if (date.getFullYear() === now.getFullYear()) return new Intl.DateTimeFormat('zh-CN', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(date)
  return new Intl.DateTimeFormat('zh-CN', { year: 'numeric', month: 'numeric', day: 'numeric' }).format(date)
}

onMounted(load)
watch(() => props.slug, load)
</script>

<style scoped>
.interactions{margin:48px 0;border-top:1px solid var(--border-subtle);padding-top:24px}.stats{display:flex;gap:18px;align-items:center}.stats button,.comments button{border:1px solid var(--border-primary);background:var(--bg-surface);color:var(--text-primary);padding:8px 14px;border-radius:999px}.comments form{margin:18px 0 8px}.comments textarea{box-sizing:border-box;display:block;width:100%;min-height:100px;resize:none;margin:12px 0;background:var(--bg-surface);color:var(--text-primary);border:1px solid var(--border-primary);border-radius:10px;padding:12px}.replying{display:flex;align-items:center;justify-content:space-between;color:var(--text-muted);font-size:.84rem}.replying button{padding:3px 9px}.empty{padding:28px 0;color:var(--text-muted)}.comments article{display:flex;gap:12px;padding:18px 0;border-bottom:1px solid var(--border-subtle)}.comments article.reply{margin-left:48px;padding-left:14px;border-left:2px solid var(--border-subtle)}.comment-content{min-width:0;flex:1}.comments img{width:36px;height:36px;object-fit:cover;border-radius:50%}.comment-head{display:flex;align-items:center;gap:8px}.reply-target{color:var(--text-muted);font-size:.8rem}.comment-content p{white-space:pre-wrap;overflow-wrap:anywhere;margin:9px 0}.comment-footer{display:flex;justify-content:space-between;align-items:center;gap:12px}.comment-times{display:flex;gap:10px;color:var(--text-muted);font-size:.76rem}.comment-actions{display:flex;gap:6px}.comment-actions button{padding:4px 9px;font-size:.72rem}.danger{color:#bd5555!important}@media(max-width:640px){.comments article.reply{margin-left:18px}.comment-footer{align-items:flex-start;flex-direction:column}.comment-times{flex-wrap:wrap}}
</style>
