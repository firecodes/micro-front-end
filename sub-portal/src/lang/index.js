import Vue from "vue";
import VueI18n from "vue-i18n";
import locale from "element-ui/lib/locale";
import elementEnLocale from "element-ui/lib/locale/lang/en";
import elementZhLocale from "element-ui/lib/locale/lang/zh-CN";
import elementJALocale from "element-ui/lib/locale/lang/ja";
// import customEnLocal from './custom/en'
// import customJaLocal from './custom/ja'
// import customZhLocal from './custom/zh'
import { post } from "./custom";
Vue.use(VueI18n);
const messages = {
  lang_en: {
    ...elementEnLocale,
    ...post.customEnLocal
  },
  lang_zh: {
    ...elementZhLocale,
    ...post.customZhLocal
  },
  lang_ja: {
    ...elementJALocale,
    ...post.customJaLocal
  }
};
// 设置能是中文的白名单
// '172.31.212.51:9528'
var cn_list = [];
var host = window.location.host;
var _this = this;
const i18n = new VueI18n({
  locale:
    sessionStorage.getItem("language") ||
    (cn_list.indexOf(host) > -1 ? "lang_zh" : "lang_en"),
  fallbackLocale: "lang_en",
  messages,
  silentTranslationWarn: true, // 没有的key值不发出警告
  missing(lang, value) {
    // 没有key值时应如何处理
    return value.split(".")[1] || _this.table_placeholder;
  }
});
locale.i18n((key, value) => i18n.t(key, value));
export default i18n;
