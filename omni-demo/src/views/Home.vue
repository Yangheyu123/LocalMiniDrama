<template>
  <main class="home">
    <h1>全能创作工作台 · 独立演示</h1>
    <p class="tip">此页为 PR1 的 mock 层自检页;PR2 接入真实工作台组件后,根路径将直接进入工作台。</p>
    <section v-if="checked">
      <p>分镜数:{{ storyboards.length }} · 素材数:{{ assets.length }} · 模型数:{{ capabilities.length }}</p>
      <ul>
        <li v-for="sb in storyboards" :key="sb.id">#{{ sb.storyboard_number }} {{ sb.title }}({{ sb.duration }}s)</li>
      </ul>
    </section>
  </main>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { dramaAPI } from '@/api/drama'
import { omniVideoAPI } from '@/api/omniVideo'

const storyboards = ref([])
const assets = ref([])
const capabilities = ref([])
const checked = ref(false)

onMounted(async () => {
  const [boards, media, caps] = await Promise.all([
    dramaAPI.getStoryboards(1),
    omniVideoAPI.assets({ page: 1, page_size: 100 }),
    omniVideoAPI.capabilities(),
  ])
  storyboards.value = boards?.storyboards || []
  assets.value = media?.items || []
  capabilities.value = caps || []
  checked.value = true
})
</script>

<style scoped>
.home { max-width: 720px; margin: 60px auto; padding: 0 24px; font-family: sans-serif; }
.tip { color: #888; }
</style>
