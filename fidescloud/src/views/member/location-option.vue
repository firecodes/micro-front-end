<template>
  <div>
    <el-option
      v-for="(item, index) in list"
      :key="index + item.dictionary_code"
      :label="item.dictionary_name"
      :value="item.dictionary_code">
    </el-option>
    <div style="text-align: center">
      <!-- <i class="el-icon-loading"  v-if="list.length<total_count"></i>
      <span style="font-size:13px;" v-if="list.length>=total_count && page>1">{{handleGlobalI18n('system', 'after_loaded')}}</span> -->
      <span style="font-size:13px;" v-if="list.length>=total_count"></span>
      <i class="el-icon-loading"  v-else></i>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      list: {
        type: Array,
        default: []
      },
      total_count: {
        type: Number,
        default: 0
      }
    }
  }
</script>

