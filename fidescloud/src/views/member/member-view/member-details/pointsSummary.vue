<template>
  <div class="pointsSummary">
    <ed-header-title :title="handleGlobalI18n('member', 'points_summary')" />
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="180px" class="demo-ruleForm">
      <el-row>
        <el-col :lg='12' :xl='8'>
          <el-form-item :label="handleGlobalI18n('member', 'total_earned_points')" prop="totalEarnPoints">
            <el-input v-model="ruleForm.totalEarnPoints"></el-input>
          </el-form-item>
        </el-col>
        <el-col :lg="12" :xl="8">
          <el-form-item :label="handleGlobalI18n('member', 'total_available_points')" prop="totalAvailablePoints">
            <el-input v-model="ruleForm.totalAvailablePoints"></el-input>
          </el-form-item>
        </el-col>
        <el-col :lg="12" :xl="8">
          <el-form-item :label="handleGlobalI18n('member', 'total_expiring_points')" prop="totalExpiringPoints">
            <el-input v-model="ruleForm.totalExpiringPoints"></el-input>
          </el-form-item>
        </el-col>
        <el-col :lg="12" :xl="8">
          <el-form-item :label="handleGlobalI18n('member', 'total_used_points')" prop="totalUsedPoints">
            <el-input v-model="ruleForm.totalUsedPoints"></el-input>
          </el-form-item>
        </el-col>
        <el-col :lg="12" :xl="8">
          <el-form-item :label="handleGlobalI18n('member', 'total_expired_points')" prop="totalExpiredPoints">
            <el-input v-model="ruleForm.totalExpiredPoints"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ruleForm: {
        totalEarnPoints: '',
        totalAvailablePoints: '',
        totalExpiringPoints: '',
        totalUsedPoints: '',
        totalExpiredPoints: ''
      }
    }
  },
  methods: {
  }
}
</script>

<style lang='scss' scoped>
.pointsSummary {
  margin-top: 20px
}
</style>
