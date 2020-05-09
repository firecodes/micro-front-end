<!--postal code 邮政编码-->
<template>
  <el-select
    v-model="postal_code"
    filterable
    multiple
    style="width:300px;"
    @change = "change"
    :placeholder="handleGlobalI18n('campaign', 'please_select')"
  >
    <el-option
      v-for="(item,index) in list"
      :key="index"
      :label="item.name"
      :value="index">
    </el-option>
  </el-select>
</template>
<script>
  export default{
    props: {
      disabled: {
        type: Boolean,
        default: false
      },
      type: {
        type: String,
        default: ''
      },
      value: {
        type: Array,
        default: ''
      }
    },
    data() {
      return {
        postal_code: '',
        list: []
      }
    },
    created() {
      var value = ''
      for (var i = 1; i <= 80; i++) {
        value = i < 10 ? '0' + i : i.toString()
        this.list.push({
          value: value,
          name: value
        })
      }
    },
    methods: {
      change() {
        const arr = []
        const length = this.postal_code.length
        for (let i = 0; i < length; i++) {
          arr.push(this.list[this.postal_code[i]])
        }
        this.$emit('postal_code', { value: arr, type: 'postal_code', index: this.postal_code })
      }
    },
    watch: {
      value() {
        this.postal_code = this.value
      }
    }
  }
</script>
<style scoped lang="scss" rel="stylesheet/scss"></style>

