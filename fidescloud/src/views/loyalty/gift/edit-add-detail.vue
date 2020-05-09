<template>
  <div class="edit-add-detail-copy-gift new-theme-css" v-loading="detail_loading">
    <div class="click-button">
      <template v-if="query.type === 'detail'">
        <p class="top-p-left" />
      </template>
      <template v-else>
        <p />
      </template>
      <!--如果是进入查看详情，显示下面的操作按钮-->
      <template v-if="query.type === 'detail'">
        <div>
          <!--Back only-->
          <el-button class="cancel" @click="goBack()">{{$t('loyalty.fc_operation_btn_back_label')}}</el-button>
          <!--Edit-->
          <el-button type="primary" class="save el-button-width-108" @click="handleClickEdit">{{$t('loyalty.fc_operation_btn_edit_label')}}</el-button>
        </div>
      </template>
      <!--如果是通过点击edit进入，显示下面的操作按钮-->
      <template v-else-if="query.type === 'edit'">
        <div>
          <!--Delete-->
          <el-button class="delete" @click="lineDeleteGift(query.id)">{{$t('loyalty.fc_operation_btn_delete_label')}}</el-button>
          <!--Cancel-->
          <el-button class="cancel" @click="goBack()">{{$t('loyalty.fc_operation_btn_cancel_label')}}</el-button>
          <!--Save-->
          <el-button type="primary" :loading="save_loading" class="save" @click="submitForm('addEvent')">{{$t('loyalty.fc_operation_btn_save_label')}}</el-button>
        </div>
      </template>
      <!--通过点击Copy进来的，显示下面的操作按钮-->
      <template v-else>
        <div>
          <!--Cancel-->
          <el-button class="cancel" @click="goBack()">{{$t('loyalty.fc_operation_btn_cancel_label')}}</el-button>
          <!--Save-->
          <el-button type="primary" :loading="save_loading" class="save" @click="submitForm('addEvent')">{{$t('loyalty.fc_operation_btn_save_label')}}</el-button>
        </div>
      </template>
    </div>
    <!--info-->
    <div class="contain" :class="{'detail-contain' : query.type === 'detail'}">
      <!--title-->
      <ed-header-title :title="handleHeaderTitle()" />
      <el-form ref="gift" label-position="left" :model="form" :rules="rules"  label-width="300px">
        <div class="content">
          <div class="info">
              <!--Gift code-->
              <el-form-item :label="$t('loyalty.fc_add_gift_code_label')" :class="query.type !== 'detail' ? 'gift_code' : ''" prop="gift_code" ref="gift_code" :label-width="query.type !== 'detail' ? '285px' : '300px'">
                <template v-if="query.type=== 'detail'">
                  <p class="color-333">{{form.gift_code}}</p>
                </template>
                <template v-else-if="query.type=== 'edit'">
                  <el-input v-model="form.gift_code" :disabled="true" maxlength="32" :placeholder="$t('loyalty.fc_add_gift_code_input_label')"></el-input>
                </template>
                <template v-else>
                  <el-input :disabled="form.auto_generate_code" :placeholder="$t('loyalty.fc_add_gift_code_input_label')" maxlength="32" v-model="form.gift_code" />
                  <el-checkbox v-model="form.auto_generate_code" class="margin-left-20">{{$t('loyalty.fc_add_gift_code_auto_label')}}</el-checkbox>
                </template>
              </el-form-item>
              <!--Gift name-->
              <el-form-item :label="$t('loyalty.fc_add_gift_name_label')" prop="gift_name">
                <template v-if="query.type === 'detail'">
                  <p class="color-333">{{form.gift_name}}</p>
                </template>
                <template v-else>
                  <el-input :placeholder="$t('loyalty.fc_add_gift_name_input_label')" maxlength="32" v-model="form.gift_name" />
                </template>
              </el-form-item>
              <!--Available stock-->
              <el-form-item :label="$t('loyalty.fc_add_gift_stock_label')" prop="available_inventory" ref="available_inventory">
                <template v-if="query.type=== 'detail'">
                  <p class="color-333">{{form.is_limited_inventory ? $t('loyalty.fc_add_gift_stock_option_label') : form.available_inventory}}</p>
                </template>
                <template v-else>
                  <el-input-number :disabled="form.is_limited_inventory || query.type === 'edit'" :max="999999999" :min="query.type === 'edit' ? 0 : 1" :precision="0" :step="1" v-model.number="form.available_inventory" />
                  <el-checkbox v-model="form.is_limited_inventory" class="margin-left-20">{{$t('loyalty.fc_add_gift_stock_option_label')}}</el-checkbox>
                </template>
              </el-form-item>
              <!--Number of redeemed gifts-->
              <template v-if="query.type === 'edit'">
                <el-form-item :label="$t('loyalty.fc_edit_gift_number_gifts_label')">
                  <template>
                    <el-input disabled v-model.number="form.redeemed_counts" />
                  </template>
                </el-form-item>
                <el-form-item :label="$t('loyalty.fc_edit_gift_stock_adjustment_label')">
                  <div style="display: flex; align-items: center;">
                    <el-input-number :disabled="form.is_limited_inventory" :max="999999999-form.available_inventory" :min="0-form.available_inventory" :precision="0" :step="1" v-model.number="stock_adjustment" />
                    <div class="margin-left-20" style="display: flex;align-items: center;">
                      <i class="el-icon-info" />
                      <span style="margin-left: 5px;"><v-clamp :max-lines="1" autoresize>{{$t('loyalty.fc_edit_gift_stock_adjustment_tips_label')}}</v-clamp></span>
                    </div>
                  </div>
                </el-form-item>
              </template>
              <!-- Retail Market price-->
              <el-form-item :label="$t('loyalty.fc_add_gift_market_price_label')" prop="unit_price">
                <template v-if="query.type === 'detail'">
                  <p class="color-333">{{`${form.unit_price} ${unit}`}}</p>
                </template>
                <template v-else>
                  <el-input-number v-model="form.unit_price" :min="0.00" :precision="2" placeholder="0.00" />
                  <label class="margin-left-20 unit">{{unit}}</label>
                </template>
              </el-form-item>
              <!-- Purchased price-->
              <el-form-item :label="$t('loyalty.fc_add_gift_purchased_price_label')" prop="purchased_price">
                <template v-if="query.type === 'detail'">
                  <p class="color-333">{{`${form.purchased_price} ${unit}`}}</p>
                </template>
                <template v-else>
                  <el-input-number v-model="form.purchased_price" :min="0.00" :precision="2" placeholder="0.00" />
                  <label class="margin-left-20 unit">{{unit}}</label>
                </template>
              </el-form-item>
              <!--Gift category-->
              <el-form-item :label="$t('loyalty.fc_add_gift_category_label')" prop="gift_category_code">
                <template v-if="query.type === 'detail'">
                  <template v-for="(item1, index) in category_list" >
                    <p class="color-333" :key="index" v-if="item1.gift_category_code === form.gift_category_code">{{item1.gift_category_name}}</p>
                  </template>
                </template>
                <template v-else>
                  <el-select v-model="form.gift_category_code" clearable filterable style="width: 300px;" :loading="category_list_status">
                    <el-option :key="index" :label="item1.gift_category_name" :value="item1.gift_category_code" class="new-select-option" v-for="(item1, index) in category_list" />
                  </el-select>
                  <el-button class="margin-left-20 new-button-not-primary category_add_button" @click="dialog_show=true" type="primary">{{$t('loyalty.fc_add_gift_category_btn_add_label')}}</el-button>
                </template>
              </el-form-item>
              <!--Gift unit-->
              <el-form-item :label="$t('loyalty.fc_add_gift_unit_label')" prop="unit">
                <template v-if="query.type === 'detail'">
                  <p class="color-333">{{form.unit || table_placeholder}}</p>
                </template>
                <template v-else>
                  <el-input maxlength="20" placeholder="" v-model="form.unit" />
                </template>
              </el-form-item>
              <!--description-->
              <el-form-item :label="$t('loyalty.fc_add_gift_description_label')" prop="description" class="description" :class="{'height-60': query.type === 'detail'}">
                <template v-if="query.type === 'detail'">
                  <div v-html="form.description" class="description-dev color-333" style="margin-top: 9px;"></div>
                </template>
                <template v-else>
                  <div class="custom-word-count">{{$t('loyalty.fc_edit_gift_description_tips_label', { 350: 400000 - form.description.length })}}</div>
                  <div style="width: 66%;">
                    <editor-description class="editor"  @show="editors" :value="form.description" style="width: 100%; min-width: 420px; height: 300px;" />
                  </div>
                </template>
              </el-form-item>
              <!--image-->
              <el-form-item :label="$t('loyalty.fc_add_gift_image_label')" prop="image_url" class="image_url">
              <template v-if="query.type === 'detail'">
                <img :src="form.image_url" alt="" style="width: 240px;">
              </template>
              <template v-else>
                <label-image :class="{'image-border' : image_state}" :image="form.image_url" @handleImgUrl="handleImgUrl" ref="image" />
              </template>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </div>
    <!--redemption information-->
    <div class="contain detail-contain margin-top-52-border" v-if="query.type === 'detail'">
      <ed-header-title :title="$t('loyalty.fc_gift_details_redemption_section_title')" />
      <el-form  label-position="left" :model="form" label-width="300px">
        <div class="content">
          <div class="info" style="height: 133px;">
            <!--used in redemption-->
            <el-form-item :label="$t('loyalty.fc_gift_details_redemption_used_label')">
              <p class="color-333">{{form.is_used_in_redemption ? 'Yes' : 'No'}}</p>
            </el-form-item>
            <!--Number of redeemed gifts-->
            <el-form-item :label="$t('loyalty.fc_gift_details_redemption_number_label')">
              <p class="color-333">{{ form.redeemed_counts ? form.redeemed_counts : 0 }}</p>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </div>
    <add-category @closeSelectCategory="closeSelectCategory" :dialog_show="dialog_show" @handleDialogVisible="handleDialogVisible" />
  </div>
