<template>
  <el-select
    clearable
    v-model="store"
    :disabled="disabled"
    :placeholder="handleGlobalI18n('system', 'please_select')"
    filterable
    style="width:100%"
    @change = "change"
  >
    <el-option
      v-for="(item,index) in list"
      :label="item.store_name"
      :key="index + item.store_name"
      :value="index">
    </el-option>
  </el-select>
</template>
<script>
  export default{
    props: {
      value: {
        type: String | Number,
        default: ''
      },
      list: {
        type: Array,
        default: []
      },
      disabled: {
        type: Boolean,
        default: false
      },
      type: {
        type: String,
        default: ''
      }
    },
    watch: {
      value() {
        this.store = this.value
      }
    },
    data() {
      return {
        store: ''
      }
    },
    methods: {
      change() {
        this.$emit('registration_name', { value: this.list[parseInt(this.store)], id: parseInt(this.store), type: 'registration_name' })
      }
    }
  }
</script>
