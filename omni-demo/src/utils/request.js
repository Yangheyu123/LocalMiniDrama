// 演示版请求层:接口与主项目 axios 封装完全同形(get/post/put/patch/delete,
// 响应解包为业务数据),实现替换为本地 mock,页面零改动。
import { ElMessage } from 'element-plus'
import { handleMock } from '@/mock/handlers'

const delay = () => new Promise((resolve) => setTimeout(resolve, 180 + Math.random() * 220))

async function call(method, url, data) {
  await delay()
  const result = handleMock(method, url, data)
  if (result === undefined) {
    const error = new Error('演示数据未覆盖该接口: ' + method + ' ' + url)
    console.warn('[mock] 未命中', method, url)
    ElMessage.warning(error.message)
    return Promise.reject(error)
  }
  if (result === null) {
    const error = new Error('资源不存在(演示)')
    return Promise.reject(error)
  }
  return result
}

export default {
  get: (url, config) => call('GET', urlWithParams(url, config), undefined),
  post: (url, data) => call('POST', url, data),
  put: (url, data) => call('PUT', url, data),
  patch: (url, data) => call('PATCH', url, data),
  delete: (url) => call('DELETE', url, undefined),
}

function urlWithParams(url, config) {
  const params = config?.params
  if (!params) return url
  const search = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) search.append(key, value)
  })
  const qs = search.toString()
  return qs ? url + '?' + qs : url
}
