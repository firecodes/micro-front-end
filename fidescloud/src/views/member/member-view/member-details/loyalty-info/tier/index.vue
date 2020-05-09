<template>
  <div class="tier" v-loading="loading">
    <div class="action_module" v-allow="'member_view_adjust_tier'">
      <div class="cancel_button">
        <!--adjust tier-->
        <el-button type="primary" @click="showUpdateTier" >{{$t('member.fc_member_details_loyalty_tier_btn_adjust_label')}}</el-button>
      </div>
    </div>
    <el-table :data="tableData" border :empty-text="$t('member.fc_table_no_data_label')">
      <!--tier-->
      <el-table-column prop="to_member_tier_name" align="center" :label="$t('member.fc_member_details_loyalty_tier_table_tier_label')"></el-table-column>
      <!--Issue date-->
       <el-table-column prop="update_date" align="center" :label="$t('member.fc_member_details_loyalty_tier_table_issue_label')">
          <template slot-scope="scope">
            {{ scope.row.update_date ? globalData.formatDate((scope.row.update_date).substring(0, 10)) : table_placeholder }}
          </template>
        </el-table-column>
      <!--Effective date-->
      <el-table-column prop="effective_from_date" align="center" :label="$t('member.fc_member_details_loyalty_tier_table_effective_label')">
        <template slot-scope="scope">
          {{ scope.row.effective_from_date ? globalData.formatDate((scope.row.effective_from_date).substring(0, 10)) : table_placeholder }}
        </template>
      </el-table-column>
      <!--Expiry date-->
      <el-table-column prop="effective_to_date" align="center" :label="$t('member.fc_member_details_loyalty_tier_table_expiry_label')">
        <template slot-scope="scope">
          {{ scope.row.effective_to_date ? globalData.formatDate((scope.row.effective_to_date).substring(0, 10)) : table_placeholder }}
        </template>
      </el-table-column>
      <!--Comments-->
      <el-table-column prop="remarks" align="center" :label="$t('member.fc_member_details_loyalty_tier_table_comments_label')">
        <template slot-scope="scope">
          {{ scope.row.remarks ? scope.row.remarks : table_placeholder }}
        </template>
      </el-table-column>
    </el-table>
    <pagination-container
      :page = "listQuery.page_no"
      :page_size = 'listQuery.page_size'
      :total = 'total'
      @handleCurrentChange = "handleCurrentChange"
      @handleSizeChange="handleSizeChange"
    ></pagination-container>
    <el-dialog :title="$t('member.fc_member_details_loyalty_tier_adjust_title')" :visible.sync="dialogFormVisible" width="540px">
      <el-form label-width="140px" ref="addGift">
        <!--Select Tier-->
        <el-form-item :label="$t('member.fc_member_details_loyalty_tier_adjust_select_label')" :placeholder="$t('member.fc_member_details_loyalty_tier_adjust_select_input_label')" class="update-member-tier-item" prop="tier">
          <span class="requred">*</span>
          <el-select v-model="tier" >
             <el-option
              v-for="(item,index) in tierList"
              :key="index"
              :label="item.member_tier_name"
              :value="item.member_tier_code">
            </el-option>
          </el-select>
        </el-form-item>
      <!--Remarks-->
        <el-form-item :label="$t('member.fc_member_details_loyalty_tier_adjust_remarks_label\t')">
          <el-input v-model="remarks" type="textarea" :rows="3"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{$t('member.fc_member_details_loyalty_tier_adjust_btn_cancel_label')}}</el-button>
        <el-button type="primary" :loading="updateLoading" @click="updateTier">{{$t('member.fc_member_details_loyalty_tier_adjust_btn_confirm_label')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { getMemberTierList, updateMemberTier, queryMemberTierList } from '@/api/member'
  import PaginationContainer from '@/components/PaginationContainer'
  import { DateTime } from 'luxon'
  import {
    pageLimit
  } from '@/api/api'
  import {
    loyaltyInfoMixins
  } from '@/utils/util'
  export default {
    mixins: [loyaltyInfoMixins],
    components: {
      PaginationContainer
    },
    data() {
      return {
        tableData: [],
        listQuery: {
          page_size: pageLimit
        },
        loading: true,
        dialogFormVisible: false,
        remarks: '',
        tier: '',
        currentTier: '',
        updateLoading: false,
        updateEnable: true,
        tierList: []
      }
    },
    created() {
      this.init()
    },
    methods: {
      async init() {
        try {
          this.loading = true
          await this.getTierList()
          await this.getTierTypeList()
        } catch (e) {
          this.loading = false
        }
      },
      getTierTypeList() {
        return queryMemberTierList({}).then(res => {
          var list = res.return_result.tiers
          for (var item of list) {
            if (item.status === 1) {
              this.tierList.push(item)
            }
          }
          const currentTier = this.currentTier
          const filterIndex = this.tierList.findIndex(item => {
            return item.member_tier_code === currentTier
          })
          if (filterIndex >= 0) {
            this.tierList.splice(filterIndex, 1)
          }
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      },
      getTierList() {
        return getMemberTierList({ member_code: this.member_code, ...this.listQuery }).then((res) => {
          this.tableData = res.return_result.member_tier_histories
          if (this.tableData !== null && this.tableData.length > 0) {
            this.currentTier = this.tableData[0].to_member_tier_code
            // this.updateEnable = true
          } else {
            // this.updateEnable = false
          }
          this.total = res.return_result.total_count
        }).catch(() => {
          this.$message.error('get member tier list fail')
          this.loading = false
        })
      },
      handleSizeChange(val) {
        this.listQuery.page_size = val
        this.getTierList()
      },
      handleCurrentChange(val) {
        this.listQuery.page_no = val
        this.getTierList()
      },
      showUpdateTier() {
        this.remarks = ''
        this.tier = ''
        this.dialogFormVisible = true
      },
      updateTier() {
        if (this.tier === '' || this.remarks === '') {
          this.$notify({
            title: 'Warning',
            message: 'Member Tier or Remarks is required',
            type: 'warning'
          })
          return
        }
        this.updateLoading = true
        updateMemberTier({
          member_code: this.member_code,
          member_tier_code: this.tier,
          remarks: this.remarks,
          current_time: DateTime.local().toISO()
        }).then(res => {
          this.updateLoading = false
          this.dialogFormVisible = false
          this.getTierList()
          this.$message({
            message: 'Success',
            type: 'success'
          })
        }).catch(() => {
          this.updateLoading = false
          this.dialogFormVisible = false
        })
      }
    }
  }
</script>

<style scoped rel="stylesheet/scss" lang="scss">
  .tier {
    margin-top: 20px;
  }
  .action_module{
    margin-top:20px;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    margin-bottom: 20px;
    padding: 15px 25px 15px;
    background-color: #f9f9f9;
    .cancel_button{
      display: flex;
    }
  }
  .update-member-tier-item {
    position: relative;
    span.requred {
      color: #f56c6c;
      position: absolute;
      left: -85px;
      top: 0px;
    }
  }
</style>
