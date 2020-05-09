<template>
  <div class="select-country-province-city">
    <el-cascader
      clearable
      :props="handleProps()"
      ref="cascader"
      v-model="value"
      @change="handleChange"
      :placeholder="handleGlobalI18n('member', 'please_select')"
      style="width: 300px"
    ></el-cascader>
  </div>
</template>
<script>
import { getChildDictionaryList } from "@/api/dictionary";
import { mapGetters } from "vuex";
export default {
  props: {
    value1: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      show: false,
      value: []
    };
  },
  computed: {
    ...mapGetters(["language"])
  },
  methods: {
    handleChange() {
      this.$emit("handleSelectCity", this.value);
    },
    handleProps() {
      return {
        lazy: true,
        checkStrictly: true,
        lazyLoad(node, resolve) {
          var level = node.level;
          var parent_id = 0;
          var lang = sessionStorage.getItem("language");
          if (level > 0) {
            parent_id = node.data.parent_id;
          }
          getChildDictionaryList({
            asc: true,
            lang_type_code: lang,
            page_no: 1,
            page_size: 10000,
            parent_id: parent_id
          }).then(res => {
            var result = res.return_result.results;
            var arr = [];
            for (const item of result) {
              arr.push({
                parent_id: item.id,
                value: item.code,
                label: item.display_name,
                children: []
              });
            }
            resolve(arr);
          });
        }
      };
    }
  },
  watch: {
    language: {
      handler() {
        this.show = !this.show;
        this.handleProps();
      }
    },
    value1() {
      this.value = this.value1;
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss">
.el-cascader-menu {
  overflow: hidden;
}
.el-cascader-menu__wrap {
}
</style>
