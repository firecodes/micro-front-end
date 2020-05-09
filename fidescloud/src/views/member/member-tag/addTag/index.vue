<template>
  <div class="edit-add-detail-copy-gift new-theme-css addNewTagPage" v-loading="detail_loading">
    <div class="click-button">
        <div>
          <el-button class="cancel" @click="goBack()">{{$t('loyalty.fc_operation_btn_cancel_label')}}</el-button>
          <el-button type="primary" :loading="save_loading" class="save" @click="submitForm('addEvent')">{{$t('loyalty.fc_operation_btn_save_label')}}</el-button>
        </div>
    </div>
    <!--info box-->
    <div class="contain" :class="{'detail-contain' : query.type === 'detail'}">
      <ed-header-title :title="'Add new tag'" />
      <el-form ref="gift" label-position="left" :model="form" :rules="rules"  label-width="300px">
        <div class="content">
          <div class="info">
              <!--tag name-->
              <el-form-item label="Tag name:" prop="gift_code" ref="gift_code">
                <template>
                  <el-input v-model="form.gift_code" maxlength="32" placeholder="Please enter tag name"></el-input>
                </template>
              </el-form-item>
              <!--tag category-->
              <el-form-item label="Tag category:" prop="gift_name">
                <template>
                  <el-select placeholder="Please select" v-model="form.gift_category_code" clearable filterable style="width: 300px;">
                    <el-option class="new-select-option" v-for="(item1, index) in category_list" :key="index" :label="item1.gift_category_name" :value="item1.gift_category_code"></el-option>
                  </el-select>
                </template>
              </el-form-item>
              <!--tag groups-->
              <el-form-item label="Tag group:"  prop="available_inventory" ref="available_inventory">
                <template>
                  <el-select placeholder="Please select" v-model="form.gift_category_code" clearable filterable style="width: 300px;">
                    <el-option class="new-select-option" v-for="(item1, index) in category_list" :key="index" :label="item1.gift_category_name" :value="item1.gift_category_code"></el-option>
                  </el-select>
                  <el-button class="deep-blue" type="primary" @click="dialog_show=true">Add</el-button>
                </template>
              </el-form-item>
              <!-- type -->
              <el-form-item label="Type" prop="type">
                <el-radio-group v-model="form.standard_point_value">
                  <el-radio :label="1" class="min-width-330">Conditional tag</el-radio>
                  <el-radio :label="2">Unconditional tag</el-radio>
                </el-radio-group>
              </el-form-item>
              <!-- conditions -->
              <el-form-item label="Conditions:">
                <template>
                  <p class="" style="color: #2777FF;"><i class="el-icon-info" style="color:#2777FF;marginRight:10px;"></i>Tag members according to intersection of condition set.</p>
                </template>
              </el-form-item>
              <!-- General-->
              <el-form-item label="General:" prop="unit_price">
                <el-checkbox class="">Registration date</el-checkbox>
                <el-select placeholder="Please select" v-model="form.gift_category_code" clearable filterable style="width: 300px;">
                  <el-option class="new-select-option" v-for="(item1, index) in category_list" :key="index" :label="item1.gift_category_name" :value="item1.gift_category_code"></el-option>
                </el-select>
              </el-form-item>
              <!-- Transaction -->
              <el-form-item label="Transaction:" prop="purchased_price">
                <div class="transaction-div">
                  <el-checkbox class="">Last transaction date</el-checkbox>
                  <el-select placeholder="Please select" v-model="form.gift_category_code" clearable filterable style="width: 300px;">
                    <el-option class="new-select-option" v-for="(item1, index) in category_list" :key="index" :label="item1.gift_category_name" :value="item1.gift_category_code"></el-option>
                  </el-select>
                </div>
                <div class="transaction-div">
                  <el-checkbox class="">Number of transactions</el-checkbox>
                  <el-select placeholder="Please select" v-model="form.gift_category_code" clearable filterable style="width: 300px;">
                    <el-option class="new-select-option" v-for="(item1, index) in category_list" :key="index" :label="item1.gift_category_name" :value="item1.gift_category_code"></el-option>
                  </el-select>
                  <el-input class="transaction-input margin-left-20"></el-input> <label for="" class="label-46">Times</label> - <el-input class="transaction-input"></el-input> <label for="">Times</label>
                </div>
                <div class="transaction-div">
                  <el-checkbox class="">Amount of transactions</el-checkbox>
                  <el-select placeholder="Please select" v-model="form.gift_category_code" clearable filterable style="width: 300px;">
                    <el-option class="new-select-option" v-for="(item1, index) in category_list" :key="index" :label="item1.gift_category_name" :value="item1.gift_category_code"></el-option>
                  </el-select>
                  <el-input class="transaction-input margin-left-20"></el-input> <label for="" class="label-46">USD</label> - <el-input class="transaction-input"></el-input> <label for="">USD</label>
                </div>
                <div class="transaction-div">
                  <el-checkbox class="">Average basket</el-checkbox>
                  <el-select placeholder="Please select" v-model="form.gift_category_code" clearable filterable style="width: 300px;">
                    <el-option class="new-select-option" v-for="(item1, index) in category_list" :key="index" :label="item1.gift_category_name" :value="item1.gift_category_code"></el-option>
                  </el-select>
                  <el-input class="transaction-input margin-left-20"></el-input> <label for="" class="label-46">USD</label> - <el-input class="transaction-input"></el-input> <label for="">USD</label>
                </div>
                <div class="transaction-div">
                  <el-checkbox class="">Average Items</el-checkbox>
                  <el-select placeholder="Please select" v-model="form.gift_category_code" clearable filterable style="width: 300px;">
                    <el-option class="new-select-option" v-for="(item1, index) in category_list" :key="index" :label="item1.gift_category_name" :value="item1.gift_category_code"></el-option>
                  </el-select>
                  <el-input class="transaction-input margin-left-20"></el-input> <label for="" class="label-46">Pieces</label> - <el-input class="transaction-input"></el-input> <label for="">Pieces</label>
                </div>
              </el-form-item>
          </div>
        </div>
      </el-form>
    </div>
    <add-category @closeSelectCategory="closeSelectCategory" :dialog_show="dialog_show" @handleDialogVisible="handleDialogVisible" />
  </div>
