<template>
  <div class="spot_campaign_who_targeted_members" ref="TargetedMember">
    <el-form-item label=" ">
      <div class="target-member-mode">
          <div :key="index"  class="profile-target t" v-for="(item,index) in by_profile">
            <label class="title">{{ handleGlobalI18n('campaign', item.criteria_group).substring(0,1).toUpperCase()+handleGlobalI18n('campaign', item.criteria_group).substring(1)}}</label>
            <div class="ul">
              <template  v-for="item1 in item.criteria_field" >
                <!--tiers-->
                <tier-component :campaign_respondent_state = "handleCampaignRespondentState" :target="target" ref="tier_component"  v-if="item1.criteria_field_code==='tiers'"/>
                <!--age-->
                <age-component :campaign_respondent_state = "handleCampaignRespondentState" :target="target" ref="age_component" v-if="item1.criteria_field_code==='age'"/>
                <!--gender-->
                <gender-component :campaign_respondent_state = "handleCampaignRespondentState" :target="target" ref="gender_component" v-if="item1.criteria_field_code==='gender'"/>
                <!--birthday-->
                <birthday-component :campaign_respondent_state = "handleCampaignRespondentState" :target="target" ref="birthday_component" v-if="item1.criteria_field_code==='birthday'"/>
                <!--join date-->
                <join-date-component :campaign_respondent_state = "handleCampaignRespondentState" :target="target" ref="join_date_component" v-if="item1.criteria_field_code==='join_date'"/>
                <!--register store-->
                <register-store-component :campaign_respondent_state = "handleCampaignRespondentState" :target="target" ref="register_store_component" v-if="item1.criteria_field_code==='register_store'"/>
                <!--register channel-->
                <register-channel-component :campaign_respondent_state = "handleCampaignRespondentState" :target="target" ref="register_channel_component" v-if="item1.criteria_field_code==='register_channel'"/>
                <!--postal code----------the show for bhg---------------------------------------------------------------------------------------------------------------------------->
                <postal-code-component :campaign_respondent_state = "handleCampaignRespondentState" :target="target" ref="postal_code_component" v-if="item1.criteria_field_code==='postal_code'" v-show="isBHGLoginUser()"/>
                <!-------------------------------------------------------------------------------------------------------------------------------------------------------------------->
                <!--latest purchase date-->
                <latest-purchase-component :campaign_respondent_state = "handleCampaignRespondentState" :target="target" ref="latest_purchase_component" v-if="item1.criteria_field_code==='lastest_purchase_date'" />
                <!--average basket-->
                <average-basket-component :campaign_respondent_state = "handleCampaignRespondentState" :target="target" ref="average_basket_component" v-if="item1.criteria_field_code==='average_basket'" />
                <!--average items-->
                <average-items-component :campaign_respondent_state = "handleCampaignRespondentState" :target="target" ref="average_items_component" v-if="item1.criteria_field_code==='average_items'" />
                <!--purchased product-->
                <purchased-product-component :campaign_respondent_state = "handleCampaignRespondentState" :target="target" ref="purchased_product_component" v-if="item1.criteria_field_code==='purchased_product'" />
                <!--purchase date-->
                <purchased-date-component :campaign_respondent_state = "handleCampaignRespondentState" :target="target" ref="purchased_date_component" v-if="item1.criteria_field_code==='purchased_date'" />
                <!--purchased brand-->
                <purchased-brand-component :campaign_respondent_state = "handleCampaignRespondentState" :target="target" ref="purchased_brand_component" v-if="item1.criteria_field_code==='purchased_brand'" />
                <!--purchased category-->
                <purchased-category-component :campaign_respondent_state = "handleCampaignRespondentState" :target="target" ref="purchased_category_component" v-if="item1.criteria_field_code==='purchased_category'" />
                <!--purchased store---------------------------------------------------------------------------------------------------------------------------------->
                <purchased-store-component :campaign_respondent_state = "handleCampaignRespondentState" :target="target" ref="purchased_store_component" v-if="item1.criteria_field_code==='purchased_store'" />
                <!--------------------------------------------------------------------------------------------------------------------------------------------------->
                <!--available point-->
                <available-point-component :campaign_respondent_state = "handleCampaignRespondentState" :target="target" ref="available_point_component" v-if="item1.criteria_field_code==='available_point'" />
                <!--campaign respondent-------------------------------------------------------------------------------------------------------------------------------->
                <campaign-respondent-component :campaign_respondent_state = "handleCampaignRespondentState" :target="target" ref="campaign_respondent_component" v-if="item1.criteria_field_code==='campaign_respondent'" />
                <!------------------------------------------------------------------------------------------------------------------------------------------------------>
              </template>
            </div>
          </div>
        </div>
    </el-form-item>
  </div>
