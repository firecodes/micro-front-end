<template>
  <el-select
    :placeholder="handleGlobalI18n('campaign', 'please_select')"
    filterable
    multiple
    ref="dialog_select"
    style="width:300px;"
    v-model="select_value"
  >
    <el-option
      :key="index"
      :label="item.tag_name"
      :value="item.tag_id"
      v-for="(item,index) in list2">
    </el-option>
  </el-select>
</template>
<script>
  export default{
    props: {
      list2: {
        type: Array
      },
      value: {
        type: Array,
        default: []
      },
      show_state: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        select_value: [],
        list: []
      }
    },
    methods: {
      change() {
        return this.select_value
      }
    },
    watch: {
      'show_state': {
        handler() {
          if (this.show_state) {
            console.log(this.list2, this.value)
            this.select_value = []
            for (var item of this.list2) {
              if (this.value.indexOf(item.tag_id) > -1) {
                this.select_value.push(item.tag_id)
              }
            }
          }
        },
        immediate: true
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped></style>

