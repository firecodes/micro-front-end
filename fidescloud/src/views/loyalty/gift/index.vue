<template>
  <div class="gift">
    <el-form>
      <el-input type="text" style="width:360px; margin-bottom: 10px;" max="32" @keyup.enter.native="handleSearch" v-model="listQuery.gift_name" :placeholder="handleGlobalI18n('loyalty', 'gift_input_placeholder')"></el-input>
      <el-button type="primary" icon="el-icon-search" @click="handleSearch">{{handleGlobalI18n('loyalty', 'search')}}</el-button>
      <el-button icon="el-icon-plus" style="margin-left:0;" @click="dialogFormVisible = true;edit = false">{{handleGlobalI18n('loyalty', 'add')}}</el-button>
    </el-form>
    <div v-loading="loading">
      <el-form ref="form">
        <el-table :data="tableData" style="width: 100%" border :empty-text="$t('member.fc_table_no_data_label')">
          <el-table-column :label="handleGlobalI18n('loyalty', 'gift_code')" align="center" prop="gift_code"></el-table-column>
          <el-table-column :label="handleGlobalI18n('loyalty', 'gift_name')" align="center" prop="gift_name"></el-table-column>
          <el-table-column :label="handleGlobalI18n('loyalty', 'gift_create_date')" align="center" prop="create_date" >
            <template slot-scope="scope">
              {{ globalData.formatDate(parse2Date(scope.row.create_date))}}
            </template>
          </el-table-column>
          <el-table-column :label="handleGlobalI18n('loyalty', 'gift_status')" align="center" prop="status">
            <template slot-scope="scope">
              {{ scope.row.status === 1 ? 'Active' : 'Inactive'}}
            </template>
          </el-table-column>
          <el-table-column :label="handleGlobalI18n('loyalty', 'operation')" align="center">
            <template slot-scope="scope">
              <el-button
                icon="el-icon-edit"
                @click="handleEdit(scope.$index, scope.row)">{{handleGlobalI18n('loyalty', 'edit')}}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <pagination-container
            :page = "listQuery.page_no"
            :page_size = 'listQuery.page_size'
            :total = 'total'
            @handleCurrentChange = "handleCurrentChange"
            @handleSizeChange="handleSizeChange"
      ></pagination-container>
    </div>
    <el-dialog :title="selectName" :visible.sync="dialogFormVisible" width="540px">
      <el-form :model="form" label-width="140px" ref="addGift" :rules="rules">
        <el-form-item :label="handleGlobalI18n('loyalty', 'gift_code') + ':'" prop="gift_code" :rules="[{ required: true, max: 32, message: handleGlobalI18n('validation', 'gift_code_length'), trigger: 'change' }, { validator: checkGiftCode, trigger: 'blur' }]">
          <el-input v-model="form.gift_code" maxlength="32" :disabled = "edit"></el-input>
        </el-form-item>
        <el-form-item :label="handleGlobalI18n('loyalty', 'gift_name') + ':'" prop="gift_name" :rules="[{ required: true, max: 32, message: handleGlobalI18n('validation', 'gift_name_length'), trigger: 'change' }]">
          <el-input v-model="form.gift_name" maxlength="32"></el-input>
        </el-form-item>
        <el-form-item :label="handleGlobalI18n('loyalty', 'gift_status') + ':'" v-if="edit">
          <el-select v-model.number="form.status" :placeholder="handleGlobalI18n('loyalty', 'please_select')">
            <el-option :label="handleGlobalI18n('loyalty', 'active')" :value="parseInt(1)"></el-option>
            <el-option :label="handleGlobalI18n('loyalty', 'inActive')" :value="parseInt(0)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="handleGlobalI18n('loyalty', 'unit_price') + ':'">
          <el-input-number :min="0" :precision="2" :step="1" v-model="form.unit_price"  style="width: 180px"></el-input-number>
          <el-select v-model="relative_type" style="width: 120px;" :placeholder="handleGlobalI18n('loyalty', 'please_select')">
            <el-option :label="globalData.value.currency" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="handleGlobalI18n('loyalty', 'purchased_price') + ':'">
          <el-input-number :min="0" :precision="2" :step="1" v-model="form.purchased_price"  style="width: 180px"></el-input-number>
          <el-select v-model="relative_type" style="width: 120px;" :placeholder="handleGlobalI18n('loyalty', 'please_select')">
            <el-option :label="globalData.value.currency" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="handleGlobalI18n('loyalty', 'description') + ':'" prop="description">
          <el-input
            type="textarea"
             maxlength="120"
            :autosize="{ minRows: 2, maxRows: 6}"
            v-model="form.description">
          </el-input>
        </el-form-item>
        <el-form-item :label="handleGlobalI18n('loyalty', 'image') + ':'">
          <el-upload
            v-loading="uploadLoading"
            class="avatar-uploader"
            :action="uploadImgUrl"
            :http-request="handleHttpRequest"
            :show-file-list="false"
            :before-upload="beforeAvatarUpload">
            <img v-if="form.image_url!== null && form.image_url!== ''" :src="form.image_url" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{handleGlobalI18n('loyalty', 'back')}}</el-button>
        <el-button type="primary" :loading="saveLoading" @click="submitForm('addGift')">{{handleGlobalI18n('loyalty', 'save')}}</el-button>
      </div>
    </el-dialog>
   </div>
</template>