</template>
<script>
  import { who_options, who_target, who_tagged_member } from '@/data/spot-campaign'
  import { uploadImage } from '@/api/master'
  import TierComponent from './tiers'
  import AgeComponent from './age'
  import GenderComponent from './gender'
  import BirthdayComponent from './birthday'
  import JoinDateComponent from './join-date'
  import RegisterStoreComponent from './register-store'
  import RegisterChannelComponent from './register-channel'
  import PostalCodeComponent from './postal-code-component'
  import LatestPurchaseComponent from './latest-purchase'
  import AverageBasketComponent from './average-basket'
  import AverageItemsComponent from './average-items'
  import PurchasedProductComponent from './purchased-product'
  import PurchasedDateComponent from './purchased-date'
  import PurchasedBrandComponent from './purchased-brand'
  import PurchasedCategoryComponent from './purchased-category'
  import PurchasedStoreComponent from './purchased-store'
  import AvailablePointComponent from './available-point'
  import CampaignRespondentComponent from './campaign-respondent-component'
  import {
    validateCompare,
    validatePositiveInteger
  } from '@/utils/validate'
  import { isObjectValueEqual, isBHGLoginUser } from '@/utils'
  export default {
    props: {
      campaign_wizard_id: {
        type: Number | String
      },
      target: {
        type: Object
      }
    },
    components: {
      TierComponent,
      AgeComponent,
      GenderComponent,
      BirthdayComponent,
      JoinDateComponent,
      RegisterStoreComponent,
      RegisterChannelComponent,
      PostalCodeComponent,
      CampaignRespondentComponent,
      LatestPurchaseComponent,
      AverageBasketComponent,
      AverageItemsComponent,
      PurchasedProductComponent,
      PurchasedDateComponent,
      PurchasedBrandComponent,
      PurchasedCategoryComponent,
      PurchasedStoreComponent,
      AvailablePointComponent
    },
    data() {
      return {
        by_profile: who_target,
        href: '../../../../static/member.csv',
        url: '',
        uploadLoading: false,
        calcLoading: false,
        total_targets: '',
        control_group: 0,
        by_tags: [[], [], [], [], [], []],
        tagged_member_list: who_tagged_member,
        select_type: 1,
        purchased_brand: '',
        purchased_category: '',
        purchased_store: '',
        campaign_respondent: '',
        purchased_product: '',
        average_items_from: '',
        average_items_to: '',
        options: who_options,
        form: {},
        target_code: '',
        cam_info: {},
        file_url: '',
        file: ''
      }
    },
    computed: {
      handleCampaignRespondentState() {
        return false
      }
    },
    methods: {
      isBHGLoginUser,
      handleParentGetCalcValue() {
        var params = {
          target_code: null,
          target_type: '1',
          campaign_id: parseInt(this.campaign_wizard_id),
          kpi_flag: 0
        }
        var criteria_values = [{
          criteria_code: 'tiers',
          criteria_value: this.$refs['tier_component'][0].tier_code_list.join(',')
        }, {
          criteria_code: 'gender',
          criteria_value: this.$refs['gender_component'][0].select_gender
        }, {
          criteria_code: 'age_from',
          criteria_value: this.$refs['age_component'][0].dialog_data.age_from || ''
        }, {
          criteria_code: 'age_to',
          criteria_value: this.$refs['age_component'][0].dialog_data.age_to || ''
        }, {
          criteria_code: 'birthday_from',
          criteria_value: this.$refs['birthday_component'][0].dialog_data.birthday_from || ''
        }, {
          criteria_code: 'birthday_to',
          criteria_value: this.$refs['birthday_component'][0].dialog_data.birthday_to || ''
        }, {
          criteria_code: 'join_date_from',
          criteria_value: this.$refs['join_date_component'][0].dialog_data.join_date_from || ''
        }, {
          criteria_code: 'join_date_to',
          criteria_value: this.$refs['join_date_component'][0].dialog_data.join_date_to || ''
        }, {
          criteria_code: 'register_store',
          criteria_value: this.$refs['register_store_component'][0].register_store_value_list.join(',')
        }, {
          criteria_code: 'register_channel',
          criteria_value: this.$refs['register_channel_component'][0].register_channel_value_list.join(',')
        }, {
          criteria_code: 'lastest_purchase_date_from',
          criteria_value: this.$refs['latest_purchase_component'][0].dialog_data.latest_purchase_from || ''
        }, {
          criteria_code: 'lastest_purchase_date_to',
          criteria_value: this.$refs['latest_purchase_component'][0].dialog_data.latest_purchase_to || ''
        }, {
          criteria_code: 'average_basket_from',
          criteria_value: this.$refs['average_basket_component'][0].dialog_data.average_basket_from || ''
        }, {
          criteria_code: 'average_basket_to',
          criteria_value: this.$refs['average_basket_component'][0].dialog_data.average_basket_to || ''
        }, {
          criteria_code: 'average_items_from',
          criteria_value: this.$refs['average_items_component'][0].dialog_data.average_items_from || ''
        }, {
          criteria_code: 'average_items_to',
          criteria_value: this.$refs['average_items_component'][0].dialog_data.average_items_to || ''
        }, {
          criteria_code: 'purchased_product',
          criteria_value: this.$refs['purchased_product_component'][0].purchased_product_value_list.join(',')
        }, {
          criteria_code: 'purchased_date_from',
          criteria_value: this.$refs['purchased_date_component'][0].dialog_data.purchased_date_from || ''
        }, {
          criteria_code: 'purchased_date_to',
          criteria_value: this.$refs['purchased_date_component'][0].dialog_data.purchased_date_to || ''
        }, {
          criteria_code: 'purchased_brand',
          criteria_value: this.$refs['purchased_brand_component'][0].purchased_brand_value_list.join(',')
        }, {
          criteria_code: 'purchased_category',
          criteria_value: this.$refs['purchased_category_component'][0].purchased_category_value_list.join(',')
        }, {
          criteria_code: 'purchased_store',
          criteria_value: this.$refs['purchased_store_component'][0].purchased_store_value_list.join(',')
        }, {
          criteria_code: 'available_point_from',
          criteria_value: this.$refs['available_point_component'][0].dialog_data.available_point_from || ''
        }, {
          criteria_code: 'available_point_to',
          criteria_value: this.$refs['available_point_component'][0].dialog_data.available_point_to || ''
        }, {
          criteria_code: 'campaign_respondent',
          criteria_value: this.$refs['campaign_respondent_component'][0].campaign_respondent_value_list.join(',')
        }]
        if (this.isBHGLoginUser()) {
          criteria_values.push({
            criteria_code: 'postal_code',
            criteria_value: this.$refs['postal_code_component'][0].postal_code_value_list.join(',')
          })
        }
        if (parseInt(this.$refs['average_basket_component'][0].dialog_data.average_basket_to) || this.$refs['average_items_component'][0].dialog_data.average_items_to) {
          params.kpi_flag = 1
        }
        params.criteria_values = criteria_values
        return params
      },
      handleSaveValue() {
        var profile_arr = []
        var transaction_arr = []
        var point_arr = []
        if (this.$refs['tier_component'][0].tier_name_list.length > 0) {
          profile_arr.push({
            criteria_field_code: 'tiers',
            criteria_field_name: 'tiers',
            criteria_field_option: {
              criteria_field_option_name: this.$refs['tier_component'][0].tier_name_list.join(','),
              criteria_field_option_code: this.$refs['tier_component'][0].tier_code_list.join(',')
            }
          })
        }
        if (this.$refs['gender_component'][0].select_gender) {
          profile_arr.push({
            criteria_field_code: 'gender',
            criteria_field_name: 'gender',
            criteria_field_option: {
              criteria_field_option_name: this.$refs['gender_component'][0].select_gender,
              criteria_field_option_code: this.$refs['gender_component'][0].select_gender
            }
          })
        }
        if (this.$refs['age_component'][0].dialog_data.age_from) {
          profile_arr.push({
            criteria_field_code: 'age_from',
            criteria_field_name: 'age',
            criteria_field_option: {
              criteria_field_option_name: this.$refs['age_component'][0].dialog_data.age_from,
              criteria_field_option_code: this.$refs['age_component'][0].dialog_data.age_from
            }
          })
        }
        if (this.$refs['age_component'][0].dialog_data.age_to) {
          profile_arr.push({
            criteria_field_code: 'age_to',
            criteria_field_name: 'age',
            criteria_field_option: {
              criteria_field_option_name: this.$refs['age_component'][0].dialog_data.age_to,
              criteria_field_option_code: this.$refs['age_component'][0].dialog_data.age_to
            }
          })
        }
        if (this.$refs['birthday_component'][0].dialog_data.birthday_from) {
          profile_arr.push({
            criteria_field_code: 'birthday_from',
            criteria_field_name: 'birthday',
            criteria_field_option: {
              criteria_field_option_name: this.$refs['birthday_component'][0].dialog_data.birthday_from,
              criteria_field_option_code: this.$refs['birthday_component'][0].dialog_data.birthday_from
            }
          })
        }
        if (this.$refs['birthday_component'][0].dialog_data.birthday_to) {
          profile_arr.push({
            criteria_field_code: 'birthday_to',
            criteria_field_name: 'birthday',
            criteria_field_option: {
              criteria_field_option_name: this.$refs['birthday_component'][0].dialog_data.birthday_to,
              criteria_field_option_code: this.$refs['birthday_component'][0].dialog_data.birthday_to
            }
          })
        }
        if (this.$refs['join_date_component'][0].dialog_data.join_date_from) {
          profile_arr.push({
            criteria_field_code: 'join_date_from',
            criteria_field_name: 'join_date',
            criteria_field_option: {
              criteria_field_option_name: this.$refs['join_date_component'][0].dialog_data.join_date_from,
              criteria_field_option_code: this.$refs['join_date_component'][0].dialog_data.join_date_from
            }
          })
        }
        if (this.$refs['join_date_component'][0].dialog_data.join_date_to) {
          profile_arr.push({
            criteria_field_code: 'join_date_to',
            criteria_field_name: 'join_date',
            criteria_field_option: {
              criteria_field_option_name: this.$refs['join_date_component'][0].dialog_data.join_date_to,
              criteria_field_option_code: this.$refs['join_date_component'][0].dialog_data.join_date_to
            }
          })
        }
        if (this.$refs['register_store_component'][0].register_store_value_list.length > 0) {
          profile_arr.push({
            criteria_field_code: 'register_store',
            criteria_field_name: 'register_store',
            criteria_field_option: {
              criteria_field_option_name: this.$refs['register_store_component'][0].register_store_name_list.join(','),
              criteria_field_option_code: this.$refs['register_store_component'][0].register_store_value_list.join(',')
            }
          })
        }
        if (this.$refs['register_channel_component'][0].register_channel_value_list.length > 0) {
          profile_arr.push({
            criteria_field_code: 'register_channel',
            criteria_field_name: 'register_channel',
            criteria_field_option: {
              criteria_field_option_name: this.$refs['register_channel_component'][0].register_channel_name_list.join(','),
              criteria_field_option_code: this.$refs['register_channel_component'][0].register_channel_value_list.join(',')
            }
          })
        }
        if (this.$refs['latest_purchase_component'][0].dialog_data.latest_purchase_from) {
          transaction_arr.push({
            criteria_field_code: 'lastest_purchase_date_from',
            criteria_field_name: 'lastest_purchase_date',
            criteria_field_option: {
              criteria_field_option_name: this.$refs['latest_purchase_component'][0].dialog_data.latest_purchase_from,
              criteria_field_option_code: this.$refs['latest_purchase_component'][0].dialog_data.latest_purchase_from
            }
          })
        }
        if (this.$refs['latest_purchase_component'][0].dialog_data.latest_purchase_to) {
          transaction_arr.push({
            criteria_field_code: 'lastest_purchase_date_to',
            criteria_field_name: 'lastest_purchase_date',
            criteria_field_option: {
              criteria_field_option_name: this.$refs['latest_purchase_component'][0].dialog_data.latest_purchase_to,
              criteria_field_option_code: this.$refs['latest_purchase_component'][0].dialog_data.latest_purchase_to
            }
          })
        }
        if (this.$refs['average_basket_component'][0].dialog_data.average_basket_from) {
          transaction_arr.push({
            criteria_field_code: 'average_basket_from',
            criteria_field_name: 'average_basket',
            criteria_field_option: {
              criteria_field_option_name: this.$refs['average_basket_component'][0].dialog_data.average_basket_from,
              criteria_field_option_code: this.$refs['average_basket_component'][0].dialog_data.average_basket_from
            }
          })
        }
        if (this.$refs['average_basket_component'][0].dialog_data.average_basket_to) {
          transaction_arr.push({
            criteria_field_code: 'average_basket_to',
            criteria_field_name: 'average_basket',
            criteria_field_option: {
              criteria_field_option_name: this.$refs['average_basket_component'][0].dialog_data.average_basket_to,
              criteria_field_option_code: this.$refs['average_basket_component'][0].dialog_data.average_basket_to
            }
          })
        }
        if (this.$refs['average_items_component'][0].dialog_data.average_items_from) {
          transaction_arr.push({
            criteria_field_code: 'average_items_from',
            criteria_field_name: 'average_item',
            criteria_field_option: {
              criteria_field_option_name: this.$refs['average_items_component'][0].dialog_data.average_items_from,
              criteria_field_option_code: this.$refs['average_items_component'][0].dialog_data.average_items_from
            }
          })
        }
        if (this.$refs['average_items_component'][0].dialog_data.average_items_to) {
          transaction_arr.push({
            criteria_field_code: 'average_items_to',
            criteria_field_name: 'average_item',
            criteria_field_option: {
              criteria_field_option_name: this.$refs['average_items_component'][0].dialog_data.average_items_to,
              criteria_field_option_code: this.$refs['average_items_component'][0].dialog_data.average_items_to
            }
          })
        }
        if (this.$refs['purchased_product_component'][0].purchased_product_value_list.length > 0) {
          transaction_arr.push({
            criteria_field_code: 'purchased_product',
            criteria_field_name: 'purchased_product',
            criteria_field_option: {
              criteria_field_option_name: this.$refs['purchased_product_component'][0].purchased_product_name_list.join(','),
              criteria_field_option_code: this.$refs['purchased_product_component'][0].purchased_product_value_list.join(',')
            }
          })
        }
        if (this.$refs['purchased_date_component'][0].dialog_data.purchased_date_from) {
          transaction_arr.push({
            criteria_field_code: 'purchased_date_from',
            criteria_field_name: 'purchased_date',
            criteria_field_option: {
              criteria_field_option_name: this.$refs['purchased_date_component'][0].dialog_data.purchased_date_from,
              criteria_field_option_code: this.$refs['purchased_date_component'][0].dialog_data.purchased_date_from
            }
          })
        }
        if (this.$refs['purchased_date_component'][0].dialog_data.purchased_date_to) {
          transaction_arr.push({
            criteria_field_code: 'purchased_date_to',
            criteria_field_name: 'purchased_date',
            criteria_field_option: {
              criteria_field_option_name: this.$refs['purchased_date_component'][0].dialog_data.purchased_date_to,
              criteria_field_option_code: this.$refs['purchased_date_component'][0].dialog_data.purchased_date_to
            }
          })
        }
        if (this.$refs['purchased_brand_component'][0].purchased_brand_value_list.length > 0) {
          transaction_arr.push({
            criteria_field_code: 'purchased_brand',
            criteria_field_name: 'purchased_brand',
            criteria_field_option: {
              criteria_field_option_name: this.$refs['purchased_brand_component'][0].purchased_brand_name_list.join(','),
              criteria_field_option_code: this.$refs['purchased_brand_component'][0].purchased_brand_value_list.join(',')
            }
          })
        }
        if (this.$refs['purchased_category_component'][0].purchased_category_value_list.length > 0) {
          transaction_arr.push({
            criteria_field_code: 'purchased_category',
            criteria_field_name: 'purchased_category',
            criteria_field_option: {
              criteria_field_option_name: this.$refs['purchased_category_component'][0].purchased_category_name_list.join(','),
              criteria_field_option_code: this.$refs['purchased_category_component'][0].purchased_category_value_list.join(',')
            }
          })
        }
        if (this.$refs['purchased_store_component'][0].purchased_store_value_list.length > 0) {
          transaction_arr.push({
            criteria_field_code: 'purchased_store',
            criteria_field_name: 'purchased_store',
            criteria_field_option: {
              criteria_field_option_name: this.$refs['purchased_store_component'][0].purchased_store_name_list.join(','),
              criteria_field_option_code: this.$refs['purchased_store_component'][0].purchased_store_value_list.join(',')
            }
          })
        }
        if (this.$refs['available_point_component'][0].dialog_data.available_point_from) {
          point_arr.push({
            criteria_field_code: 'available_point_from',
            criteria_field_name: 'available_point',
            criteria_field_option: {
              criteria_field_option_name: this.$refs['available_point_component'][0].dialog_data.available_point_from,
              criteria_field_option_code: this.$refs['available_point_component'][0].dialog_data.available_point_from
            }
          })
        }
        if (this.$refs['available_point_component'][0].dialog_data.available_point_to) {
          point_arr.push({
            criteria_field_code: 'available_point_to',
            criteria_field_name: 'available_point',
            criteria_field_option: {
              criteria_field_option_name: this.$refs['available_point_component'][0].dialog_data.available_point_to,
              criteria_field_option_code: this.$refs['available_point_component'][0].dialog_data.available_point_to
            }
          })
        }
        if (this.$refs['campaign_respondent_component'][0].campaign_respondent_value_list.length > 0) {
          point_arr.push({
            criteria_field_code: 'campaign_respondent',
            criteria_field_name: 'campaign_respondent',
            criteria_field_option: {
              criteria_field_option_name: this.$refs['campaign_respondent_component'][0].campaign_respondent_name_list.join(','),
              criteria_field_option_code: this.$refs['campaign_respondent_component'][0].campaign_respondent_value_list.join(',')
            }
          })
        }
        if (this.isBHGLoginUser()) {
          profile_arr.push({
            criteria_field_code: 'postal_code',
            criteria_field_name: 'postal_code',
            criteria_field_option: {
              criteria_field_option_name: this.$refs['postal_code_component'][0].postal_code_name_list.join(','),
              criteria_field_option_code: this.$refs['postal_code_component'][0].postal_code_value_list.join(',')
            }
          })
        }
        return {
          target_profiles: [
            {
              criteria_group_code: 'profile',
              criteria_group_name: 'profile',
              criteria_fields: profile_arr
            },
            {
              criteria_group_code: 'transaction',
              criteria_group_name: 'transaction',
              criteria_fields: transaction_arr
            },
            {
              criteria_group_code: 'point',
              criteria_group_name: 'point',
              criteria_fields: point_arr
            }
          ]
        }
      },
      handleHttpRequest() {
        if (this.file === '' || this.file === undefined) {
          return true
        }
        this.uploadLoading = true
        this.file_url = ''
        var formData = new FormData()
        formData.append('file', this.file)
        formData.append('project', 'file')
        formData.append('module', 'fides')
        uploadImage(formData).then(res => {
          this.file_url = res.return_result.url[0]
          this.$message({
            message: 'Success',
            type: 'success'
          })
          this.uploadLoading = false
          this.file = ''
        }).catch(() => {
          this.uploadLoading = false
        })
      },
      beforeAvatarUpload(file) {
        this.file = file
      },
      validatePositiveInteger,
      validateCompare,
      isObjectValueEqual,
      indexOf(arr, item) {
        for (var i = 0; i < arr.length; i++) {
          if (this.isObjectValueEqual(arr[i], item)) {
            return i.toString()
          }
        }
        return false
      },
      init() {
        // this.form = { ...this.form_data }
        // this.select_type = parseInt(this.form.target_type === null ? 1 : this.form.target_type)
        // const target = this.form.target !== null ? JSON.parse(this.form.target) : null
        // if (target === null) {
        //   return true
        // }
        // this.control_group = 100 - parseInt(target.control_group)
        // if (this.select_type === 1) {
        //   const target_detail = target.target_profiles
        //   for (const i1 in target_detail) {
        //     if (target_detail[i1].hasOwnProperty('criteria_fields')) {
        //       for (let i2 = 0; i2 < target_detail[i1].criteria_fields.length; i2++) {
        //         const obj = target_detail[i1].criteria_fields[i2]
        //         var code = []
        //         var name = []
        //         if (obj.criteria_field_option.hasOwnProperty('criteria_field_option_code')) {
        //           code = obj.criteria_field_option.criteria_field_option_code
        //         }
        //         if (obj.criteria_field_option.hasOwnProperty('criteria_field_option_name')) {
        //           name = obj.criteria_field_option.criteria_field_option_name
        //         }
        //         if (obj.criteria_field_code === 'tiers') {
        //           this.tags.tier_code = code.length ? code.split(',') : []
        //           this.tags.tier_name = name.length ? name.split(',') : []
        //           this.transfer_tier = []
        //           for (let i = 0; i < this.tier_list.length; i++) {
        //             if (obj.criteria_field_option.hasOwnProperty('criteria_field_option_code')) {
        //               if (obj.criteria_field_option.criteria_field_option_code.indexOf(this.tier_list[i].member_tier_code) > -1) {
        //                 this.transfer_tier.push(i)
        //               }
        //             }
        //           }
        //         } else if (obj.criteria_field_code === 'age_from') {
        //           this.dialogData.age_from = code.length ? code : ''
        //         } else if (obj.criteria_field_code === 'gender') {
        //           this.tags.gender.value = code.length ? parseInt(code) : ''
        //           var list = ['unknown', 'male', 'female']
        //           this.tags.gender.name = []
        //           if (this.tags.gender.value) {
        //             this.tags.gender.name.push(this.handleGlobalI18n('campaign', list[parseInt(this.tags.gender.value)]))
        //           }
        //         } else if (obj.criteria_field_code === 'age_to') {
        //           this.dialogData.age_to = code.length ? code : ''
        //           if (this.dialogData.age_from && this.dialogData.age_to) {
        //             this.tags.age = []
        //             this.tags.age.push(`${this.dialogData.age_from}-${this.dialogData.age_to}`)
        //           }
        //         } else if (obj.criteria_field_code === 'birthday_from') {
        //           this.birthday_from = code.length ? code : ''
        //         } else if (obj.criteria_field_code === 'birthday_to') {
        //           this.birthday_to = code.length ? code : ''
        //           if (this.birthday_from && this.birthday_to) {
        //             this.tags.birthday = []
        //             this.tags.birthday.push(`${this.birthday_from}-${this.birthday_to}`)
        //           }
        //         } else if (obj.criteria_field_code === 'average_items_from') {
        //           this.average_items_from = code.length ? code : ''
        //         } else if (obj.criteria_field_code === 'average_items_to') {
        //           this.average_items_to = code.length ? code : ''
        //           if (this.average_items_from && this.average_items_to) {
        //             this.tags.average_items = []
        //             this.tags.average_items.push(`${this.average_items_from}-${this.average_items_to}`)
        //           }
        //         } else if (obj.criteria_field_code === 'join_date_from') {
        //           this.join_date_from = code.length ? code : ''
        //         } else if (obj.criteria_field_code === 'join_date_to') {
        //           this.join_date_to = code.length ? code : ''
        //           if (this.join_date_from && this.join_date_to) {
        //             this.tags.join_date = []
        //             this.tags.join_date.push(`${this.join_date_from} / ${this.join_date_to}`)
        //           }
        //         } else if (obj.criteria_field_code === 'purchased_date_from') {
        //           this.purchased_date_from = code.length ? code : ''
        //         } else if (obj.criteria_field_code === 'purchased_date_to') {
        //           this.purchased_date_to = code.length ? code : ''
        //           if (this.purchased_date_from && this.purchased_date_to) {
        //             this.tags.purchased_date = []
        //             this.tags.purchased_date.push(`${this.purchased_date_from} / ${this.purchased_date_to}`)
        //           }
        //         } else if (obj.criteria_field_code === 'lastest_purchase_date_from') {
        //           this.lastest_purchase_date_from = code.length ? code : ''
        //         } else if (obj.criteria_field_code === 'lastest_purchase_date_to') {
        //           this.lastest_purchase_date_to = code.length ? code : ''
        //           if (this.lastest_purchase_date_from && this.lastest_purchase_date_to) {
        //             this.tags.lastest_purchase_date = []
        //             this.tags.lastest_purchase_date.push(`${this.lastest_purchase_date_from} / ${this.lastest_purchase_date_to}`)
        //           }
        //         } else if (obj.criteria_field_code === 'average_basket_from') {
        //           this.average_basket_from = code.length ? code : ''
        //         } else if (obj.criteria_field_code === 'average_basket_to') {
        //           this.average_basket_to = code.length ? code : ''
        //           if (this.average_basket_from && this.average_basket_to) {
        //             this.tags.average_basket = []
        //             this.tags.average_basket.push(`${this.average_basket_from}-${this.average_basket_to}`)
        //           }
        //         } else if (obj.criteria_field_code === 'available_point_from') {
        //           this.available_point_from = code.length ? code : ''
        //         } else if (obj.criteria_field_code === 'available_point_to') {
        //           this.available_point_to = code.length ? code : ''
        //           if (this.available_point_from && this.available_point_to) {
        //             this.tags.available_point = []
        //             this.tags.available_point.push(`${this.available_point_from}-${this.available_point_to}`)
        //           }
        //         } else if (obj.criteria_field_code === 'register_channel') {
        //           this.tags.register_channel.name = name.length ? name.split(',') : []
        //           this.tags.register_channel.value = code.length ? code.split(',') : []
        //         } else if (obj.criteria_field_code === 'register_store') {
        //           this.tags.register_store.name = name.length ? name.split(',') : []
        //           this.tags.register_store.value = code.length ? code.split(',') : []
        //         } else if (obj.criteria_field_code === 'purchased_product') {
        //           this.tags.purchased_product.name = name.length ? name.split(',') : []
        //           this.tags.purchased_product.value = code.length ? code.split(',') : []
        //         } else if (obj.criteria_field_code === 'purchased_brand') {
        //           this.tags.purchased_brand.name = name.length ? name.split(',') : []
        //           this.tags.purchased_brand.value = code.length ? code.split(',') : []
        //         } else if (obj.criteria_field_code === 'purchased_category') {
        //           this.tags.purchased_category.name = name.length ? name.split(',') : []
        //           this.tags.purchased_category.value = code.length ? code.split(',') : []
        //         } else if (obj.criteria_field_code === 'purchased_store') {
        //           this.tags.purchased_store.name = name.length ? name.split(',') : []
        //           this.tags.purchased_store.value = code.length ? code.split(',') : []
        //         } else if (obj.criteria_field_code === 'campaign_respondent') {
        //           this.tags.campaign_respondent.name = name.length ? name.split(',') : []
        //           this.tags.campaign_respondent.value = code.length ? code.split(',') : []
        //         } else if (obj.criteria_field_code === 'postal_code') {
        //           this.tags.postal_code.name = name.length ? name.split(',') : []
        //           this.tags.postal_code.value = code.length ? code.split(',') : []
        //         }
        //       }
        //     }
        //   }
        // }
      }
    },
    watch: {
      'tags.campaign_respondent.value': {
        handler() {
          if (this.tags.campaign_respondent.value.length > 0) {
            this.tags.tier_code = []
            this.tags.tier_name = []
            this.tags.age = []
            this.tags.birthday = []
            this.tags.join_date = []
            this.tags.purchased_date = []
            this.tags.register_channel = {
              value: [],
              name: [],
              index: []
            }
            this.tags.register_store = {
              value: [],
              name: [],
              index: []
            }
            this.tags.lastest_purchase_date = []
            this.tags.average_basket = []
            this.tags.available_point = []
            this.tags.average_items = []
            this.tags.purchased_product = {
              value: [],
              name: [],
              index: []
            }
            this.tags.purchased_brand = {
              value: [],
              name: [],
              index: []
            }
            this.tags.purchased_category = {
              value: [],
              name: [],
              index: []
            }
            this.tags.purchased_store = {
              value: [],
              name: [],
              index: []
            }
            this.tags.postal_code = {
              value: [],
              name: [],
              index: []
            }
          }
        }
      },
      form_data: {
        handler(val) {
          this.init()
        }
      },
      target() {

      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  .spot_campaign_who_targeted_members{
    .dialog-footer{
      .el-button{
        min-width: 80px;
        border-color: $new-primary;
      }
      .cancel{
        background-color: #ffffff;
        color: $new-primary;
      }
      .save{
        background-color: $new-primary;
      }
    }
    .el-input-number, .el-select{
      width: 210px;
    }
    .target-member-mode {
      .t {
        display: flex;
        flex:1;
        &:not(:first-child){
          margin-top: 10px;
        }
        .title {
          min-width: 100px;
          text-align: left;
          font-size:14px;
          font-family: Helvetica-medium-1;
          color: rgba(51,51,51,1);
          line-height: 30px;
        }
      }
      .ul {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
      }
    }
  }
</style>

