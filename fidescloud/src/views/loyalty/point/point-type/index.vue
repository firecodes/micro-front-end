<template>
  <div class="point-type">
    <div v-loading="loading">
      <el-table :data="tableData" border :empty-text="$t('member.fc_table_no_data_label')">
        <!--standard point name-->
        <el-table-column :label="$t('loyalty.fc_loyalty_point_type_table_name_label')" align="center" prop="point_type_name" width="500">
          <template slot-scope="scope">
            {{scope.row.resources_key ? $t(`member.${scope.row.resources_key}`) : scope.row.point_type_name }}
          </template>
        </el-table-column>
        <!--created date-->
        <el-table-column :label="$t('loyalty.fc_loyalty_point_type_table_date_label')" align="center" prop="create_date" width="200">
          <template slot-scope="scope">
          {{globalData.formatDate((scope.row.create_date).substring(0,10)) || table_placeholder }}
          </template>
        </el-table-column>
        <!--description-->
        <el-table-column prop="description" align="center" :label="$t('loyalty.fc_loyalty_point_type_table_description_label')">
          <template slot-scope="scope">
            <ed-clamp :max-lines="1" autoresize>{{scope.row.description || table_placeholder }}</ed-clamp>
          </template>
        </el-table-column>
      </el-table>
      <pagination-container
        :page = "listQuery.page_no"
        :page_size = 'listQuery.page_size'
        :total = 'total'
        @handleCurrentChange = "handleCurrentChange"
        @handleSizeChange="handleSizeChange"
      />
    </div>
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-form :model="form" ref="form" :rules="rules" label-width="35%">
        <el-form-item :label="handleGlobalI18n('loyalty', 'point_type_name') + ''" prop="point_type_name">
          <el-input maxlength="32" v-model="form.point_type_name" />
        </el-form-item>
        <el-form-item :label="handleGlobalI18n('loyalty', 'point_type_code') + ':'" prop="point_type_code">
          <el-input :disabled="edit" maxlength="32" v-model="form.point_type_code" />
        </el-form-item>
        <el-form-item label="Default:" prop="default_type">
          <el-select v-model="form.default_type" clearable :placeholder="handleGlobalI18n('loyalty', 'please_select')">
            <el-option :value='parseInt(1)' label="Default type" />
            <el-option :value='parseInt(0)' label="Not default" />
          </el-select>
        </el-form-item>
        <el-form-item label="Description:" prop="description" >
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 6}"
            v-model="form.description">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" :loading="saveLoading" @click="save">Save</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    queryPointTypeList,
    addPointType,
    updatePointType,
    checkPointTypeCode
  } from '@/api/loyalty'
  import PaginationContainer from '@/components/PaginationContainer'
  export default {
    components: {
      PaginationContainer
    },
    data() {
      return {
        rules: {
          point_type_name: [
            { required: true, message: 'not empty', trigger: 'change' }
          ],
          point_type_code: [
            { required: true, message: 'not empty', trigger: 'change' },
            { validator: this.checkPointType, trigger: 'blur' }
          ],
          default_type: [
            { required: true, message: 'not empty', trigger: 'change' }
          ]
        },
        loading: false,
        saveLoading: false,
        dialogFormVisible: false,
        tableData: [],
        form: {},
        listQuery: {
          page_no: 1,
          page_size: 10
        },
        dialogTitle: 'Add new point type',
        total: 0,
        edit: false
      }
    },
    created() {
      this.getData()
    },
    methods: {
      clickModify() {
        this.$alert(this.handleGlobalI18n('loyalty', 'point_type_modify'), this.handleGlobalI18n('loyalty', 'attention'), {
          confirmButtonText: this.handleGlobalI18n('loyalty', 'confirm')
        })
      },
      handleEdit(key, val) {
        this.dialogFormVisible = !this.dialogFormVisible
        this.form = JSON.parse(JSON.stringify(val))
        this.edit = true
      },
      addPointType() {
        this.edit = false
        this.dialogFormVisible = !this.dialogFormVisible
        this.form = {}
      },
      getData() {
        this.getPointTypeList()
      },
      checkPointType(rule, value, callback) {
        if (this.form.point_type_code === '' || this.form.point_type_code === undefined) {
          callback()
          return false
        }
        checkPointTypeCode(this.form.point_type_code).then(res => {
          if (res.return_result.exist) {
            callback(new Error('point type code exsits'))
          } else {
            callback()
          }
        }).catch(res => {
          callback(new Error(res.return_message))
        })
      },
      getPointTypeList() {
        this.loading = true
        queryPointTypeList(this.listQuery).then(res => {
          this.total = res.return_result.total_count
          this.loading = false
          this.tableData = res.return_result.point_types || []
        }).catch(() => {
          this.loading = false
        })
      },
      handleCurrentChange(val) {
        this.listQuery.page_no = val
        this.getData()
      },
      handleSizeChange(val) {
        this.listQuery.page_size = val
        this.getData()
      },
      save() {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.saveLoading = true
            if (this.edit) {
              this.updatePointType1()
            } else {
              this.addPointType1()
            }
          }
        })
      },
      addPointType1() {
        addPointType(this.form).then(() => {
          this.saveLoading = false
          this.dialogFormVisible = false
          this.getPointTypeList()
          this.$message.success(this.$t('configuration.fc_operation_feedback_notification_label'))
        }).catch(() => {
          this.saveLoading = false
          this.dialogFormVisible = false
        })
      },
      updatePointType1() {
        updatePointType(this.form).then(() => {
          this.saveLoading = false
          this.dialogFormVisible = false
          this.getPointTypeList()
          this.$message.success(this.$t('configuration.fc_operation_feedback_notification_label'))
        }).catch(() => {
          this.saveLoading = false
          this.dialogFormVisible = false
        })
      }
    },
    watch: {
      edit() {
        if (this.edit) {
          this.dialogTitle = 'Update point type'
          this.rules.point_type_code = [
            { required: true, message: 'not empty', trigger: 'change' },
            { min: 1, max: 32, message: 'The point type code length is up to 32', trigger: 'blur' }
          ]
        } else {
          this.dialogTitle = 'Add new point type'
          this.rules.point_type_code = [
            { required: true, message: 'not empty', trigger: 'change' },
            { min: 1, max: 32, message: 'The point type code length is up to 32', trigger: 'blur' },
            { validator: this.checkPointType, trigger: 'blur' }
          ]
        }
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .point-type {
    margin-top: 20px;
    .click-button {
      padding:5px;
      width: 100%;
      background-color: #ffffff;
      .add {
        margin-left: 20px;
      }
    }
    .el-input,.el-select,.el-textarea{
      width:300px;
    }
    .el-table{
      margin-top:20px;
    }
    .contain {
      padding:30px 0;
      margin-top: 30px;
      background-color: #ffffff;
      position: relative;
      &:before {
        content: '';
        position: absolute;
        top: -4px;
        left: 0;
        width: 100%;
        height: 3px;
        background-color: rgba(51, 51, 51, 0.1);
      }
      .label{
        position: relative;
        left:-10px;
        color:red;
      }
    }
    p{
      line-height: 4;
    }
  }
</style>
