<template>
  <div class="r-EmployeeWrapper">
    <el-form v-loading="loading" :model="addForm" :validate-on-rule-change	="false" :rules="addFormRules" status-icon label-width="122px" style="width: 555px;" class="addForm" ref="addForm">
      <el-form-item :label="handleGlobalI18n('employee', 'mgt_empl_add_last_label')" prop="last_name">
        <el-input type="text" v-model="addForm.last_name" maxlength="25" auto-complete="off" clearable :placeholder="handleGlobalI18n('employee', 'mgt_empl_add_last_input_label')"></el-input>
      </el-form-item>
      <el-form-item :label="handleGlobalI18n('employee', 'mgt_empl_add_first_label')" prop="first_name">
        <el-input type="text" v-model="addForm.first_name" maxlength="25" clearable :placeholder="handleGlobalI18n('employee', 'mgt_empl_add_first_input_label')"></el-input>
      </el-form-item>
      <el-form-item :label="handleGlobalI18n('employee', 'mgt_empl_add_gender_label')" prop="gender" clearable>
        <el-select v-model="addForm.gender" value-key="id" @change="selectGender" style="width: 250px;" :placeholder="handleGlobalI18n('employee', 'mgt_empl_add_gender_input_label')">
          <el-option v-for="item in genderArr" :key='item.value' :label="handleGlobalI18n('system', item.label)" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="handleGlobalI18n('employee', 'mgt_empl_add_position_label')" prop="position">
        <el-select value-key="id" @change="clickTypeList" v-model="addForm.position" clearable :placeholder="handleGlobalI18n('employee', 'mgt_empl_add_position_list_label')" style="width: 250px; margin-right: 10px;">
          <el-option v-for="(item) in typeList" :key="item.id" :value="item.id" :label="item.name"></el-option>
        </el-select>
        <el-button type="primary" class="add-type" @click="addPositionDialog = true">{{ handleGlobalI18n('employee', 'mgt_empl_add_position_add_label') }}</el-button>
      </el-form-item>
      <!-- store -->
      <el-form-item :label="handleGlobalI18n('employee', 'mgt_empl_add_store_label')" prop="store">
        <el-select filterable v-selectLoadmore="selectLoadmore" value-key="id" v-model="addForm.store" clearable :placeholder="handleGlobalI18n('employee', 'mgt_empl_add_store_list_label')" style="width: 250px; margin-right: 10px;">
          <el-option v-for="(item) in storeLists" :key="item.id" :value="item.id" :label="item.store_name"></el-option>
          <div style="text-align: center" >
            <span style="font-size:13px;" v-if="storeLists.length>=total_count"></span>
            <i class="el-icon-loading"  v-else></i>
          </div>
        </el-select>
      </el-form-item>
      <el-form-item :required="required" :label="handleGlobalI18n('employee', 'mgt_empl_add_mobile_label')">
        <div style="display: flex">
          <el-form-item prop="phonePrefix" style="width: 130px;">
            <el-select  v-model="addForm.phonePrefix" >
              <el-option v-for="item in phonePrefixList" :key="item.regionCode" :label="item.displayValue" :value="item.displayValue"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="mobile" style="width: 300px;">
            <el-input type="text" v-model="addForm.mobile" maxlength="11" :placeholder="handleGlobalI18n('employee', 'mgt_empl_add_mobile_input_label')"></el-input>
          </el-form-item>
        </div>
      </el-form-item>
      <el-form-item :label="handleGlobalI18n('employee', 'mgt_empl_add_email_label')" prop="email">
        <el-input type="text" v-model="addForm.email" maxlength="32" clearable :placeholder="handleGlobalI18n('employee', 'mgt_empl_add_email_input_label')"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('addForm')" :loading="btnLoading">{{ handleGlobalI18n('employee', 'mgt_operation_btn_save_label') }}</el-button>
        <el-button @click="$router.go(-1)">{{ handleGlobalI18n('employee', 'mgt_operation_btn_cancel_label') }}</el-button>
      </el-form-item>
    </el-form>
    <!-- Features accessibility: -->
    <el-form :model="ruleFormFeatures" :rules="ruleFormFeatures" ref="ruleFormFeatures" style="width: 300px;display:none;" label-width="100px" class="ruleFormFeatures">
      <el-form-item prop="type">
        <p class="color-33 font-bold">Features accessibility:</p>
        <el-checkbox-group v-model="ruleFormFeatures.type">
          <el-checkbox label="Homepage" name="type" class="check_tit"></el-checkbox>
          <el-checkbox label="Member" name="type" class="check_tit"></el-checkbox>
          <el-checkbox label="Dashboard" name="type" class="check_con"></el-checkbox>
          <el-checkbox label="Loyalty" name="type" class="check_tit"></el-checkbox>
          <el-checkbox label="Point" name="type" class="check_con"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <!-- add position -->
    <el-dialog
      :title="handleGlobalI18n('employee', 'mgt_empl_position_page_title')"
      :visible.sync="addPositionDialog"
      :before-close="handleCloseAddPosition">
      <el-table :data="addPositionList" border>
        <el-table-column :label="handleGlobalI18n('employee', 'mgt_empl_position_table_position_label')" prop="name">
          <template slot-scope="scope">
            <template v-if="scope.row.edit">
              <div class="edit-input-box">
                <el-input class="edit-input" maxlength="30" v-model="scope.row.name"></el-input>
                <el-button class='cancel-btn' icon="el-icon-refresh" type="warning" @click="cancelEdit(scope.row)">{{ handleGlobalI18n('employee', 'mgt_empl_position_btn_cancel_label') }}</el-button>
              </div>
            </template>
            <el-tooltip :content="handleGlobalI18n('employee', 'mgt_empl_position_default_manager_desc_label')" v-if="!scope.row.edit && !scope.row.delete">
              <span>{{scope.row.name}}</span>
            </el-tooltip>
            <!-- <span v-if="!scope.row.delete">{{scope.row.name}}</span> -->
            <span v-if="!scope.row.edit && scope.row.delete">{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="handleGlobalI18n('employee', 'mgt_empl_position_table_operation_label')"  width="250px">
          <template slot-scope="scope">
            <el-button v-if="scope.row.edit" type="success" @click="confirmEdit(scope.row)" icon="el-icon-circle-check-outline">{{ handleGlobalI18n('employee', 'mgt_empl_position_btn_ok_label') }}</el-button>
            <el-button v-else type="primary" icon="el-icon-edit" @click='clickEdit(scope.row)'>{{ handleGlobalI18n('employee', 'mgt_empl_position_btn_edit_label') }}</el-button>
            <el-button type="danger" v-if="!scope.row.delete" icon="el-icon-delete" @click="deleteType(scope.row.id)">{{ handleGlobalI18n('employee', 'mgt_empl_position_btn_delete_label') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addPositionDialog = false">{{ handleGlobalI18n('system', 'close') }}</el-button>
        <el-button type="primary" @click="addType">{{ handleGlobalI18n('system', 'add_new') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { employeeDetail, queryEmployeeRole, setEmployeeRoleActive, updateEmployeeRole, insertEmployeeRole, insertEmployee, updateEmployee } from '@/api/employ'
  import { Message } from 'element-ui'
  import { countryPhonePrefix } from '@/api/common'
  import { storeList } from '@/api/store'
  export default {
    data() {
      const validatorName = (rule, value, callback) => {
        if (value) {
          callback()
        } else {
          return callback(new Error(' '))
        }
      }
      return {
        loading: false,
        btnLoading: false,
        typeList: [],
        required: true,
        phonePrefixList: [],
        total_count: 0,
        // features
        ruleFormFeatures: {
          type: []
        },
        genderArr: [
          { value: 1, label: 'male' },
          { value: 2, label: 'female' },
          { value: 0, label: 'unknown' }
        ],
        // add position
        addPositionDialog: false,
        addPositionList: [],
        positionId: null,
        addForm: {
          phonePrefix: '',
          first_name: '',
          last_name: '',
          gender: null,
          mobile: '',
          email: '',
          position: '',
          store: ''
        },
        // store
        storeLists: [],
        addFormRules: {
          first_name: [
            { required: true, validator: validatorName, trigger: ['blur', 'change'] }
          ],
          last_name: [{ required: true, validator: validatorName, trigger: ['blur', 'change'] }],
          gender: [{ required: true, message: this.handleGlobalI18n('employee', 'mgt_config_gender_input_tips'), trigger: ['blur', 'change'] }],
          mobile: [
            { required: true, message: this.handleGlobalI18n('employee', 'mgt_field_input_empty_tips'), trigger: ['blur', 'change'] },
            { validator: this.employeePhoneIsRepeat, trigger: ['blur'] },
            { validator: this.handlerPhonePrefix, trigger: ['blur', 'change'] }
          ],
          phonePrefix: [
            { required: true, message: this.handleGlobalI18n('employee', 'mgt_field_input_empty_tips'), trigger: ['blur', 'change'] }
          ],
          email: [
            { required: true, message: this.handleGlobalI18n('employee', 'mgt_field_input_empty_tips'), trigger: ['blur', 'change'] },
            { type: 'email', message: this.handleGlobalI18n('employee', 'mgt_empl_form_input_email_tips_2'), trigger: ['blur', 'change'] },
            { validator: this.employeeEmailIsRepeat, trigger: ['blur'] }
          ],
          position: [{ required: true, message: this.handleGlobalI18n('employee', 'mgt_config_position_input_tips'), trigger: ['blur', 'change'] }],
          store: [{ required: true, message: this.handleGlobalI18n('employee', 'mgt_empl_add_store_list_label'), trigger: ['blur', 'change'] }]
        },
        params: {
          asc: true,
          city_id: 0,
          content: '',
          key: 0,
          language: this.$store.getters.language,
          page_no: 1,
          page_size: 20,
          state_id: ''
        }
      }
    },
    created() {
      this.init()
    },
    methods: {
      async init() {
        // if (this.$route.params.hasOwnProperty('id')) {
        //   this.loading = true
        // }
        this.loading = true
        await this.getPhoneFix()
        await this.getPosition()
        await this.getStoreList()
        await this.getDetail()
        this.loading = false
      },
      selectLoadmore() {
        if (this.storeLists.length >= this.total_count) {
          return
        } else {
          this.params.page_no += 1
          this.getStoreList()
        }
      },
      getStoreList() {
        return storeList(this.params).then(res => {
          if (res.return_result) {
            this.storeLists = this.storeLists.concat(res.return_result.results)
            this.total_count = res.return_result.total_count
          }
        }).catch(err => { Message({ message: err, type: 'error' }) })
      },
      selectGender(id) {
        // console.log('id', id)
      },
      clickTypeList(positionId) {
        this.positionId = positionId
      },
      getPosition() {
        return queryEmployeeRole({ content: '', key: '0', page_no: 1, page_size: 10000000 }).then(res => {
          if (res.return_result) {
            this.typeList = res.return_result.results
            this.addPositionList = res.return_result.results.map(item => {
              item.edit = false
              item.original_name = item.name
              return item
            })
          } else { Message({ message: res.msg, type: 'error' }) }
        }).catch(err => { Message({ message: err, type: 'error' }) })
      },
      getPhoneFix() {
        return countryPhonePrefix({}).then(res => {
          // eslint-disable-next-line no-eval
          const obj = eval('(' + res.return_result[0].cfg_value + ')')
          const str = this.$store.getters.language
          const key = Object.keys(obj).filter(item => item === str)
          this.phonePrefixList = obj[key[0]]
          // 排序
          this.phonePrefixList.sort((a, b) => {
            const a1 = parseInt(a.regionCode)
            const b1 = parseInt(b.regionCode)
            if (a1 < b1) {
              return -1
            }
            if (a1 > b1) {
              return 1
            }
            return 0
          })
        }).catch(err => {
          Message({ message: err, type: 'error' })
        })
      },
      getDetail() {
        if (this.$route.params.hasOwnProperty('id')) {
          return employeeDetail({
            id: this.$route.params.id,
            language: this.$store.getters.language
          }).then(res => {
            this.loading = false
            this.addForm = { ... res.return_result }
            this.addForm.store = res.return_result.store[0]
            this.addForm.phonePrefix = res.return_result.mobile_region_code
            // 查找Position Id
            this.addPositionList.forEach(item => {
              if (item.name === res.return_result.position) {
                this.positionId = item.id
              }
            })
            // 查找Store Id
            // this.storeLists.forEach(item => {
            //   if (item.store_name === res.return_result.)
            //   console.log('item', item)
            // })
          }).catch(err => {
            this.loading = false
            Message({
              message: err,
              type: 'error'
            })
          })
        }
      },
      submitForm(formName) {
        // 校验
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.btnLoading = true
            const argu = this.addForm
            const dataObj = {
              email: argu.email,
              first_name: argu.first_name,
              last_name: argu.last_name,
              gender: argu.gender,
              mobile: argu.mobile,
              position: this.positionId,
              language: this.$store.getters.language,
              store: [argu.store],
              mobile_region_code: argu.phonePrefix
            }
            if (this.$route.params.hasOwnProperty('id')) {
              dataObj['id'] = this.$route.params.id - 0
              updateEmployee(dataObj).then(res => {
                this.btnLoading = false
                if (res.return_result) {
                  if (res.return_result.success) {
                    this.storeLists = []
                    this.$router.push('/configuration/employee/list/index')
                  }
                } else { Message({ message: res.msg, type: 'error' }) }
              }).catch(err => { this.btnLoading = false; Message({ message: err, type: 'error' }) })
            } else {
              insertEmployee(dataObj).then(res => {
                this.btnLoading = false
                if (res.return_result) {
                  if (res.return_result.success) {
                    this.storeLists = []
                    this.$router.push('/configuration/employee/list/index')
                  }
                } else { Message({ message: res.msg, type: 'error' }) }
              }).catch(err => { this.btnLoading = false; Message({ message: err, type: 'error' }) })
            }
          }
        })
      },
      // add position
      handleCloseAddPosition(done) {
        done()
      },
      addType() {
        this.addPositionList.push({
          name: '',
          original_name: '',
          delete: true,
          edit: true
        })
      },
      cancelEdit(row) {
        row.edit = false
        this.addPositionList = Object.assign([], this.addPositionList)
        if (row.original_name === '') {
          this.addPositionList.splice(this.addPositionList.findIndex(item => item === row), 1)
        } else {
          row.name = row.original_name
        }
      },
      deleteType(id) {
        setEmployeeRoleActive({ id }).then(res => {
          if (res.return_result) {
            if (res.return_result.success) {
              this.getPosition()
              this.addPositionDialog = false
              this.$message({
                dangerouslyUseHTMLString: true,
                message: this.handleGlobalI18n('employee', 'mgt_empl_position_btn_delete_notification_label'),
                duration: '1000',
                type: 'success'
              })
            }
          } else { Message({ message: res.msg, type: 'error' }) }
        }).catch(err => { Message({ message: err, type: 'error' }) })
      },
      clickEdit(row) {
        row.edit = !row.edit
        this.addPositionList = Object.assign([], this.addPositionList)
      },
      confirmEdit(row) {
        if (this.common.validatIsNull(row.name)) { // role name is null
          this.$message({
            message: this.handleGlobalI18n('employee', 'mgt_empl_position_add_empty_notification_label'),
            duration: '1000',
            type: 'warning'
          })
          return false
        }
        row.edit = false
        this.addPositionList = Object.assign([], this.addPositionList)
        if (row.name !== row.original_name && row.original_name !== '') {
          updateEmployeeRole({
            id: row.id,
            name: row.name
          }).then(res => {
            if (res.return_result) {
              if (res.return_result.success) {
                this.getPosition()
                row.original_name = row.name
              } else {
                row.name = ''
                row.edit = true
                this.addPositionList = Object.assign([], this.addPositionList)
              }
            }
          }).catch(err => { Message({ message: err, type: 'error' }) })
        } else if (row.name !== row.original_name && row.original_name === '') {
          insertEmployeeRole({
            name: row.name
          }).then(res => {
            if (res.return_result) {
              if (res.return_result.success) {
                this.getPosition()
                row.id = res.id
                row.original_name = row.name
                this.addPositionList = Object.assign([], this.addPositionList)
              } else {
                row.name = ''
                row.edit = true
                this.addPositionList = Object.assign([], this.addPositionList)
              }
            }
          }).catch(err => {
            Message({ message: err, type: 'error' })
            row.name = ''
            row.edit = true
            this.addPositionList = Object.assign([], this.addPositionList)
          })
        }
      }
    }
  }
</script>

<style lang='scss'>
  .r-EmployeeWrapper {
    margin: 15px 20px;
    .color-33 {
      color: #333;
    }
    .font-bold {
      font-weight: bold;
    }
    .edit-input-box {
      display: flex;
    }
    .addForm {
      float: left;
    }
    .ruleFormFeatures {
      float: left;
      margin-left: 200px;
    }
    .check_tit, .check_con {
      display: block;
    }
    .check_tit {
      .el-checkbox__label {
        color: #333;
        font-weight: bold;
      }
    }
    .check_con {
      .el-checkbox__label {
        padding-left: 20px;
        color: #333;
      }
    }

  }
</style>
