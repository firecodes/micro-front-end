<template>
  <div class="point-account-type">
    <div class="click-button">
      <el-button type="primary" class="add" @click="dialogFormVisible = !dialogFormVisible">add</el-button>
    </div>
    <el-table :data="tableData" border :empty-text="$t('member.fc_table_no_data_label')">
      <el-table-column align="center" label='Name' prop="name" />
      <el-table-column align="center" label='Code' prop="code" />
      <el-table-column align="center" label='Created' prop="create_date" />
      <el-table-column align="center" label="Description" prop="description" />
    </el-table>
    <pagination-container
      :page = "listQuery.page_no"
      :page_size = 'listQuery.page_size'
      :total = 'total'
      @handleCurrentChange = "handleCurrentChange"
      @handleSizeChange="handleSizeChange"
    />
    <el-dialog title="Add new point account type" :visible.sync="dialogFormVisible">
      <el-form :model="form" ref="form" :rules="rules" label-width="35%">
        <el-form-item label="Point type name:" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="Point type code:" prop="code">
          <el-input v-model="form.code" />
        </el-form-item>
        <el-form-item label="Default:" prop="is_default">
          <el-select v-model="form.is_default" clearable>
            <el-option label="default_type" value='1' />
            <el-option label="not default" value='0' />
          </el-select>
        </el-form-item>
        <el-form-item label="Description:" >
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 6}"
            v-model="form.descripition">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Back</el-button>
        <el-button type="primary" :loading="saveLoading" @click="save">Save</el-button>
      </div>
    </el-dialog>
    <loading v-show="mixLoadingState" />
  </div>
</template>

<script>
  import {
    addOrUpdateAccountType,
    checkAccountTypeCode,
    queryAccountTypeList
  } from '@/api/loyalty'
  import PaginationContainer from '@/components/PaginationContainer'
  import {
    parse2Date
  } from '@/utils'
  import {
    mixLoading
  } from '@/utils/util'
  export default {
    mixins: [mixLoading],
    components: {
      PaginationContainer
    },
    data() {
      return {
        rules: {
          name: [
            { required: true, message: '请输入名称', trigger: 'change' },
            { min: 1, max: 32, message: '长度在 1 到 32 个字符', trigger: 'blur' }
          ],
          code: [
            { required: true, message: '请输入code', trigger: 'change' },
            { min: 1, max: 32, message: '长度在 1 到 32 个字符', trigger: 'blur' },
            { validator: this.checkAccountType, trigger: 'blur' }
          ],
          is_default: [
            { required: true, message: '请选择', trigger: 'change' }
          ]
        },
        saveLoading: false,
        dialogFormVisible: false,
        tableData: [],
        form: {
          name: '',
          code: '',
          is_default: '',
          description: ''
        },
        listQuery: {
          page_no: 1,
          page_size: 10
        },
        total: 0
      }
    },
    created() {
      this.getData()
    },
    methods: {
      getData() {
        this.getAccountTypeList()
      },
      checkAccountType(rule, value, callback) {
        checkAccountTypeCode(this.form.code).then(res => {
          callback()
        }).catch(res => {
          callback(new Error(res.return_message))
        })
      },
      getAccountTypeList() {
        this.handleMixLoadingStateTrue()
        queryAccountTypeList(this.listQuery).then(res => {
          this.handleMixLoadingStateFalse()
          this.total = res.return_result.total_count
          this.tableData = res.return_result.account_types
        }).catch(res => {
          console.log(res.return_message)
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
            addOrUpdateAccountType(Object.assign({}, this.form, { create_date: parse2Date(), is_default: parseInt(this.form.is_default) })).then(res => {
              this.saveLoading = false
              this.dialogFormVisible = false
            }).catch(res => {
              console.log(res.return_message)
            })
          }
        })
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .point-account-type {
    margin-top: 30px;
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
