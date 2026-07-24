import { createI18n } from 'vue-i18n'
import zh from './locales/zh'
import en from './locales/en'

export type AppLocale = 'zh' | 'en'

const STORAGE_KEY = 'locale'

/** 检测初始语言:优先 localStorage,其次浏览器语言 */
function detectLocale(): AppLocale {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved === 'zh' || saved === 'en') return saved
  const nav = navigator.language?.toLowerCase() ?? ''
  return nav.startsWith('zh') ? 'zh' : 'en'
}

const i18n = createI18n({
  legacy: false,
  locale: detectLocale(),
  fallbackLocale: 'en',
  messages: { zh, en },
})

/** 切换语言并持久化 */
export function setLocale(lang: AppLocale) {
  i18n.global.locale.value = lang
  localStorage.setItem(STORAGE_KEY, lang)
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en'
  document.title = i18n.global.t('site.pageTitle')
}

// 初始同步 <html lang> 与标题
document.documentElement.lang = i18n.global.locale.value === 'zh' ? 'zh-CN' : 'en'
document.title = i18n.global.t('site.pageTitle')

export default i18n
