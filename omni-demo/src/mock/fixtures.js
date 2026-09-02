// 演示数据:一个中文短剧项目「00:07 的电台」
// 图片为 public/ 下的本地占位图;演示视频使用 CC0 样片外链。

export const DEMO_VIDEOS = [
  'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
  'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
  'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
]

const now = Date.now()
const iso = (offsetMin = 0) => new Date(now - offsetMin * 60000).toISOString()

export const project = {
  id: 1,
  title: '00:07 的电台',
  description: '城市奇幻爱情短剧。插画师苏晚每晚 00:07 都会接到一通来自午夜电台的来电——来电人是三年前失踪的恋人。',
  genre: '都市奇幻',
  characters: [
    { id: 101, name: '苏晚', appearance: '22 岁城市插画师,米白毛衣,黑长直,眼角有一颗泪痣', image_url: '/char-1.svg' },
    { id: 102, name: '陆则', appearance: '28 岁深夜电台主播,深灰衬衫,骨节分明的手,常戴耳机', image_url: '/char-2.svg' },
    { id: 103, name: '老周', appearance: '50 岁便利店老板,围裙,念旧,总在擦一只旧怀表', image_url: '/char-3.svg' },
  ],
  scenes: [
    { id: 201, location: '深夜画室', time: '夜', description: '台灯下的画架,落地窗外是雨后的城市', image_url: '/scene-1.svg' },
    { id: 202, location: '午夜街道', time: '夜', description: '便利店灯箱在湿漉路面拖出长影', image_url: '/scene-2.svg' },
    { id: 203, location: '电台直播间', time: '夜', description: '红色 ON AIR 灯,调音台,消音棉墙', image_url: '/scene-3.svg' },
  ],
  props: [
    { id: 301, name: '旧怀表', description: '指针永远停在 00:07 的黄铜怀表', image_url: '/prop-1.svg' },
  ],
}

// 素材池:1=苏晚图 2=陆则图 3=画室 4=街道 5=怀表 6=演示视频
export const seedAssets = [
  { id: 1, name: '苏晚 · 形象图', reference_alias: '苏晚', type: 'image', url: '/char-1.svg', scope: 'project', drama_id: 1 },
  { id: 2, name: '陆则 · 形象图', reference_alias: '陆则', type: 'image', url: '/char-2.svg', scope: 'project', drama_id: 1 },
  { id: 3, name: '画室 · 气氛图', reference_alias: '画室', type: 'image', url: '/scene-1.svg', scope: 'project', drama_id: 1 },
  { id: 4, name: '午夜街道 · 气氛图', reference_alias: '街道', type: 'image', url: '/scene-2.svg', scope: 'project', drama_id: 1 },
  { id: 5, name: '旧怀表 · 特写', reference_alias: '怀表', type: 'image', url: '/prop-1.svg', scope: 'project', drama_id: 1 },
  { id: 6, name: '空镜 · 城市夜景', reference_alias: '空镜', type: 'video', url: DEMO_VIDEOS[0], scope: 'project', drama_id: 1, duration: 5 },
]

// 分镜:1-2 号已有成片,3-5 号待生成
export const seedStoryboards = [
  {
    id: 11, episode_id: 1, drama_id: 1, storyboard_number: 1,
    title: '开场 · 00:07 的来电',
    universal_segment_text: '深夜画室,台灯暖光。苏晚伏案画到一半,手机屏幕亮起,来电显示「00:07」。她犹豫两秒,接起,听筒里只有电流声和一个熟悉的声音说「晚晚,别挂」。',
    video_prompt: '中景推近,深夜画室,台灯暖光下的插画师,手机屏幕亮起特写,电影感,浅景深',
    duration: 8, video_model: 'doubao-seedance-2-0-260128', video_resolution: '720p',
    video_aspect_ratio: '9:16', video_url: DEMO_VIDEOS[1],
    omni_asset_ids: [1, 3], omni_asset_usage: { 1: 'reference', 3: 'reference' },
  },
  {
    id: 12, episode_id: 1, drama_id: 1, storyboard_number: 2,
    title: '便利店 · 老周的怀表',
    universal_segment_text: '午夜街道,便利店灯箱。苏晚攥着手机冲下楼,撞见老周在擦一只黄铜怀表。老周说:这块表三年前就停了,停在 00:07。苏晚瞳孔一缩。',
    video_prompt: '全景切特写,午夜便利店门口,灯箱冷光,老人手中黄铜怀表特写,指针停在 00:07',
    duration: 10, video_model: 'doubao-seedance-2-0-260128', video_resolution: '720p',
    video_aspect_ratio: '9:16', video_url: DEMO_VIDEOS[2],
    omni_asset_ids: [4, 5], omni_asset_usage: { 4: 'reference', 5: 'reference' },
  },
  {
    id: 13, episode_id: 1, drama_id: 1, storyboard_number: 3,
    title: '电台 · 回声',
    universal_segment_text: '电台直播间,ON AIR 红灯。陆则戴着耳机对着麦克风说话,声音和三年前一模一样。他说:这三年,我每天都想在 00:07 打给你。',
    video_prompt: '近景,电台直播间,红色 ON AIR 灯,主播侧脸,耳机,口型与字幕同步,暖冷对比光',
    duration: 8, video_model: '', video_resolution: '720p', video_aspect_ratio: '9:16',
    omni_asset_ids: [2], omni_asset_usage: { 2: 'reference' },
  },
  {
    id: 14, episode_id: 1, drama_id: 1, storyboard_number: 4,
    title: '抉择 · 挂断还是回应',
    universal_segment_text: '深夜画室。苏晚握着手机,眼泪掉在画纸上晕开颜料。画纸上正是陆则的脸。她深吸一口气,说:那你为什么不回来。',
    video_prompt: '特写,泪滴落在画作上晕开颜料,女主握手机的颤抖的手,情绪张力,缓慢推镜',
    duration: 8, video_model: '', video_resolution: '720p', video_aspect_ratio: '9:16',
    omni_asset_ids: [1, 3], omni_asset_usage: { 1: 'reference', 3: 'reference' },
  },
  {
    id: 15, episode_id: 1, drama_id: 1, storyboard_number: 5,
    title: '结尾 · 表针走动',
    universal_segment_text: '便利店门口。老周把怀表放进苏晚手心,表针忽然开始走动。全城灯光闪了一下。字幕:00:07,时间重新开始。',
    video_prompt: '超特写,黄铜怀表指针从 00:07 开始走动,背景城市灯光闪烁,奇幻感,升格',
    duration: 6, video_model: '', video_resolution: '720p', video_aspect_ratio: '9:16',
    omni_asset_ids: [5, 4], omni_asset_usage: { 5: 'reference', 4: 'reference' },
  },
]

