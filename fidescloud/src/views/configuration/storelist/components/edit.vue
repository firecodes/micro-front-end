<template>
  <div class='storeListEditWrapper'>
    <el-form v-loading="loading" :model="addForm" :rules="addFormRules" status-icon label-width="130px" class="addForm" ref="addForm">
      <el-form-item :label="handleGlobalI18n('store', 'mgt_store_add_picture_label')" prop="picture">
        <div class="upload-img-box">
          <i @click="handleRemove" v-if="addForm.picture" class="el-icon-circle-close remove-btn"></i>
          <el-upload
            class="avatar-uploader"
            action="https://httpbin.org/post"
            :before-upload="(file) => common.uploadImgRules(file)"
            :http-request="uploadImg"
            accept="image/*"
            :show-file-list="false"
            :on-remove="handleRemove">
            <img v-if="addForm.picture" :src="addForm.picture" class="avatar">
            <i v-else class="el-icon-picture-outline avatar-uploader-icon"></i>
          </el-upload>
        </div>
      </el-form-item>
      <el-form-item :label="handleGlobalI18n('store', 'mgt_store_add_name_label')" prop="store_name">
        <el-input type="text" v-model="addForm.store_name" maxlength="32" auto-complete="off" clearable :placeholder="handleGlobalI18n('store', 'mgt_store_add_name_input_label')"></el-input>
      </el-form-item>
      <el-form-item :label="handleGlobalI18n('store', 'mgt_store_add_telephone_label')" prop="telephone">
        <el-input type="text" v-model="addForm.telephone" maxlength="32" auto-complete="off" clearable :placeholder="handleGlobalI18n('store', 'mgt_store_add_telephone_inpupt_label')"></el-input>
      </el-form-item>
      <el-form-item :label="handleGlobalI18n('member', 'location')" prop="location">
        <el-select v-model="addForm.locationName" value-key="dictionary_code" :placeholder="handleGlobalI18n('system', 'please_select')" @change="changeLocation">
          <el-option v-for="item in locationArr" :key="item.dictionary_code" :label="item.dictionary_name" :value="item.dictionary_code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="handleGlobalI18n('store', 'mgt_store_add_maohao_state_label')" prop="state">
        <el-select v-model="addForm.stateName" value-key="dictionary_code" :placeholder="handleGlobalI18n('store', 'mgt_store_add_state_input_label')" @change="changeState">
          <el-option v-for="item in stateArr" :key="item.dictionary_code" :label="item.dictionary_name" :value="item.dictionary_code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="handleGlobalI18n('store', 'mgt_store_add_city_label')" prop="city">
        <el-select v-model="addForm.cityName" value-key="dictionary_code" :placeholder="handleGlobalI18n('store', 'mgt_store_add_city_input_label')" @change="changeCity">
          <el-option v-for="item in cityArr" :key="item.dictionary_code" :label="item.dictionary_name" :value="item.dictionary_code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="handleGlobalI18n('store', 'mgt_store_add_address_label')" prop="address">
        <el-input type="text" v-model="addForm.address" maxlength="32" auto-complete="off" clearable :placeholder="handleGlobalI18n('store', 'mgt_store_add_address_input_label')"></el-input>
      </el-form-item>
      <el-form-item :label="handleGlobalI18n('store', 'mgt_store_add_zipcode_label')" prop="zip_code">
        <el-input type="text" v-model="addForm.zip_code" maxlength="32" auto-complete="off" clearable :placeholder="handleGlobalI18n('store', 'mgt_store_add_zipcode_input_label')"></el-input>
      </el-form-item>
      <el-form-item style="display:none;" :label="handleGlobalI18n('store', 'mgt_store_add_manager_label')" prop="store_manager_name">
        <el-input type="text" v-model="addForm.store_manager_name" auto-complete="off" class="store-manager" disabled clearable :placeholder="handleGlobalI18n('store', 'mgt_store_add_manager_input_label')">
           <el-button slot="append" icon="el-icon-plus" @click="ChooseStoreManager = true"></el-button>
        </el-input>
      </el-form-item>
      <el-form-item style="display:none;" :label="handleGlobalI18n('store', 'mgt_store_add_staff_label')">
        <el-button type="primary" @click="ChooseStoreStuff = true">{{ handleGlobalI18n('store', 'mgt_store_add_empl_select_label') }}</el-button>
        <el-table
          :data="addForm.employees"
          tooltip-effect="dark"
          style="width: 100%; margin-top: 20px;"
          border
         >
          <el-table-column prop="name" :label="handleGlobalI18n('store', 'mgt_empl_table_name_label')" align="center"></el-table-column>
          <el-table-column prop="gender" :label="handleGlobalI18n('store', 'mgt_empl_table_gender_label')" align="center">
            <template slot-scope="scope"><span style="text-transform: capitalize;">{{ utils.genderFilter(scope.row.gender) }}</span></template>
          </el-table-column>
          <el-table-column prop="position" :label="handleGlobalI18n('store', 'mgt_empl_table_position_label')" align="center" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="mobile" :label="handleGlobalI18n('store', 'mgt_empl_table_mobile_label')" align="center" show-overflow-tooltip></el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="saveLoading" @click="submitForm('addForm')">{{ handleGlobalI18n('system', 'save') }}</el-button>
        <el-button @click="$router.go(-1)">{{ handleGlobalI18n('system', 'cancel') }}</el-button>
      </el-form-item>
    </el-form>
    <!-- choose store staff -->
    <el-dialog
      title="Choose store manager"
      :visible.sync="ChooseStoreStuff"
      width="30%"
      :before-close="handleCloseStoreStuff">
      <div class="ChooseStoreStuffModal">
        <!-- select -->
        <el-select v-model="ChooseStoreStuffSelectVal" placeholder="请选择活动区域">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
        <!-- search -->
        <el-input v-model="input" placeholder="Enter key words"></el-input>
        <el-button><i class="el-icon-search"></i></el-button>
      </div>
      <el-table
        ref="multipleTable"
        :data="StoreStaffList"
        tooltip-effect="dark"
        v-loading="loadingStoreStaff"
        style="width: 100%"
        @selection-change="handleSelectionChange">
          <el-table-column type="selection" :reserve-selection="true" width="55" align="center"></el-table-column>
          <el-table-column prop="name" :label="handleGlobalI18n('store', 'mgt_empl_table_name_label')" align="center"></el-table-column>
          <el-table-column prop="gender" :label="handleGlobalI18n('store', 'mgt_empl_table_gender_label')" align="center">
            <template slot-scope="scope"><span style="text-transform: capitalize;">{{ common.genderFilter(scope.row.gender) }}</span></template>
          </el-table-column>
          <el-table-column
            prop="position"
            :label="handleGlobalI18n('store', 'mgt_empl_table_position_label')"
            align="center">
          </el-table-column>
          <el-table-column
            prop="mobile"
            :label="handleGlobalI18n('store', 'mgt_empl_table_mobile_label')"
            align="center"
            show-overflow-tooltip>
          </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="ChooseStoreStuff = false">取 消</el-button>
        <el-button type="primary" @click="ChooseStoreStuff = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- choose store manager -->
    <el-dialog
      title="Choose store manager"
      :visible.sync="ChooseStoreManager"
      width="30%"
      :before-close="handleCloseStoreManager">
      <el-table
        :data="StoreManagerList"
        class="radio-table storeManagerListTable"
        v-loading="loadingStoreManager"
      >
        <el-table-column width="45" align="center">
          <template slot-scope="scope">
            <el-radio :label="scope.row.id" v-model="radio" @change.native="chooseManager(scope.$index, scope.row)"></el-radio>
          </template>
        </el-table-column>
        <el-table-column prop="name" :label="handleGlobalI18n('store', 'mgt_empl_table_name_label')" align="center"></el-table-column>
        <el-table-column prop="gender" :label="handleGlobalI18n('store', 'mgt_empl_table_gender_label')" align="center">
          <template slot-scope="scope"><span style="text-transform: capitalize;">{{ common.genderFilter(scope.row.gender) }}</span></template>
        </el-table-column>
        <el-table-column prop="position" :label="handleGlobalI18n('store', 'mgt_empl_table_position_label')" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="mobile" :label="handleGlobalI18n('store', 'mgt_empl_table_mobile_label')" align="center" show-overflow-tooltip></el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSaveStoreManager">{{ handleGlobalI18n('store', 'mgt_operation_btn_save_label') }}</el-button>
        <el-button @click="ChooseStoreManager = false">{{ handleGlobalI18n('store', 'mgt_operation_btn_cancel_label') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { fileUpload, queryEmployeeByRoleLevel } from '@/api/common'
import { getChildDictionaryListType, getChildDictionaryList, storeInsert, storeDetail, storeUpdate } from '@/api/store'
import { Message } from 'element-ui'
export default {
  data() {
    const validatePhone = (rule, value, callback) => {
      const reg = /^([0-9-]+)$/
      if (value) {
        if (!reg.test(value)) {
          return callback(new Error(' '))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return {
      loading: false,
      listQuery: { asc: false, content: '', key: 0, exclude: false, level: 1, page_no: 1, page_size: 10 },
      listQueryStaff: { asc: false, content: '', key: 0, exclude: true, level: 1, page_no: 1, page_size: 10 },
      // choose store stuff
      ChooseStoreStuff: false,
      loadingStoreStaff: true,
      storeStaffTotal: null,
      StoreStaffList: [],
      // choose store manager
      ChooseStoreManager: false,
      loadingStoreManager: true,
      ChooseStoreStuffSelectVal: '',
      storeManagerTotal: null,
      StoreManagerList: [],
      StoreManagerRow: {},
      saveLoading: false,
      radio: '',
      addForm: {
        picture: '',
        store_name: '',
        telephone: '',
        location: '',
        locationName: '',
        state: '',
        stateName: '',
        cityName: '',
        city: '',
        address: '',
        zip_code: '',
        manager: null,
        store_manager_name: '',
        employees: []
      },
      tableData: [],
      multipleSelection: [],
      locationArr: [],
      stateArr: [],
      cityArr: [],
      input: '',
      addFormRules: {
        store_name: [{ required: true, message: this.handleGlobalI18n('store', 'mgt_field_input_empty_tips'), trigger: ['blur', 'change'] }],
        telephone: [
          { required: true, message: this.handleGlobalI18n('store', 'mgt_field_input_empty_tips'), trigger: ['blur', 'change'] },
          { validator: validatePhone, trigger: ['blur', 'change'] }
        ],
        location: [{ required: true, message: this.handleGlobalI18n('store', 'mgt_store_add_location_input_label'), trigger: ['blur', 'change'] }],
        state: [{ required: true, message: this.handleGlobalI18n('store', 'mgt_store_add_state_input_label'), trigger: ['blur', 'change'] }],
        city: [{ required: true, message: this.handleGlobalI18n('store', 'mgt_store_add_city_input_label'), trigger: ['blur', 'change'] }],
        address: [{ required: true, message: this.handleGlobalI18n('store', 'mgt_field_input_empty_tips'), trigger: ['blur', 'change'] }]
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    async init() {
      this.loading = true
      await this.getStoreManager()
      await this.getStoreStaff()
      await this.getRegionState()
      await this.getDetail()
      this.loading = false
    },
    getDetail() {
      // get route id
      if (this.$route.params.hasOwnProperty('id')) {
        this.loading = true
        return storeDetail({
          'id': this.$route.params.id,
          'language': this.$store.getters.language
        }).then(res => {
          this.loading = false
          if (res.return_result) {
            this.addForm.picture = res.return_result.picture
            this.addForm.store_name = res.return_result.store_name
            this.addForm.telephone = res.return_result.telephone
            this.addForm.address = res.return_result.address
            this.addForm.zip_code = res.return_result.zip_code
            this.addForm.location = res.return_result.country_code
            this.addForm.locationName = res.return_result.country_name
            this.addForm.cityName = res.return_result.city_name
            this.addForm.city = res.return_result.city_code
            this.addForm.state = res.return_result.state_code
            this.addForm.stateName = res.return_result.state_name
          } else {
            this.message(res.msg)
          }
        }).catch((err) => {
          this.loading = false
          this.$message.error(err)
        })
      }
    },
    message(message, type = 'error') {
      Message({
        message,
        type
      })
    },
    changeLocation(value) {
      this.addForm.location = value
      this.addForm.stateName = ''
      this.addForm.state = ''
      this.stateArr = []
      this.addForm.cityName = ''
      this.addForm.city = ''
      this.cityArr = []
      getChildDictionaryList({
        parent_dictionary_type_code: 'COUNTRY',
        parent_dictionary_code: value,
        page_no: 1,
        page_size: 1000
      }).then(res => {
        if (res.return_result) {
          this.stateArr = res.return_result.dictionaries
        } else {
          this.message(res.msg)
        }
      })
    },
    changeState(value) {
      this.addForm.state = value
      this.addForm.cityName = ''
      this.addForm.city = ''
      this.cityArr = []
      getChildDictionaryList({
        parent_dictionary_type_code: 'PROVINCE',
        parent_dictionary_code: value,
        page_no: 1,
        page_size: 1000
      }).then(res => {
        if (res.return_result) {
          this.cityArr = res.return_result.dictionaries
        } else {
          this.message(res.msg)
        }
      })
    },
    changeCity(value) {
      this.addForm.city = value
    },
    getStoreManager() {
      this.loadingStoreManager = true
      return queryEmployeeByRoleLevel(this.listQuery).then(res => {
        this.loadingStoreManager = false
        this.storeManagerTotal = res.return_result.total_count
        this.StoreManagerList = res.return_result.results
      }).catch(() => { this.loadingStoreManager = false })
    },
    getStoreStaff() {
      this.loadingStoreStaff = true
      return queryEmployeeByRoleLevel(this.listQuery).then(res => {
        this.loadingStoreStaff = false
        this.storeStaffTotal = res.return_result.total_count
        this.StoreStaffList = res.return_result.results
      }).catch(() => { this.loadingStoreStaff = false })
    },
    getRegionState() {
      return getChildDictionaryListType({ dictionary_type_code: 'COUNTRY', page_no: 1, page_size: 1000 }).then(res => {
        if (res.return_result) {
          this.locationArr = res.return_result.dictionaries
        } else {
          this.message(res.msg)
        }
      })
    },
    uploadImg(file) {
      const img_form = new FormData()
      img_form.append('file', file.file)
      img_form.append('project', 'SMIC')
      img_form.append('module', 'Store')
      fileUpload(img_form).then(res => {
        if (res.return_result.url) {
          this.addForm.picture = res.return_result.url[0]
          this.$refs['addForm'].validateField('picture')
        } else {
          this.$message.error('Uploading image failed. Please try again!')
        }
      })
    },
    handleRemove() {
      this.addForm.picture = ''
      this.$refs['addForm'].validateField('picture')
    },
    employeeTransferDialog() {
      console.log(111)
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleCloseStoreStuff(done) {
      done()
    },
    handleCloseStoreManager(done) {
      done()
    },
    chooseManager(idx, row) {
      this.StoreManagerRow = row
    },
    handleSaveStoreManager() {
      this.addForm.store_manager_name = this.StoreManagerRow.name
      this.ChooseStoreManager = false
    },
    submitForm(addForm) {
      this.$refs[addForm].validate((valid) => {
        if (valid) {
          this.saveLoading = true
          const dataObj = {
            'address': this.addForm.address,
            'city_code': this.addForm.city,
            'picture': this.addForm.picture,
            'state_code': this.addForm.state,
            'store_name': this.addForm.store_name,
            'telephone': this.addForm.telephone,
            'zip_code': this.addForm.zip_code
          }
          if (this.$route.params.hasOwnProperty('id')) {
            dataObj['id'] = this.$route.params.id
            storeUpdate(dataObj).then(res => {
              this.saveLoading = false
              if (res.return_result.success) {
                this.$message.success(this.$t('configuration.fc_operation_feedback_notification_label'))
                this.$router.push('/configuration/store/list/index')
              } else {
                this.$message.error(res.msg)
              }
            })
          } else {
            storeInsert(dataObj).then(res => {
              this.saveLoading = false
              if (res.return_result.success) {
                this.$message.success(this.$t('configuration.fc_operation_feedback_notification_label'))
                this.$router.push('/configuration/store/list/index')
              } else {
                this.$message.error(res.msg)
              }
            })
          }
        }
      })
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss' scoped>
  .storeListEditWrapper {
    padding-top: 40px;
    .upload-img-box {
      width: 178px;
      height: 178px;
      position: relative;
      img {
        width: 178px;
        height: 178px;
      }
    }
    .avatar-uploader {
      background-color: #fbfdff;
      width: 180px;
      height: 180px;
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
    .avatar-uploader:hover {
      border-color: #409eff;
    }
    .storeManagerListTable .el-radio /deep/ .el-radio__label {
      display: none;
    }
  }
.addForm {
    .avatar-uploader-icon {
      font-size: 36px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      line-height: 178px;
      text-align: center;
      background: #ffffff;
    }
    width: 620px;
    .el-input, .el-select {
      width: 300px;
    }
  }
  .ChooseStoreStuffModal {
    display: flex;
    margin-bottom: 20px;
    .el-select {
      margin-right: 20px;
    }
  }
</style>
<style>
  .store-manager input{
    background-color: #fff!important;
    border-color: #dcdfe6!important;
  }
</style>
