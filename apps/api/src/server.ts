import { createHash, randomBytes } from 'node:crypto'
import Fastify from 'fastify'
import cookie from '@fastify/cookie'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import rateLimit from '@fastify/rate-limit'
import { query } from './db.js'

const app = Fastify({ logger: true, trustProxy: true, bodyLimit: 16 * 1024 })
const origins = (process.env.ALLOWED_ORIGINS || '').split(',').filter(Boolean)
const admins = new Set((process.env.ADMIN_GITHUB_IDS || '').split(',').filter(Boolean))
const cookieName = 'jwz_session'
const secureCookies = (process.env.API_PUBLIC_URL || '').startsWith('https://')
const sha = (value: string) => createHash('sha256').update(value).digest('hex')
const cleanText = (value: unknown) => String(value ?? '').replace(/[<>]/g, '').trim()

await app.register(cookie)
await app.register(cors, { origin: origins, credentials: true })
await app.register(helmet, { contentSecurityPolicy: false })
await app.register(rateLimit, { max: 120, timeWindow: '1 minute' })

app.decorateRequest('user', null)
app.addHook('preHandler', async request => {
  if (!['GET','HEAD','OPTIONS'].includes(request.method)) {
    const origin = request.headers.origin
    const ownOrigin = process.env.API_PUBLIC_URL ? new URL(process.env.API_PUBLIC_URL).origin : ''
    if (origin && origin !== ownOrigin && !origins.includes(origin)) throw Object.assign(new Error('invalid_origin'), { statusCode: 403 })
  }
  const token = request.cookies[cookieName]
  if (!token) return
  const result = await query<any>(`SELECT u.* FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token_hash=$1 AND s.expires_at>now()`, [sha(token)])
  ;(request as any).user = result.rows[0] || null
})
const requireUser = async (request: any, reply: any) => {
  if (!request.user) return reply.code(401).send({ error: 'authentication_required' })
  if (request.user.banned_at) return reply.code(403).send({ error: 'user_banned' })
}
const requireAdmin = async (request: any, reply: any) => {
  await requireUser(request, reply)
  if (!reply.sent && request.user.role !== 'admin') return reply.code(403).send({ error: 'admin_required' })
}

app.get('/api/v1/health', async () => ({ status: 'ok' }))
app.get('/api/v1/auth/github', async (_request, reply) => {
  if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET || !process.env.API_PUBLIC_URL) return reply.code(503).send({ error: 'github_oauth_not_configured' })
  const state = randomBytes(24).toString('hex')
  reply.setCookie('oauth_state', state, { httpOnly: true, secure: secureCookies, sameSite: 'lax', path: '/', maxAge: 600 })
  const params = new URLSearchParams({ client_id: process.env.GITHUB_CLIENT_ID || '', redirect_uri: `${process.env.API_PUBLIC_URL}/api/v1/auth/github/callback`, scope: 'read:user', state })
  return reply.redirect(`https://github.com/login/oauth/authorize?${params}`)
})
app.get('/api/v1/auth/github/callback', async (request: any, reply) => {
  const { code, state } = request.query
  if (!code || !state || state !== request.cookies.oauth_state) return reply.code(400).send({ error: 'invalid_oauth_state' })
  const tokenRes = await fetch('https://github.com/login/oauth/access_token', { method: 'POST', headers: { accept: 'application/json', 'content-type': 'application/json' }, body: JSON.stringify({ client_id: process.env.GITHUB_CLIENT_ID, client_secret: process.env.GITHUB_CLIENT_SECRET, code }) })
  const token = (await tokenRes.json() as any).access_token
  if (!token) return reply.code(401).send({ error: 'oauth_failed' })
  const ghRes = await fetch('https://api.github.com/user', { headers: { authorization: `Bearer ${token}`, 'user-agent': 'jwz-blog' } })
  const gh = await ghRes.json() as any
  const role = admins.has(String(gh.id)) ? 'admin' : 'user'
  const user = await query<any>(`INSERT INTO users(github_id,login,avatar_url,role) VALUES($1,$2,$3,$4) ON CONFLICT(github_id) DO UPDATE SET login=excluded.login,avatar_url=excluded.avatar_url,role=excluded.role,updated_at=now() RETURNING *`, [gh.id, gh.login, gh.avatar_url, role])
  const session = randomBytes(32).toString('base64url')
  await query(`INSERT INTO sessions(token_hash,user_id,expires_at) VALUES($1,$2,now()+interval '30 days')`, [sha(session), user.rows[0].id])
  reply.clearCookie('oauth_state', { path: '/' }).setCookie(cookieName, session, { httpOnly: true, secure: secureCookies, sameSite: 'lax', path: '/', maxAge: 2592000 })
  return reply.redirect(process.env.WEB_PUBLIC_URL || '/')
})
app.post('/api/v1/auth/logout', async (request, reply) => { const token=request.cookies[cookieName]; if(token) await query('DELETE FROM sessions WHERE token_hash=$1',[sha(token)]); reply.clearCookie(cookieName,{path:'/'}); return {ok:true} })
app.get('/api/v1/me', async (request: any) => request.user ? { id:String(request.user.id), login:request.user.login, avatarUrl:request.user.avatar_url, role:request.user.role } : null)

