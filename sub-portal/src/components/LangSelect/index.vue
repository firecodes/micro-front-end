<template>
  <el-dropdown
    trigger="hover"
    class="international"
    @command="handleSetLanguage"
  >
    <div class="name">
      {{ $t("homepage.fc_account_menu_second_label") }}
    </div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item
        v-for="(item, index) in list"
        :command="item.cfg_key"
        :key="index"
        :disabled="language === item.cfg_key"
        >{{ item.cfg_value }}</el-dropdown-item
      >
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
export default {
  data() {
    return {
      list: []
    };
  },
  computed: {
    language() {
      return this.language;
    },
    ...mapGetters(["business_data", "global_data", "language"])
  },
  created() {
    // 获取显示的语言列表
    // this.$i18n.locale = this.language
    const has = Object.prototype.hasOwnProperty;
    const global_data = this.global_data;
    if (has.call(global_data, "language")) {
      if (!has.call(global_data.language, "optional")) {
        this.list = global_data.language.optional;
      } else {
        this.list = [
          {
            cfg_key: "lang_en",
            cfg_value: "English"
          },
          {
            cfg_key: "lang_zh",
            cfg_value: "中文"
          },
          {
            cfg_key: "lang_ja",
            cfg_value: "日本語"
          }
        ];
      }
    }
  },
  methods: {
    ...mapActions({
      storeGetConfiguration: "getConfiguration"
    }),
    ...mapMutations({
      setLanguage: "SET_LANGUAGE"
    }),
    async handleSetLanguage(lang) {
      // 获取到配置的语言
      // 调用获取语言
      // const obj = {
      //   'app_id': 3,
      //   'config_type': {
      //     'language_key': lang,
      //     'group_type': '1'
      //   }
      // }
      // await this.storeGetConfiguration(obj)
      this.setLanguage(lang);
      this.$i18n.locale = lang;
      // this.$message({
      //   message: 'switch language success',
      //   type: 'success'
      // })
    }
  }
};
</script>

<style scoped rel="stylesheet/scss" lang="scss">
.international-icon {
  font-size: 20px;
  cursor: pointer;
  vertical-align: -5px !important;
}
.name {
  font-size: 13px;
}
</style>
