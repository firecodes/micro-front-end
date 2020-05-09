<template>
      <el-select
        clearable
        v-model="store"
        :disabled="disabled"
        :placeholder="$t('member.fc_member_recruitment_registration_store_input_label')"
        filterable
        style="width:100%"
        @change = "change"
      >
        <el-option
          v-for="(item,index) in list"
          :label="item.store_name"
          :key="index+ item.store_name"
          :value="item.store_code">
        </el-option>
        <div style="text-align: center" >
          <span style="font-size:13px;" v-if="list.length>=total_count"></span>
          <i class="el-icon-loading"  v-else></i>
        </div>
      </el-select>
</template>
<script>
  export default{
    props: {
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
      },
      value: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        store: '',
        total_count: 0,
        page: 0
      }
    },
    methods: {
      change() {
        this.$emit(this.type, { value: this.store, type: this.type })
      }
    },
    watch: {
      value() {
        this.store = this.value
      }
    }
  }
</script>
<style scoped lang="scss" rel="stylesheet/scss"></style>
