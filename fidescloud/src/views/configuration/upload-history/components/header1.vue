<template>
  <div class="header1Component">
    <p class="title" style="marginBottom: 20px;">{{detail.file_name}}（File Name）</p>
    <el-row :gutter="20">
      <el-col :lg="6" :md="12" :sm="12" :xs="24">
        <span>Execution Status :&nbsp;</span><span :style="{color: detail.status === 4 ? '' : 'red'}">{{detail.status | filterStatus}}</span>
      </el-col>
      <el-col :lg="6" :md="12" :sm="12" :xs="24">
        <span>Total Errors :&nbsp;</span><span><span :style="{color: detail.failed_count > 0 ? 'red' : ''}">{{detail.failed_count}}</span>/{{detail.total_count}}</span>
      </el-col>
      <el-col :lg="6" :md="12" :sm="12" :xs="24">
        <span>Execution Start Time :&nbsp;</span><span>{{detail.process_start_time | formatDate(true, '/')}}</span>
      </el-col>
      <el-col :lg="6" :md="12" :sm="12" :xs="24">
        <span>Execution End Time :&nbsp;</span><span>{{detail.process_end_time | formatDate(true, '/')}}</span>
      </el-col>
    </el-row>
    <!-- second -->
    <el-row :gutter="20">
      <el-col :lg="6" :md="12" :sm="12" :xs="24">
        <span>File Import Name :&nbsp;</span><span>{{detail.file_import_pattern_name}}</span>
      </el-col>
      <el-col :lg="6" :md="12" :sm="12" :xs="24">
        <span>File Format :&nbsp;</span><span>{{detail.file_format}}</span>
      </el-col>
      <el-col :lg="6" :md="12" :sm="12" :xs="24">
        <span>Separator :&nbsp;</span><span>{{detail.field_separator}}</span>
      </el-col>
      <el-col :lg="6" :md="12" :sm="12" :xs="24">
        <span>Need File Header :&nbsp;</span><span>{{detail.has_header ? 'Need' : 'No Need'}}</span>
      </el-col>
    </el-row>
    <!-- third -->
    <el-row :gutter="20">
      <el-col :lg="6" :md="12" :sm="12" :xs="24">
        <span>File Encoder :&nbsp;</span><span>{{detail.file_encode}}</span>
      </el-col>
      <el-col :lg="6" :md="12" :sm="12" :xs="24">
        <span>File Name Pattern :&nbsp;</span><span>{{detail.file_name_regular_pattern}}</span>
      </el-col>
      <el-col :lg="6" :md="12" :sm="12" :xs="24">
        <span>File Source :&nbsp;</span><span>{{detail.file_source}}</span>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  props: {
    content: {
      type: Object
    }
  },
  data() {
    return {
      detail: {}
    }
  },
  watch: {
    content: {
      deep: true,
      immediate: true,
      handler(newV) {
        this.detail = newV
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.header1Component {
  font-size: 16px;
  color: rgba(16, 16, 16, 1);
  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
}
</style>