export const capabilities = [
  {
    config_id: 1, model: 'doubao-seedance-2-0-260128', provider: 'volces', is_default: true, priority: 10,
    supports: { image_reference: true, video_reference: true, audio_reference: true },
    limits: { duration: { min: 4, max: 15, step: 1 }, image_reference: { max: 8 }, video_reference: { max: 3 }, audio_reference: { max: 3 }, total_reference: { max: 8 }, resolutions: ['480p', '720p', '1080p'] },
  },
  {
    config_id: 2, model: 'kling-video-o1', provider: 'kling', is_default: false, priority: 5,
    supports: { image_reference: true, video_reference: false, audio_reference: false },
    limits: { duration: { min: 5, max: 10, step: 5 }, image_reference: { max: 6 }, total_reference: { max: 6 }, resolutions: ['720p', '1080p'] },
  },
]

export const aiVideoConfigs = [
  { id: 1, service_type: 'video', provider: 'volces', name: '火山 · Seedance 2.0', model: ['doubao-seedance-2-0-260128'], default_model: 'doubao-seedance-2-0-260128', is_default: true, is_active: true, priority: 10 },
  { id: 2, service_type: 'video', provider: 'kling', name: '可灵 · Omni', model: ['kling-video-o1'], default_model: 'kling-video-o1', is_default: false, is_active: true, priority: 5 },
]

export const uploadLimits = {
  files: { image: { max_mb: 30 }, video: { max_mb: 50 }, audio: { max_mb: 15 } },
  shot: { total: 8 },
}

export const generationContract = {
  master_storyboard_id: 11,
  storyboards: [
    { id: 11, mode: 'master', effective: { video_model: 'doubao-seedance-2-0-260128', aspect_ratio: '9:16', duration: 8, resolution: '720p' } },
    { id: 12, mode: 'inherited', effective: { video_model: 'doubao-seedance-2-0-260128', aspect_ratio: '9:16', duration: 10, resolution: '720p' } },
    { id: 13, mode: 'inherited', effective: { video_model: 'doubao-seedance-2-0-260128', aspect_ratio: '9:16', duration: 8, resolution: '720p' } },
    { id: 14, mode: 'inherited', effective: { video_model: 'doubao-seedance-2-0-260128', aspect_ratio: '9:16', duration: 8, resolution: '720p' } },
    { id: 15, mode: 'inherited', effective: { video_model: 'doubao-seedance-2-0-260128', aspect_ratio: '9:16', duration: 6, resolution: '720p' } },
  ],
}

export const seedJobs = [
  {
    id: 'job-demo-2', status: 'completed', created_at: iso(90), completed_at: iso(85),
    storyboard_id: 12, prompt: '全景切特写,午夜便利店门口…',
    generation: { status: 'completed', duration: 10, video_url: DEMO_VIDEOS[2], completed_at: iso(85) },
  },
  {
    id: 'job-demo-1', status: 'completed', created_at: iso(120), completed_at: iso(112),
    storyboard_id: 11, prompt: '中景推近,深夜画室…',
    generation: { status: 'completed', duration: 8, video_url: DEMO_VIDEOS[1], completed_at: iso(112) },
  },
]

export const seedVideos = [
  { id: 901, storyboard_id: 11, status: 'completed', video_url: DEMO_VIDEOS[1], duration: 8, completed_at: iso(112) },
  { id: 902, storyboard_id: 12, status: 'completed', video_url: DEMO_VIDEOS[2], duration: 10, completed_at: iso(85) },
]

export const account = {
  balance: 1860.4,
  balance_display: '1860.40 积分',
}

export const billingQuote = (body) => {
  const duration = Number(body?.duration) || 8
  const resolution = body?.resolution || '720p'
  const perSecond = resolution === '1080p' ? 1.6 : resolution === '480p' ? 0.45 : 0.9
  return { amount: +(duration * perSecond).toFixed(2), currency: '积分(演示)', duration, resolution }
}
