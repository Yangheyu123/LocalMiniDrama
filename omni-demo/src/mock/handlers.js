// mock 路由表:URL → 处理器。写操作修改内存 store;生成任务 3 秒后自动完成。
import {
  project, seedAssets, seedStoryboards, seedJobs, seedVideos, capabilities,
  aiVideoConfigs, uploadLimits, generationContract, account, billingQuote, DEMO_VIDEOS,
} from './fixtures'

const clone = (v) => JSON.parse(JSON.stringify(v))

// —— 内存状态(每次刷新页面重置) ——
const store = {
  assets: clone(seedAssets),
  storyboards: clone(seedStoryboards),
  jobs: clone(seedJobs),
  videos: clone(seedVideos),
  nextId: 1000,
}

const page = (items) => ({ items, pagination: { total: items.length, total_pages: 1, page: 1 } })

// 生成任务:创建后延迟转 completed,并挂上演示视频
function startFakeGeneration(body) {
  const id = `job-${++store.nextId}`
  const storyboardId = Number(body?.storyboard_id) || null
  const duration = Number(body?.duration) || 8
  const videoGenerationId = ++store.nextId
  const job = {
    id,
    omni_job_id: id,
    video_generation_id: videoGenerationId,
    status: 'processing',
    created_at: new Date().toISOString(),
    storyboard_id: storyboardId,
    prompt: body?.prompt || '',
    generation: { status: 'processing', duration, task_progress: 0, task_message: '排队中…' },
  }
  store.jobs.unshift(job)
  const startedAt = Date.now()
  const finish = () => {
    const videoUrl = DEMO_VIDEOS[store.nextId % DEMO_VIDEOS.length]
    job.status = 'completed'
    job.completed_at = new Date().toISOString()
    job.generation = { ...job.generation, status: 'completed', duration, video_url: videoUrl, completed_at: job.completed_at }
    if (storyboardId) {
      store.videos.push({ id: ++store.nextId, storyboard_id: storyboardId, status: 'completed', video_url: videoUrl, duration, completed_at: job.completed_at })
      const sb = store.storyboards.find((s) => Number(s.id) === storyboardId)
      if (sb) sb.video_url = videoUrl
    }
  }
  const progressTimer = setInterval(() => {
    const elapsed = Date.now() - startedAt
    if (elapsed >= 3200) { clearInterval(progressTimer); finish(); return }
    const pct = Math.min(95, Math.round((elapsed / 3200) * 100))
    job.generation.task_progress = pct
    job.generation.task_message = pct < 40 ? '生成画面中…' : pct < 80 ? '视频合成中…' : '即将完成…'
  }, 400)
  return job
}

// —— GET 路由 ——
const GET = {
  '/assets': () => page(store.assets),
  '/ai-configs': (q) => (q?.service_type ? aiVideoConfigs.filter((c) => c.service_type === q.service_type) : aiVideoConfigs),
  '/video-model-capabilities': () => capabilities,
  '/upload-limits': () => uploadLimits,
  '/omni-video-jobs': () => store.jobs.map(clone),
  '/omni-video-jobs/polish-prompt': () => ({}),
  '/billing/me': () => account,
  '/videos': (q) => page(q?.storyboard_id ? store.videos.filter((v) => Number(v.storyboard_id) === Number(q.storyboard_id)) : store.videos),
  '/homepage/default-videos': () => page([]),
}

// —— 动态路由(GET) ——
function getDynamic(url, q) {
  let m
  if ((m = url.match(/^\/omni-video-jobs\/([^/]+)$/))) {
    const job = store.jobs.find((j) => j.id === m[1])
    return job ? clone(job) : null
  }
  if ((m = url.match(/^\/episodes\/(\d+)\/storyboards$/))) return { storyboards: clone(store.storyboards) }
  if ((m = url.match(/^\/dramas\/(\d+)$/))) return clone(project)
  if ((m = url.match(/^\/episodes\/(\d+)\/generation-settings$/))) return clone(generationContract)
  return undefined
}