</template>

<script>
  import { queryGiftCategory, checkGiftCode, newGift, searchGift, editGift, batchDeleteGift } from '@/api/loyalty'
  import LabelContent from './content'
  import AddCategory from './add-category'
  export default {
    components: {
      LabelContent,
      AddCategory
    },
    watch: {
      'form.is_limited_inventory': {
        handler(...args) {
          if (args[0]) {
            this.rules.available_inventory = []
            this.$refs.available_inventory.clearValidate()
            this.rules = Object.assign({}, this.rules)
          } else {
            this.rules = Object.assign(this.rules, { available_inventory: [{ required: true, message: ' ', trigger: ['blur', 'change'] }, { validator: this.checkAvailableInventory, trigger: ['blur', 'change'] }]
            })
          }
        }
      },
      'form.auto_generate_code': {
        handler(...args) {
          if (args[0]) {
            this.rules.gift_code = []
            this.$refs.gift_code.clearValidate()
            this.rules = Object.assign({}, this.rules)
          } else {
            this.rules = Object.assign(this.rules, { gift_code: [{ required: true, message: this.handleGlobalI18n('validation', 'is_null'), trigger: ['blur'] }, { validator: this.checkGiftCode, trigger: ['blur'] }]
            })
          }
        }
      },
      'form.description': {
        handler(val) {
          if (val !== '') {
            this.description_state = false
          } else {
            this.description_state = true
          }
        }
      },
      'form.image_url': {
        handler(val) {
          if (val !== '') {
            this.image_state = false
          } else {
            this.image_state = true
          }
        }
      }
      // 'form.dynamic_content': {
      //   handler(val) {
      //     if (val !== '') {
      //       this.content_state = false
      //     } else {
      //       this.content_state = true
      //     }
      //   }
      // }
    },
    data() {
      return {
        content_state: false,
        description_state: false,
        image_state: false,
        delete: {
          params: {},
          loading: false
        },
        detail_gift_category_name: '',
        detail_loading: false,
        save_loading: false,
        dialog_show: false,
        unit: this.globalData.value.currency,
        rules: {
          gift_code: [{ required: true, message: ' ', trigger: ['blur'] }, { validator: this.checkGiftCode, trigger: 'blur' }],
          gift_name: [{ required: true, message: ' ', trigger: ['blur', 'change'] }],
          gift_category_code: [{ required: true, message: ' ', trigger: ['blur', 'change'] }],
          type: [{ required: true, message: ' ', trigger: ['blur', 'change'] }],
          unit: [{ required: true, message: ' ', trigger: ['blur', 'change'] }],
          dynamic_content: [{ validator: this.checkDynamicContent, message: ' ', trigger: ['blur', 'change'] }, { required: true, message: ' ', trigger: ['blur', 'change'] }],
          description: [{ validator: this.checkDescription, trigger: ['blur', 'change'] }, { required: true, message: ' ', trigger: ['blur', 'change'] }],
          image_url: [{ validator: this.checkImageUrl, trigger: ['blur', 'change'] }, { required: true, message: ' ', trigger: ['blur', 'change'] }],
          available_inventory: [{ required: true, message: ' ', trigger: ['blur', 'change'] }, { validator: this.checkAvailableInventory, trigger: ['blur', 'change'] }]
        },
        form: {
          auto_generate_code: false,
          is_limited_inventory: false,
          gift_code: '',
          gift_name: '',
          available_inventory: 1,
          unit_price: '',
          purchased_price: '',
          gift_category_code: '',
          unit: '',
          dynamic_content: '{}',
          image_url: '',
          description: '',
          standard_point_value: ''
        },
        query: {},
        category_list: []
      }
    },
    computed: {

    },
    created() {
      //
      this.query = this.$route.query
      this.getCategoryList()
      if (this.query.type === 'detail' || this.query.type === 'edit' || this.query.type === 'copy') {
        // 获取详情
        this.detail_loading = true
        this.handleGetDetailInfo()
      }
      if (this.query.type === 'detail') {
        this.rules = {}
      }
    },
    methods: {
      handleContent(content) {
        this.content_state = !this.handleCheckContent(content)
      },
      // 验证content 的数据是否正确或者是否存在
      handleCheckContent(content_list) {
        var content_list_length = content_list.length
        if (content_list_length <= 0) {
          return false
        }

        for (var item of content_list) {
          if (item.from === '' || item.to === '') {
            return false
          }
        }
        return true
      },
      closeSelectCategory(val) {
        this.category_list = val
      },
      deleteGift(type) {
        this.$confirm('Are you sure you want to delete this gift? <br /> This operation may affect your redemption catalogue and ongoing campaigns', 'Please confirm', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          confirmButtonClass: 'new_confirm_confirm',
          cancelButtonClass: 'new_confirm_cancel'
        }).then(() => {
          // success
          this.handleDelete(type)
        }).catch(() => {
          // cancel
        })
      },
      handleDelete(type) {
        this.delete.loading = true
        batchDeleteGift(this.delete.params).then(res => {
          this.$message({
            type: 'success',
            message: 'Success!'
          })
          this.$router.go(-1)
          this.delete.loading = false
        }).catch(res => {
          this.$message.error(res)
        })
      },
      // 一行的删除
      lineDeleteGift(gift_code) {
        this.delete.params = {
          gift_codes: [gift_code]
        }
        this.deleteGift()
      },
      handleClickEdit() {
        this.query.type = 'edit'
        // this.$refs['coupon'].resetFields()
        this.handleGetDetailInfo()
        this.rules = {
          gift_code: [{ required: true, message: ' ', trigger: ['blur'] }, { validator: this.checkGiftCode, trigger: 'blur' }],
          gift_name: [{ required: true, message: ' ', trigger: ['blur', 'change'] }],
          gift_category_code: [{ required: true, message: ' ', trigger: ['blur', 'change'] }],
          unit: [{ required: true, message: ' ', trigger: ['blur', 'change'] }],
          dynamic_content: [{ validator: this.checkDynamicContent, message: ' ', trigger: ['blur', 'change'] }, { required: true, message: ' ', trigger: ['blur', 'change'] }],
          description: [{ validator: this.checkDescription, trigger: ['blur', 'change'] }, { required: true, message: ' ', trigger: ['blur', 'change'] }],
          image_url: [{ validator: this.checkImageUrl, trigger: ['blur', 'change'] }, { required: true, message: ' ', trigger: ['blur', 'change'] }],
          available_inventory: [{ required: true, message: ' ', trigger: ['blur', 'change'] }, { validator: this.checkAvailableInventory, trigger: ['blur', 'change'] }]
        }
      },
      handleGetDetailInfo() {
        searchGift({ 'gift_code': this.query.id, 'page_no': 1, 'page_size': 1, 'status': 1 }).then(res => {
          this.form = res.return_result.gifts[0]
          if (this.query.type === 'edit' || this.query.type === 'copy') {
            var content = JSON.parse(this.form.dynamic_content)
            this.$refs['dynamic_content'].list = []
            for (const key in content) {
              this.$refs['dynamic_content'].list.push({
                from: key,
                to: content[key]
              })
            }
          }
          // copy 除了gift code 和 stock 之外 其他的全部复制过来
          if (this.query.type === 'copy') {
            this.form = Object.assign({}, this.form, {
              auto_generate_code: false,
              gift_code: '',
              available_inventory: 1
            })
            // this.form.is_limited_inventory = false
          }
          this.detail_loading = false
        }).catch(() => {
          this.detail_loading = false
        })
      },
      editors(content) {
        this.form.description = content
      },
      handleImgUrl(val) {
        this.form.image_url = val
      },
      checkAvailableInventory(rule, value, callback) {
        var type = this.query.type
        if (type === 'detail' || this.form.is_limited_inventory) {
          callback()
          return true
        }
        if ((this.form.available_inventory) === '' || this.form.available_inventory === undefined) {
          callback(new Error(' '))
          return true
        }
        callback()
      },
      checkDescription(rule, value, callback) {
        var type = this.query.type
        if (type === 'detail') {
          callback()
          return true
        }
        if ((this.form.description) === '' || this.form.description === undefined) {
          this.description_state = true
          return true
        }
        callback()
        this.description_state = false
      },
      checkDynamicContent(rule, value, callback) {
        var type = this.query.type
        if (type === 'detail') {
          callback()
          return true
        }
        var content_list = this.$refs['dynamic_content'].list
        if ((this.form.dynamic_content) === '' || this.form.dynamic_content === undefined) {
          this.content_state = true
          callback()
          return true
        }
        if (!this.handleCheckContent(content_list)) {
          this.content_state = true
          callback()
          return true
        }
        this.content_state = false
        callback()
      },
      checkImageUrl(rule, value, callback) {
        var type = this.query.type
        if (type === 'detail') {
          callback()
          return true
        }
        if ((this.form.image_url) === '' || this.form.image_url === undefined) {
          this.image_state = true
          return true
        }
        this.image_state = false
        callback()
      },
      checkGiftCode(rule, value, callback) {
        var type = this.query.type
        if (type === 'detail' || this.form.auto_generate_code || type === 'edit') {
          callback()
          return true
        }
        if ((this.form.gift_code) === '' || this.form.gift_code === undefined) {
          callback(new Error(' '))
          return true
        }
        checkGiftCode({ gift_code: this.form.gift_code }).then(res => {
          const obj = res.return_result
          if (obj.exist) {
            this.$message.error(this.handleGlobalI18n('validation', 'gift_code_exist'))
            callback(new Error(' '))
          } else {
            callback()
          }
        }).then((res) => {
          callback(new Error(res))
        })
      },
      submitForm() {
        var content_list = this.$refs['dynamic_content'].list
        var content_length = content_list.length
        var dynamic_content = '{'
        content_list.forEach((item, index) => {
          dynamic_content += '"' + item.from + '"' + ':' + '"' + item.to + '"'
          if (index < content_length - 1) {
            dynamic_content += ','
          }
        })
        dynamic_content += '}'
        this.form.dynamic_content = dynamic_content
        if (this.content_state) {
          return true
        }
        this.$refs['gift'].validate(valid => {
          if (valid) {
            this.save_loading = true
            if (this.query.type === 'edit') {
              this.editSave()
            } else {
              this.save()
            }
          } else {
            this.save_loading = false
            return false
          }
        })
      },
      // 保存
      save() {
        newGift(this.form).then(res => {
          this.save_loading = false
          this.$router.go(-1)
          this.$message({
            message: 'Success',
            type: 'success'
          })
        }).catch(res => {
          this.save_loading = false
          this.$message.error(res)
        })
      },
      // 编辑保存
      editSave() {
        editGift(this.form).then(res => {
          this.save_loading = false
          this.$router.go(-1)
          this.$message({
            message: 'Success',
            type: 'success'
          })
        }).catch(res => {
          this.save_loading = false
          this.$message.error(res)
        })
      },
      getCategoryList() {
        queryGiftCategory({ page_no: 1, page_size: 100000, asc: false }).then(res => {
          this.category_list = res.return_result.results
        })
      },
      handleDialogVisible(bl) {
        this.dialog_show = bl
      },
      handleHeaderTitle() {
        var type = this.query.type
        if (type === 'detail') {
          return 'Basic Information'
        } else if (type === 'add' || type === 'copy') {
          return 'Add New Gift'
        } else if (type === 'edit') {
          return 'Edit Gift'
        }
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.addNewTagPage {
  .el-checkbox {
    width: 200px;
  }
  .transaction-div {
    margin-bottom: 20px;
    .label-46 {
      width: 46px;
      display: inline-block;
    }
    .transaction-input {
      width: 100px !important;
    }
  }
}
  .edit-add-detail-copy-gift {
    .category_add_button{
      background-color: $new-primary;
      border-color: $new-primary;
      min-width: 60px !important;
    }
    .content{
      display: flex;
    }
    .image-border{
      border: 1px solid #F56C6C;
      width: 240px;
    }
    .border-red{
      border: 1px solid #F56C6C;
    }
    .description-dev{
      white-space: pre-wrap;
      word-wrap: break-word;
      word-break: break-all;
      line-height: 1;
      width: 480px;
      overflow: hidden;
      > img{
        width: 100%;
      }
    }
    .dynamic_content, .description, .image_url{
      padding: 15px 0!important;
      align-items: flex-start!important;
      height: auto!important;
    }
    .unit{
      font-size:14px;
      color:rgba(102,102,102,1);
      line-height:16px;
    }
    .margin-left-20{
      margin-left: 20px;
    }
    .el-button{
      min-width: 88px;
    }
    .pagination-container {
      text-align: right;
      padding: 15px 0;
      background-color: #ffffff;
    }
    .el-input,.el-input-number{
      width: 300px;
    }
    .el-form-item{
      margin: 0 0 70px 20px;
      min-height: 66px;
      line-height: 66px;
      margin-bottom: 0!important;
      &:not(:last-child) {
        padding-top: 15px;
        border-bottom: 1px solid rgba(230,230,230,1);
      }
      &:last-child{
        padding: 15px 0 0px 0;
        height: auto!important;
      }
      display: flex;
      // align-items: center;
    }
    .el-select{
      width: 100px;
    }
    margin: 30px;
    .click-button {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      width: 100%;
      text-align: right;
      margin-bottom: -20px;
      .save{
        margin-left: 8px;
        background-color: $new-primary;
        border-color: $new-primary;
      }
      .cancel, .delete{
        border-color: $new-primary;
        color: $new-primary;
      }
    }
    .contain {
      position: relative;
      .info{
        background:rgba(255,255,255,1);
        box-shadow:0 5px 15px -3px rgba(204,204,204,1);
        width: 100%;
      }
    }
    .p{
      text-align: right;
      vertical-align: middle;
      float: left;
      font-size: 14px;
      color: #606266;
      line-height: 40px;
      padding: 0 12px 0 0;
      margin-top: -20px;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
    }
  }
</style>
<style rel="stylesheet/scss" lang="scss">
  @import "../../new-theme-css";
  .edit-add-detail-copy-gift{
    .el-checkbox__input.is-checked .el-checkbox__inner{
      background-color: $new-primary;
      border-color: $new-primary;
    }
    .el-checkbox__input.is-checked + .el-checkbox__label{
      color: $new-primary;
    }
    .el-checkbox__inner:hover{
      border-color: $new-primary;
    }
    .el-table th{
      padding: 4px 0 !important;
    }
    .el-table__empty-block{
      min-height: 42px!important;
      height: 32px!important;
    }

    .el-form-item .el-form-item__label {
      font-size: 14px!important;
      font-weight: bold!important;
      color: rgba(51,51,51,1);
      line-height: 17px!important;
      &:before{
        color: rgba(51,51,51,1)!important;
      }
    }
    .el-form-item__content{
      margin-left: 0!important;
      width: 100% !important
    }
  }
  .deep-blue {
  background-color: #2777FF !important;
  border-color: #2777FF !important;
}
</style>
