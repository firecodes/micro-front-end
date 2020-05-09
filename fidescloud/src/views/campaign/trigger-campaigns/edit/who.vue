<template>
  <div class="trigger-campaign-who-item" ref="who">
    <el-form label-width="160px" >
      <p class="p">{{$t('campaign.fc_campaign_trigger_edit_who_title_label')}}</p>
      <!--选择模式-->
      <div class="select-mode">
        <el-form-item :label="$t('campaign.fc_campaign_trigger_edit_who_audience_label')">
          <el-select v-model="form.select_type">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="$t(`campaign.${item.name}`)"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </div>
      <!--选择模式为目标会员-->
      <div class="target-member-mode" v-if="form.select_type === 'filter'">
        <div class="profile-target t"  v-for="(item,index) in by_profile" :key="index">
            <label class="title">{{ handleGlobalI18n('campaign', item.criteria_group).substring(0,1).toUpperCase()+handleGlobalI18n('campaign', item.criteria_group).substring(1)}}</label>
            <div class="ul">
              <template  v-for="item1 in item.criteria_field" >
                <!--tiers-->
                <div class="li" :class="{'check': tags.tier_name.length>0}" v-if="item1.criteria_field_code==='tiers'">
                  <p @click="clickP(item1.criteria_field_code)"><span>+</span>{{handleFirstToUpperCase(item1.criteria_field_name)}}</p>
                  <by-profile :data="tags.tier_name" @handleDelete="handleDelete" />
                </div>
                <!--age-->
                <div class="li" :class="{'check': tags.age.length>0 }" v-else-if="item1.criteria_field_code==='age'">
                  <p @click="clickP(item1.criteria_field_code)" ><span>+</span>{{handleFirstToUpperCase(item1.criteria_field_name)}}</p>
                  <by-profile :data="tags.age" @handleDelete="handleDeleteAge" />
                </div>
                <!--birthday-->
                <div class="li" :class="{'check': tags.birthday.length>0}" v-else-if="item1.criteria_field_code==='birthday'">
                  <p @click="clickP(item1.criteria_field_code)" ><span>+</span>{{handleFirstToUpperCase(item1.criteria_field_name)}}</p>
                  <by-profile :data="tags.birthday" @handleDelete="handleDeleteBirthday" />
                </div>
                <!--join date-->
                <div class="li" :class="{'check': tags.join_date.length>0}" v-else-if="item1.criteria_field_code==='join_date'">
                  <p @click="clickP(item1.criteria_field_code)" ><span>+</span>{{handleFirstToUpperCase(item1.criteria_field_name)}}</p>
                  <by-profile :data="tags.join_date" @handleDelete="handleDeleteJoinDate" />
                </div>
                <!--register store-->
                <div class="li" :class="{'check': tags.register_store.name.length>0}" v-else-if="item1.criteria_field_code==='register_store'">
                  <p @click="clickP(item1.criteria_field_code)" ><span>+</span>{{handleFirstToUpperCase(item1.criteria_field_code)}}</p>
                  <by-profile :data="tags.register_store.name" @handleDelete="handleDeleteRegisterStore" />
                </div>
                <!--register channel-->
                <div class="li" :class="{'check': tags.register_channel.name.length>0}" v-else-if="item1.criteria_field_code==='register_channel'">
                  <p @click="clickP(item1.criteria_field_code)" ><span>+</span>{{handleFirstToUpperCase(item1.criteria_field_code)}}</p>
                  <by-profile :data="tags.register_channel.name" @handleDelete="handleDeleteRegisterChannel" />
                </div>
                <!--lastest purchase date-->
                <div class="li" :class="{'check': tags.lastest_purchase_date.length>0}" v-else-if="item1.criteria_field_code==='lastest_purchase_date'">
                  <p @click="clickP(item1.criteria_field_code)" ><span>+</span>{{handleFirstToUpperCase(item1.criteria_field_name)}}</p>
                  <by-profile :data="tags.lastest_purchase_date" @handleDelete="handleDeleteLastPurchaseDate" />
                </div>
                <!--average basket-->
                <div class="li" :class="{'check': tags.average_basket.length>0}" v-else-if="item1.criteria_field_code==='average_basket'">
                  <p @click="clickP(item1.criteria_field_code)" ><span>+</span>{{handleFirstToUpperCase(item1.criteria_field_code)}}</p>
                  <by-profile :data="tags.average_basket" @handleDelete="handleDeleteAverageBasket" />
                </div>
                <!--average items-->
                <div class="li" :class="{'check': tags.average_items.length>0}" v-else-if="item1.criteria_field_code==='average_items'">
                  <p @click="clickP(item1.criteria_field_code)" ><span>+</span>{{handleFirstToUpperCase(item1.criteria_field_code)}}</p>
                  <by-profile :data="tags.average_items" @handleDelete = "handleDeleteAverageBasketSize" />
                </div>
                <!--purchased product-->
                <div class="li" :class="{'check': tags.purchased_product.name.length>0}" v-else-if="item1.criteria_field_code==='purchased_product'">
                  <p @click="clickP(item1.criteria_field_code)" ><span>+</span>{{handleFirstToUpperCase(item1.criteria_field_code)}}</p>
                  <by-profile :data="tags.purchased_product.name" @handleDelete="handleDeletePurchasedProduct" />
                </div>
                <!--purchased brand-->
                <div class="li" :class="{'check': tags.purchased_brand.name.length>0}" v-else-if="item1.criteria_field_code==='purchased_brand'">
                  <p @click="clickP(item1.criteria_field_code)" ><span>+</span>{{handleFirstToUpperCase(item1.criteria_field_code)}}</p>
                  <by-profile :data="tags.purchased_brand.name" @handleDelete="handleDeletePurchasedBrand" />
                </div>
                <!--purchased category-->
                <div class="li" :class="{'check': tags.purchased_category.name.length>0}" v-else-if="item1.criteria_field_code==='purchased_category'">
                  <p @click="clickP(item1.criteria_field_code)" ><span>+</span>{{handleFirstToUpperCase(item1.criteria_field_code)}}</p>
                  <by-profile :data="tags.purchased_category.name" @handleDelete="handleDeletePurchasedCategory" />
                </div>
                <!--available point-->
                <div class="li" :class="{'check': tags.available_point.length>0}" v-else-if="item1.criteria_field_code==='available_point'">
                  <p @click="clickP(item1.criteria_field_code)" ><span>+</span>{{handleFirstToUpperCase(item1.criteria_field_name)}}</p>
                  <by-profile :data="tags.available_point" @handleDelete="handleDeleteAvailablePoint" />
                </div>
                <!--campaign respondent-->
                <div :class="{'check': tags.campaign_respondent.length>0}" class="li" v-else-if="item1.criteria_field_code==='campaign_respondent'">
                  <p @click="clickP(item1.criteria_field_code)" ><span>+</span>{{handleFirstToUpperCase(item1.criteria_field_code)}}</p>
                  <by-profile :data="tags.campaign_respondent" @handleDelete="handleDeleteCampaignRespondent" />
                </div>
              </template>
            </div>
          </div>
      </div>
    </el-form>
    <el-dialog :title="handleDialogTitle" :visible.sync="selectDialog" width="350px">
      <el-form label-position="top" :model="dialogData" :rules="rulesDialog" ref="dialog">
        <el-form-item :label="handleGlobalI18n('campaign', 'select_tier_field_name')" v-if="profile_type==='tiers'">
          <el-select
            v-model="transfer_tier"
            style="width: 300px"
            multiple
            filterable
            allow-create
            :placeholder="handleGlobalI18n('campaign', 'please_select')"
            default-first-option >
            <el-option
              v-for="(item, index) in tier_list"
              :key="item.member_tier_code"
              :label="item.member_tier_name"
              :value="index">
            </el-option>
          </el-select>
        </el-form-item>
        <div v-else-if="profile_type==='age'">
          <el-form-item :label="handleGlobalI18n('campaign', 'select_from')" prop="age_from">
            <el-input-number :min="0" :precision="0" :step="1" style="width:300px;" v-model="dialogData.age_from" />
          </el-form-item>
          <el-form-item :label="handleGlobalI18n('campaign', 'select_to')"  prop="age_to">
            <el-input-number :min="0" :precision="0" :step="1" style="width:300px;" v-model="dialogData.age_to" />
          </el-form-item>
        </div>
        <div v-else-if="profile_type==='birthday'">
          <el-form-item :label="handleGlobalI18n('campaign', 'select_from')">
            <el-date-picker
              style="width: 300px"
              v-model="birthday_from"
              format="MM-dd"
              :picker-options="pickerOptions1"
              value-format="MMdd"
              type="date">
            </el-date-picker>
          </el-form-item>
          <el-form-item :label="handleGlobalI18n('campaign', 'select_to')">
            <el-date-picker
              style="width: 300px"
              v-model="birthday_to"
              format="MM-dd"
              :picker-options="pickerOptions1"
              value-format="MMdd"
              type="date">
            </el-date-picker>
          </el-form-item>
        </div>
        <div v-else-if="profile_type==='join_date'">
          <el-form-item :label="handleGlobalI18n('campaign', 'select_from')">
            <el-date-picker
              style="width: 300px"
              v-model="join_date_from"
              :picker-options="pickerOptions1"
              :value-format="globalData.value.date_format"
              :format="globalData.value.date_format"
              type="date">
            </el-date-picker>
          </el-form-item>
          <el-form-item :label="handleGlobalI18n('campaign', 'select_to')">
            <el-date-picker
              style="width: 300px"
              v-model="join_date_to"
              :picker-options="pickerOptions1"
              :format="globalData.value.date_format"
              :value-format="globalData.value.date_format"
              type="date">
            </el-date-picker>
          </el-form-item>
        </div>
        <div v-else-if="profile_type==='register_channel'">
          <el-form-item :label="handleGlobalI18n('campaign', 'select_register_channel_field_name')">
            <multiple-register-channel :value="tags.register_channel.index" @registration_channel = "selectRegistration" ref="reg_channel" />
          </el-form-item>
        </div>
        <div v-else-if="profile_type==='register_store'">
          <el-form-item :label="handleGlobalI18n('campaign', 'select_register_store_field_name')">
            <multiple-register-store :value="tags.register_store.index" @registration_store = "selectRegistration" ref="reg_store" />
          </el-form-item>
        </div>
        <div v-else-if="profile_type==='lastest_purchase_date'">
          <el-form-item :label="handleGlobalI18n('campaign', 'select_from')">
            <el-date-picker
              style="width:300px;"
              v-model="lastest_purchase_date_from"
              :format="globalData.value.date_format"
              :value-format="globalData.value.date_format"
              type="date">
            </el-date-picker>
          </el-form-item>
          <el-form-item :label="handleGlobalI18n('campaign', 'select_to')">
            <el-date-picker
              style="width:300px;"
              v-model="lastest_purchase_date_to"
              :format="globalData.value.date_format"
              :value-format="globalData.value.date_format"
              type="date">
            </el-date-picker>
          </el-form-item>
        </div>
        <div v-else-if="profile_type==='average_basket'">
          <el-form-item :label="handleGlobalI18n('campaign', 'select_from')" prop="average_basket_from">
            <el-input-number :min="0" :precision="2" :step="1" style="width:300px;"  v-model="average_basket_from" />
          </el-form-item>
          <el-form-item :label="handleGlobalI18n('campaign', 'select_to')" prop="average_basket_to">
            <el-input-number :min="0" :precision="2" :step="1" style="width:300px;" v-model="average_basket_to" />
          </el-form-item>
        </div>
        <div v-else-if="profile_type==='average_items'">
          <el-form-item :label="handleGlobalI18n('campaign', 'select_from')">
            <el-input-number :min="0" :step="1" style="width:300px;"  v-model="average_items_from" />
          </el-form-item>
          <el-form-item :label="handleGlobalI18n('campaign', 'select_to')">
            <el-input-number :min="0" :step="1" style="width:300px;"  v-model="average_items_to" />
          </el-form-item>
        </div>
        <div v-else-if="profile_type==='available_point'">
          <el-form-item :label="handleGlobalI18n('campaign', 'select_from')" prop="available_point_from">
            <el-input-number :min="0" :precision="2" :step="1" style="width:300px;" v-model="available_point_from" />
          </el-form-item>
          <el-form-item :label="handleGlobalI18n('campaign', 'select_to')" prop="available_point_to">
            <el-input-number :min="0" :precision="2" :step="1" style="width:300px;" v-model="available_point_to" />
          </el-form-item>
        </div>
        <div v-else-if="profile_type==='purchased_product'">
          <el-form-item :label="handleGlobalI18n('campaign', 'purchased_product')">
            <product-list @select-product-arr = "selectRegistration" :value="tags.purchased_product.index" />
          </el-form-item>
        </div>
        <div v-else-if="profile_type==='purchased_brand'">
          <el-form-item :label="handleGlobalI18n('campaign', 'brand')">
            <brand-list @brand_value = "selectRegistration" :value="tags.purchased_brand.index" />
          </el-form-item>
        </div>
        <div v-else-if="profile_type==='purchased_category'">
          <el-form-item :label="handleGlobalI18n('campaign', 'category')">
            <category-list @category_value = "selectRegistration" :value="tags.purchased_category.index" />
          </el-form-item>
        </div>
        <div v-else-if="profile_type==='campaign_respondent'">
          <el-form-item :label="handleGlobalI18n('campaign', 'campaign')">
            <el-select v-model="campaign_respondent" style="width: 300px;">
              <el-option :label="handleGlobalI18n('campaign', 'EDM')" key="1" value="EDM" />
              <el-option :label="handleGlobalI18n('campaign', 'coupon')" key="2" value="Coupons" />
              <el-option :label="handleGlobalI18n('loyalty', 'gift')" key="3" value="Gifts" />
            </el-select>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="selectDialog = false">{{handleGlobalI18n('campaign', 'back')}}</el-button>
        <el-button type="primary" @click="closeDialog(profile_type)" v-if="profile_type!=='tiers'">{{handleGlobalI18n('campaign', 'submit')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import { who_target_1 } from '@/data/trigger-campaign'
  import ByProfile from '../../campaign-setting/by-profile'
  import MultipleRegisterChannel from '../../campaign-setting/basic-info/multiple_select_register_channel'
  import MultipleRegisterStore from '../../campaign-setting/basic-info/multiple_select-register_store'
  import ProductList from '@/views/campaign/product-list'
  import CategoryList from '@/views/campaign/category-list'
  import {
    validateCompare,
    validatePositiveInteger
  } from '@/utils/validate'
  import { isObjectValueEqual } from '@/utils'
  import { who_options } from '@/data/trigger-campaign'
  import BrandList from '@/views/campaign/brand-list'
  export default {
    components: {
      BrandList,
      ByProfile,
      MultipleRegisterChannel,
      MultipleRegisterStore,
      ProductList,
      CategoryList
    },
    props: {
      tier_list: {
        type: Array
      },
      nonius_id: {
        type: Number,
        default: 1
      },
      form_data: {
        type: Object,
        default: {}
      }
    },
    data() {
      return {
        purchased_brand: '',
        purchased_category: '',
        campaign_respondent: '',
        purchased_product: '',
        average_items_from: '',
        average_items_to: '',
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7
          }
        },
        pickerOptions1: {
          disabledDate(time) {
            return time.getTime() > Date.now() - 8.64e6
          }
        },
        rulesDialog: {
          age_from: [
            { validator: this.validateAgeFrom, trigger: ['blur', 'change'] }
          ],
          age_to: [
            { validator: this.validateAgeTo, trigger: ['blur', 'change'] }
          ],
          average_basket_from: [
            { validator: this.validateAverageBasketFrom, trigger: ['blur', 'change'] }
          ],
          average_basket_to: [
            { validator: this.validateAverageBasketTo, trigger: ['blur', 'change'] }
          ],
          available_point_from: [
            { validator: this.validateAvailablePointFrom, trigger: ['blur', 'change'] }
          ],
          available_point_to: [
            { validator: this.validateAvailablePointTo, trigger: ['blur', 'change'] }
          ]
        },
        birthday_from: '',
        birthday_to: '',
        join_date_from: '',
        join_date_to: '',
        lastest_purchase_date_from: '',
        lastest_purchase_date_to: '',
        average_basket_from: '',
        average_basket_to: '',
        available_point_from: '',
        available_point_to: '',
        dialogData: {
          age_from: '',
          age_to: ''
        },
        transfer_tier: [],
        profile_type: 'profile_type',
        selectDialog: false,
        by_profile: who_target_1,
        tags: {
          tier_code: [],
          tier_name: [],
          age: [],
          birthday: [],
          join_date: [],
          register_channel: {
            value: [],
            name: [],
            index: []
          },
          register_store: {
            value: [],
            name: [],
            index: []
          },
          lastest_purchase_date: [],
          average_basket: [],
          available_point: [],
          average_items: [],
          purchased_product: {
            value: [],
            name: [],
            index: []
          },
          purchased_brand: {
            value: [],
            name: [],
            index: []
          },
          purchased_category: {
            value: [],
            name: [],
            index: []
          },
          campaign_respondent: []
        },
        options: who_options,
        form: {}
      }
    },
    computed: {
      handleDialogTitle() {
        return this.handleFirstToUpperCase(this.profile_type)
      }
    },
    methods: {
      validatePositiveInteger,
      validateCompare,
      isObjectValueEqual,
      handleDeletePurchasedBrand(tag) {
        const key = this.tags.purchased_brand.name.indexOf(tag)
        this.tags.purchased_brand.name.splice(key, 1)
        this.tags.purchased_brand.value.splice(key, 1)
        this.tags.purchased_brand.index.splice(key, 1)
      },
      handleDeletePurchasedCategory(tag) {
        const key = this.tags.purchased_category.name.indexOf(tag)
        this.tags.purchased_category.name.splice(key, 1)
        this.tags.purchased_category.value.splice(key, 1)
        this.tags.purchased_category.index.splice(key, 1)
      },
      handleDeleteCampaignRespondent(tag) {
        this.campaign_respondent = ''
        this.tags.campaign_respondent.splice(this.tags.campaign_respondent.indexOf(tag), 1)
      },
      handleDeleteAverageBasketSize(tag) {
        this.average_items = ''
        this.tags.average_items.splice(this.tags.average_items.indexOf(tag), 1)
      },
      handleDeletePurchasedProduct(tag) {
        const key = this.tags.purchased_product.name.indexOf(tag)
        this.tags.purchased_product.name.splice(key, 1)
        this.tags.purchased_product.value.splice(key, 1)
        this.tags.purchased_product.index.splice(key, 1)
      },
      // 翻译
      handleFirstToUpperCase(value) {
        return this.handleGlobalI18n('campaign', value).substring(0, 1).toUpperCase() + this.handleGlobalI18n('campaign', value).substring(1)
      },
      validateAgeFrom(rule, value, callback) {
        this.validatePositiveInteger(this.dialogData.age_from, callback)
      },
      validateAgeTo(rule, value, callback) {
        this.validateCompare(this.dialogData.age_from, this.dialogData.age_to, callback)
      },
      validateAverageBasketFrom(rule, value, callback) {
        this.validatePositiveInteger(this.average_basket_from, callback)
      },
      validateAverageBasketTo(rule, value, callback) {
        this.validateCompare(this.average_basket_from, this.average_basket_to, callback)
      },
      validateAvailablePointFrom(rule, value, callback) {
        this.validatePositiveInteger(this.available_point_from, callback)
      },
      validateAvailablePointTo(rule, value, callback) {
        this.validateCompare(this.available_point_from, this.available_point_to, callback)
      },
      selectRegistration(obj) {
        switch (obj.type) {
          case 'channel': {
            this.tags.register_channel.value = []
            this.tags.register_channel.name = []
            const value = obj.value
            for (let i = 0; i < value.length; i++) {
              this.$set(this.tags.register_channel.value, i, value[i].channel_code)
              this.$set(this.tags.register_channel.name, i, value[i].channel_name)
            }
            this.tags.register_channel.index = obj.index
            break
          }
          case 'registration_store': {
            this.tags.register_store.value = []
            this.tags.register_store.name = []
            const value = obj.value
            for (let i = 0; i < value.length; i++) {
              this.$set(this.tags.register_store.value, i, value[i].store_code)
              this.$set(this.tags.register_store.name, i, value[i].store_name)
            }
            this.tags.register_store.index = obj.index
            break
          }
          case 'category': {
            this.tags.purchased_category.value = []
            this.tags.purchased_category.name = []
            const value = obj.value
            for (let i = 0; i < value.length; i++) {
              this.$set(this.tags.purchased_category.value, i, value[i].product_category_code)
              this.$set(this.tags.purchased_category.name, i, value[i].product_category_name)
            }
            this.tags.purchased_category.index = obj.index
            break
          }
          case 'brand': {
            this.tags.purchased_brand.value = []
            this.tags.purchased_brand.name = []
            const value = obj.value
            for (let i = 0; i < value.length; i++) {
              this.$set(this.tags.purchased_brand.value, i, value[i].brand_code)
              this.$set(this.tags.purchased_brand.name, i, value[i].brand_name)
            }
            this.tags.purchased_brand.index = obj.index
            break
          }
          case 'product': {
            this.tags.purchased_product.value = []
            this.tags.purchased_product.name = []
            const value = obj.value
            for (let i = 0; i < value.length; i++) {
              this.$set(this.tags.purchased_product.value, i, value[i].product_code)
              this.$set(this.tags.purchased_product.name, i, value[i].product_name)
            }
            this.tags.purchased_product.index = obj.index
            break
          }
        }
      },
      clickP(val) {
        this.selectDialog = true
        this.profile_type = val
      },
      handleDelete(tag) {
        const key = this.tags.tier_name.indexOf(tag)
        this.tags.tier_name.splice(key, 1)
        this.tags.tier_code.splice(key, 1)
        this.transfer_tier.splice(key, 1)
      },
      handleDeleteAge(tag) {
        this.tags.age.splice(this.tags.age.indexOf(tag), 1)
      },
      handleDeleteBirthday(tag) {
        this.tags.birthday.splice(this.tags.birthday.indexOf(tag), 1)
      },
      handleDeleteRegisterChannel(tag) {
        const key = this.tags.register_channel.name.indexOf(tag)
        this.tags.register_channel.name.splice(key, 1)
        this.tags.register_channel.value.splice(key, 1)
        this.tags.register_channel.index.splice(key, 1)
      },
      handleDeleteLastPurchaseDate(tag) {
        this.tags.lastest_purchase_date.splice(this.tags.lastest_purchase_date.indexOf(tag), 1)
      },
      handleDeleteAverageBasket(tag) {
        this.tags.average_basket.splice(this.tags.average_basket.indexOf(tag), 1)
      },
      handleDeleteAvailablePoint(tag) {
        this.tags.available_point.splice(this.tags.available_point.indexOf(tag), 1)
      },
      handleDeleteRegisterStore(tag) {
        const key = this.tags.register_store.name.indexOf(tag)
        this.tags.register_store.name.splice(key, 1)
        this.tags.register_store.value.splice(key, 1)
        this.tags.register_store.index.splice(key, 1)
      },
      handleDeleteJoinDate(tag) {
        this.tags.join_date.splice(this.tags.join_date.indexOf(tag), 1)
      },
      init() {
        const info = JSON.parse(JSON.stringify(this.form_data))
        const who_definition_list = info.who_definition_list[0]
        this.form = { ...who_definition_list }
        // target
        if (this.form.select_type === 'filter' && this.form.target_criteria.length > 0) {
          const target_criteria = this.form.target_criteria
          for (const obj of target_criteria) {
            var code = obj.criteria_code
            var name = obj.criteria_value
            if (obj.criteria_field_code === 'tiers') {
              this.tags.tier_code = []
              this.tags.tier_name = []
              this.transfer_tier = []
              this.tags.tier_code = code ? code.split(',') : []
              this.tags.tier_name = name ? name.split(',') : []
              for (let i = 0; i < this.tier_list.length; i++) {
                if (code.indexOf(this.tier_list[i].member_tier_code) > -1) {
                  this.transfer_tier.push(i)
                }
              }
            } else if (obj.criteria_field_code === 'age_from') {
              this.dialogData.age_from = ''
              this.dialogData.age_from = code > 0 ? code : ''
            } else if (obj.criteria_field_code === 'age_to') {
              this.dialogData.age_to = code > 0 ? code : ''
              if (this.dialogData.age_from && this.dialogData.age_to) {
                this.tags.age = []
                this.tags.age.push(`${this.dialogData.age_from}-${this.dialogData.age_to}`)
              }
            } else if (obj.criteria_field_code === 'birthday_from') {
              this.birthday_from = code.length ? code : ''
            } else if (obj.criteria_field_code === 'birthday_to') {
              this.birthday_to = code.length ? code : ''
              if (this.birthday_from && this.birthday_to) {
                this.tags.birthday = []
                this.tags.birthday.push(`${this.birthday_from}-${this.birthday_to}`)
              }
            } else if (obj.criteria_field_code === 'join_date_from') {
              this.join_date_from = code.length ? code : ''
            } else if (obj.criteria_field_code === 'join_date_to') {
              this.join_date_to = code.length ? code : ''
              this.tags.join_date = []
              if (this.join_date_from && this.join_date_to) {
                this.tags.join_date.push(`${this.join_date_from} / ${this.join_date_to}`)
              }
            } else if (obj.criteria_field_code === 'lastest_purchase_date_from') {
              this.lastest_purchase_date_from = code.length ? code : ''
            } else if (obj.criteria_field_code === 'lastest_purchase_date_to') {
              this.lastest_purchase_date_to = code.length ? code : ''
              this.tags.lastest_purchase_date = []
              if (this.lastest_purchase_date_from && this.lastest_purchase_date_to) {
                // this.tags.lastest_purchase_date.push(`${this.lastest_purchase_date_from} / ${this.lastest_purchase_date_to}`)
                this.$set(this.tags.lastest_purchase_date, 0, `${this.lastest_purchase_date_from} / ${this.lastest_purchase_date_to}`)
              }
            } else if (obj.criteria_field_code === 'average_items_from') {
              this.average_items_from = code > 0 ? code : ''
            } else if (obj.criteria_field_code === 'average_items_to') {
              this.average_items_to = code > 0 ? code : ''
              this.tags.average_items = []
              if (this.average_items_from && this.average_items_to) {
                this.tags.average_items.push(`${this.average_items_from} / ${this.average_items_to}`)
              }
            } else if (obj.criteria_field_code === 'average_basket_from') {
              this.average_basket_from = code > 0 ? code : ''
            } else if (obj.criteria_field_code === 'average_basket_to') {
              this.average_basket_to = code > 0 ? code : ''
              this.tags.average_basket = []
              if (this.average_basket_from && this.average_basket_to) {
                this.tags.average_basket.push(`${this.average_basket_from}-${this.average_basket_to}`)
              }
            } else if (obj.criteria_field_code === 'available_point_from') {
              this.available_point_from = code > 0 ? code : ''
            } else if (obj.criteria_field_code === 'available_point_to') {
              this.available_point_to = code > 0 ? code : ''
              this.tags.available_point = []
              if (this.available_point_from && this.available_point_to) {
                this.tags.available_point.push(`${this.available_point_from}-${this.available_point_to}`)
              }
            } else if (obj.criteria_field_code === 'register_channel') {
              this.tags.register_channel.name = name.length ? name.split(',') : []
              this.tags.register_channel.value = code.length ? code.split(',') : []
            } else if (obj.criteria_field_code === 'register_store') {
              this.tags.register_store.name = name.length ? name.split(',') : []
              this.tags.register_store.value = code.length ? code.split(',') : []
            } else if (obj.criteria_field_code === 'purchased_product') {
              this.tags.purchased_product.name = name.length ? name.split(',') : []
              this.tags.purchased_product.value = code.length ? code.split(',') : []
            } else if (obj.criteria_field_code === 'purchased_brand') {
              this.tags.purchased_brand.name = name.length ? name.split(',') : []
              this.tags.purchased_brand.value = code.length ? code.split(',') : []
            } else if (obj.criteria_field_code === 'purchased_category') {
              this.tags.purchased_category.name = name.length ? name.split(',') : []
              this.tags.purchased_category.value = code.length ? code.split(',') : []
            } else if (obj.criteria_field_code === 'campaign_respondent') {
              this.tags.campaign_respondent = name ? name.split(',') : []
            }
          }
        }
      },
      closeDialog(index) {
        this.$refs['dialog'].validate((valid) => {
          if (valid) {
            this.selectDialog = false
            switch (index) {
              case 'age':
                this.$set(this.tags.age, 0, `${this.dialogData.age_from}-${this.dialogData.age_to}`)
                break
              case 'birthday':
                this.$set(this.tags.birthday, 0, `${this.birthday_from}-${this.birthday_to}`)
                break
              case 'join_date':
                this.$set(this.tags.join_date, 0, `${this.join_date_from} / ${this.join_date_to}`)
                break
              case 'lastest_purchase_date':
                this.$set(this.tags.lastest_purchase_date, 0, `${this.lastest_purchase_date_from} / ${this.lastest_purchase_date_to}`)
                break
              case 'average_basket':
                this.$set(this.tags.average_basket, 0, `${this.average_basket_from}-${this.average_basket_to}`)
                break
              case 'available_point':
                this.$set(this.tags.available_point, 0, `${this.available_point_from}-${this.available_point_to}`)
                break
              case 'average_items':
                this.$set(this.tags.average_items, 0, `${this.average_items_from}-${this.average_items_to}`)
                break
              case 'campaign_respondent':
                this.tags.campaign_respondent = []
                this.tags.campaign_respondent.push(this.campaign_respondent)
                break
            }
          } else {
            return false
          }
        })
      }
    },
    watch: {
      transfer_tier() {
        this.tags.tier_name = []
        this.tags.tier_code = []
        for (const index of this.transfer_tier) {
          this.tags.tier_code.push(this.tier_list[index].member_tier_code)
          this.tags.tier_name.push(this.tier_list[index].member_tier_name)
        }
        this.form.target_criteria.criteria_code = this.transfer_tier
        this.form.target_criteria.criteria_value = this.transfer_tier
      },
      nonius_id: {
        handler(val) {
          this.init()
        },
        immediate: true
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .trigger-campaign-who-item{
    .el-input-number, .el-select{
      width: 160px;
    }
    .tip{
      color: rgba(16, 16, 16, 1);
      font-size: 14px;
      text-align: left;
      margin-left: 12px;
    }
    .p{
      padding-top: 14px;
      @include vertical-moulding(14px)
    }
    .select-mode{
      margin-top: 17px;
    }
  }
  .target-member-mode {
    margin-top: 40px;
    .t {
      .title {
        min-width: 205px;
        text-align: right;
        color: #888888;
        font-weight: bold;
        font-size: 14px;
        margin-top: 7px;
        margin-right: 14px;
      }
      .title1{
        @extend .title;
        flex:0 0 100%;
        text-align: left;
        margin-bottom:10px;
      }
      display: flex;
      flex:1;
      margin-bottom:18px;
    }
    .t1{
      @extend .t;
      flex-wrap: wrap;
    }
    .ul {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      .li {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        margin-right: 10px;
        cursor: pointer;
        margin-bottom: 10px;
        p {
          font-size: 14px;
          padding: 6px 10px;
          border-radius: 6px;
          border: 1px dashed rgb(187, 187, 187);
          color: rgb(136, 136, 136);
          background-color: #ffffff;
          z-index:11;
          span {
            padding-right: 3px;
          }
        }
      }
      .check{
        p{
          border-style: solid;
          border-color: $primary;
          color: $primary;
        }
      }
    }
  }
</style>