// —— 写操作 ——
function handleWrite(method, url, body) {
  let m
  if (method === 'POST' && url === '/omni-video-jobs') return startFakeGeneration(body)
  if (method === 'POST' && url === '/omni-video-jobs/polish-prompt') {
    const text = String(body?.prompt || '')
    return { polished_prompt: text + '\n\n[演示润色] 镜头语言:近景起手,缓推;光比 3:1;情绪关键词:克制、思念;结尾定格 1 秒。' }
  }
  if (method === 'POST' && url === '/billing/quotes') return billingQuote(body)
  if (method === 'POST' && url === '/media/upload') {
    const asset = { id: ++store.nextId, name: body?.name || '上传素材', type: 'image', url: '/char-1.svg', scope: 'project' }
    store.assets.push(asset)
    return asset
  }
  if (method === 'POST' && url === '/assets/project-resource-link') {
    const asset = { id: ++store.nextId, name: '项目资源', type: 'image', url: '/scene-3.svg', scope: 'project' }
    return asset
  }
  if (method === 'POST' && url === '/assets') {
    const asset = { id: ++store.nextId, ...(body || {}), scope: 'project' }
    store.assets.push(asset)
    return asset
  }
  if ((m = url.match(/^\/omni-video-jobs\/([^/]+)\/retry$/)) && method === 'POST') {
    const job = store.jobs.find((j) => j.id === m[1])
    if (job) { job.status = 'processing'; job.generation = { status: 'processing', task_progress: 0, task_message: '重试中…', duration: job.generation?.duration || 8 } }
    return job ? clone(job) : null
  }
  if ((m = url.match(/^\/omni-video-jobs\/([^/]+)\/cancel$/)) && method === 'POST') {
    const job = store.jobs.find((j) => j.id === m[1])
    if (job) { job.status = 'failed'; job.error_msg = '已取消(演示)' }
    return { message: '已取消' }
  }
  if ((m = url.match(/^\/omni-video-jobs\/([^/]+)$/)) && method === 'DELETE') {
    store.jobs = store.jobs.filter((j) => j.id !== m[1])
    return { message: '已隐藏' }
  }
  if ((m = url.match(/^\/storyboards\/(\d+)$/))) {
    const sb = store.storyboards.find((s) => Number(s.id) === Number(m[1]))
    if (!sb) return null
    Object.assign(sb, body || {})
    return clone(sb)
  }
  if (method === 'POST' && url === '/storyboards') {
    const sb = { id: ++store.nextId, episode_id: 1, drama_id: 1, storyboard_number: store.storyboards.length + 1, title: body?.title || '新镜头', universal_segment_text: '', duration: 8, omni_asset_ids: [], omni_asset_usage: {}, ...(body || {}) }
    store.storyboards.push(sb)
    return clone(sb)
  }
  if ((m = url.match(/^\/storyboards\/(\d+)$/)) && method === 'DELETE') {
    store.storyboards = store.storyboards.filter((s) => Number(s.id) !== Number(m[1]))
    return { message: '删除成功' }
  }
  if (url === '/storyboards/reorder' && method === 'PUT') {
    const ids = (body?.storyboard_ids || body?.ids || []).map(Number)
    store.storyboards.sort((a, b) => ids.indexOf(Number(a.id)) - ids.indexOf(Number(b.id)))
    store.storyboards.forEach((s, i) => { s.storyboard_number = i + 1 })
    return { message: '已排序' }
  }
  if ((m = url.match(/^\/episodes\/(\d+)\/generation-settings$/)) && method === 'PATCH') {
    return clone(generationContract)
  }
  if ((m = url.match(/^\/storyboards\/(\d+)\/generation-settings\/overrides$/)) && method === 'DELETE') {
    return clone(generationContract)
  }
  if ((m = url.match(/^\/assets\/(\d+)$/))) {
    if (method === 'PUT' || method === 'PATCH') {
      const asset = store.assets.find((a) => Number(a.id) === Number(m[1]))
      if (!asset) return null
      Object.assign(asset, body || {})
      return clone(asset)
    }
    if (method === 'DELETE') {
      store.assets = store.assets.filter((a) => Number(a.id) !== Number(m[1]))
      return { message: '已删除' }
    }
  }
  return undefined
}

// 入口:返回业务数据(与原 request 拦截器的解包结果同形状);null=404,undefined=未实现
export function handleMock(method, rawUrl, data) {
  const [path, search = ''] = String(rawUrl || '').split('?')
  const query = Object.fromEntries(new URLSearchParams(search))
  const url = path.replace(/\/+$/, '') || '/'
  if (method === 'GET') {
    const fixed = GET[url]
    if (fixed) return fixed(query)
    const dyn = getDynamic(url, query)
    if (dyn !== undefined) return dyn
    return undefined
  }
  if (method === 'GET-OTHER') return undefined
  const written = handleWrite(method, url, data || {})
  if (written !== undefined) return written
  // 写操作未命中时兜底返回友好成功,保证演示主路径不被次要操作打断
  console.warn('[mock] 兜底成功:', method, url)
  return { message: 'ok (mock)' }
}
