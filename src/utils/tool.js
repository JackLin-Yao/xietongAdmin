/**
 * 根据当前时间生成问候语
 */
export const getGreet = () => {
  const now = new Date()
  const hour = now.getHours()
  let greet = ''

  if (hour < 5) {
    greet = '深夜，注意你的身体!'
  } else if (hour < 9) {
    greet = '早上好，欢迎回来'
  } else if (hour < 12) {
    greet = '上午好，欢迎回来'
  } else if (hour < 14) {
    greet = '中午好，欢迎回来'
  } else if (hour < 18) {
    greet = '下午好，欢迎回来'
  } else if (hour < 24) {
    greet = '晚上好，欢迎回来'
  } else {
    greet = '今天真好，欢迎回来'
  }
  return greet
}


/**
 * window.localStorage 浏览器永久缓存
 * @method set 设置永久缓存
 * @method get 获取永久缓存
 * @method remove 移除永久缓存
 * @method clear 移除全部永久缓存
 */
export const Local = {
  // 设置永久缓存
  set(key, val) {
    window.localStorage.setItem(key, JSON.stringify(val))
  },
  // 获取永久缓存
  get(key) {
    const json = window.localStorage.getItem(key)
    return JSON.parse(json)
  },
  // 移除永久缓存
  remove(key) {
    window.localStorage.removeItem(key)
  },
  // 移除全部永久缓存
  clear() {
    window.localStorage.clear()
  },
}
