// translate router.meta.title, be used in breadcrumb sidebar tagsview
export function generateTitle(title, key1, key2) {
  const hasKey = this.$te("login." + title);
  const translatedTitle = this.$t("login." + title); // $t :this method from vue-i18n, inject in @/lang/index.js

  if (hasKey) {
    return translatedTitle;
  }
  return this.handleGlobalI18n(key1, key2);
}