app.get('/api/v1/articles/:slug/stats', async (request: any) => {
  const { slug } = request.params; const uid = request.user?.id || 0
  const result=await query<any>(`SELECT (SELECT count(*) FROM article_views WHERE article_slug=$1)::int views,(SELECT count(*) FROM likes WHERE article_slug=$1)::int likes,EXISTS(SELECT 1 FROM likes WHERE article_slug=$1 AND user_id=$2) liked`,[slug,uid]); return {slug,...result.rows[0]}
})
app.post('/api/v1/articles/:slug/views', async (request: any) => { const visitor=sha(`${request.ip}:${request.headers['user-agent']||''}`).slice(0,32); await query(`INSERT INTO article_views(article_slug,visitor_hash) VALUES($1,$2) ON CONFLICT DO NOTHING`,[request.params.slug,visitor]); return {ok:true} })
app.put('/api/v1/articles/:slug/like',{preHandler:requireUser},async(request:any)=>{await query(`INSERT INTO likes(article_slug,user_id) VALUES($1,$2) ON CONFLICT DO NOTHING`,[request.params.slug,request.user.id]);return{ok:true}})
app.delete('/api/v1/articles/:slug/like',{preHandler:requireUser},async(request:any)=>{await query(`DELETE FROM likes WHERE article_slug=$1 AND user_id=$2`,[request.params.slug,request.user.id]);return{ok:true}})

const commentSelect=`SELECT c.id::text,c.article_slug "articleSlug",c.body,c.status,c.parent_id::text "parentId",c.created_at "createdAt",c.updated_at "updatedAt",json_build_object('id',u.id::text,'login',u.login,'avatarUrl',u.avatar_url,'role',u.role) author FROM comments c JOIN users u ON u.id=c.user_id`
app.get('/api/v1/articles/:slug/comments',async(request:any)=>{const r=await query<any>(`${commentSelect} WHERE c.article_slug=$1 AND c.status='visible' ORDER BY c.created_at`,[request.params.slug]);return r.rows})
app.post('/api/v1/articles/:slug/comments',{preHandler:requireUser,config:{rateLimit:{max:5,timeWindow:'1 minute'}}},async(request:any,reply)=>{const body=cleanText(request.body?.body);if(!body||body.length>2000)return reply.code(400).send({error:'invalid_comment'});const r=await query<any>(`INSERT INTO comments(article_slug,user_id,parent_id,body) VALUES($1,$2,$3,$4) RETURNING id`,[request.params.slug,request.user.id,request.body?.parentId||null,body]);return reply.code(201).send({id:String(r.rows[0].id)})})
app.patch('/api/v1/comments/:id',{preHandler:requireUser},async(request:any,reply)=>{const body=cleanText(request.body?.body);const r=await query(`UPDATE comments SET body=$1,updated_at=now() WHERE id=$2 AND user_id=$3 AND status='visible'`,[body,request.params.id,request.user.id]);return r.rowCount?{ok:true}:reply.code(404).send({error:'not_found'})})
app.delete('/api/v1/comments/:id',{preHandler:requireUser},async(request:any,reply)=>{const r=await query(`UPDATE comments SET status='deleted',body='[deleted]',updated_at=now() WHERE id=$1 AND (user_id=$2 OR $3='admin')`,[request.params.id,request.user.id,request.user.role]);return r.rowCount?{ok:true}:reply.code(404).send({error:'not_found'})})
app.get('/api/v1/admin/comments',{preHandler:requireAdmin},async()=>{const r=await query<any>(`${commentSelect} ORDER BY c.created_at DESC LIMIT 200`);return r.rows})
app.get('/api/v1/admin/overview',{preHandler:requireAdmin},async()=>{const r=await query<any>(`SELECT (SELECT count(*) FROM users)::int users,(SELECT count(*) FROM comments WHERE status='visible')::int comments,(SELECT count(*) FROM likes)::int likes,(SELECT count(*) FROM article_views)::int views`);return r.rows[0]})
app.get('/api/v1/admin/users',{preHandler:requireAdmin},async()=>{const r=await query<any>(`SELECT id::text,github_id::text "githubId",login,avatar_url "avatarUrl",role,banned_at "bannedAt",created_at "createdAt" FROM users ORDER BY created_at DESC LIMIT 200`);return r.rows})
app.patch('/api/v1/admin/comments/:id/moderation',{preHandler:requireAdmin},async(request:any,reply)=>{const status=request.body?.status;if(!['visible','hidden','deleted'].includes(status))return reply.code(400).send({error:'invalid_status'});await query(`WITH changed AS (UPDATE comments SET status=$1,updated_at=now() WHERE id=$2 RETURNING id) INSERT INTO moderation_logs(admin_id,action,target_type,target_id) SELECT $3,$1,'comment',id::text FROM changed`,[status,request.params.id,request.user.id]);return{ok:true}})
app.delete('/api/v1/admin/comments/:id',{preHandler:requireAdmin},async(request:any,reply)=>{const r=await query(`WITH detached AS (UPDATE comments SET parent_id=NULL WHERE parent_id=$1), removed AS (DELETE FROM comments WHERE id=$1 AND status='deleted' RETURNING id) INSERT INTO moderation_logs(admin_id,action,target_type,target_id) SELECT $2,'permanent_delete','comment',id::text FROM removed`,[request.params.id,request.user.id]);return r.rowCount?{ok:true}:reply.code(409).send({error:'comment_must_be_deleted_first'})})
app.post('/api/v1/admin/users/:id/ban',{preHandler:requireAdmin},async(request:any)=>{await query(`UPDATE users SET banned_at=COALESCE(banned_at,now()) WHERE id=$1`,[request.params.id]);await query(`INSERT INTO moderation_logs(admin_id,action,target_type,target_id) VALUES($1,'ban','user',$2)`,[request.user.id,request.params.id]);return{ok:true}})

await app.listen({ host: '0.0.0.0', port: Number(process.env.PORT || 3000) })
