<template>
  <div class="basic-info">
    <!--select dialog-->
    <el-dialog :title="handleDialogTitle" :visible.sync="selectDialog" width="400px">
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
              v-for="(item, index) in tierList"
              :key="item.member_tier_code"
              :label="item.member_tier_name"
              :value="index">
            </el-option>
          </el-select>
        </el-form-item>
        <div v-else-if="profile_type==='age'">
          <el-form-item :label="handleGlobalI18n('campaign', 'select_from')" prop="age_from">
            <el-input-number style="width:200px;" :min="0" :precision="0" :step="1" v-model="dialogData.age_from"></el-input-number>
          </el-form-item>
          <el-form-item :label="handleGlobalI18n('campaign', 'select_to')"  prop="age_to">
            <el-input-number style="width:200px;" :min="0" :precision="0" :step="1" v-model="dialogData.age_to"></el-input-number>
          </el-form-item>
        </div>
        <div v-else-if="profile_type==='birthday'">
          <el-form-item :label="handleGlobalI18n('campaign', 'select_from')">
            <el-date-picker
              v-model="birthday_from"
              format="MM-dd"
              :picker-options="pickerOptions1"
              value-format="MMdd"
              type="date">
            </el-date-picker>
          </el-form-item>
          <el-form-item :label="handleGlobalI18n('campaign', 'select_to')">
            <el-date-picker
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
              v-model="join_date_from"
              :picker-options="pickerOptions1"
              :value-format="globalData.value.date_format"
              :format="globalData.value.date_format"
              type="date">
            </el-date-picker>
          </el-form-item>
          <el-form-item :label="handleGlobalI18n('campaign', 'select_to')">
            <el-date-picker
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
            <multiple-register-channel ref="reg_channel" @registration_channel = "selectRegistration" :value="tags.register_channel.index" ></multiple-register-channel>
           </el-form-item>
        </div>
        <div v-else-if="profile_type==='register_store'">
          <el-form-item :label="handleGlobalI18n('campaign', 'select_register_store_field_name')">
            <multiple-register-store ref="reg_store" @registration_store = "selectRegistration" :value="tags.register_store.index" ></multiple-register-store>
          </el-form-item>
        </div>
        <div v-else-if="profile_type==='lastest_purchase_date'">
          <el-form-item :label="handleGlobalI18n('campaign', 'select_from')">
            <el-date-picker
              v-model="lastest_purchase_date_from"
              :format="globalData.value.date_format"
              :value-format="globalData.value.date_format"
              type="date">
            </el-date-picker>
          </el-form-item>
          <el-form-item :label="handleGlobalI18n('campaign', 'select_to')">
            <el-date-picker
              v-model="lastest_purchase_date_to"
              :format="globalData.value.date_format"
              :value-format="globalData.value.date_format"
              type="date">
            </el-date-picker>
          </el-form-item>
        </div>
        <div v-else-if="profile_type==='average_basket'">
          <el-form-item :label="handleGlobalI18n('campaign', 'select_from')" prop="average_basket_from">
            <el-input-number style="width:200px;" :min="0" :step="1"  v-model="average_basket_from"></el-input-number>
          </el-form-item>
          <el-form-item :label="handleGlobalI18n('campaign', 'select_to')" prop="average_basket_to">
            <el-input-number style="width:200px;" :min="0" :step="1"  v-model="average_basket_to"></el-input-number>
          </el-form-item>
        </div>
        <div v-else-if="profile_type==='available_point'">
          <el-form-item :label="handleGlobalI18n('campaign', 'select_from')" prop="available_point_from">
            <el-input-number style="width:200px;" :min="0" :step="1" :precision="0" v-model="available_point_from"></el-input-number>
          </el-form-item>
          <el-form-item :label="handleGlobalI18n('campaign', 'select_to')" prop="available_point_to">
            <el-input-number style="width:200px;" :min="0" :step="1" :precision="0" v-model="available_point_to"></el-input-number>
          </el-form-item>
        </div>
        <div v-else-if="profile_type==='average_basket_size'">
          <el-form-item label="Range">
             <el-select v-model="average_basket_size">
               <el-option key="Below 200 SGD" label="Below 200 SGD" value="Below 200 SGD"></el-option>
               <el-option key="200 - 250 SGD" label="200 - 250 SGD" value="200 - 250 SGD"></el-option>
               <el-option key="251 - 300 SGD" label="251 - 300 SGD" value="251 - 300 SGD"></el-option>
               <el-option key="Above 300 SGD" label="Above 300 SGD" value="Above 300 SGD"></el-option>
             </el-select>
          </el-form-item>
        </div>
        <div v-else-if="profile_type==='purchased_product'">
          <el-form-item :label="handleGlobalI18n('campaign', 'skus')">
            <el-select v-model="purchased_product">
              <el-option key="1" label="Pullover Male Green S" value="Pullover Male Green S"></el-option>
              <el-option key="2" label="Skirt Female Yellow L" value="Skirt Female Yellow L"></el-option>
              <el-option key="3" label="Jeans Male Red L" value="Jeans Male Red L"></el-option>
              <el-option key="4" label="Jeans Female Green S" value="Jeans Female Green S"></el-option>
              <el-option key="5" label="Jeans Female Blue M" value="Jeans Female Blue M"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div v-else-if="profile_type==='purchased_brand'">
          <el-form-item :label="handleGlobalI18n('campaign', 'brand')">
            <el-select v-model="purchased_brand">
              <el-option key="1" label="Glossy" value="Glossy"></el-option>
              <el-option key="2" label="Pure Joy " value="Pure Joy "></el-option>
              <el-option key="3" label="Shiny" value="Shiny"></el-option>
              <el-option key="4" label="Sparkle" value="Sparkle"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div v-else-if="profile_type==='purchased_category'">
          <el-form-item :label="handleGlobalI18n('campaign', 'category')">
            <el-select v-model="purchased_category">
              <el-option key="1" label="SUMMER" value="SUMMER"></el-option>
              <el-option key="2" label="REGULAR" value="REGULAR"></el-option>
              <el-option key="3" label="WINTER" value="WINTER"></el-option>
              <el-option key="4" label="OUTS" value="OUTS"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div v-else-if="profile_type==='campaign_respondent'">
          <el-form-item :label="handleGlobalI18n('campaign', 'campaign')">
            <el-select v-model="campaign_respondent">
              <el-option key="1" :label="handleGlobalI18n('campaign', 'EDM')" value="EDM"></el-option>
              <el-option key="2" :label="handleGlobalI18n('campaign', 'coupon')" value="Coupons"></el-option>
              <el-option key="3" :label="handleGlobalI18n('campaign', 'gift')" value="Gifts"></el-option>
            </el-select>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="selectDialog = false">{{handleGlobalI18n('campaign', 'back')}}</el-button>
        <el-button type="primary" @click="closeDialog(profile_type)" v-if="profile_type!=='tiers'">{{handleGlobalI18n('campaign', 'submit')}}</el-button>
      </div>
    </el-dialog>
    <el-form ref="campaign_info" :rules="rules" :model="campaign_info" label-width="250px" class="campaign">
      <!--活动名称-->
      <el-form-item :label="handleGlobalI18n('campaign', 'campaign_name') + ':'" prop="campaign_name" :rules="[
            { required: true, message: handleGlobalI18n('validation', 'campaign_name_null'), trigger: 'change' }
          ]" >
        <el-input  v-model="campaign_info.campaign_name" maxlength="32" @change="campaign_info.campaign_name=MixTrim(campaign_info.campaign_name)" :disabled="campaign_status==='3'"></el-input>
      </el-form-item>
      <!--活动类型-->
      <el-form-item :label="handleGlobalI18n('campaign', 'campaign_type') + ':'" prop="campaign_type_code" :rules="[
            { required: true, message: handleGlobalI18n('validation', 'campaign_type_null'), trigger: 'change' }
          ]">
        <el-select v-model="campaign_info.campaign_type_code" :disabled="campaign_status==='3'" clearable :placeholder="handleGlobalI18n('campaign', 'please_select')">
          <el-option :label="handleGlobalI18n('campaign', 'coupon_type')" value="4"></el-option>
          <el-option :label="handleGlobalI18n('campaign', 'communication_only_type')" value="7"></el-option>
          <el-option :label="handleGlobalI18n('campaign', 'gwp_type')" value="6"></el-option>
          <el-option :label="handleGlobalI18n('campaign', 'multiple_points_type')" value="2"></el-option>
        </el-select>
      </el-form-item>
      <!--活动日期-->
      <el-form-item :label="handleGlobalI18n('campaign', 'campaign_period') + ':'" prop="campaign_start_date"  :rules="[
            { required: true, message: handleGlobalI18n('validation', 'campaign_period_null'), trigger: 'change' }
          ]">
        <eldate-picker :value="campaign_date" :pickerOptions = "pickerOptions0" @valueDate="valueDate" :disabled="campaign_status==='3'"></eldate-picker>
      </el-form-item>
      <!--活动描述-->
      <el-form-item :label="handleGlobalI18n('campaign', 'campaign_description')+ ':'" >
        <el-input
          maxlength="80"
          style="width: 350px;"
          :disabled="campaign_status==='3'"
          type="textarea"
          :autosize="{ minRows: 3, maxRows: 6}"
          v-model="campaign_info.campaign_description">
        </el-input>
      </el-form-item>
      <div class="line" style="width: 100%;border-top:1px dashed #c7c7c7;margin-bottom: 15px;"></div>
      <!--活动目标-->
      <div v-show="campaign_info.campaign_type!=='5'" :class="{'not-allowed': campaign_status==='3'}" >
        <el-form-item :label="handleGlobalI18n('campaign', 'campaign_targets') + ':'" :rules="[
            { required: true, message: handleGlobalI18n('validation', 'campaign_info_incomplete_error'), trigger: 'change' }
          ]">
          <handle-radio
            :disabled="campaign_status==='3'"
            :data="campaign_target_radio"
            :campaign_targets="form.campaign_targets"
            @selId = "checkTarget"></handle-radio>
        </el-form-item>
        <!--By Profile-->
        <div class="target-list" v-if="form.campaign_targets===1">
          <div class="profile-target t"  v-for="(item,index) in by_profile" :key="index">
            <label class="title">{{ handleGlobalI18n('campaign', item.criteria_group).substring(0,1).toUpperCase()+handleGlobalI18n('campaign', item.criteria_group).substring(1)}}</label>
            <div class="ul">
              <template  v-for="item1 in item.criteria_field" >
                <div class="li" :class="{'check': tags.tier_name.length>0, 'pointer-events not-allowed ': campaign_status==='3'}" v-if="item1.criteria_field_code==='tiers'">
                  <p @click="clickP(item1.criteria_field_code)" :class="{'bg-f5f7fa':  campaign_status==='3'}"><span>+</span>{{handleGlobalI18n('campaign', item1.criteria_field_name)}}</p>
                  <by-profile :data="tags.tier_name" :disabled="campaign_status==='3'" @handleDelete="handleDelete"></by-profile>
                </div>
                <div class="li" :class="{'check': tags.age.length>0, 'pointer-events not-allowed ': campaign_status==='3'}" v-else-if="item1.criteria_field_code==='age'">
                  <p @click="clickP(item1.criteria_field_code)" :class="{'bg-f5f7fa':  campaign_status==='3'}"><span>+</span>{{handleGlobalI18n('campaign', item1.criteria_field_name)}}</p>
                  <by-profile :data="tags.age" :disabled="campaign_status==='3'" @handleDelete="handleDeleteAge"></by-profile>
                </div>
                <div class="li" :class="{'check': tags.birthday.length>0, 'pointer-events not-allowed ': campaign_status==='3'}" v-else-if="item1.criteria_field_code==='birthday'">
                  <p @click="clickP(item1.criteria_field_code)" :class="{'bg-f5f7fa':  campaign_status==='3'}"><span>+</span>{{handleGlobalI18n('campaign', item1.criteria_field_name)}}</p>
                  <by-profile :data="tags.birthday" :disabled="campaign_status==='3'" @handleDelete="handleDeleteBirthday"></by-profile>
                </div>
                <div class="li" :class="{'check': tags.join_date.length>0, 'pointer-events not-allowed ': campaign_status==='3'}" v-else-if="item1.criteria_field_code==='join_date'">
                  <p @click="clickP(item1.criteria_field_code)" :class="{'bg-f5f7fa':  campaign_status==='3'}"><span>+</span>{{handleGlobalI18n('campaign', item1.criteria_field_name)}}</p>
                  <by-profile :data="tags.join_date" :disabled="campaign_status==='3'" @handleDelete="handleDeleteJoinDate"></by-profile>
                </div>
                <div class="li" :class="{'check': tags.register_channel.name.length>0, 'pointer-events not-allowed ': campaign_status==='3'}" v-else-if="item1.criteria_field_code==='register_channel'">
                  <p @click="clickP(item1.criteria_field_code)" :class="{'bg-f5f7fa':  campaign_status==='3'}"><span>+</span>{{handleGlobalI18n('campaign', item1.criteria_field_name)}}</p>
                  <by-profile :data="tags.register_channel.name" :disabled="campaign_status==='3'" @handleDelete="handleDeleteRegisterChannel"></by-profile>
                </div>
                <div class="li" :class="{'check': tags.register_store.name.length>0, 'pointer-events not-allowed ': campaign_status==='3'}" v-else-if="item1.criteria_field_code==='register_store'">
                  <p @click="clickP(item1.criteria_field_code)" :class="{'bg-f5f7fa':  campaign_status==='3'}"><span>+</span>{{handleGlobalI18n('campaign', item1.criteria_field_name)}}</p>
                  <by-profile :data="tags.register_store.name" :disabled="campaign_status==='3'" @handleDelete="handleDeleteRegisterStore"></by-profile>
                </div>
                <div class="li" :class="{'check': tags.lastest_purchase_date.length>0, 'pointer-events not-allowed ': campaign_status==='3'}" v-else-if="item1.criteria_field_code==='lastest_purchase_date'">
                  <p @click="clickP(item1.criteria_field_code)" :class="{'bg-f5f7fa':  campaign_status==='3'}"><span>+</span>{{handleGlobalI18n('campaign', item1.criteria_field_name)}}</p>
                  <by-profile :data="tags.lastest_purchase_date" :disabled="campaign_status==='3'" @handleDelete="handleDeleteLastPurchaseDate"></by-profile>
                </div>
                <div class="li" :class="{'check': tags.average_basket.length>0, 'pointer-events not-allowed ': campaign_status==='3'}" v-else-if="item1.criteria_field_code==='average_basket'">
                  <p @click="clickP(item1.criteria_field_code)" :class="{'bg-f5f7fa':  campaign_status==='3'}"><span>+</span>{{handleGlobalI18n('campaign', item1.criteria_field_name)}}</p>
                  <by-profile :data="tags.average_basket" :disabled="campaign_status==='3'" @handleDelete="handleDeleteAverageBasket"></by-profile>
                </div>
                <div class="li" :class="{'check': tags.available_point.length>0, 'pointer-events not-allowed ': campaign_status==='3'}" v-else-if="item1.criteria_field_code==='available_point'">
                  <p @click="clickP(item1.criteria_field_code)" :class="{'bg-f5f7fa':  campaign_status==='3'}"><span>+</span>{{handleGlobalI18n('campaign', item1.criteria_field_name)}}</p>
                  <by-profile :data="tags.available_point" :disabled="campaign_status==='3'" @handleDelete="handleDeleteAvailablePoint"></by-profile>
                </div>
                <!--1111-->
                <div class="li" :class="{'check': tags.average_basket_size.length>0, 'pointer-events not-allowed ': campaign_status==='3'}" v-else-if="item1.criteria_field_code==='average_basket_size'">
                  <p @click="clickP(item1.criteria_field_code)" :class="{'bg-f5f7fa':  campaign_status==='3'}"><span>+</span>{{handleGlobalI18n('campaign', item1.criteria_field_code)}}</p>
                  <by-profile :data="tags.average_basket_size" :disabled="campaign_status==='3'" @handleDelete="handleDeleteAverageBasketSize"></by-profile>
                </div>
                <div class="li" :class="{'check': tags.purchased_product.length>0, 'pointer-events not-allowed ': campaign_status==='3'}" v-else-if="item1.criteria_field_code==='purchased_product'">
                  <p @click="clickP(item1.criteria_field_code)" :class="{'bg-f5f7fa':  campaign_status==='3'}"><span>+</span>{{handleGlobalI18n('campaign', item1.criteria_field_code)}}</p>
                  <by-profile :data="tags.purchased_product" :disabled="campaign_status==='3'" @handleDelete="handleDeletePurchasedProduct"></by-profile>
                </div>
                <div class="li" :class="{'check': tags.purchased_brand.length>0, 'pointer-events not-allowed ': campaign_status==='3'}" v-else-if="item1.criteria_field_code==='purchased_brand'">
                  <p @click="clickP(item1.criteria_field_code)" :class="{'bg-f5f7fa':  campaign_status==='3'}"><span>+</span>{{handleGlobalI18n('campaign', item1.criteria_field_code)}}</p>
                  <by-profile :data="tags.purchased_brand" :disabled="campaign_status==='3'" @handleDelete="handleDeletePurchasedBrand"></by-profile>
                </div>
                <div class="li" :class="{'check': tags.purchased_category.length>0, 'pointer-events not-allowed ': campaign_status==='3'}" v-else-if="item1.criteria_field_code==='purchased_category'">
                  <p @click="clickP(item1.criteria_field_code)" :class="{'bg-f5f7fa':  campaign_status==='3'}"><span>+</span>{{handleGlobalI18n('campaign', item1.criteria_field_code)}}</p>
                  <by-profile :data="tags.purchased_category" :disabled="campaign_status==='3'" @handleDelete="handleDeletePurchasedCategory"></by-profile>
                </div>
                <div class="li" :class="{'check': tags.campaign_respondent.length>0, 'pointer-events not-allowed ': campaign_status==='3'}" v-else-if="item1.criteria_field_code==='campaign_respondent'">
                  <p @click="clickP(item1.criteria_field_code)" :class="{'bg-f5f7fa':  campaign_status==='3'}"><span>+</span>{{handleGlobalI18n('campaign', item1.criteria_field_code)}}</p>
                  <by-profile :data="tags.campaign_respondent" :disabled="campaign_status==='3'" @handleDelete="handleDeleteCampaignRespondent"></by-profile>
                </div>
                <!--end---11111----end -->
                <div class="li" v-else>
                  <p ><span>+</span>{{handleGlobalI18n('campaign', item1.criteria_field_name)}}</p>
                </div>
              </template>
            </div>
          </div>
        </div>
        <!-- By Tags-->
        <div class="target-list" v-else-if="form.campaign_targets===2" >
          <div class="profile-target t1" v-for="(item,index) in bgTags" :key = "index" >
            <label class="title1">{{ handleGlobalI18n('campaign', item.segmentation_type_name).substring(0,1).toUpperCase()+handleGlobalI18n('campaign', item.segmentation_type_name).substring(1)}}</label>
            <div class="ul">
              <div class="li" v-for="(item1,index1) in item.list" :key = "index1" :class="{'pointer-events not-allowed': campaign_status==='3', 'check': form.by_tags[index].includes(index1)}" @click="checkByTag(index, index1)"><p :class="{'bg-f5f7fa':  campaign_status==='3'}">{{handleGlobalI18n('campaign', item1.segmentation_value_name)}}</p></div>
            </div>
          </div>
        </div>
      </div>
      <div class="lifecycle" v-show="campaign_info.campaign_type === '5'">
        <el-form-item label="Campaign target:">
          <div class="lifecycle-trigger">
            <div class="a" @click="checkLifeCycle(0)" :class="{ 'check': form.lifecycle_target[0]}">
              <div class="svg">
                <svg-icon :icon-class="checkLifeCycleIcon(0)"></svg-icon>
              </div>
              <div class="info">
                <el-input type="text"></el-input>
                <label class="label">days after join membership</label>
              </div>
            </div>
            <div class="a" @click="checkLifeCycle(1)" :class="{ 'check': form.lifecycle_target[1]}">
              <div class="svg">
                <svg-icon :icon-class="checkLifeCycleIcon(1)"></svg-icon>
              </div>
              <div class="info">
                <el-input type="text"></el-input>
                <label class="label">days after the first purchase</label>
              </div>
            </div>
            <div class="a" @click="checkLifeCycle(2)" :class="{ 'check': form.lifecycle_target[2]}">
              <div class="svg">
                <svg-icon :icon-class="checkLifeCycleIcon(2)"></svg-icon>
              </div>
              <div class="info">
                <label>Member level:</label>
                <el-select v-model="form.lifecycle_level" clearable>
                  <el-option label="All" value="1"></el-option>
                  <el-option label="Gold" value="2"></el-option>
                  <el-option label="Silver" value="3"></el-option>
                  <el-option label="Bronze" value="4"></el-option>
                </el-select>
                <el-input type="text"></el-input>
                <label class="label">days after upgrade/downgrade membership</label>
              </div>
            </div>
            <div class="a" @click="checkLifeCycle(3)" :class="{ 'check': form.lifecycle_target[3]}">
              <div class="svg">
                <svg-icon :icon-class="checkLifeCycleIcon(3)"></svg-icon>
              </div>
              <div class="info">
                <label>Points reach</label>
                <el-input type="text"></el-input>
              </div>
            </div>
            <div class="a" @click="checkLifeCycle(4)" :class="{ 'check': form.lifecycle_target[4]}">
              <div class="svg">
                <svg-icon :icon-class="checkLifeCycleIcon(4)"></svg-icon>
              </div>
              <div class="info">
                <el-input type="text"></el-input>
                <label>days after the lastest purchase</label>
              </div>
            </div>
          </div>
        </el-form-item>
      </div>
      <el-form-item class="estimate-target">
        <div  v-show="form.campaign_type!=='5'" class="flex">
          <div class="potential-reach">
            <p class="reach">{{handleGlobalI18n('campaign', 'potential_reach') + ':'}}<span>{{total_targets}}</span></p>
            <el-button @click="handleEstitimated" :disabled="campaign_status==='3'" :loading="calcLoading">{{handleGlobalI18n('campaign', 'estimate')}}</el-button>
          </div>
          <p class="control">
            <span>{{handleGlobalI18n('campaign', 'control_group') + ':'}}</span>
            <el-input-number v-model="form.control_group" style="width: 130px" :min="0" :max="100" :precision="2" :step="1"  :disabled="campaign_status==='3'"></el-input-number> %</p>
         </div>
        <div class="button">
          <router-link to="/campaign/campaign-list" tag="span">
            <el-button>{{handleGlobalI18n('campaign', 'cancel')}}</el-button>
          </router-link>
          <el-button @click="handleBack" type="primary" :loading="nextLoading">{{handleGlobalI18n('campaign', 'next')}}</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import { isObjectValueEqual } from '@/utils'
  import { mapGetters, mapMutations } from 'vuex'
  import { byTags, by_profile } from '@/utils/data'
  import ByProfile from '../by-profile'
  import HandleRadio from '../handleRadio'
  import EldatePicker from '@/components/EldatePicker'
  import MultipleRegisterChannel from './multiple_select_register_channel'
  import MultipleRegisterStore from './multiple_select-register_store'
  import { getTenantKPIByTier } from '@/api/kpi'
  import {
    addOrUpdateCampaignInfo,
    addOrUpdateCampaignTarget,
    calcTarget,
    queryCalcTarget
  } from '@/api/campaign'
  import { handleTrim } from '@/utils/util'
  import {
    validateCompare,
    validatePositiveInteger
  } from '@/utils/validate'
  import { DateTime } from 'luxon'
  export default {
    mixins: [handleTrim],
    data() {
      return {
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
        step: 0,
        target_code: '',
        calcLoading: false,
        average_basket_size: '',
        purchased_product: '',
        purchased_brand: '',
        purchased_category: '',
        campaign_respondent: '',
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
        rules: {},
        profile_type: 'profile_type',
        by_profile: by_profile,
        bgTags: byTags,
        selectDialog: false,
        profile: {
          select_gender: '',
          isGrade: ''
        },
        tierList: [],
        nextLoading: false,
        campaign_date: [],
        campaign_info: {
          campaign_name: '',
          campaign_type_code: '',
          campaign_start_date: '',
          campaign_end_date: '',
          campaign_description: ''
        },
        campaign_wizard_id: '',
        saveCampaignInfoLoading: false,
        channel_list: [{
          channel_code: 'channel_name',
          channel_name: ''
        }],
        target: 1,
        campaign_target_radio: [
          { title: 'by_profile', id: 1 },
          { title: 'by_tags', id: 2 }
          // { title: 'Import Member From Files', id: 3 }
        ],
        form: {
          campaign_name: '',
          campaign_type: '1',
          campaign_date_period: '',
          campaign_targets: 1,
          control_group: 0,
          by_tags: [[], [], [], [], [], []],
          lifecycle_level: '',
          lifecycle_target: []
        },
        campaign_info_state: false,
        transfer_tier: [],
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
          average_basket_size: [],
          purchased_product: [],
          purchased_brand: [],
          purchased_category: [],
          campaign_respondent: []
        },
        dialogData: {
          age_from: '',
          age_to: ''
        },
        campaign_status: '',
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
        next_state: false,
        timer: null,
        total_targets: '',
        postfix: ''
      }
    },
    computed: {
      ...mapGetters([
        'campaign_add',
        'campaign_edit'
      ]),
      handleDialogTitle() {
        switch (this.profile_type) {
          case 'tiers':
            return this.handleGlobalI18n('campaign', 'select_tier')
          case 'age':
            return this.handleGlobalI18n('campaign', 'select_age')
          case 'birthday':
            return this.handleGlobalI18n('campaign', 'select_birthday')
          case 'join_date':
            return this.handleGlobalI18n('campaign', 'select_join_date')
          case 'register_store':
            return this.handleGlobalI18n('campaign', 'select_registration_store')
          case 'register_channel':
            return this.handleGlobalI18n('campaign', 'select_registration_channel')
          case 'lastest_purchase_date':
            return this.handleGlobalI18n('campaign', 'select_lastest_purchase_date')
          case 'average_basket':
            return this.handleGlobalI18n('campaign', 'select_average_basket')
          case 'available_point':
            return this.handleGlobalI18n('campaign', 'select_available_point')
          case 'average_basket_size':
            return this.handleGlobalI18n('campaign', 'average_basket_size').substring(0, 1).toUpperCase() + this.handleGlobalI18n('campaign', 'average_basket_size').substring(1)
          case 'purchased_product':
            return this.handleGlobalI18n('campaign', 'purchased_product').substring(0, 1).toUpperCase() + this.handleGlobalI18n('campaign', 'purchased_product').substring(1)
          case 'purchased_brand':
            return this.handleGlobalI18n('campaign', 'purchased_brand').substring(0, 1).toUpperCase() + this.handleGlobalI18n('campaign', 'purchased_brand').substring(1)
          case 'purchased_category':
            return this.handleGlobalI18n('campaign', 'purchased_category').substring(0, 1).toUpperCase() + this.handleGlobalI18n('campaign', 'purchased_category').substring(1)
          case 'campaign_respondent':
            return this.handleGlobalI18n('campaign', 'campaign_respondent').substring(0, 1).toUpperCase() + this.handleGlobalI18n('campaign', 'campaign_respondent').substring(1)
        }
      }
    },
    components: {
      HandleRadio,
      ByProfile,
      EldatePicker,
      MultipleRegisterChannel,
      MultipleRegisterStore
    },
    mounted() {
      clearInterval(this.timer)
    },
    created() {
      this.getTierList()
    },
    destroyed() {
      clearInterval(this.timer)
    },
    methods: {
      ...mapMutations({
        setAdd: 'SET_ADD'
      }),
      validatePositiveInteger,
      validateCompare,
      isObjectValueEqual,
      handleEstitimated() {
        if (this.campaign_wizard_id === '' || this.campaign_wizard_id === null || this.campaign_info_state) {
          this.saveCampaignInfo(false)
        } else {
          this.target_code = ''
          this.calcEstitimated()
        }
      },
      calcEstitimated() {
        this.calcLoading = true
        if (this.target_code !== '') {
          this.setTimer()
          return
        }
        // 保存信息
        const params = {
          target_code: null,
          campaign_id: parseInt(this.campaign_wizard_id)
        }
        var criteria_values = []
        if (this.form.campaign_targets === 1) {
          criteria_values = [{
            criteria_code: 'tiers',
            criteria_value: this.tags.tier_code.join(',')
          }, {
            criteria_code: 'age_from',
            criteria_value: this.dialogData.age_from
          }, {
            criteria_code: 'age_to',
            criteria_value: this.dialogData.age_to
          }, {
            criteria_code: 'birthday_from',
            criteria_value: this.birthday_from
          }, {
            criteria_code: 'birthday_to',
            criteria_value: this.birthday_to
          }, {
            criteria_code: 'join_date_from',
            criteria_value: this.join_date_from
          }, {
            criteria_code: 'join_date_to',
            criteria_value: this.join_date_to
          }, {
            criteria_code: 'register_store',
            criteria_value: this.tags.register_store.value.join(',')
          }, {
            criteria_code: 'register_channel',
            criteria_value: this.tags.register_channel.value.join(',')
          }, {
            criteria_code: 'lastest_purchase_date_from',
            criteria_value: this.lastest_purchase_date_from
          }, {
            criteria_code: 'lastest_purchase_date_to',
            criteria_value: this.lastest_purchase_date_to
          }, {
            criteria_code: 'average_basket_from',
            criteria_value: this.average_basket_from
          }, {
            criteria_code: 'average_basket_to',
            criteria_value: this.average_basket_to
          }, {
            criteria_code: 'available_point_from',
            criteria_value: this.available_point_from
          }, {
            criteria_code: 'available_point_to',
            criteria_value: this.available_point_to
          }]
        } else if (this.form.campaign_targets === 2) {
          // by tags
          var by_targs = this.form.by_tags
          const byTags = this.bgTags
          criteria_values = []
          const by_targets_length = by_targs.length
          for (let i = 0; i < by_targets_length; i++) {
            var segmentation = []
            criteria_values.push({
              criteria_code: byTags[i].segmentation_type_code,
              criteria_value: ''
            })
            const by_targets_i_length = by_targs[i].length
            if (by_targets_i_length <= 0) {
              continue
            }
            for (let j = 0; j < by_targets_i_length; j++) {
              segmentation.push(byTags[i].list[by_targs[i][j]].segmentation_value_code)
            }
            criteria_values[i].criteria_value = segmentation.join(',')
          }
        }
        params.criteria_values = criteria_values
        calcTarget(params).then(res => {
          this.target_code = res.return_result.target_code
          if (this.target_code !== '' && this.target_code !== null && this.target_code !== undefined) {
            this.setTimer()
          } else {
            this.$notify({
              title: this.handleGlobalI18n('campaign', 'error'),
              message: this.handleGlobalI18n('campaign', 'error'),
              type: 'error'
            })
            this.calcLoading = false
          }
        }).catch(() => {
          this.calcLoading = false
        })
      },
      setTimer() {
        this.timer = setInterval(() => {
          this.getCaleValue()
        }, 10000)
      },
      getCaleValue() {
        if (this.target_code) {
          queryCalcTarget({ target_code: this.target_code, campaign_id: parseInt(this.campaign_wizard_id) }).then(res => {
            if (res.return_result.finish) {
              this.total_targets = res.return_result.total_targets || 0
              this.calcLoading = false
              clearInterval(this.timer)
            }
          }).catch(() => {
            this.calcLoading = false
          })
        }
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
      getTierList() {
        getTenantKPIByTier().then(res => {
          this.tierList = res.return_result.kpis
        })
      },
      clickP(val) {
        this.selectDialog = true
        this.profile_type = val
      },
      setDateTime() {
        const now_date = DateTime.local().toISO()
        const now_date_length = now_date.length
        this.postfix = now_date.substring(now_date_length - 6, now_date_length)
      },
      saveCampaignInfo(state = true) {
        this.$refs['campaign_info'].validate((valid) => {
          if (valid) {
            this.saveCampaignInfoLoading = true
            this.setDateTime()
            addOrUpdateCampaignInfo({ ...this.campaign_info, compaign_wizard_id: this.campaign_wizard_id, campaign_start_date: `${this.campaign_info.campaign_start_date}T00:00:00.000${this.postfix}`, campaign_end_date: `${this.campaign_info.campaign_end_date}T23:59:59.999${this.postfix}` }).then(res => {
              this.campaign_wizard_id = res.return_result.compaign_wizard_id
              this.saveCampaignInfoLoading = false
              this.campaign_info_state = false
              if (state) {
                this.handleSaveTarget()
              } else {
                this.calcEstitimated()
              }
            })
          }
        })
      },
      valueDate(val) {
        this.campaign_date = val;
        [this.campaign_info.campaign_start_date, this.campaign_info.campaign_end_date] = val
      },
      checkLifeCycleIcon(id) {
        if (this.form.lifecycle_target[id]) {
          return 'fit'
        } else {
          return 'dot'
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
              case 'average_basket_size':
                this.tags.average_basket_size = []
                this.tags.average_basket_size.push(this.average_basket_size)
                break
              case 'purchased_product':
                this.tags.purchased_product = []
                this.tags.purchased_product.push(this.purchased_product)
                break
              case 'purchased_brand':
                this.tags.purchased_brand = []
                this.tags.purchased_brand.push(this.purchased_brand)
                break
              case 'purchased_category':
                this.tags.purchased_category = []
                this.tags.purchased_category.push(this.purchased_category)
                break
              case 'campaign_respondent':
                this.tags.campaign_respondent = []
                this.tags.campaign_respondent.push(this.campaign_respondent)
                break
            }
          } else {
            // console.log('error submit!!')
            return false
          }
        })
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
        }
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
      handleDeleteAverageBasketSize(tag) {
        this.average_basket_size = ''
        this.tags.average_basket_size.splice(this.tags.average_basket_size.indexOf(tag), 1)
      },
      handleDeletePurchasedProduct(tag) {
        this.purchased_product = ''
        this.tags.purchased_product.splice(this.tags.purchased_product.indexOf(tag), 1)
      },
      handleDeletePurchasedBrand(tag) {
        this.purchased_brand = ''
        this.tags.purchased_brand.splice(this.tags.purchased_brand.indexOf(tag), 1)
      },
      handleDeletePurchasedCategory(tag) {
        this.purchased_category = ''
        this.tags.purchased_category.splice(this.tags.purchased_category.indexOf(tag), 1)
      },
      handleDeleteCampaignRespondent(tag) {
        this.campaign_respondent = ''
        this.tags.campaign_respondent.splice(this.tags.campaign_respondent.indexOf(tag), 1)
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
      handleClose(tag) {
        this.tags.splice(this.tags.indexOf(tag), 1)
      },
      handleBack() {
        // if status 5
        this.setAdd(Object.assign({}, this.campaign_add, {
          'basic': {
            total_targets: this.total_targets
          }
        }))
        if (this.campaign_status === '3') {
          this.toNext()
          return true
        }
        if (this.campaign_wizard_id === '' || this.campaign_wizard_id === null || this.campaign_info_state) {
          this.saveCampaignInfo()
        } else {
          this.handleSaveTarget()
        }
      },
      handleSaveTarget() {
        // 保存信息
        const params = {
          compaign_wizard_id: parseInt(this.campaign_wizard_id),
          target_type: this.form.campaign_targets,
          control_group: 100 - parseInt(this.form.control_group)
        }
        var target = {}
        if (this.form.campaign_targets === 1) {
          if (this.tags.tier_code.length <= 0 && this.dialogData.age_from === '' && this.dialogData.age_to === '' && this.birthday_from === '' && this.birthday_to === '' && this.join_date_from === '' && this.join_date_to === '' && this.tags.register_store.value <= 0 && this.tags.register_channel.value <= 0 && this.lastest_purchase_date_from === '' && this.lastest_purchase_date_to === '' && this.average_basket_from === '' && this.average_basket_to === '' && this.available_point_from === '' && this.available_point_to === '') {
            this.$notify({
              title: this.handleGlobalI18n('campaign', 'error'),
              message: this.handleGlobalI18n('validation', 'campaign_info_incomplete_error'),
              type: 'error'
            })
            return false
          }
          target = {
            target_profiles: [
              {
                criteria_group_code: 'profile',
                criteria_group_name: 'profile',
                criteria_fields: [
                  {
                    criteria_field_code: 'tiers',
                    criteria_field_name: 'tiers',
                    criteria_field_option: {
                      criteria_field_option_name: this.tags.tier_name.join(','),
                      criteria_field_option_code: this.tags.tier_code.join(',')
                    }
                  }, {
                    criteria_field_code: 'age_from',
                    criteria_field_name: 'age',
                    criteria_field_option: {
                      criteria_field_option_name: this.dialogData.age_from,
                      criteria_field_option_code: this.dialogData.age_from
                    }
                  }, {
                    criteria_field_code: 'age_to',
                    criteria_field_name: 'age',
                    criteria_field_option: {
                      criteria_field_option_name: this.dialogData.age_to,
                      criteria_field_option_code: this.dialogData.age_to
                    }
                  }, {
                    criteria_field_code: 'birthday_from',
                    criteria_field_name: 'birthday',
                    criteria_field_option: {
                      criteria_field_option_name: this.birthday_from,
                      criteria_field_option_code: this.birthday_from
                    }
                  }, {
                    criteria_field_code: 'birthday_to',
                    criteria_field_name: 'birthday',
                    criteria_field_option: {
                      criteria_field_option_name: this.birthday_to,
                      criteria_field_option_code: this.birthday_to
                    }
                  }, {
                    criteria_field_code: 'join_date_from',
                    criteria_field_name: 'join_date',
                    criteria_field_option: {
                      criteria_field_option_name: this.join_date_from,
                      criteria_field_option_code: this.join_date_from
                    }
                  }, {
                    criteria_field_code: 'join_date_to',
                    criteria_field_name: 'join_date',
                    criteria_field_option: {
                      criteria_field_option_name: this.join_date_to,
                      criteria_field_option_code: this.join_date_to
                    }
                  }, {
                    criteria_field_code: 'register_store',
                    criteria_field_name: 'register_store',
                    criteria_field_option: {
                      criteria_field_option_name: this.tags.register_store.name.join(','),
                      criteria_field_option_code: this.tags.register_store.value.join(',')
                    }
                  }, {
                    criteria_field_code: 'register_channel',
                    criteria_field_name: 'register_channel',
                    criteria_field_option: {
                      criteria_field_option_name: this.tags.register_channel.name.join(','),
                      criteria_field_option_code: this.tags.register_channel.value.join(',')
                    }
                  }
                ]
              },
              {
                criteria_group_code: 'transaction',
                criteria_group_name: 'transaction',
                criteria_fields: [
                  {
                    criteria_field_code: 'lastest_purchase_date_from',
                    criteria_field_name: 'lastest_purchase_date',
                    criteria_field_option: {
                      criteria_field_option_name: this.lastest_purchase_date_from,
                      criteria_field_option_code: this.lastest_purchase_date_from
                    }
                  }, {
                    criteria_field_code: 'lastest_purchase_date_to',
                    criteria_field_name: 'lastest_purchase_date',
                    criteria_field_option: {
                      criteria_field_option_name: this.lastest_purchase_date_to,
                      criteria_field_option_code: this.lastest_purchase_date_to
                    }
                  }, {
                    criteria_field_code: 'average_basket_from',
                    criteria_field_name: 'average_basket',
                    criteria_field_option: {
                      criteria_field_option_name: this.average_basket_from,
                      criteria_field_option_code: this.average_basket_from
                    }
                  }, {
                    criteria_field_code: 'average_basket_to',
                    criteria_field_name: 'average_basket',
                    criteria_field_option: {
                      criteria_field_option_name: this.average_basket_to,
                      criteria_field_option_code: this.average_basket_to
                    }
                  }
                ]
              },
              {
                criteria_group_code: 'point',
                criteria_group_name: 'point',
                criteria_fields: [
                  {
                    criteria_field_code: 'available_point_from',
                    criteria_field_name: 'available_point',
                    criteria_field_option: {
                      criteria_field_option_name: this.available_point_from,
                      criteria_field_option_code: this.available_point_from
                    }
                  }, {
                    criteria_field_code: 'available_point_to',
                    criteria_field_name: 'available_point',
                    criteria_field_option: {
                      criteria_field_option_name: this.available_point_to,
                      criteria_field_option_code: this.available_point_to
                    }
                  }
                ]
              }
            ]
          }
        } else if (this.form.campaign_targets === 2) {
          var by_targs = this.form.by_tags
          const byTags = this.bgTags
          target = {
            target_tags: []
          }
          const by_targets_length = by_targs.length
          var ta_state = []
          for (let i = 0; i < by_targets_length; i++) {
            ta_state.push(by_targs[i].length > 0 ? '1' : '0')
            var segmentation = []
            target.target_tags.push({
              segmentation_type_code: byTags[i].segmentation_type_code,
              segmentation_type_name: byTags[i].segmentation_type_name,
              segmentation_values: []
            })
            const by_targets_i_length = by_targs[i].length
            if (by_targets_i_length <= 0) {
              continue
            }
            for (let j = 0; j < by_targets_i_length; j++) {
              segmentation.push(byTags[i].list[by_targs[i][j]])
            }
            target.target_tags[i].segmentation_values = segmentation
          }
          if (!(ta_state.indexOf('1') > -1)) {
            this.$notify({
              title: 'Error',
              message: this.handleGlobalI18n('validation', 'campaing_info_incomplete_error'),
              type: 'error'
            })
            return false
          }
        }
        this.nextLoading = true
        // console.log(Object.assign({}, params, target))
        addOrUpdateCampaignTarget(Object.assign({}, params, target)).then(res => {
          this.nextLoading = false
          this.next_state = true
          this.toNext()
        }).catch(res => {
          this.nextLoading = false
        })
      },
      toNext() {
        var id = 2
        if (this.campaign_info.campaign_type_code === '4') {
          id = 3
        }
        this.$emit('selectTabs', id)
        this.$emit('selectCampaignType', { campaign_type: this.campaign_info.campaign_type_code, campaign_wizard_id: parseInt(this.campaign_wizard_id) })
      },
      checkTarget(id) {
        this.form.campaign_targets = id
      },
      checkByTag(index, index1) {
        var arr = this.form.by_tags[index]
        if (arr.includes(index1)) {
          arr.splice(arr.indexOf(index1), 1)
        } else {
          this.form.by_tags[index].push(index1)
        }
        // this.$set(this.form.by_tags, index, index1)
      },
      checkLifeCycle(id) {
        this.$set(this.form.lifecycle_target, id, !this.form.lifecycle_target[id])
      },
      indexOf(arr, item) {
        for (var i = 0; i < arr.length; i++) {
          if (this.isObjectValueEqual(arr[i], item)) {
            return i.toString()
          }
        }
        return false
      }
    },
    watch: {
      transfer_tier() {
        this.tags.tier_name = []
        this.tags.tier_code = []
        for (const index of this.transfer_tier) {
          this.tags.tier_code.push(this.tierList[index].member_tier_code)
          this.tags.tier_name.push(this.tierList[index].member_tier_name)
        }
      },
      campaign_info: {
        deep: true,
        handler(val) {
          if (this.campaign_wizard_id !== '') {
            this.campaign_info_state = true
          }
        }
      },
      campaign_edit() {
        setTimeout(() => {
          if (this.campaign_edit.state && this.campaign_edit.id !== null) {
            const edit_detail = this.campaign_edit.detail
            const target = JSON.parse(edit_detail.target)
            this.campaign_wizard_id = this.campaign_edit.id
            this.campaign_date = [edit_detail.campaign_start_date, edit_detail.campaign_end_date]
            this.campaign_info = {
              campaign_name: edit_detail.campaign_name,
              campaign_type_code: edit_detail.communication_type_code.toString(),
              campaign_description: edit_detail.campaign_description
            }
            this.campaign_status = edit_detail.campaign_status
            this.step = edit_detail.step
            if (target === null) {
              return true
            }
            this.form.control_group = 100 - parseInt(target.control_group)
            if (target.hasOwnProperty('target_profiles')) {
              const target_detail = target.target_profiles
              this.form.campaign_targets = 1
              for (const i1 in target_detail) {
                if (target_detail[i1].hasOwnProperty('criteria_fields')) {
                  for (let i2 = 0; i2 < target_detail[i1].criteria_fields.length; i2++) {
                    const obj = target_detail[i1].criteria_fields[i2]
                    var code = []
                    var name = []
                    if (obj.criteria_field_option.hasOwnProperty('criteria_field_option_code')) {
                      code = obj.criteria_field_option.criteria_field_option_code
                    }
                    if (obj.criteria_field_option.hasOwnProperty('criteria_field_option_name')) {
                      name = obj.criteria_field_option.criteria_field_option_name
                    }
                    if (obj.criteria_field_code === 'tiers') {
                      this.tags.tier_code = code.length ? code.split(',') : []
                      this.tags.tier_name = name.length ? name.split(',') : []
                      for (let i = 0; i < this.tierList.length; i++) {
                        if (obj.criteria_field_option.hasOwnProperty('criteria_field_option_code')) {
                          if (obj.criteria_field_option.criteria_field_option_code.indexOf(this.tierList[i].member_tier_code) > -1) {
                          // if (obj.criteria_field_option.criteria_field_option_code.indexOf(`tier_${this.tierList[i].member_tier_code}`) > -1) {
                            this.transfer_tier.push(i)
                          }
                        }
                      }
                    } else if (obj.criteria_field_code === 'age_from') {
                      this.dialogData.age_from = code.length ? code : ''
                    } else if (obj.criteria_field_code === 'age_to') {
                      this.dialogData.age_to = code.length ? code : ''
                      if (this.dialogData.age_from && this.dialogData.age_to) {
                        this.tags.age.push(`${this.dialogData.age_from}-${this.dialogData.age_to}`)
                      }
                    } else if (obj.criteria_field_code === 'birthday_from') {
                      this.birthday_from = code.length ? code : ''
                    } else if (obj.criteria_field_code === 'birthday_to') {
                      this.birthday_to = code.length ? code : ''
                      if (this.birthday_from && this.birthday_to) {
                        this.tags.birthday.push(`${this.birthday_from}-${this.birthday_to}`)
                      }
                    } else if (obj.criteria_field_code === 'join_date_from') {
                      this.join_date_from = code.length ? code : ''
                    } else if (obj.criteria_field_code === 'join_date_to') {
                      this.join_date_to = code.length ? code : ''
                      if (this.join_date_from && this.join_date_to) {
                        this.tags.join_date.push(`${this.join_date_from} / ${this.join_date_to}`)
                      }
                    } else if (obj.criteria_field_code === 'lastest_purchase_date_from') {
                      this.lastest_purchase_date_from = code.length ? code : ''
                    } else if (obj.criteria_field_code === 'lastest_purchase_date_to') {
                      this.lastest_purchase_date_to = code.length ? code : ''
                      if (this.lastest_purchase_date_from && this.lastest_purchase_date_to) {
                        this.tags.lastest_purchase_date.push(`${this.lastest_purchase_date_from} / ${this.lastest_purchase_date_to}`)
                      }
                    } else if (obj.criteria_field_code === 'average_basket_from') {
                      this.average_basket_from = code.length ? code : ''
                    } else if (obj.criteria_field_code === 'average_basket_to') {
                      this.average_basket_to = code.length ? code : ''
                      if (this.average_basket_from && this.average_basket_to) {
                        this.tags.average_basket.push(`${this.average_basket_from}-${this.average_basket_to}`)
                      }
                    } else if (obj.criteria_field_code === 'available_point_from') {
                      this.available_point_from = code.length ? code : ''
                    } else if (obj.criteria_field_code === 'available_point_to') {
                      this.available_point_to = code.length ? code : ''
                      if (this.available_point_from && this.available_point_to) {
                        this.tags.available_point.push(`${this.available_point_from}-${this.available_point_to}`)
                      }
                    } else if (obj.criteria_field_code === 'register_channel') {
                      this.tags.register_channel.name = name.length ? name.split(',') : []
                      this.tags.register_channel.value = code.length ? code.split(',') : []
                    } else if (obj.criteria_field_code === 'register_store') {
                      this.tags.register_store.name = name.length ? name.split(',') : []
                      this.tags.register_store.value = code.length ? code.split(',') : []
                    }
                  }
                }
              }
            } else {
              this.form.campaign_targets = 2
              const byTags_length = this.bgTags.length
              const targetTags_length = target.target_tags.length
              for (let i = 0; i < byTags_length; i++) {
                for (let i2 = 0; i2 < targetTags_length; i2++) {
                  if (target.target_tags[i2].segmentation_type_code === this.bgTags[i].segmentation_type_code) {
                    if (target.target_tags[i2].hasOwnProperty('segmentation_values')) {
                      for (let i3 = 0; i3 < target.target_tags[i2].segmentation_values.length; i3++) {
                        const id = this.indexOf(this.bgTags[i].list, target.target_tags[i2].segmentation_values[i3])
                        if (id) {
                          this.form.by_tags[i].push(JSON.parse(id))
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }, 800)
      }
    }
  }
</script>

<style scoped rel="stylesheet/scss" lang="scss">
  .campaign{
    .el-input,.el-select{
      width: 350px;
    }
  }
  .basic-info {
    background-color: #ffffff;
    margin-top: 13px;
    .el-form {
      padding: 20px;
    }
    .target-list {
      .t {
        .title {
          min-width: 238px;
          text-align: right;
          color: #606266;
          font-size: 14px;
          margin-top: 7px;
          margin-right: 14px;
        }
        .title1{
          @extend .title;
          margin-bottom:10px;
        }
        display: flex;
        flex:1;
        margin-bottom:18px;
      }
      .t1{
        @extend .t;
        // flex-wrap: wrap;
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
            font-weight: bold;
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
    .estimate-target {
      margin-top: 50px;
      font-size: 16px;
      .flex{
        display: flex;
        align-items: center;
      }
      .reach {
        display: inline;
        line-height: 40px;
        padding:7px 10px;
        border-radius: 5px;
        color: $primary;
        border: 1px solid $primary;
      }
      .button {
        margin-top: 30px;
      }
      .control{
        margin-left: 50px;
        display: initial;
      }
    }
    .lifecycle-trigger {
      .el-input, .el-select {
        width: 120px;
      }
      .a {
        padding: 5px;
        width: 680px;
        line-height: 20px;
        border-radius: 5px;
        background-color: rgba(239, 239, 239, 1);
        color: #bbbbbb;
        font-size: 14px;
        display: flex;
        margin-bottom: 12px;
        .svg {
          font-size: 25px;
          line-height: 32px;
          margin: 0 10px;
        }
      }
      .check {
        background-color: $primary;
        color: #ffffff;
      }
    }
    .target2 {
      margin-bottom: 20px;
      margin-left:150px;
      display: flex;
      flex:1;
      flex-wrap: wrap;
      justify-content: flex-start;
      .li{
        &:nth-child(2n+1) {
          background-color: #EAF7F1;
        }
        &:nth-child(2n+2) {
          background-color: #EDF7EE;
        }
        margin-right:10px;
        margin-top:10px;
        height: 359px;
        background-color: rgba(242, 242, 242, 1);
        padding: 10px;
        h5 {
          text-align: center;
          background-color: rgba(255, 255, 255, 1);
          line-height: 1;
          font-size: 14px;
          font-weight: 700;
          padding: 10px 10px;
        }
        li {
          text-align: center;
          margin-top: 15px;

          div {
            margin: auto;
            line-height: 1;
            padding: 10px 0;
            border-radius: 10px;
            background-color: #ffffff;
          }
        }
      }
    }
    .target3 {
      .template {
        height: 40px;
        background-color: #f2f2f2;
        label {
          margin-left: 20px;
        }
        span {
          color: #6866FE;
        }
      }
    }
  }
</style>
