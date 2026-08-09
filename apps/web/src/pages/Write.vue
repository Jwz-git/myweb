<template>
  <div class="write-page page-enter">
    <header class="write-toolbar">
      <div><span class="eyebrow">WRITING STUDIO</span><h1>写文章</h1></div>
      <div class="toolbar-actions"><span class="save-state">{{ saveState }}</span><button type="button" @click="createDraft">新建</button><button type="button" @click="saveDraft">保存</button><button v-if="currentRecord?.status === 'draft'" class="primary" type="button" @click="publishDraft">发布</button></div>
    </header>

    <div class="write-layout" :class="{ 'draft-collapsed': draftCollapsed }">
      <aside class="draft-panel" :class="{ collapsed: draftCollapsed }">
        <div class="draft-panel-head"><div><span>内容管理</span><h2>文章</h2></div><div class="draft-head-actions"><button type="button" title="新建文章" @click="createDraft">＋</button><button type="button" :title="draftCollapsed ? '展开文章列表' : '收起文章列表'" @click="draftCollapsed = !draftCollapsed">{{ draftCollapsed ? '›' : '‹' }}</button></div></div>
        <div class="draft-list">
          <div v-for="item in articleRecords" :key="item.id" class="draft-item" :class="{ active: item.id === draftId, published: item.status === 'published' }" @dragover.prevent @drop="dropDraft(item)">
            <span v-if="item.status === 'draft'" class="drag-handle" title="拖动排序" draggable="true" @dragstart="startDrag(item)">⠿</span>
            <button class="draft-open" type="button" @click="openDraft(item)"><strong>{{ item.content.title || '未命名文章' }}</strong><span><i>{{ item.status === 'draft' ? '未发布' : '已发布' }}</i>{{ formatDraftTime(item.updatedAt) }}</span></button>
            <button class="draft-delete" type="button" :aria-label="`删除文章：${item.content.title || '未命名文章'}`" title="移入垃圾箱" @click="deleteDraft(item)">×</button>
          </div>
        </div>
        <p v-if="!articleRecords.length" class="draft-empty">还没有文章，点击右上角新建。</p>
        <button class="trash-toggle" type="button" :aria-expanded="trashOpen" @click="trashOpen = !trashOpen"><span>垃圾箱</span><b>{{ trashedRecords.length }}</b></button>
        <div v-if="trashOpen" class="trash-box">
          <div class="trash-head"><strong>已删除文章</strong><button v-if="trashedRecords.length" type="button" @click="emptyTrash">清空垃圾箱</button></div>
          <div v-if="trashedRecords.length" class="trash-list"><div v-for="item in trashedRecords" :key="item.id" class="trash-item"><div><strong>{{ item.content.title || '未命名文章' }}</strong><span>{{ formatDraftTime(item.deletedAt) }}</span></div><div class="trash-actions"><button type="button" @click="previewTrash(item)">预览</button><button type="button" @click="restoreArticle(item)">恢复</button><button class="permanent-delete" type="button" :aria-label="`永久删除：${item.content.title || '未命名文章'}`" @click="permanentlyDeleteArticle(item)">删除</button></div></div></div>
          <p v-else>垃圾箱为空</p>
        </div>
      </aside>
      <aside class="meta-panel">
        <label>标题<input v-model="draft.title" placeholder="输入文章标题" @input="syncSlug" /></label>
        <label>Slug<input v-model="draft.slug" placeholder="article-slug" /></label>
        <div class="field-row"><label>日期<input v-model="draft.date" type="date" /></label><label>类型<select v-model="draft.type"><option>随笔</option><option>知识</option></select></label></div>
        <label>标签<input v-model="tagsInput" placeholder="用逗号分隔，例如：Vue, 笔记" /></label>
        <label>系列<input v-model="draft.series" placeholder="可选" /></label>
        <label>摘要<textarea v-model="draft.summary" rows="4" placeholder="可留空，由内容管线自动生成"></textarea></label>

        <section class="image-section">
          <div class="section-heading"><strong>文章封面</strong><small>JPG / PNG / WebP</small></div>
          <label class="cover-drop">
            <input type="file" accept="image/*" @change="selectCover" />
            <img v-if="coverPreview" :src="coverPreview" alt="封面预览" />
            <span v-else>选择封面图片</span>
          </label>
          <div v-if="draft.cover" class="cover-file"><span>{{ draft.cover.split('/').pop() }}</span><button type="button" @click="renameCover">重命名</button></div>
        </section>

        <section class="image-section">
          <div class="section-heading"><strong>正文图片</strong><small>点击图片插入光标位置</small></div>
          <label class="image-picker"><input type="file" accept="image/*" multiple @change="selectBodyImages" />添加图片</label>
          <div class="image-list"><div v-for="image in bodyImages" :key="image.name" class="image-item"><button class="image-insert" type="button" @click="insertImage(image)"><img :src="image.url" :alt="image.name" /><span>{{ image.name }}</span></button><button class="image-rename" type="button" :aria-label="`重命名图片：${image.name}`" title="重命名图片" @click="renameBodyImage(image)">✎</button><button class="image-remove" type="button" :aria-label="`删除图片：${image.name}`" title="删除图片并移除正文引用" @click="removeImage(image)">×</button></div></div>
        </section>
      </aside>

      <main class="editor-panel">
        <div class="editor-tabs"><button :class="{active:mobileTab==='edit'}" @click="mobileTab='edit'">正文</button><button :class="{active:mobileTab==='preview'}" @click="mobileTab='preview'">预览</button><span>{{ wordCount }} 字 · 约 {{ readingMinutes }} 分钟</span></div>
        <div class="editor-split">
          <section class="markdown-editor" :class="{mobileHidden:mobileTab!=='edit'}">
            <div class="format-bar"><button v-for="tool in tools" :key="tool.label" type="button" :title="tool.title" @click="applyFormat(tool)">{{ tool.label }}</button></div>
            <textarea ref="editor" v-model="draft.body" spellcheck="false" placeholder="# 从这里开始写作…"></textarea>
          </section>
          <section class="preview-pane" :class="{mobileHidden:mobileTab!=='preview'}">
            <article class="preview-article">
              <div class="preview-meta"><span>{{ draft.type }}</span><time>{{ draft.date }}</time></div>
              <h1>{{ draft.title || '未命名文章' }}</h1>
              <div class="preview-tags"><span v-for="tag in tags" :key="tag">{{ tag }}</span></div>
              <div class="article-content" v-html="renderedBody"></div>
            </article>
          </section>
        </div>
      </main>
    </div>
    <div v-if="trashPreview" class="trash-preview-backdrop" role="dialog" aria-modal="true" aria-label="已删除文章预览" @click="trashPreview = null">
      <section class="trash-preview" @click.stop>
        <header><div><span>{{ trashPreview.content.type }}</span><time>{{ trashPreview.content.date }}</time></div><button type="button" aria-label="关闭预览" @click="trashPreview = null">×</button></header>
        <h1>{{ trashPreview.content.title || '未命名文章' }}</h1>
        <div class="preview-tags"><span v-for="tag in trashPreview.content.tags || []" :key="tag">{{ tag }}</span></div>
        <article class="article-content" v-html="trashPreviewHtml"></article>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, reactive, ref, watch } from 'vue'