<script>
import PaginationContainer from '@/components/PaginationContainer'
import { checkGiftCode, searchGift, newGift, editGift } from '@/api/redemption'
import { pageLimit, projectName } from '@/api/api'
import { parse2Date } from '@/utils'
import { uploadImage } from '@/api/master'
export default {
  components: {
    PaginationContainer
  },
  data() {
    return {
      uploadLoading: false,
      saveLoading: false,
      uploadImgUrl: '',
      loading: true,
      total: null,
      listQuery: {
        page_no: 1,
        page_size: pageLimit,
        gift_name: ''
      },
      rules: {},
      pgVisable: false,
      dialogFormVisible: false,
      tableData: [],
      relative_type: '1',
      form: {
        gift_code: '',
        gift_name: '',
        description: '',
        unit_price: 0,
        status: null,
        image_url: '',
        purchased_price: 0
      },
      edit: false,
      file: '',
      module: 'Gift'
    }
  },
  computed: {
    selectName() {
      if (!this.edit) {
        return this.handleGlobalI18n('loyalty', 'add_new_gift')
      } else {
        return this.handleGlobalI18n('loyalty', 'edit_gift')
      }
    }
  },
  created() {
    this.getListData()
  },
  methods: {
    parse2Date,
    handleHttpRequest() {
      if (this.file === '' || this.file === undefined) {
        return true
      }
      this.uploadLoading = true
      this.form.image_url = ''
      var formData = new FormData()
      formData.append('file', this.file)
      formData.append('oldUrl', this.form.image_url)
      formData.append('project', projectName)
      formData.append('module', this.module)
      uploadImage(formData).then(res => {
        this.form.image_url = res.return_result.url[0]
        this.uploadLoading = false
        this.file = ''
      }).catch(() => {
        this.uploadLoading = false
      })
    },
    handleCurrentChange(val) {
      this.listQuery.page_no = val
      this.getListData()
    },
    handleSizeChange(val) {
      this.listQuery.page_size = val
      this.getListData()
    },
    handleSearch() {
      this.listQuery.page_no = 1
      this.getListData()
    },
    getListData() {
      this.loading = true
      searchGift(Object.assign({}, this.listQuery, { asc: false })).then(res => {
        const result = res.return_result
        this.tableData = result.gifts
        this.total = result.total_count
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    checkGiftCode(rule, value, callback) {
      if (this.edit) {
        callback()
        return true
      }
      if (this.form.gift_code === '' || this.form.gift_code === undefined) {
        callback(new Error(this.handleGlobalI18n('validation', 'gift_code_length')))
        return true
      }
      checkGiftCode(this.form.gift_code).then(res => {
        const obj = res.return_result
        obj.exist ? callback(new Error(this.handleGlobalI18n('validation', 'gift_code_exist'))) : callback()
      }).then((res) => {
        callback(new Error(res))
      })
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type
      // === 'image/jpeg'
      // const isLt2M = file.size / 1024 / 1024 < 2
      //
      if (isJPG.indexOf('image') < 0) {
        this.$message.error(this.handleGlobalI18n('validation', 'upload_image_type_error'))
        return isJPG
      }
      // // if (!isLt2M) {
      // //   this.$message.error('上传头像图片大小不能超过 2MB!')
      // // }
      this.file = file
    },
    submitForm(formName) {
      this.saveLoading = true
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.edit ? this.editGift() : this.addGift()
        } else {
          this.saveLoading = false
          // console.log("error submit!!")
          return false
        }
      })
    },
    addGift() {
      newGift(this.form).then(res => {
        this.dialogFormVisible = false
        this.saveLoading = false
        this.getListData()
        this.$refs['addGift'].resetFields()
      }).catch(() => {
        this.saveLoading = false
      })
    },
    editGift() {
      editGift(this.form).then(res => {
        this.dialogFormVisible = false
        this.saveLoading = false
        this.edit = false
        this.getListData()
        this.$refs['addGift'].resetFields()
      }).catch(() => {
        this.saveLoading = false
      })
    },
    resetForm(formName) {
      if (
        this.form.gift_name ||
        this.form.gift_description ||
        this.form.effective_type ||
        this.form.image_url
      ) {
        this.$refs[formName].resetFields()
      }
    },
    handleEdit(index, row) {
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.form = {
          gift_code: row.gift_code,
          gift_name: row.gift_name,
          description: row.description,
          unit_price: row.unit_price,
          status: row.status,
          image_url: row.image_url,
          purchased_price: row.purchased_price || 0
        }
        this.edit = true
      })
    }
  },
  watch: {
    'dialogFormVisible': {
      handler() {
        if (!this.edit) {
          this.form = {
            gift_code: '',
            gift_name: '',
            description: '',
            unit_price: 0,
            status: '',
            image_url: '',
            purchased_price: 0
          }
          this.$nextTick(() => {
            this.$refs.addGift.resetFields()
          })
        }
      }
    },
    'form.unit_price': {
      handler(val) {
        if (val === undefined || val === '' || val === null) {
          this.$nextTick(() => {
            this.form.unit_price = 0
          })
        }
      }
    }
  }
}
</script>

<style scoped rel="stylesheet/scss" lang="scss">
.el-input {
  width: 80%;
  text-align: center;
}
.avatar-uploader {
  width: 178px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader:hover {
  border-color: $primary;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.el-form-item {
  margin-bottom: 20px;
}
.el-input,
.el-select,
.el-textarea {
  width: 300px;
}
.pagination-container {
  text-align: right;
  padding: 15px 0;
  background-color: #ffffff;
}
.gift {
  margin: 25px;
  .gwp {
    text-align: left;
    label {
      border: 1px solid #666666;
      padding: 2px 20px;
      border-radius: 5px;
    }
    div {
      &:not(:first-child) {
        margin-top: 10px;
      }
    }
  }
}
</style>
