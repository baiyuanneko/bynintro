import { reactive } from 'vue'

export interface A11ySettings {
  reduceMotion: boolean   // 减少动画效果
  highContrast: boolean   // 提高背景对比度
  forceWhiteBg: boolean   // 强制使用白色背景
}

const STORAGE_KEY = 'a11y-settings'

const DEFAULTS: A11ySettings = {
  reduceMotion: false,
  highContrast: false,
  forceWhiteBg: false,
}

/** 检测初始设置:读取 localStorage,缺失字段回退默认值 */
function detectSettings(): A11ySettings {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return { ...DEFAULTS }
    const parsed = JSON.parse(saved)
    return {
      reduceMotion: !!parsed.reduceMotion,
      highContrast: !!parsed.highContrast,
      forceWhiteBg: !!parsed.forceWhiteBg,
    }
  } catch {
    return { ...DEFAULTS }
  }
}

export const a11y = reactive<A11ySettings>(detectSettings())

type A11yKey = keyof A11ySettings

/** 更新单项设置并持久化 */
export function updateA11y(key: A11yKey, value: boolean) {
  a11y[key] = value
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...a11y }))
  } catch {
    /* localStorage 不可用时静默降级 */
  }
}