</template>

<script>
  import VClamp from 'vue-clamp'
  import { queryGiftCategory, checkGiftCode, newGift, editGift, batchDeleteGift, getGiftByCode } from '@/api/loyalty'
  import LabelImage from './image'
  import EditorDescription from '@/components/Description'
  import LabelContent from './content'
  import AddCategory from './add-category'
  import { handleOssFileHtmlStr } from '@/views/data/oss-file-html-str'
  export default {
    mixins: [handleOssFileHtmlStr],
    components: {
      VClamp,
      LabelContent,
      EditorDescription,
      LabelImage,
      AddCategory
    },
    watch: {
      'form.description': {
        handler(val) {
          if (val && val.length > 400000) {
            this.form.description = val.substr(0, 400000)
          }
        }
      },
      'form.image_url': {
        handler(val) {
          this.image_state = (val === '')
        }
      }
    },
    data() {
      return {
        stock_adjustment: 0,
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
          gift_code: [{ validator: this.checkGiftCode, trigger: 'blur' }],
          gift_name: [{ required: true, message: ' ', trigger: ['blur', 'change'], validator: this.checkGiftName }],
          gift_category_code: [{ required: true, message: ' ', trigger: ['blur', 'change'] }],
          unit: [{ required: true, message: ' ', trigger: ['blur', 'change'] }],
          image_url: [{ validator: this.checkImageUrl, trigger: ['blur', 'change'] }, { required: true, message: ' ', trigger: ['blur', 'change'] }],
          available_inventory: [{ required: true, message: ' ', trigger: ['blur', 'change'], validator: this.checkAvailableInventory }]
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
          image_url: '',
          description: ''
        },
        query: {},
        category_list: [],
        category_list_status: true
      }
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
      checkGiftName(rule, value, callback) {
        const type = this.query.type
        if (type === 'detail') {
          callback()
          return true
        }
        if (this.form.gift_name.length > 32) {
          this.$message.error('Gift name is 32 bits long')
          callback(new Error(' '))
          return true
        }
        callback()
      },
      closeSelectCategory(val) {
        this.category_list = val
      },
      deleteGift(type) {
        this.$confirm(this.$t('loyalty.fc_gift_delete_content_label'), this.$t('loyalty.fc_operation_delete_confirm_title_label'), {
          dangerouslyUseHTMLString: true,
          confirmButtonText: this.$t('loyalty.fc_operation_btn_confirm_label'),
          cancelButtonText: this.$t('loyalty.fc_operation_btn_cancel_label'),
          confirmButtonClass: 'new_confirm_confirm',
          cancelButtonClass: 'new_confirm_cancel'
        }).then(() => {
          // success
          this.handleDelete(type)
        }).catch(() => {
          // do something
        })
      },
      handleDelete() {
        this.delete.loading = true
        batchDeleteGift(this.delete.params).then(() => {
          this.$message({
            type: 'success',
            message: this.$t('loyalty.fc_gift_delete_notification_label')
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
        this.$nextTick(() => {
          this.rules = {
            gift_code: [{ validator: this.checkGiftCode, trigger: 'blur' }],
            gift_name: [{ required: true, message: ' ', trigger: ['blur', 'change'] }],
            gift_category_code: [{ required: true, message: ' ', trigger: ['blur', 'change'] }],
            unit: [{ required: true, message: ' ', trigger: ['blur', 'change'] }],
            image_url: [{ validator: this.checkImageUrl, trigger: ['blur', 'change'] }, { required: true, message: ' ', trigger: ['blur', 'change'] }],
            available_inventory: [{ required: true, message: ' ', trigger: ['blur', 'change'], validator: this.checkAvailableInventory }]
          }
        })
      },
      handleGetDetailInfo() {
        getGiftByCode({ 'gift_code': this.query.id }).then(res => {
          this.form = res.return_result
          this.form.redeemed_counts = this.form.redeemed_counts ? this.form.redeemed_counts : 0
          this.form.is_limited_inventory = !this.form.is_limited_inventory
          // copy 除了gift code 和 stock 之外 其他的全部复制过来
          if (this.query.type === 'copy') {
            this.form = Object.assign({}, this.form, {
              auto_generate_code: false,
              gift_code: '',
              gift_name: 'Copy-' + this.form.gift_name,
              available_inventory: 1
            })
            // this.form.is_limited_inventory = false
          }
          // select description
          if (this.form.description) {
            this.handleHtml2str(this.form.description).then(res => {
              this.form.description = res
            })
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
        const type = this.query.type
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
      checkImageUrl(rule, value, callback) {
        const type = this.query.type
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
        const type = this.query.type
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
          callback(new Error(' '))
        })
      },
      submitForm() {
        // edit 处理库存000000000000000000000000000000000000
        if (!this.form.is_limited_inventory && this.query.type === 'edit') {
          this.form.available_inventory += this.stock_adjustment
        }
        // 000000000000000000000000000000000000000000000000
        this.$refs['gift'].validate(valid => {
          if (valid) {
            this.save_loading = true
            this.handleSubmitForm()
          } else {
            this.save_loading = false
            return false
          }
        })
      },
      async handleSubmitForm() {
        let description = ''
        if (this.form.description) {
          await this.handleStr2html(this.form.description, true).then(res => {
            description = res
          }).catch(() => {
            this.save_loading = false
            this.$message.error(this.$t('configuration.fc_operation_failed_notification_label'))
          })
        }
        if (this.query.type === 'edit') {
          await this.editSave(description)
        } else {
          await this.save(description)
        }
      },
      // 保存
      save(description) {
        return newGift({ ...this.form, description: description, is_limited_inventory: !this.form.is_limited_inventory }).then(() => {
          this.save_loading = false
          this.$router.go(-1)
          this.$message.success(this.$t('configuration.fc_operation_feedback_notification_label'))
        }).catch(res => {
          this.save_loading = false
          this.$message.error(res)
        })
      },
      // 编辑保存
      editSave(description) {
        return editGift({ ...this.form, description: description, is_limited_inventory: !this.form.is_limited_inventory }).then(() => {
          this.save_loading = false
          this.$router.go(-1)
          this.$message.success(this.$t('configuration.fc_operation_feedback_notification_label'))
        }).catch(res => {
          this.save_loading = false
          this.$message.error(res)
        })
      },
      getCategoryList() {
        queryGiftCategory({ page_no: 1, page_size: 100000, asc: false }).then(res => {
          this.category_list = res.return_result.results || []
          this.category_list_status = false
        }).catch(() => {
          this.category_list_status = false
        })
      },
      handleDialogVisible(bl) {
        this.dialog_show = bl
      },
      handleHeaderTitle() {
        const type = this.query.type
        if (type === 'detail') {
          return this.$t('loyalty.fc_gift_details_basic_section_title')
        } else if (type === 'add' || type === 'copy') {
          return this.$t('loyalty.fc_add_gift_title_label')
        } else if (type === 'edit') {
          return this.$t('loyalty.fc_edit_gift_title_label')
        }
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .edit-add-detail-copy-gift {
    .custom-word-count{
      position: absolute;
      z-index: 11;
      right: 34%;
      padding-right: 3px;
      bottom: 2px;
      line-height: 1.8;
      background: #ffffff;
    }
    .margin-top-52-border{
      margin-top: 52px;
      border-top: 1px dashed #cccccc;
    }
    /deep/ .gift_code{
      &:before{
        content: '*';
        margin-right: 4px;
      }
    }
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
      height: 66px;
      line-height: 66px;
      margin-bottom: 0!important;
      &:not(:last-child) {
        border-bottom: 1px solid rgba(230,230,230,1);
      }
      &:last-child{
        padding: 12px 0 70px 0;
        height: auto!important;
      }
      display: flex;
      align-items: center;
    }
    .el-select{
      width: 100px;
    }
    margin: 30px;
    .click-button {
      position: relative;
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: space-between;
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
      .cancel{
        background-color: #ffffff;
      }
    }
    .contain {
      z-index: 1;
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
    .height-60{
      min-height:66px!important;
    }
    /deep/ .height-60 .el-form-item__label, .line-height-33 .line-height-1{
      line-height: 33px!important;
    }
  }
</style>
<style rel="stylesheet/scss" lang="scss">
  @import "../new-theme-css";
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
</style>