import MarkdownIt from 'markdown-it'
import markdownItKatex from '@iktakahiro/markdown-it-katex'
import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import cpp from 'highlight.js/lib/languages/cpp'
import python from 'highlight.js/lib/languages/python'
import bash from 'highlight.js/lib/languages/bash'
import { createManagedArticle, managedArticleRecords, persistManagedArticles } from '../composables/useManagedArticles.js'
import 'highlight.js/styles/github-dark.css'
import 'katex/dist/katex.min.css'
import '../styles/article.css'

hljs.registerLanguage('javascript',javascript);hljs.registerLanguage('js',javascript);hljs.registerLanguage('cpp',cpp);hljs.registerLanguage('python',python);hljs.registerLanguage('bash',bash)
const today=()=>new Date().toISOString().slice(0,10)
const emptyDraft=()=>({title:'',slug:'',date:today(),type:'随笔',series:'',summary:'',cover:'',coverPosition:'center',body:'# 开始写作\n\n'})
const draftRecords=managedArticleRecords
if(!draftRecords.value.length)createManagedArticle({...emptyDraft(),tags:[]})
const articleRecords=computed(()=>draftRecords.value.filter(item=>item.status!=='trash').sort((a,b)=>{if(a.status!==b.status)return a.status==='draft'?-1:1;if(a.status==='draft')return (a.draftOrder??0)-(b.draftOrder??0);return (b.updatedAt||b.publishedAt).localeCompare(a.updatedAt||a.publishedAt)}))
const trashedRecords=computed(()=>draftRecords.value.filter(item=>item.status==='trash').sort((a,b)=>(b.deletedAt||'').localeCompare(a.deletedAt||'')))
const firstRecord=articleRecords.value[0]
const draftId=ref(firstRecord.id)
const draft=reactive({...emptyDraft(),...firstRecord.content})
const tagsInput=ref((firstRecord.content.tags||[]).join(', '))
const editor=ref(null),coverPreview=ref(draft.cover||''),bodyImages=ref([]),mobileTab=ref('edit'),saveState=ref('已保存'),draftCollapsed=ref(false),trashOpen=ref(false),trashPreview=ref(null)
const currentRecord=computed(()=>draftRecords.value.find(item=>item.id===draftId.value))
const tags=computed(()=>tagsInput.value.split(/[,，]/).map(tag=>tag.trim()).filter(Boolean))
const wordCount=computed(()=>draft.body.replace(/[`#>*_~|\[\]()!-]/g,'').replace(/\s/g,'').length)
const readingMinutes=computed(()=>Math.max(1,Math.ceil(wordCount.value/400)))
const md=new MarkdownIt({html:true,breaks:true,highlight(str,lang){if(lang&&hljs.getLanguage(lang))return `<pre class="hljs"><code class="language-${lang}">${hljs.highlight(str,{language:lang}).value}</code></pre>`;return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`}}).use(markdownItKatex)
const imageLookup=computed(()=>Object.fromEntries(bodyImages.value.map(image=>[`/image/${image.name}`,image.url])))
const renderMarkdownBody=body=>{
  const strikethroughs=[]
  const prepared=String(body||'').replace(/~~([^~]+)~~/g,(_,text)=>{strikethroughs.push(text);return `%%STRIKE_${strikethroughs.length-1}%%`})
  return md.render(prepared)
    .replace(/%%STRIKE_(\d+)%%/g,(_,index)=>`<del>${strikethroughs[Number(index)]}</del>`)
}
const renderedBody=computed(()=>renderMarkdownBody(draft.body)
    .replace(/(<img[^>]+src=")([^"\s]+)(")/g,(_,a,src,c)=>`${a}${imageLookup.value[src]||src}${c}`)
)
const trashPreviewHtml=computed(()=>renderMarkdownBody(trashPreview.value?.content.body))
const tools=[{label:'H2',title:'二级标题',before:'## ',after:''},{label:'B',title:'粗体',before:'**',after:'**'},{label:'I',title:'斜体',before:'*',after:'*'},{label:'`',title:'行内代码',before:'`',after:'`'},{label:'<>',title:'代码块',before:'```js\n',after:'\n```'},{label:'—',title:'分隔线',before:'\n---\n',after:''},{label:'🔗',title:'链接',before:'[',after:'](https://)'}]
const slugify=value=>value.trim().toLowerCase().replace(/[^a-z0-9\s-]/g,'').replace(/\s+/g,'-').replace(/-+/g,'-').replace(/^-|-$/g,'')
const syncSlug=()=>{if(!draft.slug||draft.slug.startsWith('article-'))draft.slug=slugify(draft.title)||`article-${draft.date}`}
const replacePreview=(target,file)=>{if(target.value)URL.revokeObjectURL(target.value);target.value=URL.createObjectURL(file)}
const selectCover=event=>{const file=event.target.files?.[0];if(!file)return;replacePreview(coverPreview,file);draft.cover=`/image/${file.name}`}
const normalizedImageName=(value,oldName)=>{const oldExtension=oldName.includes('.')?oldName.slice(oldName.lastIndexOf('.')):'';let name=String(value||'').trim().replace(/[\\/]/g,'-').replace(/\s+/g,'-');if(name&&!/\.[a-z0-9]+$/i.test(name))name+=oldExtension;return name}
const replaceImageReference=(oldName,newName)=>{const escaped=oldName.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');draft.body=draft.body.replace(new RegExp(`/image/${escaped}`,'g'),`/image/${newName}`)}
const renameCover=()=>{const oldName=draft.cover.split('/').pop();const name=normalizedImageName(prompt('输入新的封面文件名',oldName),oldName);if(name)draft.cover=`/image/${name}`}
const addFiles=files=>{for(const file of files){if(!file.type.startsWith('image/')||bodyImages.value.some(item=>item.name===file.name))continue;bodyImages.value.push({name:file.name,file,url:URL.createObjectURL(file)})}}
const selectBodyImages=event=>addFiles(event.target.files||[])
const insertText=async(before,after='')=>{const el=editor.value,start=el.selectionStart,end=el.selectionEnd,selected=draft.body.slice(start,end);draft.body=draft.body.slice(0,start)+before+selected+after+draft.body.slice(end);await nextTick();el.focus();el.setSelectionRange(start+before.length,start+before.length+selected.length)}
const insertImage=image=>insertText(`\n![${image.name.replace(/\.[^.]+$/,'')}](/image/${image.name})\n`)
const renameBodyImage=image=>{const oldName=image.name;const name=normalizedImageName(prompt('输入新的图片文件名',oldName),oldName);if(!name||name===oldName)return;if(bodyImages.value.some(item=>item!==image&&item.name===name))return alert('图片文件名已存在');replaceImageReference(oldName,name);image.name=name}
const removeImage=image=>{const escaped=image.name.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');draft.body=draft.body.replace(new RegExp(`\\n?!\\[[^\\]]*\\]\\(/image/${escaped}\\)\\n?`,'g'),'\n').replace(/\n{3,}/g,'\n\n');URL.revokeObjectURL(image.url);bodyImages.value=bodyImages.value.filter(item=>item!==image)}
const applyFormat=tool=>insertText(tool.before,tool.after)
watch([draft,tagsInput],()=>{saveState.value='未保存'},{deep:true})
const persistRecords=persistManagedArticles
const saveDraft=()=>{syncSlug();const record=currentRecord.value;if(!record)return;record.content={...JSON.parse(JSON.stringify(draft)),tags:tags.value};record.updatedAt=new Date().toISOString();persistRecords();saveState.value='已保存'}
const clearTransientImages=()=>{if(coverPreview.value.startsWith('blob:'))URL.revokeObjectURL(coverPreview.value);bodyImages.value.forEach(image=>URL.revokeObjectURL(image.url));bodyImages.value=[]}
const openDraft=item=>{if(item.id===draftId.value)return;saveDraft();clearTransientImages();draftId.value=item.id;Object.assign(draft,emptyDraft(),item.content);tagsInput.value=(item.content.tags||[]).join(', ');coverPreview.value=draft.cover||'';saveState.value='已保存'}
const createDraft=()=>{saveDraft();clearTransientImages();const record=createManagedArticle({...emptyDraft(),tags:[]});draftId.value=record.id;Object.assign(draft,record.content);tagsInput.value='';coverPreview.value='';saveState.value='已保存'}
const publishDraft=()=>{if(!draft.title.trim())return alert('请先填写标题');saveDraft();const record=currentRecord.value;record.status='published';record.publishedAt=record.publishedAt||new Date().toISOString();record.updatedAt=new Date().toISOString();persistRecords();saveState.value='已发布'}
const deleteDraft=item=>{if(!confirm(`将文章“${item.content.title||'未命名文章'}”移入垃圾箱？`))return;const wasActive=item.id===draftId.value;item.previousStatus=item.status;item.status='trash';item.deletedAt=new Date().toISOString();if(wasActive){clearTransientImages();let next=articleRecords.value[0];if(!next)next=createManagedArticle({...emptyDraft(),tags:[]});draftId.value=next.id;Object.assign(draft,emptyDraft(),next.content);tagsInput.value=(next.content.tags||[]).join(', ');coverPreview.value=draft.cover||'';saveState.value='已保存'}persistRecords()}
const restoreArticle=item=>{item.status=item.previousStatus==='published'?'published':'draft';delete item.previousStatus;delete item.deletedAt;persistRecords()}
const previewTrash=item=>{trashPreview.value=item}
const permanentlyDeleteArticle=item=>{if(!confirm(`永久删除文章“${item.content.title||'未命名文章'}”？此操作不可撤回。`))return;draftRecords.value=draftRecords.value.filter(record=>record.id!==item.id);persistRecords()}
const emptyTrash=()=>{if(!confirm(`永久删除垃圾箱中的 ${trashedRecords.value.length} 篇文章？`))return;const trashedIds=new Set(trashedRecords.value.map(item=>item.id));draftRecords.value=draftRecords.value.filter(item=>!trashedIds.has(item.id));persistRecords();trashOpen.value=false}
const draggedId=ref('')
const startDrag=item=>{if(item.status==='draft')draggedId.value=item.id}
const dropDraft=target=>{if(!draggedId.value||target.status!=='draft'||target.id===draggedId.value)return;const drafts=articleRecords.value.filter(item=>item.status==='draft');const from=drafts.findIndex(item=>item.id===draggedId.value),to=drafts.findIndex(item=>item.id===target.id);const [moved]=drafts.splice(from,1);drafts.splice(to,0,moved);drafts.forEach((item,index)=>{item.draftOrder=index});draggedId.value='';persistRecords()}
const formatDraftTime=value=>new Intl.DateTimeFormat('zh-CN',{month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'}).format(new Date(value))
onBeforeUnmount(()=>{clearTransientImages()})
</script>

<style scoped>
.write-page{min-height:calc(100vh - var(--nav-height));padding:28px clamp(18px,3vw,46px) 60px}.write-toolbar{display:flex;align-items:end;justify-content:space-between;gap:20px;margin-bottom:22px}.eyebrow{font:.65rem var(--font-mono);letter-spacing:.14em;color:var(--accent)}h1{font:700 2.15rem var(--font-serif)}.toolbar-actions{display:flex;align-items:center;gap:8px}.toolbar-actions button,.image-picker{padding:9px 13px;border:1px solid var(--border-primary);border-radius:8px;background:var(--bg-surface)}.toolbar-actions .primary{color:var(--bg-primary);background:var(--accent);border-color:var(--accent)}.save-state{font-size:.72rem;color:var(--text-muted)}.write-layout{display:grid;grid-template-columns:210px 270px minmax(0,1fr);gap:16px;min-height:720px}.draft-panel,.meta-panel,.editor-panel{border:1px solid var(--border-subtle);border-radius:var(--radius-md);background:var(--surface-glass-soft);box-shadow:var(--shadow-sm)}.meta-panel{min-width:0;padding:18px;overflow-x:hidden;overflow-y:auto}.meta-panel label{display:grid;gap:6px;margin-bottom:13px;font-size:.76rem;color:var(--text-secondary)}input,select,textarea{width:100%;border:1px solid var(--border-subtle);border-radius:7px;background:var(--bg-primary);color:var(--text-primary);padding:9px 10px;outline:none}input:focus,select:focus,textarea:focus{border-color:var(--accent)}.field-row{display:grid;grid-template-columns:1fr 1fr;gap:8px}.image-section{margin-top:20px;padding-top:17px;border-top:1px solid var(--border-subtle)}.section-heading{display:flex;justify-content:space-between;margin-bottom:10px}.section-heading small{color:var(--text-muted)}.cover-drop{position:relative;display:grid!important;place-items:center;min-height:120px;overflow:hidden;border:1px dashed var(--border-primary);border-radius:8px;cursor:pointer}.cover-drop input,.image-picker input{position:absolute;opacity:0;pointer-events:none}.cover-drop img{width:100%;height:140px;object-fit:cover}.cover-file{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:-5px;margin-bottom:12px;font-size:.68rem;color:var(--text-muted)}.cover-file span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.cover-file button{flex:0 0 auto;padding:4px 7px;border-radius:5px;background:var(--bg-surface);color:var(--accent);font-size:.66rem}.image-picker{position:relative;display:block!important;text-align:center;cursor:pointer}.image-list{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-top:8px}.image-list button{min-width:0}.image-list img{width:100%;aspect-ratio:1;object-fit:cover;border-radius:5px}.image-list span{display:block;overflow:hidden;font-size:.6rem;text-overflow:ellipsis;white-space:nowrap}.image-item{position:relative;min-width:0}.image-insert{display:block;width:100%;min-width:0}.image-rename,.image-remove{position:absolute;z-index:2;top:-5px;display:grid;place-items:center;width:22px;height:22px;border:1px solid var(--border-primary);border-radius:50%;background:var(--bg-elevated);color:var(--text-muted);box-shadow:var(--shadow-sm);opacity:0;transition:opacity var(--transition-fast),color var(--transition-fast)}.image-rename{left:-5px}.image-remove{right:-5px;display:grid;place-items:center;width:22px;height:22px;border:1px solid var(--border-primary);border-radius:50%;background:var(--bg-elevated);color:var(--text-muted);box-shadow:var(--shadow-sm);opacity:0;transition:opacity var(--transition-fast),color var(--transition-fast)}.image-item:hover .image-rename,.image-item:hover .image-remove,.image-rename:focus-visible,.image-remove:focus-visible{opacity:1}.image-rename:hover{color:var(--accent);border-color:var(--accent)}.image-remove:hover{color:#c96b67;border-color:#c96b67}.editor-panel{min-width:0;overflow:hidden}.editor-tabs{display:flex;align-items:center;height:46px;padding:0 12px;border-bottom:1px solid var(--border-subtle)}.editor-tabs button{padding:7px 12px;color:var(--text-muted)}.editor-tabs button.active{color:var(--accent);background:var(--accent-muted);border-radius:6px}.editor-tabs span{margin-left:auto;font:.68rem var(--font-mono);color:var(--text-muted)}.editor-split{display:grid;grid-template-columns:1fr 1fr;height:calc(100% - 46px)}.markdown-editor{display:flex;min-width:0;flex-direction:column;border-right:1px solid var(--border-subtle)}.format-bar{display:flex;gap:4px;padding:8px;border-bottom:1px solid var(--border-subtle)}.format-bar button{min-width:30px;height:28px;border-radius:5px;background:var(--bg-surface);font:.75rem var(--font-mono)}.format-bar button:hover{color:var(--accent);background:var(--accent-muted)}.markdown-editor>textarea{flex:1;resize:none;border:0;border-radius:0;background:transparent;padding:20px;font:14px/1.75 var(--font-mono)}.preview-pane{overflow:auto;padding:28px}.preview-article{max-width:760px;margin:auto}.preview-meta{display:flex;gap:12px;font:.7rem var(--font-mono);color:var(--text-muted)}.preview-meta span{color:var(--accent)}.preview-article>h1{margin:8px 0 12px;font-size:2rem}.preview-tags{display:flex;gap:6px;margin-bottom:30px}.preview-tags span{padding:3px 8px;border-radius:5px;background:var(--bg-elevated);font-size:.7rem;color:var(--text-muted)}

.draft-panel{min-width:0;padding:16px 10px;overflow:hidden}
.draft-panel-head{display:flex;align-items:center;justify-content:space-between;padding:2px 6px 14px;border-bottom:1px solid var(--border-subtle)}
.draft-panel-head span{font:.62rem var(--font-mono);letter-spacing:.12em;color:var(--text-muted)}
.draft-panel-head h2{margin-top:3px;font:700 1.15rem var(--font-serif)}
.draft-panel-head button{display:grid;place-items:center;width:32px;height:32px;border:1px solid var(--border-primary);border-radius:8px;background:var(--bg-surface);font-size:1.15rem}
.draft-list{display:grid;gap:5px;max-height:640px;padding-top:10px;overflow-y:auto}
.draft-item{display:grid;gap:6px;width:100%;padding:11px 10px;border:1px solid transparent;border-radius:8px;text-align:left}
.draft-item:hover{background:var(--bg-surface-hover)}
.draft-item.active{border-color:var(--border-primary);background:var(--accent-muted)}
.draft-item strong{overflow:hidden;color:var(--text-primary);font-size:.8rem;text-overflow:ellipsis;white-space:nowrap}
.draft-item span{font:.62rem var(--font-mono);color:var(--text-muted)}
.draft-empty{padding:18px 8px;color:var(--text-muted);font-size:.72rem;line-height:1.7}

.draft-head-actions{display:flex;gap:5px}
.write-layout.draft-collapsed{grid-template-columns:48px 270px minmax(0,1fr)}
.draft-panel.collapsed{padding:10px 7px}
.draft-panel.collapsed .draft-panel-head{justify-content:center;padding:0;border:0}
.draft-panel.collapsed .draft-panel-head>div:first-child,.draft-panel.collapsed .draft-head-actions button:first-child,.draft-panel.collapsed .draft-list,.draft-panel.collapsed .draft-empty{display:none}
.draft-item{position:relative;padding:0}
.draft-open{display:grid;gap:6px;width:100%;padding:11px 30px 11px 10px;text-align:left}
.draft-delete{position:absolute;right:6px;top:50%;display:grid;place-items:center;width:24px;height:24px;border-radius:6px;color:var(--text-muted);transform:translateY(-50%);opacity:0}
.draft-item:hover .draft-delete,.draft-item.active .draft-delete,.draft-delete:focus-visible{opacity:1}
.draft-delete:hover{color:#c96b67;background:rgba(201,107,103,.12)}

.drag-handle{position:absolute;z-index:1;left:7px;top:50%;cursor:grab;transform:translateY(-50%);user-select:none}
.drag-handle:active{cursor:grabbing}
.draft-open span{display:flex;align-items:center;gap:6px}
.draft-open i{padding:1px 4px;border-radius:4px;background:var(--accent-muted);color:var(--accent);font-style:normal}
.draft-item.published .draft-open{padding-left:10px}
.draft-item.published .draft-open i{background:var(--bg-elevated);color:var(--text-muted)}
.draft-item:not(.published)+.draft-item.published{margin-top:12px}


.trash-toggle{display:flex;align-items:center;justify-content:space-between;width:100%;margin-top:12px;padding:10px;border-top:1px solid var(--border-subtle);color:var(--text-muted);font-size:.74rem}
.trash-toggle b{display:grid;place-items:center;min-width:21px;height:21px;border-radius:999px;background:var(--bg-elevated);font:.65rem var(--font-mono)}
.trash-box{margin-top:4px;padding:10px;border:1px solid var(--border-subtle);border-radius:8px;background:var(--bg-primary)}
.trash-head{display:flex;align-items:center;justify-content:space-between;gap:6px;margin-bottom:8px;font-size:.7rem}
.trash-head button{color:#c96b67;font-size:.62rem}
.trash-list{display:grid;gap:5px;max-height:220px;overflow-y:auto}
.trash-item{display:flex;align-items:center;justify-content:space-between;gap:6px;padding:8px;border-radius:6px;background:var(--bg-surface)}
.trash-item>div{display:grid;min-width:0;gap:3px}
.trash-item strong{overflow:hidden;font-size:.68rem;text-overflow:ellipsis;white-space:nowrap}
.trash-item span,.trash-box>p{color:var(--text-muted);font:.58rem var(--font-mono)}
.trash-actions{display:flex;flex:0 0 auto;gap:3px}.trash-item button{flex:0 0 auto;padding:4px 6px;border-radius:5px;color:var(--accent);font-size:.62rem}.trash-item .permanent-delete{color:#c96b67}
.draft-panel.collapsed .trash-toggle,.draft-panel.collapsed .trash-box{display:none}

.trash-preview-backdrop{position:fixed;z-index:2100;inset:0;display:grid;place-items:center;padding:24px;background:rgba(0,0,0,.72);backdrop-filter:blur(8px)}
.trash-preview{width:min(820px,100%);max-height:88dvh;overflow-y:auto;padding:34px 42px;border:1px solid var(--border-primary);border-radius:var(--radius-md);background:var(--bg-primary);box-shadow:var(--shadow-md)}
.trash-preview>header{display:flex;align-items:center;justify-content:space-between;margin-bottom:18px}
.trash-preview>header>div{display:flex;gap:10px;color:var(--text-muted);font:.7rem var(--font-mono)}
.trash-preview>header button{display:grid;place-items:center;width:32px;height:32px;border-radius:50%;background:var(--bg-surface);font-size:1.25rem}
.trash-preview>h1{margin-bottom:12px;font:700 clamp(1.8rem,4vw,2.5rem) var(--font-serif)}
@media(max-width:600px){.trash-preview-backdrop{padding:10px}.trash-preview{padding:24px 20px}}
@media(min-width:901px){.editor-tabs button{pointer-events:none}.editor-tabs button:nth-child(2){display:none}}
@media(max-width:1180px) and (min-width:901px){.write-layout{grid-template-columns:190px 250px minmax(0,1fr)}.write-layout.draft-collapsed{grid-template-columns:48px 250px minmax(0,1fr)}}
@media(max-width:900px){.write-layout.draft-collapsed{grid-template-columns:1fr}.draft-panel.collapsed{width:48px}.write-toolbar{align-items:flex-start;flex-direction:column}.write-layout{grid-template-columns:1fr}.draft-panel{padding:12px}.draft-list{grid-template-columns:repeat(2,minmax(0,1fr));max-height:220px}.meta-panel{max-height:none}.editor-panel{height:760px}.editor-split{display:block}.markdown-editor,.preview-pane{height:100%;border:0}.mobileHidden{display:none}.toolbar-actions{width:100%;flex-wrap:wrap}.save-state{margin-right:auto}}
@media(max-width:520px){.write-page{padding-inline:12px}.write-toolbar h1{font-size:1.8rem}.write-layout{min-height:0}.editor-panel{height:680px}.preview-pane{padding:18px}.field-row{grid-template-columns:1fr}.toolbar-actions .primary{flex:1}.editor-tabs span{display:none}}
</style>
