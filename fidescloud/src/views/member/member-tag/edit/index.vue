<template>
  <div class="addNewTagPage new-theme-css addNewTagPage" v-loading="detail_loading">
    <div class="click-button">
      <div>
        <el-button class="cancel" @click="goBack()">{{$t('loyalty.fc_operation_btn_cancel_label')}}</el-button>
        <el-button type="primary" :loading="save_loading" class="save" @click="submitForm">{{handleGlobalI18n('loyalty', 'save')}}</el-button>
      </div>
    </div>
    <!--info-->
    <div class="contain" v-loading="loading">
      <div style="margin-top: 20px">
        <ed-header-title :title="renderTitle" />
      </div>
      <el-form ref="form" label-position="left" :model="form" :rules="rules"  label-width="300px">
        <div class="content">
          <div class="info">
              <!--tag name-->
              <el-form-item :label="$t('member.fc_member_tag_add_name_label')" prop="tag_name">
                <template>
                  <el-input v-model="form.tag_name" maxlength="200" :placeholder="$t('member.fc_member_tag_add_name_input_label')"></el-input>
                </template>
              </el-form-item>
              <!--tag category-->
              <el-form-item :label="$t('member.fc_member_tag_add_category_label')" prop="tag_category">
                <template>
                  <el-select @change="changeTagCategory" :placeholder="$t('member.fc_member_tag_add_category_input_label')" v-model="form.tag_category" clearable style="width: 300px;">
                    <el-option class="new-select-option" v-for="(item, index) in category_list" :key="index" :label="item.category_name" :value="item.category_id"></el-option>
                  </el-select>
                </template>
              </el-form-item>
              <!--tag groups-->
              <el-form-item :label="$t('member.fc_member_tag_add_group_label')"  prop="tag_group">
                <template>
                  <el-select ref="tag_group" :placeholder="$t('member.fc_member_tag_add_group_input_label')" v-model="form.tag_group" clearable style="width: 300px;">
                    <el-option class="new-select-option" v-for="(item, index) in sortGroupList" :key="index" :label="item.group_name" :value="item.group_id"></el-option>
                  </el-select>
                  <el-button class="deep-blue" :style="{'opacity': form.tag_category ? 1 : 0.6}" :disabled="form.tag_category ? false : true" type="primary" @click="handleClickTagGroup">{{$t('member.fc_member_tag_add_group_btn_add_label')}}</el-button>
                </template>
              </el-form-item>
              <!-- type -->
              <el-form-item :label="$t('member.fc_member_tag_add_type_label')" prop="type">
                <el-radio-group @change="handleChangeType" v-model="form.type">
                  <el-radio :label="'ConditionalTag'" class="min-width-330">{{$t('member.fc_member_tag_add_type_1st_label')}}</el-radio>
                  <el-radio :label="'UnconditionalTag'">{{$t('member.fc_member_tag_add_type_2nd_label')}}</el-radio>
                </el-radio-group>
              </el-form-item>
              <div v-if="form.UnConditionalTagHidden">
                <!-- conditions module -->
                <el-form-item :label="$t('member.fc_member_tag_add_conditions_label')">
                  <template>
                    <p class="" style="color: #2777FF;"><i class="el-icon-info" style="color:#2777FF;marginRight:10px;"></i>{{$t('member.fc_member_tag_add_conditions_tips')}}</p>
                  </template>
                </el-form-item>
                <!-- General module-->
                <el-form-item :label="$t('member.fc_member_tag_add_general_label')">
                  <!-- gender -->
                  <div class="general-div">
                    <div class="general-div-gender">
                      <el-form-item>
                        <el-checkbox class="" label="Gender" v-model="form.genderCheckbox">{{$t('member.fc_member_tag_add_general_gender_label')}}</el-checkbox>
                      </el-form-item>
                      <el-form-item>
                        <el-checkbox-group :disabled="!form.genderCheckbox.length" v-model="form.gender">
                          <el-checkbox :label="'1'">{{$t('member.fc_member_tag_add_general_gender_option1_label')}}</el-checkbox>
                          <el-checkbox :label="'2'">{{$t('member.fc_member_tag_add_general_gender_option2_label')}}</el-checkbox>
                          <el-checkbox :label="'3'">{{$t('member.fc_member_tag_add_general_gender_option3_label')}}</el-checkbox>
                        </el-checkbox-group>
                      </el-form-item>
                    </div>
                    <span class="tag-error" v-if="form.genderCheckbox.length && !form.gender.length">{{$t('member.fc_config_gender_input_tips')}}</span>
                  </div>
                  <!-- age -->
                  <div class="general-div">
                    <div class="general-div-age">
                      <el-form-item>
                        <el-checkbox class="" label="Age" v-model="form.age">{{$t('member.fc_member_tag_add_general_age_label')}}</el-checkbox>
                      </el-form-item>
                      <el-form-item prop="gte_age">
                        <el-input-number :class="{'errors': judgeNumberInput1(form.age, String(form.gte_age), String(form.lte_age))}" :disabled="!form.age.length" @change="handleGteAge" ref="gte_age" v-model="form.gte_age" :min="0" :max="200" label="描述文字"></el-input-number>&nbsp;&nbsp;-&nbsp;&nbsp;
                      </el-form-item>
                      <el-form-item prop="lte_age">
                        <el-input-number :class="{'errors': judgeNumberInput1(form.age, String(form.gte_age), String(form.lte_age))}" :disabled="!form.age.length" v-model="form.lte_age" :min="0" :max="200" label="描述文字"></el-input-number>
                      </el-form-item>
                    </div>
                    <span class="tag-error" v-if="judgeNumberInput2(form.age, String(form.gte_age), String(form.lte_age))">{{$t('member.fc_field_input_empty_tips')}}</span>
                    <span class="tag-error" v-if="judgeNumberInput3(form.age, String(form.gte_age), String(form.lte_age))">{{$t('member.fc_member_lifecycle_vaule_incorrect_tips')}}</span>
                  </div>
                  <div class="general-div">
                    <!-- birthday -->
                    <div class="general-div-birth">
                      <el-form-item>
                        <el-checkbox class="" label="birthday" v-model="form.birthdayCheckbox">{{$t('member.fc_member_tag_add_general_birthday_label')}}</el-checkbox>
                      </el-form-item>
                      <el-form-item>
                        <el-select :disabled="!form.birthdayCheckbox.length" @change="selectFirstTransactionDate('birthdayLte')" :placeholder="$t('member.fc_member_tag_add_general_birthday_input_label')" v-model="form.birthdayLte" clearable style="width: 300px;">
                          <el-option :key="index" :label="item.label ? $t(`member.${item.label}`) : item.value" :value="item.id" class="new-select-option" v-for="(item, index) in transactionDateList"></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item>
                        <el-date-picker
                          :disabled="!form.birthdayCheckbox.length"
                          v-if="show_birthday_date"
                          v-model="form.birthdayLte2"
                          type="daterange"
                          :range-separator="$t('member.fc_member_tag_date_custom_to_label')"
                          :start-placeholder="$t('member.fc_member_tag_date_custom_start_label')"
                          :end-placeholder="$t('member.fc_member_tag_date_custom_end_label')">
                        </el-date-picker>
                      </el-form-item>
                    </div>
                    <span class="tag-error" v-if="(form.birthdayCheckbox.length && show_birthday_date && !form.birthdayLte2) || (form.birthdayCheckbox.length && !show_birthday_date && !form.birthdayLte)">{{$t('member.fc_config_birthday_period_input_tips')}}</span>
                  </div>
                  <!-- birthday month -->
                  <div class="general-div">
                    <div class="general-div-month">
                      <el-form-item>
                        <el-checkbox class="" label="birthdayMonth" v-model="form.birthdayMonthCheckbox">{{$t('member.fc_member_tag_add_general_birthday_month_label')}}</el-checkbox>
                      </el-form-item>
                      <el-form-item>
                        <el-select multiple :disabled="!form.birthdayMonthCheckbox.length" v-model="form.birthday_month" clearable :placeholder="$t('member.fc_member_tag_add_general_birthday_month_input_label')" filterable style="width: 300px!important;">
                          <el-option class="new-select-option" v-for="(item, index) in birthday_month" :key="index" :label="item.name" :value="item.value"></el-option>
                        </el-select>
                      </el-form-item>
                    </div>
                    <span class="tag-error" v-if="form.birthdayMonthCheckbox.length && form.birthday_month.length === 0">{{$t('member.fc_config_birthday_month_input_tips')}}</span>
                  </div>
                  <!-- 国家start -->
                  <div class="general-div">
                    <div class="general-div-region">
                      <el-form-item>
                        <el-checkbox class="" label="country" v-model="form.countryCheckbox">{{$t('member.fc_member_tag_add_general_country_label	')}}</el-checkbox>
                      </el-form-item>
                      <el-form-item>
                        <el-select :remote="true" :remote-method="handleChangeCountry" multiple :disabled="!form.countryCheckbox.length" v-model="form.country" clearable filterable :placeholder="$t('member.fc_member_tag_add_general_country_input_label')" style="width: 300px!important;">
                          <el-option class="new-select-option" v-for="(item, index) in country_list" :key="index" :label="item.display_name" :value="item.id"></el-option>
                        </el-select>
                      </el-form-item>
                    </div>
                    <span class="tag-error" v-if="form.countryCheckbox.length && !form.country.length">{{$t('member.fc_config_country_input_tips')}}</span>
                  </div>
                  <div class="general-div">
                    <div class="general-div-region">
                      <el-form-item>
                        <el-checkbox class="" label="province" v-model="form.provinceCheckbox">{{$t('member.fc_member_tag_add_general_province_label')}}</el-checkbox>
                      </el-form-item>
                      <el-form-item>
                        <el-select :remote="true" :remote-method="handleChangeProvince" multiple :disabled="!form.provinceCheckbox.length" v-model="form.province" clearable filterable :placeholder="$t('member.fc_member_tag_add_general_province_input_label')" style="width: 300px!important;">
                          <el-option class="new-select-option" v-for="(item, index) in province_list" :key="index" :label="item.display_name" :value="item.id"></el-option>
                        </el-select>
                      </el-form-item>
                    </div>
                    <span class="tag-error" v-if="form.provinceCheckbox.length && !form.province.length">{{$t('member.fc_config_states_input_tips')}}</span>
                  </div>
                  <div class="general-div">
                    <div class="general-div-region">
                      <el-form-item>
                        <el-checkbox class="" label="city" v-model="form.cityCheckbox">{{$t('member.fc_member_tag_add_general_city_label')}}</el-checkbox>
                      </el-form-item>
                      <el-form-item>
                        <el-select :remote="true" :remote-method="handleChangeCity" multiple :disabled="!form.cityCheckbox.length" v-model="form.city" clearable filterable :placeholder="$t('member.fc_member_tag_add_general_city_input_label')" style="width: 300px!important;">
                          <el-option class="new-select-option" v-for="(item, index) in city_list" :key="index" :label="item.display_name" :value="item.id"></el-option>
                        </el-select>
                      </el-form-item>
                    </div>
                    <span class="tag-error" v-if="form.cityCheckbox.length && !form.city.length">{{$t('member.fc_config_city_input_tips')}}</span>
                  </div>
                  <!-- 国家end -->
                </el-form-item>
                <!-- Loyalty -->
                <el-form-item :label="$t('member.fc_member_tag_add_loyalty_label')">
                  <!-- tier -->
                  <div class="loyalty-div">
                    <div class="loyalty-div-tier">
                      <el-form-item>
                        <el-checkbox class="" label="tier" v-model="form.tierCheckbox">{{$t('member.fc_member_tag_add_loyalty_tier_label')}}</el-checkbox>
                      </el-form-item>
                      <el-form-item>
                        <el-select :disabled="!form.tierCheckbox.length" multiple :placeholder="$t('member.fc_member_tag_add_loyalty_tier_input_label')" v-model="form.tier" clearable style="width: 300px;">
                          <el-option class="new-select-option" v-for="(item, index) in tierList" :key="index" :label="item.member_tier_name" :value="item.id"></el-option>
                        </el-select>
                      </el-form-item>
                    </div>
                    <span class="tag-error" v-if="form.tierCheckbox.length && !form.tier.length">{{$t('member.fc_config_tier_input_tips')}}</span>
                  </div>
                  <!-- 改造开始-->
                  <!-- registration date -->
                  <div class="general-div">
                    <div class="general-div-birth">
                      <el-form-item>
                        <el-checkbox class="" label="registerDate" v-model="form.registrationDateCheckbox">{{$t('member.fc_member_tag_add_loyalty_registration_label')}}</el-checkbox>
                      </el-form-item>
                      <el-form-item>
                        <el-select :disabled="!form.registrationDateCheckbox.length" @change="selectFirstTransactionDate('registration_date')" :placeholder="$t('member.fc_member_tag_add_loyalty_registration_input_label')" v-model="form.registration_date" clearable style="width: 300px;">
                          <el-option :key="index" :label="item.label ? $t(`member.${item.label}`) : item.value" :value="item.id" class="new-select-option" v-for="(item, index) in transactionDateList"></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item>
                        <el-date-picker
                          :disabled="!form.registrationDateCheckbox.length"
                          v-if="show_registration_date"
                          v-model="form.registration_date2"
                          type="daterange"
                          :range-separator="$t('member.fc_member_tag_date_custom_to_label')"
                          :start-placeholder="$t('member.fc_member_tag_date_custom_start_label')"
                          :end-placeholder="$t('member.fc_member_tag_date_custom_end_label')">
                        </el-date-picker>
                      </el-form-item>
                    </div>
                    <span class="tag-error" v-if="(form.registrationDateCheckbox.length && show_registration_date && !form.registration_date2) || (form.registrationDateCheckbox.length && !show_registration_date && !form.registration_date)">{{$t('member.fc_config_registration_date_input_tips')}}</span>
                  </div>
                  <!-- 改造结束-->
                  <!-- avaliable points -->
                  <div class="loyalty-div">
                    <div class="loyalty-div-points">
                      <el-form-item prop="availablePointsCheckbox">
                        <el-checkbox class="" label="points" v-model="form.availablePointsCheckbox">{{$t('member.fc_member_tag_add_loyalty_points_label')}}</el-checkbox>
                      </el-form-item>
                      <el-form-item prop="gte_available_points">
                        <el-input-number :class="{'errors': judgeNumberInput1(form.availablePointsCheckbox, String(form.gte_available_points), String(form.lte_available_points))}" :disabled="!form.availablePointsCheckbox.length" @change="handleGtePoints" v-model="form.gte_available_points" @keyup.native="handleChangeValidateInputSmall($event, 'gte_available_points', 'lte_available_points')" :min="0" label="描述文字"></el-input-number>&nbsp;&nbsp;-&nbsp;&nbsp;
                      </el-form-item>
                      <el-form-item prop="lte_available_points">
                        <el-input-number :class="{'errors': judgeNumberInput1(form.availablePointsCheckbox, String(form.gte_available_points), String(form.lte_available_points))}" :disabled="!form.availablePointsCheckbox.length" v-model="form.lte_available_points" :min="0" label="描述文字"></el-input-number>
                      </el-form-item>
                    </div>
                    <span class="tag-error" v-if="judgeNumberInput2(form.availablePointsCheckbox, String(form.gte_available_points), String(form.lte_available_points))">{{$t('member.fc_field_input_empty_tips')}}</span>
                    <span class="tag-error" v-if="judgeNumberInput3(form.availablePointsCheckbox, String(form.gte_available_points), String(form.lte_available_points))">{{$t('member.fc_member_lifecycle_vaule_incorrect_tips')}}</span>
                  </div>
                  <!-- registration store -->
                  <div class="loyalty-div">
                    <div class="loyalty-div-store">
                      <el-form-item>
                        <el-checkbox class="" label="store" v-model="form.registrationStoreCheckbox">{{$t('member.fc_member_tag_add_loyalty_store_label')}}</el-checkbox>
                      </el-form-item>
                      <el-form-item>
                        <el-button :disabled="!form.registrationStoreCheckbox.length" :style="{'opacity': form.registrationStoreCheckbox.length ? 1 : 0.6}" class="deep-blue" type="primary" @click="handleClickRegistrationStore">{{$t('member.fc_member_tag_add_loyalty_store_btn_select_label')}}</el-button>
                      </el-form-item>
                    </div>
                    <span class="tag-error" v-if="form.registrationStoreCheckbox.length >=1  && registrationStoreTableData.length === 0">{{$t('member.fc_config_registration_store_input_tips')}}</span>
                    <div class="transaction-div">
                      <el-table
                        :data="registrationStoreTableData"
                        border
                        style="width: 80%">
                        <el-table-column
                          prop="store_code"
                          :label="$t('member.fc_member_tag_add_loyalty_store_table_code_label')"
                          width="180">
                          <template slot-scope="scope">
                            {{scope.row.store_code || table_placeholder}}
                          </template>
                        </el-table-column>
                        <el-table-column
                          prop="store_name"
                          :label="$t('member.fc_member_tag_add_loyalty_store_table_name_label')"
                          width="180">
                          <template slot-scope="scope">
                            {{scope.row.store_name || table_placeholder}}
                          </template>
                        </el-table-column>
                        <el-table-column
                          prop="telephone"
                          :label="$t('member.fc_member_tag_add_loyalty_store_table_telephone_label')">
                          <template slot-scope="scope">
                            {{scope.row.telephone || table_placeholder}}
                          </template>
                        </el-table-column>
                        <el-table-column
                          prop="state_name"
                          :label="$t('member.fc_member_tag_add_loyalty_store_table_state_label')">
                          <template slot-scope="scope">
                            {{scope.row.state_name || table_placeholder}}
                          </template>
                        </el-table-column>
                        <el-table-column
                          prop="city_name"
                          :label="$t('member.fc_member_tag_add_loyalty_store_table_city_label')">
                          <template slot-scope="scope">
                            {{scope.row.city_name || table_placeholder}}
                          </template>
                        </el-table-column>
                      </el-table>
                    </div>
                  </div>
                  <!-- registration channel -->
                  <div class="loyalty-div">
                    <div class="loyalty-div-channel" style="height: auto !important;">
                      <el-form-item>
                        <el-checkbox class="" label="channel" v-model="form.registrationChannelCheckbox">{{$t('member.fc_member_tag_add_loyalty_channel_label')}}</el-checkbox>
                      </el-form-item>
                      <el-form-item style="margin:0px !important;padding:0px !important;">
                        <el-checkbox-group :disabled="!form.registrationChannelCheckbox.length" v-model="form.registration_channel">
                          <el-checkbox :key="index" :label="item.channel_code" v-for="(item, index) in channelList">{{ item.resources_key ? $t(`reporting.${item.resources_key}`) : item.channel_name }}</el-checkbox>
                        </el-checkbox-group>
                      </el-form-item>
                    </div>
                    <span class="tag-error" v-if="form.registrationChannelCheckbox.length && form.registration_channel.length === 0">{{$t('member.fc_config_registration_channel_input_tips')}}</span>
                  </div>
                </el-form-item>
                <!-- Transaction -->
                <el-form-item :label="$t('member.fc_member_tag_add_transaction_label')" label-width="100px">
                  <!-- first transaction date -->
                  <div class="transaction-div">
                    <div class="transaction-div-first">
                      <el-form-item>
                        <el-checkbox class="" label="firstdate" v-model="form.firstTransactionDateCheck">{{$t('member.fc_member_tag_add_transaction_first_label')}}</el-checkbox>
                      </el-form-item>
                      <el-form-item class="transaction-item">
                        <el-select :disabled="!form.firstTransactionDateCheck.length" @change="selectFirstTransactionDate('first_transaction_date')" :placeholder="$t('member.fc_member_tag_add_transaction_first_input_label')" v-model="form.first_transaction_date" clearable style="width: 300px;">
                          <el-option :key="index" :label="item.label ? $t(`member.${item.label}`) : item.value" :value="item.id" class="new-select-option" v-for="(item, index) in first_last_transaction_list"></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item>
                        <el-date-picker
                          :disabled="!form.firstTransactionDateCheck.length"
                          v-if="show_first_transaction_date"
                          v-model="form.first_transaction_date2"
                          type="daterange"
                          :range-separator="$t('member.fc_member_tag_date_custom_to_label')"
                          :start-placeholder="$t('member.fc_member_tag_date_custom_start_label')"
                          :end-placeholder="$t('member.fc_member_tag_date_custom_end_label')">
                        </el-date-picker>
                      </el-form-item>
                    </div>
                    <span class="tag-error" v-if="(form.firstTransactionDateCheck.length && show_first_transaction_date && !form.first_transaction_date2) || (form.firstTransactionDateCheck.length && !show_first_transaction_date && !form.first_transaction_date)">{{$t('member.fc_config_first_transaction_input_tips')}}</span>
                  </div>
                  <!-- last transaction date -->
                  <div class="transaction-div">
                    <div class="transaction-div-last">
                      <el-form-item>
                        <el-checkbox class="" label="lastdate" v-model="form.lastTransactionDateCheck">{{$t('member.fc_member_tag_add_transaction_last_label')}}</el-checkbox>
                      </el-form-item>
                      <el-form-item class="transaction-item">
                        <el-select :disabled="!form.lastTransactionDateCheck.length" @change="selectFirstTransactionDate('last_transaction_date')" :placeholder="$t('member.fc_member_tag_add_transaction_last_input_label')" v-model="form.last_transaction_date" clearable style="width: 300px;">
                          <el-option :key="index" :label="item.label ? $t(`member.${item.label}`) : item.value" :value="item.id" class="new-select-option" v-for="(item, index) in first_last_transaction_list"></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item>
                        <el-date-picker
                          :disabled="!form.lastTransactionDateCheck.length"
                          v-if="show_last_transaction_date"
                          v-model="form.last_transaction_date2"
                          type="daterange"
                          :range-separator="$t('member.fc_member_tag_date_custom_to_label')"
                          :start-placeholder="$t('member.fc_member_tag_date_custom_start_label')"
                          :end-placeholder="$t('member.fc_member_tag_date_custom_end_label')">
                        </el-date-picker>
                      </el-form-item>
                    </div>
                    <span class="tag-error" v-if="(form.lastTransactionDateCheck.length && show_last_transaction_date && !form.last_transaction_date2) || (form.lastTransactionDateCheck.length && !show_last_transaction_date && !form.last_transaction_date)">{{$t('member.fc_config_last_transaction_input_tips')}}</span>
                  </div>
                  <!-- number of transaction -->
                  <div class="transaction-div">
                    <div class="transaction-div-number">
                      <el-form-item prop="numberOfTransactionCheck">
                        <el-checkbox class="" label="numbertransaction" v-model="form.numberOfTransactionCheck">{{$t('member.fc_member_tag_add_transaction_number_label')}}</el-checkbox>
                      </el-form-item>
                      <el-form-item prop="number" class="transaction-parent-item transaction-item">
                        <el-select :disabled="disableNumberAmountSelect" @change="selectFirstTransactionDate('number')" :placeholder="$t('member.fc_member_tag_add_transaction_number_input_label')" v-model="form.number" clearable style="width: 300px;">
                          <el-option class="new-select-option" v-for="(item, index) in transactionDateList" :key="index" :label="item.label ? $t(`member.${item.label}`) : item.value" :value="item.id"></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item class="transaction-custom-date" v-if="show_number_of_transaction_date">
                        <el-date-picker
                          :disabled="disableNumberCustomRange"
                          v-if="show_number_of_transaction_date"
                          v-model="form.number2"
                          type="daterange"
                          :range-separator="$t('member.fc_member_tag_date_custom_to_label')"
                          :start-placeholder="$t('member.fc_member_tag_date_custom_start_label')"
                          :end-placeholder="$t('member.fc_member_tag_date_custom_end_label')">
                        </el-date-picker>
                      </el-form-item>
                      <el-form-item prop="number_transactions_gte_times" class="transaction-inp1" style="margin-left: 0px;">
                        <el-input :class="{'errors': judgeNumberInput1(form.numberOfTransactionCheck, String(form.number_transactions_gte_times), String(form.number_transactions_lte_times))}" :disabled="disableNumberAmountInput" id="gte_times" oninput="value=value.replace(/[^\d.]/g,'')" class="transaction-input" v-model="form.number_transactions_gte_times"></el-input>
                        <!-- <label for="gte_times" class="label-46">Times</label> -  -->
                      </el-form-item>
                      <el-form-item prop="number_transactions_lte_times" class="transaction-inp2">
                        <!-- form.amountOfTransactionCheck.length >= 1 && form.amount_transactions_gte_usd !== '' && form.amount_transactions_lte_usd !== '' && (form.amount_transactions_lte_usd - 0 < form.amount_transactions_gte_usd - 0)} -->
                        <el-input :class="{'errors': judgeNumberInput1(form.numberOfTransactionCheck, String(form.number_transactions_gte_times), String(form.number_transactions_lte_times))}" :disabled="disableNumberAmountInput" oninput="value=value.replace(/[^\d.]/g,'')" v-model="form.number_transactions_lte_times" id="lte_times" class="transaction-input"></el-input>
                        <label for="lte_times">{{$t('member.fc_member_tag_add_transaction_number_times_label')}}</label>
                      </el-form-item>
                      <el-form-item prop="number_no_date_limitation" style="margin-left: 2px">
                        <el-checkbox :disabled="disableNumberNoDate" class="descLabelCheckbox" v-model="form.number_no_date_limitation">{{$t('member.fc_member_tag_add_transaction_number_unlimited_label')}}</el-checkbox>
                      </el-form-item>
                    </div>
                    <p class="tag-error" v-if="judgeNumberInput2(form.numberOfTransactionCheck, String(form.number_transactions_gte_times), String(form.number_transactions_lte_times))">{{$t('member.fc_field_input_empty_tips')}}</p>
                    <p class="tag-error" v-if="judgeNumberInput3(form.numberOfTransactionCheck, String(form.number_transactions_gte_times), String(form.number_transactions_lte_times))">{{$t('member.fc_member_lifecycle_vaule_incorrect_tips')}}</p>
                    <p class="tag-error" v-if="judgeNumberInput4(form.numberOfTransactionCheck, String(form.number), String(form.number2), form.number_no_date_limitation)">{{$t('configuration.fc_configuration_select_box_default_label')}}</p>
                  </div>
                  <div class="transaction-div">
                    <div class="transaction-div-amount">
                      <el-form-item prop="amountOfTransactionCheck">
                        <el-checkbox class="" label="amounttransaction" v-model="form.amountOfTransactionCheck">{{$t('member.fc_member_tag_add_transaction_amount_label')}}</el-checkbox>
                      </el-form-item>
                      <el-form-item prop="amount" class="transaction-parent-item transaction-item">
                        <el-select :disabled="disableNumberAmountSelect2" @change="selectFirstTransactionDate('amount')" :placeholder="$t('member.fc_member_tag_add_transaction_amount_input_label')" v-model="form.amount" clearable style="width: 300px;">
                          <el-option class="new-select-option" v-for="(item, index) in transactionDateList" :key="index" :label="item.label ? $t(`member.${item.label}`) : item.value" :value="item.id"></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item class="transaction-custom-date" v-if="show_amount_of_transaction_date">
                        <el-date-picker
                          :disabled="disableAmountCustomRange"
                          v-if="show_amount_of_transaction_date"
                          v-model="form.amount2"
                          type="daterange"
                          :range-separator="$t('member.fc_member_tag_date_custom_to_label')"
                          :start-placeholder="$t('member.fc_member_tag_date_custom_start_label')"
                          :end-placeholder="$t('member.fc_member_tag_date_custom_end_label')">
                        </el-date-picker>
                      </el-form-item>
                      <el-form-item prop="amount_transactions_gte_usd" class="transaction-inp1" style="margin-left: 0px;">
                        <el-input :class="{'errors': judgeNumberInput1(form.amountOfTransactionCheck, String(form.amount_transactions_gte_usd), String(form.amount_transactions_lte_usd))}" :disabled="disableNumberAmountInput2" class="transaction-input" oninput="value=value.replace(/[^\d.]/g,'')" v-model="form.amount_transactions_gte_usd" id="amount_gte_usd"></el-input>
                        <!-- <label for="amount_gte_usd" class="label-46">USD</label> -  -->
                      </el-form-item>
                      <el-form-item prop="amount_transactions_lte_usd" class="transaction-inp transaction-inp2">
                        <el-input :class="{'errors': judgeNumberInput1(form.amountOfTransactionCheck, String(form.amount_transactions_gte_usd), String(form.amount_transactions_lte_usd))}" :disabled="disableNumberAmountInput2" class="transaction-input" oninput="value=value.replace(/[^\d.]/g,'')" v-model="form.amount_transactions_lte_usd" id="amount_lte_usd"></el-input>
                        <label for="amount_lte_usd">{{this.globalData.value.currency_symbol}}</label>
                      </el-form-item>
                      <el-form-item prop="amount_no_date_limitation" class="transaction-inp" style="margin-left: 2px">
                        <el-checkbox :disabled="disableAmountNoDate" class="descLabelCheckbox" v-model="form.amount_no_date_limitation">{{$t('member.fc_member_tag_add_transaction_amount_unlimited_label')}}</el-checkbox>
                      </el-form-item>
                    </div>
                    <p class="tag-error" v-if="judgeNumberInput2(form.amountOfTransactionCheck, String(form.amount_transactions_gte_usd), String(form.amount_transactions_lte_usd))">{{$t('member.fc_field_input_empty_tips')}}</p>
                    <p class="tag-error" v-if="judgeNumberInput3(form.amountOfTransactionCheck, String(form.amount_transactions_gte_usd), String(form.amount_transactions_lte_usd))">{{$t('member.fc_member_lifecycle_vaule_incorrect_tips')}}</p>
                    <p class="tag-error" v-if="judgeNumberInput4(form.amountOfTransactionCheck, String(form.amount), String(form.amount2), form.amount_no_date_limitation)">{{$t('configuration.fc_configuration_select_box_default_label')}}</p>
                  </div>
                  <div class="transaction-div average-div">
                    <div class="transaction-div-average-value">
                      <el-form-item prop="averageBasketValueCheck">
                        <el-checkbox class="" label="basketvalue" v-model="form.averageBasketValueCheck">{{$t('member.fc_member_tag_add_transaction_ab_label')}}</el-checkbox>
                      </el-form-item>
                      <el-form-item prop="average_basket_value_gte_usd" class="transaction-item">
                        <el-input :class="{'errors': judgeNumberInput1(form.averageBasketValueCheck, String(form.average_basket_value_gte_usd), String(form.average_basket_value_lte_usd))}" :disabled="!form.averageBasketValueCheck.length" oninput="value=value.replace(/[^\d.]/g,'')" class="transaction-input" v-model="form.average_basket_value_gte_usd" id="average_basket_value_gte_usd"></el-input>
                        <label class="label-46" for="average_basket_value_gte_usd">{{this.globalData.value.currency_symbol}}</label> -
                      </el-form-item>
                      <el-form-item prop="average_basket_value_lte_usd">
                        <el-input :class="{'errors': judgeNumberInput1(form.averageBasketValueCheck, String(form.average_basket_value_gte_usd), String(form.average_basket_value_lte_usd))}" :disabled="!form.averageBasketValueCheck.length" oninput="value=value.replace(/[^\d.]/g,'')" v-model="form.average_basket_value_lte_usd" id="average_basket_value_lte_usd" class="transaction-input"></el-input>
                        <label for="average_basket_value_lte_usd">{{this.globalData.value.currency_symbol}}</label>
                      </el-form-item>
                    </div>
                    <span class="tag-error" v-if="judgeNumberInput2(form.averageBasketValueCheck, String(form.average_basket_value_gte_usd), String(form.average_basket_value_lte_usd))">{{$t('member.fc_field_input_empty_tips')}}</span>
                    <span class="tag-error" v-if="judgeNumberInput3(form.averageBasketValueCheck, String(form.average_basket_value_gte_usd), String(form.average_basket_value_lte_usd))">{{$t('member.fc_member_lifecycle_vaule_incorrect_tips')}}</span>
                  </div>
                  <div class="transaction-div average-div">
                    <div class="transaction-div-average-items">
                      <el-form-item prop="averageBasketItemsCheck">
                        <el-checkbox class="" label="basketitems" v-model="form.averageBasketItemsCheck">{{$t('member.fc_member_tag_add_transaction_ai_label')}}</el-checkbox>
                      </el-form-item>
                      <el-form-item prop="average_basket_items_gte_usd" class="transaction-item">
                        <el-input oninput="value=value.replace(/[^\d.]/g,'')" :class="{'errors': judgeNumberInput1(form.averageBasketItemsCheck, String(form.average_basket_items_gte_usd), String(form.average_basket_items_lte_usd))}" :disabled="!form.averageBasketItemsCheck.length" class="transaction-input" v-model="form.average_basket_items_gte_usd" id="average_basket_items_gte_usd"></el-input>
                        <label class="label-46" for="average_basket_items_gte_usd">{{$t('member.fc_member_tag_add_transaction_ai_pieces_label')}}</label> -
                      </el-form-item>
                      <el-form-item prop="average_basket_items_lte_usd">
                        <el-input oninput="value=value.replace(/[^\d.]/g,'')" :class="{'errors': judgeNumberInput1(form.averageBasketItemsCheck, String(form.average_basket_items_gte_usd), String(form.average_basket_items_lte_usd))}" :disabled="!form.averageBasketItemsCheck.length" v-model="form.average_basket_items_lte_usd" id="average_basket_items_lte_usd" class="transaction-input"></el-input>
                        <label for="average_basket_items_lte_usd">{{$t('member.fc_member_tag_add_transaction_ai_pieces_label')}}</label>
                      </el-form-item>
                    </div>
                    <span class="tag-error" v-if="judgeNumberInput2(form.averageBasketItemsCheck, String(form.average_basket_items_gte_usd), String(form.average_basket_items_lte_usd))">{{$t('member.fc_field_input_empty_tips')}}</span>
                    <span class="tag-error" v-if="judgeNumberInput3(form.averageBasketItemsCheck, String(form.average_basket_items_gte_usd), String(form.average_basket_items_lte_usd))">{{$t('member.fc_member_lifecycle_vaule_incorrect_tips')}}</span>
                  </div>
                  <!-- product brands -->
                  <div class="transaction-div">
                    <div class="transaction-div-brands">
                      <el-form-item>
                        <el-checkbox class="" label="brands" v-model="form.purchasedBrandsCheck">{{$t('member.fc_member_tag_add_transaction_brands_label')}}</el-checkbox>
                      </el-form-item>
                      <el-form-item class="transaction-item">
                        <el-button :disabled="!form.purchasedBrandsCheck.length" :style="{'opacity': form.purchasedBrandsCheck.length ? 1 : 0.6}" class="deep-blue" type="primary" @click="handleClickProductBrands">{{$t('member.fc_member_tag_add_transaction_brands_btn_select_label')}}</el-button>
                      </el-form-item>
                    </div>
                    <span class="tag-error" v-if="form.purchasedBrandsCheck.length >=1  && productBrandsTableData.length === 0">{{$t('member.fc_config_purchased_brands_input_tips')}}</span>
                    <div class="transaction-div">
                      <el-table
                        :data="productBrandsTableData"
                        border
                        style="width: 80%">
                        <el-table-column
                          prop="brand_code"
                          :label="$t('member.fc_member_tag_add_transaction_brands_table_code_label')"
                          width="180">
                          <template slot-scope="scope">
                            {{scope.row.brand_code || table_placeholder}}
                          </template>
                        </el-table-column>
                        <el-table-column
                          prop="brand_name"
                          :label="$t('member.fc_member_tag_add_transaction_brands_table_name_label')"
                          width="180">
                          <template slot-scope="scope">
                            {{scope.row.brand_name || table_placeholder}}
                          </template>
                        </el-table-column>
                        <el-table-column
                          prop="brand_desc"
                          :label="$t('member.fc_member_tag_add_transaction_brands_table_desc_label')">
                          <template slot-scope="scope">
                            {{scope.row.brand_desc || table_placeholder}}
                          </template>
                        </el-table-column>
                      </el-table>
                    </div>
                  </div>
                  <!-- purchased category -->
                  <div class="transaction-div">
                    <div class="transaction-div-category">
                      <el-form-item>
                        <el-checkbox class="" label="category" v-model="form.purchasedCategoryCheck">{{$t('member.fc_member_tag_add_transaction_categories_label')}}</el-checkbox>
                      </el-form-item>
                      <el-form-item class="transaction-item">
                        <el-button :style="{'opacity': form.purchasedCategoryCheck.length ? 1 : 0.6}" :disabled="!form.purchasedCategoryCheck.length" class="deep-blue" type="primary" @click="handleClickProductCategory">{{$t('member.fc_member_tag_add_transaction_categories_btn_select_label')}}</el-button>
                      </el-form-item>
                    </div>
                    <span class="tag-error" v-if="form.purchasedCategoryCheck.length >=1  && productCategoryTableData.length === 0">{{$t('member.fc_config_purchased_categories_input_tips')}}</span>
                    <div class="transaction-div">
                      <el-table
                        :data="productCategoryTableData"
                        border
                        style="width: 80%">
                        <el-table-column
                          prop="product_category_code"
                          :label="$t('member.fc_member_tag_add_transaction_categories_table_code_label')"
                          width="180">
                          <template slot-scope="scope">
                            {{scope.row.product_category_code || table_placeholder}}
                          </template>
                        </el-table-column>
                        <el-table-column
                          prop="product_category_name"
                          :label="$t('member.fc_member_tag_add_transaction_categories_table_name_label')"
                          width="180">
                          <template slot-scope="scope">
                            {{scope.row.product_category_name || table_placeholder}}
                          </template>
                        </el-table-column>
                        <el-table-column
                          prop="product_category_desc"
                          :label="$t('member.fc_member_tag_add_transaction_categories_table_desc_label')">
                          <template slot-scope="scope">
                            {{scope.row.product_category_desc || table_placeholder}}
                          </template>
                        </el-table-column>
                      </el-table>
                    </div>
                  </div>
                  <!-- purchased products -->
                  <div class="transaction-div">
                    <div class="transaction-div-products">
                      <el-form-item>
                        <el-checkbox class="" label="products" v-model="form.purchasedProductsCheck">{{$t('member.fc_member_tag_add_transaction_products_label')}}</el-checkbox>
                      </el-form-item>
                      <el-form-item class="transaction-item">
                        <el-button :style="{'opacity': form.purchasedProductsCheck.length ? 1 : 0.6}" :disabled="!form.purchasedProductsCheck.length" class="deep-blue" type="primary" @click="handleClickSelectProduct">{{$t('member.fc_member_tag_add_transaction_products_btn_select_label')}}</el-button>
                      </el-form-item>
                    </div>
                    <span class="tag-error" v-if="form.purchasedProductsCheck.length >=1  && productTableData.length === 0">{{$t('member.fc_config_purchased_products_input_tips')}}</span>
                    <div class="transaction-div">
                      <el-table
                        :data="productTableData"
                        border
                        style="width: 80%">
                        <el-table-column
                          prop="product_code"
                          :label="$t('member.fc_member_tag_add_transaction_products_table_code_label')"
                          width="180">
                          <template slot-scope="scope">
                            {{scope.row.product_code || table_placeholder}}
                          </template>
                        </el-table-column>
                        <el-table-column
                          prop="product_name"
                          :label="$t('member.fc_member_tag_add_transaction_products_table_name_label')"
                          width="180">
                          <template slot-scope="scope">
                            {{scope.row.product_name || table_placeholder}}
                          </template>
                        </el-table-column>
                        <el-table-column
                          prop="product_category_name"
                          :label="$t('member.fc_member_tag_add_transaction_products_table_category_label')">
                          <template slot-scope="scope">
                            {{scope.row.product_category_name || table_placeholder}}
                          </template>
                        </el-table-column>
                        <el-table-column prop="unit_price" min-width="90" align="center" :label="$t('member.fc_member_tag_add_transaction_products_table_unit_label')">
                          <template slot-scope="scope">
                            {{scope.row.unit_price || table_placeholder}}
                          </template>
                        </el-table-column>
                        <el-table-column prop="brand_name" min-width="90" align="center" :label="$t('member.fc_member_tag_add_transaction_products_table_brand_label')">
                          <template slot-scope="scope">
                            {{scope.row.brand_name || table_placeholder}}
                          </template>
                        </el-table-column>
                      </el-table>
                    </div>
                  </div>
                </el-form-item>
                <el-form-item :label="$t('member.fc_member_tag_add_campaign_label')">
                  <div class="campaign-div">
                    <!-- 第一个-->
                    <div class="campaign-div-email-open">
                      <el-checkbox label="emailopen" v-model="form.campaignEmailsOpenedCheck" class="">{{$t('member.fc_member_tag_add_campaign_least_label')}}</el-checkbox>
                      <el-form-item prop="campaign_emails_open_least">
                        <el-input-number :class="{'errors': judgeNumberInput1(form.campaignEmailsOpenedCheck, String(form.campaign_emails_open_least), String(form.campaign_emails_open_out))}" :disabled="!form.campaignEmailsOpenedCheck.length" @change="handleEmailsOpened" @keyup.native="handleChangeValidateInputSmall($event, 'campaign_emails_open_least', 'campaign_emails_open_out')" v-model="form.campaign_emails_open_least" :min="0" :max="1000" label="描述文字"></el-input-number>
                        &nbsp;{{$t('member.fc_member_tag_add_campaign_out_label')}}&nbsp;
                      </el-form-item>
                      <el-form-item prop="campaign_emails_open_out">
                        <el-input-number :class="{'errors': judgeNumberInput1(form.campaignEmailsOpenedCheck, String(form.campaign_emails_open_least), String(form.campaign_emails_open_out))}" :disabled="!form.campaignEmailsOpenedCheck.length" v-model="form.campaign_emails_open_out" :min="0" :max="1000" label="描述文字"></el-input-number>
                    {{$t('member.fc_member_tag_add_campaign_email_opened_label')}}
                      </el-form-item>
                    </div>
                    <span class="tag-error" v-if="judgeNumberInput2(form.campaignEmailsOpenedCheck, String(form.campaign_emails_open_least), String(form.campaign_emails_open_out))">{{$t('member.fc_field_input_empty_tips')}}</span>
                    <span class="tag-error" v-if="judgeNumberInput3(form.campaignEmailsOpenedCheck, String(form.campaign_emails_open_least), String(form.campaign_emails_open_out))">{{$t('member.fc_member_lifecycle_vaule_incorrect_tips')}}</span>
                  </div>
                  <!-- 第二个 -->
                  <div class="campaign-div">
                    <div class="campaign-div-email-not-open">
                      <el-checkbox label="emailnotopen" v-model="form.campaignEmailsNotOpenedCheck" class="">{{$t('member.fc_member_tag_add_campaign_least_label')}}</el-checkbox>
                      <el-form-item prop="campaign_emails_not_open_least">
                        <el-input-number :class="{'errors': judgeNumberInput1(form.campaignEmailsNotOpenedCheck, String(form.campaign_emails_not_open_least), String(form.campaign_emails_not_open_out))}" :disabled="!form.campaignEmailsNotOpenedCheck.length" @change="handleEmailNotOpen" @keyup.native="handleChangeValidateInputSmall($event, 'campaign_emails_not_open_least', 'campaign_emails_not_open_out')" v-model="form.campaign_emails_not_open_least" :min="0" :max="1000" label="描述文字"></el-input-number>
                    &nbsp;{{$t('member.fc_member_tag_add_campaign_out_label')}}&nbsp;
                      </el-form-item>
                      <el-form-item prop="campaign_emails_not_open_out">
                        <el-input-number :class="{'errors': judgeNumberInput1(form.campaignEmailsNotOpenedCheck, String(form.campaign_emails_not_open_least), String(form.campaign_emails_not_open_out))}" :disabled="!form.campaignEmailsNotOpenedCheck.length" v-model="form.campaign_emails_not_open_out" :min="0" :max="1000" label="描述文字"></el-input-number>
                    {{$t('member.fc_member_tag_add_campaign_email_not_opened_label')}}
                      </el-form-item>
                    </div>
                    <span class="tag-error" v-if="judgeNumberInput2(form.campaignEmailsNotOpenedCheck, String(form.campaign_emails_not_open_least), String(form.campaign_emails_not_open_out))">{{$t('member.fc_field_input_empty_tips')}}</span>
                    <span class="tag-error" v-if="judgeNumberInput3(form.campaignEmailsNotOpenedCheck, String(form.campaign_emails_not_open_least), String(form.campaign_emails_not_open_out))">{{$t('member.fc_member_lifecycle_vaule_incorrect_tips')}}</span>
                  </div>
                  <!-- 第三个-->
                  <div class="campaign-div">
                    <div class="campaign-div-noti-open">
                      <el-checkbox label="notiopen" v-model="form.campaignNotificationsOpenedCheck" class="">{{$t('member.fc_member_tag_add_campaign_least_label')}}</el-checkbox>
                      <el-form-item prop="campaign_notifications_open_least">
                        <el-input-number :class="{'errors': judgeNumberInput1(form.campaignNotificationsOpenedCheck, String(form.campaign_notifications_open_least), String(form.campaign_notifications_open_out))}" :disabled="!form.campaignNotificationsOpenedCheck.length" @change="handleNotiOpen" v-model="form.campaign_notifications_open_least" @keyup.native="handleChangeValidateInputSmall($event, 'campaign_notifications_open_least', 'campaign_notifications_open_out')" :min="0" :max="1000" label="描述文字"></el-input-number>
                    &nbsp;{{$t('member.fc_member_tag_add_campaign_out_label')}}&nbsp;
                      </el-form-item>
                      <el-form-item prop="campaign_notifications_open_out">
                        <el-input-number :class="{'errors': judgeNumberInput1(form.campaignNotificationsOpenedCheck, String(form.campaign_notifications_open_least), String(form.campaign_notifications_open_out))}" :disabled="!form.campaignNotificationsOpenedCheck.length" v-model="form.campaign_notifications_open_out" :min="0" :max="1000" label="描述文字"></el-input-number>
                    {{$t('member.fc_member_tag_add_campaign_fp_opened_label')}}
                      </el-form-item>
                    </div>
                    <span class="tag-error" v-if="judgeNumberInput2(form.campaignNotificationsOpenedCheck, String(form.campaign_notifications_open_least), String(form.campaign_notifications_open_out))">{{$t('member.fc_field_input_empty_tips')}}</span>
                    <span class="tag-error" v-if="judgeNumberInput3(form.campaignNotificationsOpenedCheck, String(form.campaign_notifications_open_least), String(form.campaign_notifications_open_out))">{{$t('member.fc_member_lifecycle_vaule_incorrect_tips')}}</span>
                  </div>
                  <!-- 第四个-->
                  <div class="campaign-div">
                    <div class="campaign-div-noti-not-open">
                      <el-checkbox label="notinotopen" v-model="form.campaignNotificationsNotOpenedCheck" class="">{{$t('member.fc_member_tag_add_campaign_least_label')}}</el-checkbox>
                      <el-form-item prop="campaign_notifications_not_open_least">
                        <el-input-number :class="{'errors': judgeNumberInput1(form.campaignNotificationsNotOpenedCheck, String(form.campaign_notifications_not_open_least), String(form.campaign_notifications_not_open_out))}" :disabled="!form.campaignNotificationsNotOpenedCheck.length" @change="handleNotiNotOpen" v-model="form.campaign_notifications_not_open_least" @keyup.native="handleChangeValidateInputSmall($event, 'campaign_notifications_not_open_least', 'campaign_notifications_not_open_out')" :min="0" :max="1000" label="描述文字"></el-input-number>
                    &nbsp;{{$t('member.fc_member_tag_add_campaign_out_label')}}&nbsp;
                      </el-form-item>
                      <el-form-item prop="campaign_notifications_not_open_out">
                        <el-input-number :class="{'errors': judgeNumberInput1(form.campaignNotificationsNotOpenedCheck, String(form.campaign_notifications_not_open_least), String(form.campaign_notifications_not_open_out))}" :disabled="!form.campaignNotificationsNotOpenedCheck.length" v-model="form.campaign_notifications_not_open_out" :min="0" :max="1000" label="描述文字"></el-input-number>
                    {{$t('member.fc_member_tag_add_campaign_fp_not_opened_label')}}
                      </el-form-item>
                    </div>
                    <span class="tag-error" v-if="judgeNumberInput2(form.campaignNotificationsNotOpenedCheck, String(form.campaign_notifications_not_open_least), String(form.campaign_notifications_not_open_out))">{{$t('member.fc_field_input_empty_tips')}}</span>
                    <span class="tag-error" v-if="judgeNumberInput3(form.campaignNotificationsNotOpenedCheck, String(form.campaign_notifications_not_open_least), String(form.campaign_notifications_not_open_out))">{{$t('member.fc_member_lifecycle_vaule_incorrect_tips')}}</span>
                  </div>
                </el-form-item>
                <el-form-item :label="$t('member.fc_member_tag_add_privacy_label')" class="privacy">
                  <!-- privacy -->
                  <div class="privacy-div">
                    <div class="privacy-div-opt">
                      <el-form-item prop="optInCheckbox">
                        <el-checkbox class="" label="privacy" v-model="form.optInCheckbox">{{$t('member.fc_member_tag_add_privacy_potion1_label')}}</el-checkbox>
                      </el-form-item>
                      <el-form-item>
                        <el-checkbox-group :disabled="!form.optInCheckbox.length" v-model="form.privacyCheckList">
                          <el-checkbox :key="index" :label="item.id" v-for="(item, index) in privacyList">{{ privacyOption(item.option_type_name) }}</el-checkbox>
                        </el-checkbox-group>
                      </el-form-item>
                    </div>
                    <span class="tag-error" v-if="form.optInCheckbox.length >= 1 && form.privacyCheckList.length === 0 ? true : false">{{$t('member.fc_config_privacy_opt_input_tips')}}</span>
                  </div>
                </el-form-item>
              </div>
          </div>
        </div>
      </el-form>
    </div>
    <add-tag :id="computedCategoryId" :content="sortGroupList" @closeTagGroupModel="closeTagGroupModel" :dialog_show="dialog_show" @handleDialogVisible="handleDialogVisible" />
    <select-stores :content="registrationStoreTableData" @handleSelectedRegisterStore="handleSelectedRegisterStore" @closeSelectRegisterStore="closeSelectRegisterStore" :dialog_show_store="dialog_show_registration_store" @handleRegisterStoreDialogVisible="handleRegisterStoreDialogVisible" />
    <select-product :content="productTableData" @handleSelectedProducts="handleSelectedProducts" @closeSelectProduct="closeSelectProduct" :dialog_show="dialog_show_product" @handleProductDialogVisible="handleProductDialogVisible" />
    <select-brands :content="productBrandsTableData" @handleSelectedBrands="handleSelectedBrands" @closeSelectBrands="closeSelectBrands" :dialog_show_brands="dialog_show_brands" @handleBrandsDialogVisible="handleBrandsDialogVisible" />
    <select-category :content="productCategoryTableData" @handleSelectedProductCategory="handleSelectedProductCategory" @closeSelectProductCategory="closeSelectProductCategory" :dialog_show_category="dialog_show_category" @handleCategoryDialogVisible="handleCategoryDialogVisible" />
  </div>
</template>

<script>
  import AddTag from './add-tag-group'
  import SelectProduct from './select-product'
  import SelectBrands from './select-brands'
  import SelectCategory from './select-product-categories'
  import SelectStores from './select-stores'
  // getChildDictionaryList
  import { queryBrandList, queryProductCategoryList } from '@/api/master'
  import { queryStoreList, getOptionType, queryCategory, addMemberTag, detailMemberTag, editMemberTag, batchQueryProductList, queryChannelList, listMemberTier } from '@/api/memberTag'
  import { formatTransactionDate } from './utils'
  import { getDictionaryListByType, getDictionaryById } from '@/api/memberTag'
  const moment = require('moment')
  export default {
    components: {
      AddTag,
      SelectProduct,
      SelectBrands,
      SelectCategory,
      SelectStores
    },
    computed: {
      renderTitle() {
        if (this.$route.params.id) {
          return this.$t('member.fc_member_tag_edit_title_label')
        } else {
          return this.$t('member.fc_member_tag_add_title_label')
        }
      },
      privacyOption() {
        return function(type) {
          const origin = type
          const ty = type && type.toLowerCase()
          if (ty === 'sms') {
            return this.$t('member.fc_member_tag_add_privacy_potion2_label')
          } else if (ty === 'email') {
            return this.$t('member.fc_member_tag_add_privacy_potion3_label')
          } else if (ty === 'mobile') {
            return this.$t('member.fc_member_tag_add_privacy_potion4_label')
          } else {
            return origin
          }
        }
      },
      categoryName() {
        return function(name) {
          console.log(2222, name)
          const origin = name
          name = name && name.toLowerCase()
          switch (name) {
            case 'campaign' || '活动':
              return this.$t('member.fc_member_tag_edit_category_4th_label')
            case 'lifecycle':
              return this.$t('member.fc_member_tag_edit_category_5th_label')
            case 'loyalty':
              return this.$t('member.fc_member_tag_edit_category_2nd_label')
            case 'privacy':
              return this.$t('member.fc_member_tag_edit_category_6th_label')
            case 'socio-demographic':
              return this.$t('member.fc_member_tag_edit_category_1st_label')
            case 'transaction':
              return this.$t('member.fc_member_tag_edit_category_3rd_label')
            default:
              return origin
          }
        }
      },
      disableNumberAmountSelect() {
        // !form.numberOfTransactionCheck.length || form.number_no_date_limitation || (form.number_transactions_gte_times !== '' && form.number_transactions_lte_times !== '' && form.number_transactions_gte_times - 0 >= form.number_transactions_lte_times - 0)
        if (this.form.numberOfTransactionCheck.length) {
          // 下拉框与No date互斥
          // 下拉框有两种情况
          if (this.form.number === '' && !this.form.number_no_date_limitation) {
            return false
          } else {
            if (this.form.number_no_date_limitation) {
              return true
            }
          }
        } else {
          return true
        }
      },
      disableNumberAmountSelect2() {
        if (this.form.amountOfTransactionCheck.length) {
          // 下拉框与No date互斥
          // 下拉框有两种情况
          if (this.form.amount === '' && !this.form.amount_no_date_limitation) {
            return false
          } else {
            if (this.form.amount_no_date_limitation) {
              return true
            }
          }
        } else {
          return true
        }
      },
      disableNumberCustomRange() {
        // !form.numberOfTransactionCheck.length || form.number_no_date_limitation || (form.number_transactions_gte_times !== '' && form.number_transactions_lte_times !== '' && form.number_transactions_gte_times - 0 >= form.number_transactions_lte_times - 0)
        if (this.form.number === 'Custom range') {
          if (!this.form.number_no_date_limitation) {
            return false
          } else {
            return true
          }
        }
      },
      disableAmountCustomRange() {
        // !form.amountOfTransactionCheck.length || (form.amount_transactions_gte_usd !== '' && form.amount_transactions_lte_usd !== '' && form.amount_transactions_gte_usd - 0 >= form.amount_transactions_lte_usd - 0)
        if (this.form.amount === 'Custom range') {
          if (!this.form.amount_no_date_limitation) {
            return false
          } else {
            return true
          }
        }
      },
      disableNumberAmountInput() {
        if (this.form.numberOfTransactionCheck.length) {
          return false
        } else {
          return true
        }
        // form.numberOfTransactionCheck.length === 0 || (form.number === '' && form.number_no_date_limitation === false)
        // if (this.form.numberOfTransactionCheck.length) {
        //   if (this.form.number === '' && !this.form.number_no_date_limitation) {
        //     return true
        //   } else if (this.form.number === 'Custom range' && this.form.number2 === '' && !this.form.number_no_date_limitation) {
        //     return true
        //   } else {
        //     return false
        //   }
        // } else {
        //   return true
        // }
      },
      disableNumberAmountInput2() {
        if (this.form.amountOfTransactionCheck.length) {
          return false
        } else {
          return true
        }
        // if (this.form.amountOfTransactionCheck.length) {
        //   if (this.form.amount === '' && !this.form.amount_no_date_limitation) {
        //     return true
        //   } else if (this.form.amount === 'Custom range' && this.form.amount2 === '' && !this.form.amount_no_date_limitation) {
        //     return true
        //   } else {
        //     return false
        //   }
        // } else {
        //   return true
        // }
      },
      enterNumberAmountCorrectValue() {
        // (form.numberOfTransactionCheck.length >= 1 && form.number_no_date_limitation === true && form.number_transactions_lte_times !== '' && form.number_transactions_gte_times - 0 > form.number_transactions_lte_times - 0) || (form.numberOfTransactionCheck.length >= 1 && form.number !== '' && form.number_transactions_lte_times !== '' && form.number_transactions_gte_times - 0 >= form.number_transactions_lte_times - 0)
        if (this.form.numberOfTransactionCheck.length) {
          if (this.form.number_transactions_gte_times !== '' && this.form.number_transactions_lte_times !== '') {
            if (this.form.number !== '' && this.form.number !== 'Custom range' && !this.form.number_no_date_limitation) {
              if (this.form.number_transactions_gte_times - 0 >= this.form.number_transactions_lte_times - 0) {
                return true
              } else {
                return false
              }
            }
            if (this.form.number !== 'Custom range' && this.form.number_no_date_limitation) {
              if (this.form.number_transactions_gte_times - 0 >= this.form.number_transactions_lte_times - 0) {
                return true
              } else {
                return false
              }
            }
            if (this.form.number === 'Custom range' && this.form.number2 !== '' && !this.form.number_no_date_limitation) {
              if (this.form.number_transactions_gte_times - 0 >= this.form.number_transactions_lte_times - 0) {
                return true
              } else {
                return false
              }
            }
            if (this.form.number === 'Custom range' && (this.form.number2 === '' || this.form.number2.length === 0) && this.form.number_no_date_limitation) {
              if (this.form.number_transactions_gte_times - 0 >= this.form.number_transactions_lte_times - 0) {
                return true
              } else {
                return false
              }
            }
          } else {
            return false
          }
        } else {
          return false
        }
      },
      enterNumberAmountCorrectValue2() {
        if (this.form.amountOfTransactionCheck.length) {
          if (this.form.amount_transactions_gte_usd !== '' && this.form.amount_transactions_lte_usd !== '') {
            if (this.form.amount !== '' && this.form.amount !== 'Custom range' && !this.form.amount_no_date_limitation) {
              if (this.form.amount_transactions_gte_usd - 0 >= this.form.amount_transactions_lte_usd - 0) {
                return true
              } else {
                return false
              }
            }
            if (this.form.amount !== 'Custom range' && this.form.amount_no_date_limitation) {
              if (this.form.amount_transactions_gte_usd - 0 >= this.form.amount_transactions_lte_usd - 0) {
                return true
              } else {
                return false
              }
            }
            if (this.form.amount === 'Custom range' && this.form.amount2 !== '' && !this.form.amount_no_date_limitation) {
              if (this.form.amount_transactions_gte_usd - 0 >= this.form.amount_transactions_lte_usd - 0) {
                return true
              } else {
                return false
              }
            }
            if (this.form.amount === 'Custom range' && (this.form.amount2 === '' || this.form.amount2.length === 0) && this.form.amount_no_date_limitation) {
              if (this.form.amount_transactions_gte_usd - 0 >= this.form.amount_transactions_lte_usd - 0) {
                return true
              } else {
                return false
              }
            }
          } else {
            return false
          }
        } else {
          return false
        }
      },
      sortGroupList() {
        const tmp = JSON.parse(JSON.stringify(this.tag_group_list))
        return tmp.sort((a, b) => a.group_name.localeCompare(b.group_name, 'zh-CN'))
      },
      disableNumberNoDate() {
        return this.validateNumberAmountNoDateCheckbox(this.form.numberOfTransactionCheck, this.form.number_transactions_gte_times, this.form.number_transactions_lte_times, this.form.number, this.form.number2)
      },
      disableAmountNoDate() {
        return this.validateNumberAmountNoDateCheckbox(this.form.amountOfTransactionCheck, this.form.amount_transactions_gte_usd, this.form.amount_transactions_lte_usd, this.form.amount, this.form.amount2)
      },
      computedCategoryId() {
        let id = null
        if (typeof this.form.tag_category === 'number') {
          id = this.form.tag_category
        }
        if (!this.category_list.length) {
          return
        }
        for (let i = 0; i < this.category_list.length; i++) {
          if (this.category_list[i]) {
            if (this.category_list[i].category_name === this.form.tag_category || this.category_list[i].category_id === this.form.tag_category) {
              id = this.category_list[i].category_id
              break
            }
          }
        }
        return id
      },
      computedAmountTransaction() {
        if (this.form.amountOfTransactionCheck.length >= 1) {
          if (this.form.amount) {
            if (this.form.amount === 'Custom range') {
              if (this.form.amount2.length >= 1) {
                if (this.form.amount_transactions_gte_usd !== '' && this.form.amount_transactions_lte_usd !== '') {
                  if (this.form.amount_transactions_gte_usd - 0 >= this.form.amount_transactions_lte_usd - 0) {
                    return true
                  }
                }
              }
            } else {
              if (this.form.amount_transactions_gte_usd !== '' && this.form.amount_transactions_lte_usd !== '') {
                if (this.form.amount_transactions_gte_usd - 0 >= this.form.amount_transactions_lte_usd - 0) {
                  return true
                }
              }
            }
          }
        }
      }
    },
    data() {
      return {
        pickOptionBirthdayGte: {
          disabledDate: time => {
            if (this.form.birthdayLte) {
              return time > new Date(this.form.birthdayLte)
            }
          }
        },
        pickOptionBirthdayLte: {
          disabledDate: time => {
            if (this.form.birthday) {
              return time < new Date(this.form.birthday)
            }
          }
        },
        pickOptionRegisDateGte: {
          disabledDate: time => {
            if (this.form.registration_dateLte) {
              return time > new Date(this.form.registration_dateLte)
            }
          }
        },
        pickOptionRegisDateLte: {
          disabledDate: time => {
            if (this.form.registration_date) {
              return time < new Date(this.form.registration_date)
            }
          }
        },
        // 校验disabled start
        // 校验disabled end
        show_first_transaction_date: false,
        show_last_transaction_date: false,
        show_number_of_transaction_date: false,
        show_amount_of_transaction_date: false,
        show_birthday_date: false,
        show_registration_date: false,
        isShowCountry: false,
        isShowProvince: false,
        isShowCity: false,
        // brand start
        brandList: [],
        // brand end
        minValue: 1,
        country_list: [],
        province_list: [],
        city_list: [],
        store_list: [],
        transactionDateList: [
          {
            id: '1D',
            label: 'fc_member_tag_date_select_1st_label',
            value: this.$t('member.fc_member_tag_date_select_1st_label')
          },
          {
            id: '7D',
            label: 'fc_member_tag_date_select_2nd_label',
            value: this.$t('member.fc_member_tag_date_select_2nd_label')
          },
          {
            id: '30D',
            label: 'fc_member_tag_date_select_3rd_label',
            value: this.$t('member.fc_member_tag_date_select_3rd_label')
          },
          {
            id: '90D',
            label: 'fc_member_tag_date_select_4th_label',
            value: this.$t('member.fc_member_tag_date_select_4th_label')
          },
          {
            id: '180D',
            label: 'fc_member_tag_date_select_5th_label',
            value: this.$t('member.fc_member_tag_date_select_5th_label')
          },
          {
            id: '12M',
            label: 'fc_member_tag_date_select_6th_label',
            value: this.$t('member.fc_member_tag_date_select_6th_label')
          },
          {
            id: '18M',
            label: 'fc_member_tag_date_select_7th_label',
            value: this.$t('member.fc_member_tag_date_select_7th_label')
          },
          {
            id: '24M',
            label: 'fc_member_tag_date_select_8th_label',
            value: this.$t('member.fc_member_tag_date_select_8th_label')
          },
          {
            id: 'Custom range',
            label: 'fc_member_tag_date_select_9th_label',
            value: this.$t('member.fc_member_tag_date_select_9th_label')
          }
        ],
        first_last_transaction_list: [
          {
            id: '1D',
            label: 'fc_member_tag_date_before_1st_label',
            value: this.$t('member.fc_member_tag_date_before_1st_label')
          },
          {
            id: '7D',
            label: 'fc_member_tag_date_before_2nd_label',
            value: this.$t('member.fc_member_tag_date_before_2nd_label')
          },
          {
            id: '30D',
            label: 'fc_member_tag_date_before_3rd_label',
            value: this.$t('member.fc_member_tag_date_before_3rd_label')
          },
          {
            id: '90D',
            label: 'fc_member_tag_date_before_4th_label',
            value: this.$t('member.fc_member_tag_date_before_4th_label')
          },
          {
            id: '180D',
            label: 'fc_member_tag_date_before_5th_label',
            value: this.$t('member.fc_member_tag_date_before_5th_label')
          },
          {
            id: '12M',
            label: 'fc_member_tag_date_before_6th_label',
            value: this.$t('member.fc_member_tag_date_before_6th_label')
          },
          {
            id: '18M',
            label: 'fc_member_tag_date_before_7th_label',
            value: this.$t('member.fc_member_tag_date_before_7th_label')
          },
          {
            id: '24M',
            label: 'fc_member_tag_date_before_8th_label',
            value: this.$t('member.fc_member_tag_date_before_8th_label')
          },
          {
            id: 'Custom range',
            label: 'fc_member_tag_date_before_9th_label',
            value: this.$t('member.fc_member_tag_date_before_9th_label')
          }
        ],
        title: '',
        placeholder: '',
        productBrandsTableData: [],
        productCategoryTableData: [],
        productTableData: [],
        registrationStoreTableData: [],
        detail_loading: false,
        save_loading: false,
        loading: true,
        dialog_show: false,
        dialog_show_product: false,
        // brand
        dialog_show_brands: false,
        // category
        dialog_show_category: false,
        dialog_show_registration_store: false,
        rules: {
          tag_name: [{ required: true, message: this.$t('member.fc_field_input_empty_tips'), trigger: ['blur', 'change'] }],
          tag_category: [{ required: true, message: this.$t('member.fc_config_category_input_tips'), trigger: ['blur', 'change'] }],
          tag_group: [{ required: true, message: this.$t('member.fc_config_group_input_tips'), trigger: ['blur', 'change'] }],
          type: [{ required: true, message: 'please select type', trigger: ['blur', 'change'] }]
        },
        form: {
          birthdayErrors: false,
          UnConditionalTagHidden: false,
          pickOptionBirthdayGte: '',
          pickOptionBirthdayLte: '',
          // number of transactions
          disableNumberOfTransactionsSelect: true,
          disabledGteTimes: true,
          disabledLteTimes: true,
          disabledNumberNoDate: true,
          numberOfTransactionsErrors: false,
          numberOfTransactionsErrors2: false,
          numberOfTransactionsErrors3: false,
          // amount of transactions
          disableAmountOfTransactionsSelect: true,
          disabledGteUsd: true,
          disabledLteUsd: true,
          amountOfTransactionsErrors: false,
          amountOfTransactionsErrors2: false,
          amountOfTransactionsErrors3: false,
          // average bastket value
          averageValueGteUsd: true,
          averageValueLteUsd: true,
          averageBasketValueErrors: false,
          averageBasketValueErrors2: false,
          // average basket items
          averageItemsGteUsd: true,
          averageItemsLteUsd: true,
          averageBasketItemsErrors: false,
          averageBasketItemsErrors2: false,
          availablePointsError: false,
          disabledAmountNoDate: true,
          genderCheckbox: [],
          birthdayCheckbox: [],
          age: [],
          birthdayMonthCheckbox: [],
          countryCheckbox: [],
          provinceCheckbox: [],
          cityCheckbox: [],
          tierCheckbox: [],
          registrationDateCheckbox: [],
          availablePointsCheckbox: [],
          registrationStoreCheckbox: [],
          registrationChannelCheckbox: [],
          firstTransactionDateCheck: [],
          lastTransactionDateCheck: [],
          numberOfTransactionCheck: [],
          amountOfTransactionCheck: [],
          averageBasketValueCheck: [],
          averageBasketItemsCheck: [],
          purchasedBrandsCheck: [],
          purchasedCategoryCheck: [],
          purchasedProductsCheck: [],
          campaignEmailsOpenedCheck: [],
          campaignEmailsNotOpenedCheck: [],
          campaignNotificationsOpenedCheck: [],
          campaignNotificationsNotOpenedCheck: [],
          gte_age: '',
          gte_age_old: '',
          lte_age: '',
          lte_age_old: '',
          tag_name: '',
          tag_category: '',
          tag_group: '',
          registration_date: '',
          registration_date2: '',
          registration_dateLte: '',
          birthday: '',
          birthdayLte: '',
          birthdayLte2: '',
          birthday_month: [],
          country: [],
          countryEdit: [],
          city: [],
          cityEdit: [],
          province: [],
          provinceEdit: [],
          tier: [],
          registration_channel: [],
          gender: [],
          type: 'ConditionalTag',
          gte_available_points: '',
          gte_available_points_old: '',
          lte_available_points: '',
          first_transaction_date: '',
          first_transaction_date2: '',
          last_transaction_date2: '',
          last_transaction_date: '',
          number: '',
          number2: '',
          amount: '',
          amount2: '',
          number_no_date_limitation: false,
          amount_no_date_limitation: false,
          amount_transactions_gte_usd: '0.00',
          amount_transactions_lte_usd: '0.00',
          number_transactions_gte_times: 0,
          number_transactions_lte_times: 0,
          average_basket_value_gte_usd: '0.00',
          average_basket_value_lte_usd: '0.00',
          average_basket_items_gte_usd: 0,
          average_basket_items_lte_usd: 0,
          campaign_emails_open_least: '',
          campaign_emails_open_least_old: '',
          campaign_emails_open_out: '',
          campaign_emails_not_open_least: '',
          campaign_emails_not_open_least_old: '',
          campaign_emails_not_open_out: '',
          campaign_notifications_open_least: '',
          campaign_notifications_open_least_old: '',
          campaign_notifications_open_out: '',
          campaign_notifications_not_open_least: '',
          campaign_notifications_not_open_least_old: '',
          campaign_notifications_not_open_out: '',
          privacyCheckList: [],
          optInCheckbox: []
        },
        category_list: [],
        tag_group_list: [],
        tag_category_group_list: [],
        birthday_month: [
          {
            code: 1,
            value: 1
          },
          {
            code: 2,
            value: 2
          },
          {
            code: 3,
            value: 3
          },
          {
            code: 4,
            value: 4
          },
          {
            code: 5,
            value: 5
          },
          {
            code: 6,
            value: 6
          },
          {
            code: 7,
            value: 7
          },
          {
            code: 8,
            value: 8
          },
          {
            code: 9,
            value: 9
          },
          {
            code: 10,
            value: 10
          },
          {
            code: 11,
            value: 11
          },
          {
            code: 12,
            value: 12
          }
        ],
        channelList: [],
        privacyList: [],
        tierList: [],
        storeObj: {
          storesAll: [],
          storesCode: [],
          storeSelectedCode: [],
          total: ''
        },
        brandObj: {
          brandsAll: [],
          brandsCode: [],
          brandSelectedCode: [],
          total: ''
        },
        categoryObj: {
          categoryAll: [],
          categorySelectedCode: []
        },
        productObj: {
          productAll: [],
          productSelectedCode: []
        }
      }
    },
    created() {
      this.init()
    },
    methods: {
      async init() {
        // 获取所有的category
        await this.getCategory()
        // 获取国家
        // await this.getDictionaryLists()
        // await this.getDictionaryList(0)
        // 获取省份
        // await this.getDictionaryList(1)
        // 获取城市
        // await this.getDictionaryList(2)
        // 获取Tier列表
        await this.getTierList()
        // 获取所有的channel list
        await this.getChannelList()
        // 获取所有的privacy
        await this.getOptionTypeList()
        // 调用获取detail接口
        if (this.$route.params.hasOwnProperty('id')) { // edit
          await this.getTagDetail(this.$route.params.id)
          // 获取门店列表
          if (this.storeObj.storeSelectedCode.length >= 1) {
            await this.getRegisterStore()
          }
          // 获取所有的brand
          if (this.brandObj.brandSelectedCode.length >= 1) {
            await this.getBrandsAll()
          }
          if (this.categoryObj.categorySelectedCode.length >= 1) {
            // 获取所有的category
            await this.getCategoryAll()
          }
          if (this.productObj.productSelectedCode.length >= 1) {
            // 获取所有的products
            await this.getProductsAll()
          }
        } else { // add
          // 获取所有的brand
          // await this.getBrandsAll()
          this.form.UnConditionalTagHidden = true
        }
        this.loading = false
      },
      handleChangeCountry(val) {
        if (val === '') {
          this.country_list = []
          this.countryEdit = []
          return
        }
        this.getDictionaryList(val, 'COUNTRY')
      },
      handleChangeProvince(val) {
        if (val === '') {
          this.province_list = []
          this.provinceEdit = []
          return
        }
        this.getDictionaryList(val, 'PROVINCE')
      },
      handleChangeCity(val) {
        if (val === '') {
          this.city_list = []
          this.cityEdit = []
          return
        }
        this.getDictionaryList(val, 'CITY')
      },
      validateNumberAmountNoDateCheckbox(check, gte, lte, select, select2) {
        if (check.length > 0) {
          if (gte - 0 > lte - 0) {
            if (select !== 'Custom range' && select === '') {
              return false
            } else if (select === 'Custom range' && select2 === '') {
              return false
            } else {
              return true
            }
          } else if (select !== 'Custom range' && !select) {
            return false
          } else if (select !== 'Custom range' && select) {
            return true
          } else if (select === 'Custom range' && !select2) {
            return false
          } else if (select === 'Custom range' && select2) {
            return true
          } else {
            return false
          }
        } else {
          return true // 禁用
        }
      },
      async getDictionaryByIds(ids, code) {
        const arr = []
        const arr2 = []
        const arr3 = []
        for (let i = 0; i < ids.length; i++) {
          await new Promise((resolve, reject) => {
            return getDictionaryById(ids[i], this.$store.getters.language).then(res => {
              if (res.return_result) {
                arr.push(res.return_result.display_name)
                arr2.push(res.return_result.id)
                arr3.push({ id: res.return_result.id, display_name: res.return_result.display_name })
                resolve(arr)
              } else {
                this.$message.error(res.msg)
              }
            }).catch(err => {
              this.$message.error(err)
            })
          })
        }
        if (code === 'COUNTRY') {
          this.country_list = arr3
          this.countryEdit = JSON.parse(JSON.stringify(arr3))
          this.form.country = arr2
        }
        if (code === 'PROVINCE') {
          this.province_list = arr3
          this.form.province = arr2
          this.provinceEdit = JSON.parse(JSON.stringify(arr3))
        }
        if (code === 'CITY') {
          this.city_list = arr3
          this.form.city = arr2
          this.cityEdit = JSON.parse(JSON.stringify(arr3))
        }
      },
      getDictionaryList(val, code) {
        getDictionaryListByType({
          dictionary_type_code: code,
          display_name: val && val.trim() || '',
          lang_type_code: this.$store.getters.language,
          page_no: 1,
          page_size: 100
        }).then(res => {
          if (res.return_result) {
            if (code === 'COUNTRY') { // country
              this.country_list = []
              // this.countryEdit = []
              if (this.$route.params.id) {
                if (this.countryEdit) {
                  const origin = JSON.parse(JSON.stringify(this.countryEdit))
                  this.country_list = origin.concat(res.return_result.results)
                } else {
                  this.country_list = res.return_result.results
                }
              } else {
                this.country_list = res.return_result.results
              }
            }
            if (code === 'PROVINCE') { // province
              this.province_list = []
              if (this.$route.params.id) {
                if (this.provinceEdit) {
                  const origin = JSON.parse(JSON.stringify(this.provinceEdit))
                  this.province_list = origin.concat(res.return_result.results)
                } else {
                  this.province_list = res.return_result.results
                }
              } else {
                this.province_list = res.return_result.results
              }
            }
            if (code === 'CITY') { // city
              this.city_list = []
              if (this.$route.params.id) {
                if (this.cityEdit) {
                  const origin = JSON.parse(JSON.stringify(this.cityEdit))
                  this.city_list = origin.concat(res.return_result.results)
                } else {
                  this.city_list = res.return_result.results
                }
              } else {
                this.city_list = res.return_result.results
              }
            }
          } else {
            this.$message.error(res.msg)
          }
        }).catch(err => {
          this.$message.error(err)
          this.detail_loading = false
        })
      },
      getChannelList() {
        return queryChannelList({
          page_no: 1,
          page_size: 1000
        }).then(res => {
          this.detail_loading = false
          if (res.return_result) {
            this.channelList = res.return_result.channels || []
          } else {
            this.$message.error(res.msg)
          }
        }).catch(err => {
          this.$message.error(err)
          this.detail_loading = false
        })
      },
      getOptionTypeList() {
        return getOptionType({ asc: true, page_size: 1000, page_no: 1 }).then(res => {
          this.detail_loading = false
          if (res.return_result) {
            this.privacyList = res.return_result.results
          } else {
            this.$message.error(res.msg)
          }
        }).catch(err => {
          this.detail_loading = false
          this.$message.error(err)
        })
      },
      getBrandsAll() {
        return queryBrandList({
          id_list: this.brandObj.brandSelectedCode,
          page_no: 1,
          page_size: 100,
          asc: true,
          condition: ''
        }).then(res => {
          this.detail_loading = false
          if (res.return_result) {
            this.$set(this.brandObj, 'brandsAll', res.return_result.brands || [])
            this.productBrandsTableData = res.return_result.brands || []
            this.$set(this.brandObj, 'total', res.return_result.total_count)
          } else {
            this.$message.error(res.msg)
          }
        }).catch(err => {
          this.$message.error(err)
          this.detail_loading = false
        })
      },
      getCategoryAll() {
        return queryProductCategoryList({
          id_list: this.categoryObj.categorySelectedCode,
          page_no: 1,
          page_size: 100,
          asc: true,
          condition: ''
        }).then(res => {
          this.detail_loading = false
          if (res.return_result) {
            this.$set(this.categoryObj, 'categoryAll', res.return_result.product_categories || [])
            this.productCategoryTableData = res.return_result.product_categories || []
          } else {
            this.$message.error(res.msg)
          }
        }).catch(err => {
          this.$message.error(err)
          this.detail_loading = false
        })
      },
      getProductsAll() {
        return batchQueryProductList({
          id_list: this.productObj.productSelectedCode,
          page_no: 1,
          page_size: 100,
          asc: true,
          condition: ''
        }).then(res => {
          this.detail_loading = false
          if (res.return_result) {
            this.$set(this.productObj, 'productAll', res.return_result.products || [])
            this.productTableData = res.return_result.products || []
          } else {
            this.$message.error(res.msg)
          }
        }).catch(err => {
          this.$message.error(err)
          this.detail_loading = false
        })
      },
      // change type，如果选择的是Unconditional tag则隐藏下面的
      handleChangeType(val) {
        this.form.UnConditionalTagHidden = val !== 'UnconditionalTag'
      },
      // 获取tier list
      getTierList() {
        return listMemberTier({
          page_no: 1,
          page_size: 1000
        }).then(res => {
          this.detail_loading = false
          if (res.return_result) {
            this.tierList = res.return_result
          } else {
            this.$message.error(res.msg)
          }
        }).catch(err => {
          this.$message.error(err)
          this.detail_loading = false
        })
      },
      // 调用获取detail接口
      getTagDetail(id) {
        return detailMemberTag(id).then(res => {
          this.detail_loading = false
          if (res.return_result) {
            this.renderTag(res.return_result)
          } else {
            this.$message.error(res.msg)
          }
        }).catch(err => {
          this.loading = false
          this.$message.error(err)
          this.detail_loading = false
        })
      },
      async renderTag(detail) {
        this.form.tag_name = detail.tag_name
        this.form.type = detail.conditional ? 'ConditionalTag' : 'UnconditionalTag'
        this.form.UnConditionalTagHidden = detail.conditional
        const list = detail.tag_config_list
        this.rendercategoryAndTagGroup(detail.category_id, detail.tag_group_id)
        // this.renderGender()
        for (let i = 0; i < list.length; i++) {
          const tmp = list[i].config_value.split(',')
          // if (list[i].type_id === 13) {
          //   tmp = list[i].config_value.split('-')
          // }
          switch (list[i].type_id) {
            case 1: // gender
              this.form.genderCheckbox = ['Gender']
              this.form.gender = tmp
              break
            case 4: // age
              this.form.gte_age = tmp[0]
              this.form.lte_age = tmp[1]
              this.form.age = ['Age']
              break
            case 7: // Birthday
              this.form.birthdayCheckbox = ['birthday']
              if (tmp[0].length > 12) { // custom range
                this.show_birthday_date = true
                this.form.birthdayLte = 'Custom range'
                this.form.birthdayLte2 = [tmp[0].split('-')[0], tmp[0].split('-')[1]]
              } else {
                this.form.birthdayLte = tmp[0]
                this.show_birthday_date = false
              }
              break
            case 8: // birthday month
              this.form.birthdayMonthCheckbox = ['birthdayMonth']
              this.form.birthday_month = tmp
              break
            case 9: // country
              this.form.countryCheckbox = ['country']
              await this.getDictionaryByIds(tmp.map(item => +item), 'COUNTRY')
              // this.form.country = tmp.map(item => +item)
              break
            case 10: // province
              // this.form.province = tmp.map(item => +item)
              this.form.provinceCheckbox = ['province']
              await this.getDictionaryByIds(tmp.map(item => +item), 'PROVINCE')
              break
            case 11: // city
              // this.form.city = tmp.map(item => +item)
              this.form.cityCheckbox = ['city']
              await this.getDictionaryByIds(tmp.map(item => +item), 'CITY')
              break
            case 12: // tier
              this.form.tier = tmp.map(item => +item)
              this.form.tierCheckbox = ['tier']
              break
            case 13: // registration date
              this.form.registrationDateCheckbox = ['registerDate']
              if (tmp[0].length > 12) { // custom range
                this.show_registration_date = true
                this.form.registration_date = 'Custom range'
                this.form.registration_date2 = [tmp[0].split('-')[0], tmp[0].split('-')[1]]
              } else {
                this.form.registration_date = tmp[0]
                this.show_registration_date = false
              }
              break
            case 16: // available points
              this.form.gte_available_points = tmp[0]
              this.form.lte_available_points = tmp[1]
              this.form.availablePointsCheckbox = ['points']
              break
            case 19: // registration store
              this.storeObj.storeSelectedCode = tmp
              this.form.registrationStoreCheckbox = ['store']
              break
            case 20: // registration channel
              this.form.registrationChannelCheckbox = ['channel']
              this.form.registration_channel = tmp
              break
            case 24: // first transaction date
              this.form.firstTransactionDateCheck = ['firstdate']
              if (tmp[0].length > 12) { // custom range
                this.show_first_transaction_date = true
                this.form.first_transaction_date = 'Custom range'
                this.form.first_transaction_date2 = [tmp[0].split('-')[0], tmp[0].split('-')[1]]
              } else {
                this.form.first_transaction_date = tmp[0]
                this.show_first_transaction_date = false
              }
              break
            case 25: // last transaction date
              this.form.lastTransactionDateCheck = ['lastdate']
              if (tmp[0].length > 12) {
                this.show_last_transaction_date = true
                this.form.last_transaction_date = 'Custom range'
                this.form.last_transaction_date2 = [tmp[0].split('-')[0], tmp[0].split('-')[1]]
              } else {
                this.form.last_transaction_date = tmp[0]
                this.show_last_transaction_date = false
              }
              break
            case 26: // number of transaction
              this.form.numberOfTransactionCheck = ['numbertransaction']
              if (tmp[0] === -1 + '') {
                this.form.number_transactions_gte_times = ''
              } else {
                this.form.number_transactions_gte_times = tmp[0]
              }
              if (tmp[1] === 10000000000 + '') {
                this.form.number_transactions_lte_times = ''
              } else {
                this.form.number_transactions_lte_times = tmp[1]
              }
              if (!tmp[2]) { // 此时勾选了no date
                this.form.number_no_date_limitation = true
              } else {
                this.form.number_no_date_limitation = false
              }
              if (tmp[2] && tmp[2].length > 15) { // custom range
                this.form.number = 'Custom range'
                this.form.number2 = tmp[2].split('-')
                this.show_number_of_transaction_date = true
              } else {
                this.form.number = tmp[2]
                this.form.number2 = ''
                this.show_number_of_transaction_date = false
              }
              break
            case 29: // amount of transaction
              this.form.amountOfTransactionCheck = ['amounttransaction']
              if (tmp[0] === -1 + '') {
                this.form.amount_transactions_gte_usd = ''
              } else {
                this.form.amount_transactions_gte_usd = tmp[0]
              }
              if (tmp[1] === 10000000000 + '') {
                this.form.amount_transactions_lte_usd = ''
              } else {
                this.form.amount_transactions_lte_usd = tmp[1]
              }
              if (!tmp[2]) { // 此时勾选了no date
                this.form.amount_no_date_limitation = true
              } else {
                this.form.amount_no_date_limitation = false
              }
              if (tmp[2] && tmp[2].length > 15) { // custom range
                this.form.amount = 'Custom range'
                this.form.amount2 = tmp[2].split('-')
                this.show_amount_of_transaction_date = true
              } else {
                this.form.amount = tmp[2]
                this.form.amount2 = ''
                this.show_amount_of_transaction_date = false
              }
              break
            case 32: // average basket value
              this.form.averageBasketValueCheck = ['basketvalue']
              if (tmp[0] === -1 + '') {
                this.form.average_basket_value_gte_usd = ''
              } else {
                this.form.average_basket_value_gte_usd = tmp[0]
              }
              if (tmp[1] === 10000000000 + '') {
                this.form.average_basket_value_lte_usd = ''
              } else {
                this.form.average_basket_value_lte_usd = tmp[1]
              }
              break
            case 34: // average basket items
              this.form.averageBasketItemsCheck = ['basketitems']
              if (tmp[0] === -1 + '') {
                this.form.average_basket_items_gte_usd = ''
              } else {
                this.form.average_basket_items_gte_usd = tmp[0]
              }
              if (tmp[1] === 10000000000 + '') {
                this.form.average_basket_items_lte_usd = ''
              } else {
                this.form.average_basket_items_lte_usd = tmp[1]
              }
              break
            case 37: // select product brands
              this.form.purchasedBrandsCheck = ['brands']
              this.brandObj.brandSelectedCode = tmp
              break
            case 38: // select product categories
              this.categoryObj.categorySelectedCode = tmp
              this.form.purchasedCategoryCheck = ['category']
              break
            case 39: // select products
              this.productObj.productSelectedCode = tmp
              this.form.purchasedProductsCheck = ['products']
              break
            case 40: // campaign email opened
              this.form.campaignEmailsOpenedCheck = ['emailopen']
              this.form.campaign_emails_open_least = tmp[0]
              this.form.campaign_emails_open_out = tmp[1]
              break
            case 43: // campaign email not open
              this.form.campaignEmailsNotOpenedCheck = ['emailnotopen']
              this.form.campaign_emails_not_open_least = tmp[0]
              this.form.campaign_emails_not_open_out = tmp[1]
              break
            case 46: // campaign noti open
              this.form.campaignNotificationsOpenedCheck = ['notiopen']
              this.form.campaign_notifications_open_least = tmp[0]
              this.form.campaign_notifications_open_out = tmp[1]
              break
            case 49:
              this.form.campaignNotificationsNotOpenedCheck = ['notinotopen']
              this.form.campaign_notifications_not_open_least = tmp[0]
              this.form.campaign_notifications_not_open_out = tmp[1]
              break
            case 50:
              console.log(tmp)
              this.form.optInCheckbox = ['privacy']
              this.form.privacyCheckList = tmp.map(item => +item)
              break
            default:
              break
          }
        }
      },
      // 判断input框显示红色边框
      judgeNumberInput1(check, left, right) {
        if (!check || (check && !check.length)) return false
        let tempL = true
        let tempR = true
        if (left === 'undefined') {
          tempL = false
        }
        if (left === '') {
          tempL = false
        }
        if (right === 'undefined') {
          tempR = false
        }
        if (right === '') {
          tempR = false
        }
        if (tempL && tempR && +left > +right) return true
        if (!tempL && !tempR) return true
        if (!tempL || !tempR) return false
        return false
      },
      // 判断为空错误消息展示
      judgeNumberInput2(check, left, right) {
        if (!check || (check && !check.length)) return false
        let tempL = true
        let tempR = true
        if (left === 'undefined') {
          tempL = false
        }
        if (left === '') {
          tempL = false
        }
        if (right === 'undefined') {
          tempR = false
        }
        if (right === '') {
          tempR = false
        }
        if (!tempL && !tempR) return true
        return false
      },
      // 判断大小错误消息展示
      judgeNumberInput3(check, left, right) {
        if (!check || (check && !check.length)) return false
        let tempL = true
        let tempR = true
        if (left === 'undefined') {
          tempL = false
        }
        if (left === '') {
          tempL = false
        }
        if (right === 'undefined') {
          tempR = false
        }
        if (right === '') {
          tempR = false
        }
        if (tempR && tempL && +left > +right) return true
        return false
      },
      judgeNumberInput4(check, time1, time2, bool) {
        if (!check || (check && !check.length)) return false
        if (time1 === '' && time2 === '' && bool === false) return true
        if (time1 === 'Custom range' && time2 === '' && bool === false) return true
        if (time1 === '' && time2 !== '' && bool === false) return true
      },
      // 根据detail渲染Tag category和Tag group
      rendercategoryAndTagGroup(cateId, groupId) {
        const category = this.category_list
        const list = this.tag_category_group_list
        let newArr = []
        for (let i = 0; i < category.length; i++) {
          if (category[i].category_id === cateId) {
            this.form.tag_category = category[i].category_name
            break
          }
        }
        // 找到当前category id下面的groups
        for (let i = 0; i < list.length; i++) {
          if (list[i].category_id === cateId) {
            newArr = list[i].groups
            this.tag_group_list = newArr
            break
          }
        }
        for (let k = 0; k < newArr.length; k++) {
          if (newArr[k].group_id === groupId) {
            this.form.tag_group = newArr[k].group_name
            break
          }
        }
      },
      // 校验开�
      handleChangeValidateInputSmall(e, lte, gte) {
        if (+e.target.value >= this.form[gte]) {
          e.target.value = this.form[lte]
        }
      },
      handleGteAge(currentValue, oldValue) {
        this.form.gte_age_old = oldValue
      },
      handleGtePoints(currentValue, oldValue) {
        this.form.gte_available_points_old = oldValue
      },
      handleEmailsOpened(currentValue, oldValue) {
        this.form.campaign_emails_open_least_old = oldValue
      },
      handleEmailNotOpen(currentValue, oldValue) {
        this.form.campaign_emails_not_open_least_old = oldValue
      },
      handleNotiOpen(currentValue, oldValue) {
        this.form.campaign_notifications_open_least_old = oldValue
      },
      handleNotiNotOpen(currentValue, oldValue) {
        this.form.campaign_notifications_not_open_least_old = oldValue
      },
      // 校验结束
      // 选择first transaction date
      selectFirstTransactionDate(type) {
        const tmp = this.form[type]
        if (type === 'first_transaction_date') {
          if (tmp === 'Custom range') {
            this.show_first_transaction_date = true
          } else {
            this.show_first_transaction_date = false
            this.form.first_transaction_date2 = ''
          }
        } else if (type === 'last_transaction_date') {
          if (tmp === 'Custom range') {
            this.show_last_transaction_date = true
          } else {
            this.show_last_transaction_date = false
            this.form.last_transaction_date2 = ''
          }
        } else if (type === 'birthdayLte') {
          if (tmp === 'Custom range') {
            this.show_birthday_date = true
          } else {
            this.show_birthday_date = false
            this.form.birthdayLte2 = ''
          }
        } else if (type === 'registration_date') {
          if (tmp === 'Custom range') {
            this.show_registration_date = true
          } else {
            this.show_registration_date = false
            this.form.registration_date2 = ''
          }
        } else if (type === 'number') {
          if (tmp === 'Custom range') {
            this.show_number_of_transaction_date = true
          } else {
            this.show_number_of_transaction_date = false
          }
          this.form.number_no_date_limitation = false
        } else {
          if (tmp === 'Custom range') {
            this.show_amount_of_transaction_date = true
          } else {
            this.show_amount_of_transaction_date = false
          }
          this.form.amount_no_date_limitation = false
        }
      },
      changeTransaction(type) {
        const tmp = this.form[type]
        if (tmp === 'Today') {
          this.$set(this.form, type, formatTransactionDate(0))
          return
        } else if (tmp === 'Recent 7 days') {
          this.$set(this.form, type, formatTransactionDate(7).fullDate)
          return
        } else if (tmp === 'Recent 30 days') {
          this.$set(this.form, type, formatTransactionDate(30).fullDate)
          return
        } else if (tmp === 'Recent 90 days') {
          this.$set(this.form, type, formatTransactionDate(90).fullDate)
          return
        } else if (tmp === 'Recent 180 days') {
          this.$set(this.form, type, formatTransactionDate(180).fullDate)
          return
        } else if (tmp === 'Recent 1 year') {
          this.$set(this.form, type, formatTransactionDate(360).fullDate)
          return
        } else {
          this.$set(this.form, type, tmp)
        }
      },
      // 点击add tag group按钮
      handleClickTagGroup() {
        this.dialog_show = true
      },
      // 选择category时候，对应展示tag group
      changeTagCategory() {
        this.tag_group_list = []
        const id = this.form.tag_category
        const list = this.tag_category_group_list
        let newArr = []
        for (let i = 0; i < list.length; i++) {
          if (list[i].category_id === id || list[i].category_name === id) {
            newArr = list[i].groups
          }
        }
        this.form.tag_group = ''
        this.tag_group_list = newArr
      },
      getCategory() {
        return queryCategory().then(res => {
          this.detail_loading = false
          if (res.return_result) {
            const results = res.return_result.ref
            this.tag_category_group_list = results
            const newArr = []
            for (let i = 0; i < results.length; i++) {
              const tmp = {}
              tmp['category_id'] = results[i].category_id
              tmp['category_name'] = results[i].category_name
              newArr.push(tmp)
            }
            this.tag_group_list = results[0].groups
            this.category_list = newArr.sort((a, b) => {
              return a.category_name.localeCompare(b.category_name, 'zh-CN')
            })
          } else {
            this.$message.error(res.msg)
          }
        }).catch(err => {
          this.$message.error(err)
          this.detail_loading = false
        })
      },
      // 获取注册门店
      getRegisterStore() {
        return queryStoreList({
          id_list: this.storeObj.storeSelectedCode,
          page_no: this.page,
          page_size: 10,
          lang_type_code: this.$store.getters.language
        }).then(res => {
          this.detail_loading = false
          if (res.return_result) {
            this.$set(this.storeObj, 'storesAll', res.return_result.stores || [])
            this.registrationStoreTableData = res.return_result.stores || []
            this.$set(this.storeObj, 'total', res.return_result.total_count)
          } else {
            this.$message.error(res.msg)
          }
        }).catch(err => {
          this.$message.error(err)
          this.detail_loading = false
        })
      },
      handleClickSelectProduct() {
        this.dialog_show_product = true
        this.title = 'Select products'
        this.placeholder = 'Please enter product code or product name'
      },
      handleChange() {
      },
      closeTagGroupModel(val) {
        this.dialog_show = false
      },
      closeSelectProduct() {},
      // brands start
      closeSelectBrands() {},
      closeSelectRegisterStore() {},
      handleBrandsDialogVisible(val) {
        this.dialog_show_brands = val
      },
      handleClickProductBrands() {
        this.dialog_show_brands = true
      },
      handleClickRegistrationStore() {
        this.dialog_show_registration_store = true
      },
      handleSelectedBrands(list) {
        const obj = {}
        this.dialog_show_brands = false
        this.productBrandsTableData = list.reduce(function(item, next) {
          obj[next.brand_code] ? '' : obj[next.brand_code] = true && item.push(next)
          return item
        }, [])
      },
      // brands end

      // select products start
      handleSelectedProducts(list) {
        const obj = {}
        this.dialog_show_product = false
        this.productTableData = list.reduce(function(item, next) {
          obj[next.product_code] ? '' : obj[next.product_code] = true && item.push(next)
          return item
        }, [])
      },
      handleSelectedRegisterStore(list) {
        const obj = {}
        this.dialog_show_registration_store = false
        this.registrationStoreTableData = list.reduce(function(item, next) {
          obj[next.store_code] ? '' : obj[next.store_code] = true && item.push(next)
          return item
        }, [])
      },
      // select products end
      // category start
      closeSelectProductCategory() {},
      handleCategoryDialogVisible(val) {
        this.dialog_show_category = val
      },
      handleClickProductCategory() {
        this.dialog_show_category = true
      },
      handleSelectedProductCategory(list) {
        const obj = {}
        this.dialog_show_category = false
        this.productCategoryTableData = list.reduce(function(item, next) {
          obj[next.product_category_code] ? '' : obj[next.product_category_code] = true && item.push(next)
          return item
        }, [])
      },
      // category end
      // 根据标签名称获取id
      getTagGroupIdByTagName(name) {
        if (typeof name === 'number') {
          return name
        }
        const list = this.tag_group_list
        let id = null
        for (let i = 0; i < list.length; i++) {
          if (list[i].group_name === name) {
            id = list[i].group_id
          }
        }
        return id
      },
      // 校验number of transactions 的times
      validateNumberTimes(tmpArr, gte, lte, front, back, id) {
        if (gte === '' && (lte + '')) {
          tmpArr.push({
            config_value: [-1, lte, moment(front).format('YYYY/MM/DD') + '-' + moment(back).format('YYYY/MM/DD')].join(),
            type_id: id
          })
        } else if ((gte + '') && lte === '') {
          tmpArr.push({
            config_value: [gte, 10000000000, moment(front).format('YYYY/MM/DD') + '-' + moment(back).format('YYYY/MM/DD')].join(),
            type_id: id
          })
        } else {
          tmpArr.push({
            config_value: [gte, lte, moment(front).format('YYYY/MM/DD') + '-' + moment(back).format('YYYY/MM/DD')].join(),
            type_id: id
          })
        }
      },
      validateNumberTimes2(tmpArr, gte, lte, id, flag = null) {
        if (gte === '' && (lte + '')) {
          tmpArr.push({
            config_value: [-1, lte, flag].join(),
            type_id: id
          })
        } else if ((gte + '') && lte === '') {
          tmpArr.push({
            config_value: [gte, 10000000000, flag].join(),
            type_id: id
          })
        } else {
          tmpArr.push({
            config_value: [gte, lte, flag].join(),
            type_id: id
          })
        }
      },
      validateAverageBasket(tmpArr, check, gte, lte, id) {
        if (check.length && gte !== '' && lte !== '') {
          if (gte - 0 <= lte - 0) {
            tmpArr.push({
              config_value: [gte, lte].join(),
              type_id: id
            })
          }
        }
        if (check.length && gte === '' && lte !== '') {
          tmpArr.push({
            config_value: [-1, lte].join(),
            type_id: id
          })
        }
        if (check.length && gte !== '' && lte === '') {
          tmpArr.push({
            config_value: [gte, 10000000000].join(),
            type_id: id
          })
        }
      },
      // add member tag start
      submitForm() {
        this.$refs['form'].validate((valid) => {
          const copyObj = JSON.parse(JSON.stringify(this.form))
          const tmpObj = {}
          const tmpArr = []
          tmpObj.conditional = copyObj.type === 'ConditionalTag'
          tmpObj.tag_group_id = this.getTagGroupIdByTagName(copyObj.tag_group)
          if (this.form.UnConditionalTagHidden) { // 选择的是Conditional tag
            // 判断性别
            if (copyObj.genderCheckbox.length && copyObj.gender.length) {
              tmpArr.push({
                config_value: copyObj.gender.join(),
                type_id: 1
              })
            }
            if (copyObj.genderCheckbox.length && !copyObj.gender.length) {
              return
            }
            // 年龄
            if (copyObj.age.length && (copyObj.gte_age !== '' || copyObj.lte_age !== '') && copyObj.gte_age - 0 <= copyObj.lte_age - 0) {
              tmpArr.push({
                config_value: [copyObj.gte_age, copyObj.lte_age].join(),
                type_id: 4
              })
            }
            if (copyObj.age.length && copyObj.gte_age === '' && copyObj.lte_age === '') {
              return
            }
            if (copyObj.age.length && copyObj.gte_age - 0 > copyObj.lte_age - 0) {
              return
            }
            // 生日
            if (copyObj.birthdayCheckbox.length && (copyObj.birthdayLte || copyObj.birthdayLte2)) {
              if (copyObj.birthdayLte === 'Custom range') {
                if (copyObj.birthdayLte2) {
                  tmpArr.push({
                    config_value: [moment(copyObj.birthdayLte2[0]).format('YYYY/MM/DD') + '-' + moment(copyObj.birthdayLte2[1]).format('YYYY/MM/DD')].join(),
                    type_id: 7
                  })
                }
              } else {
                tmpArr.push({
                  config_value: [copyObj.birthdayLte].join(),
                  type_id: 7
                })
              }
            }
            if (copyObj.birthdayCheckbox.length && copyObj.birthdayLte !== 'Custom range' && !copyObj.birthdayLte) {
              return
            }
            if (copyObj.birthdayCheckbox.length && copyObj.birthdayLte === 'Custom range' && !copyObj.birthdayLte2) {
              return
            }
            // 生日月份
            if (copyObj.birthdayMonthCheckbox.length && copyObj.birthday_month.length) {
              tmpArr.push({
                config_value: copyObj.birthday_month.join(),
                type_id: 8
              })
            }
            if (copyObj.birthdayMonthCheckbox.length && !copyObj.birthday_month.length) {
              return
            }
            // 国家
            if (copyObj.countryCheckbox.length && copyObj.country.length) {
              tmpArr.push({
                config_value: copyObj.country.join(),
                type_id: 9
              })
            }
            if (copyObj.countryCheckbox.length && !copyObj.country.length) {
              return
            }
            // 省份
            if (copyObj.provinceCheckbox.length && copyObj.province.length) {
              tmpArr.push({
                config_value: copyObj.province.join(),
                type_id: 10
              })
            }
            if (copyObj.provinceCheckbox.length && !copyObj.province.length) {
              return
            }
            // 城市
            if (copyObj.cityCheckbox.length && copyObj.city.length) {
              tmpArr.push({
                config_value: copyObj.city.join(),
                type_id: 11
              })
            }
            if (copyObj.cityCheckbox.length && !copyObj.city.length) {
              return
            }
            // tier
            if (copyObj.tierCheckbox.length && copyObj.tier.length) {
              tmpArr.push({
                config_value: copyObj.tier.join(),
                type_id: 12
              })
            }
            if (copyObj.tierCheckbox.length && !copyObj.tier.length) {
              return
            }
            // 注册日期registration date
            if (copyObj.registrationDateCheckbox.length && (copyObj.registration_date || copyObj.registration_date2)) {
              if (copyObj.registration_date === 'Custom range') {
                if (copyObj.registration_date2) {
                  tmpArr.push({
                    config_value: [moment(copyObj.registration_date2[0]).format('YYYY/MM/DD') + '-' + moment(copyObj.registration_date2[1]).format('YYYY/MM/DD')].join(),
                    type_id: 13
                  })
                }
              } else {
                tmpArr.push({
                  config_value: [copyObj.registration_date].join(),
                  type_id: 13
                })
              }
            }
            if (copyObj.registrationDateCheckbox.length && copyObj.registration_date !== 'Custom range' && !copyObj.registration_date) {
              return
            }
            if (copyObj.registrationDateCheckbox.length && copyObj.registration_date === 'Custom range' && !copyObj.registration_date2) {
              return
            }
            // 可用积分 available points
            if (copyObj.availablePointsCheckbox.length && (copyObj.gte_available_points !== '' || copyObj.lte_available_points !== '' || copyObj.gte_available_points !== undefined || copyObj.lte_available_points !== undefined)) {
              if (copyObj.gte_available_points - 0 <= copyObj.lte_available_points - 0) {
                tmpArr.push({
                  config_value: [copyObj.gte_available_points, copyObj.lte_available_points].join(),
                  type_id: 16
                })
              }
            }
            if (copyObj.availablePointsCheckbox.length && (copyObj.gte_available_points === '' && copyObj.lte_available_points === '')) {
              return
            }
            if (copyObj.availablePointsCheckbox.length && (copyObj.gte_available_points === undefined && copyObj.lte_available_points === undefined)) {
              return
            }
            if (copyObj.availablePointsCheckbox.length && (copyObj.gte_available_points - 0 > copyObj.lte_available_points - 0)) {
              return
            }
            // registration store
            const storeCodeArr = []
            for (let i = 0; i < this.registrationStoreTableData.length; i++) {
              storeCodeArr.push(this.registrationStoreTableData[i].id)
            }
            if (copyObj.registrationStoreCheckbox.length && this.registrationStoreTableData.length) {
              tmpArr.push({
                config_value: storeCodeArr.join(),
                type_id: 19
              })
            }
            if (copyObj.registrationStoreCheckbox.length && !this.registrationStoreTableData.length) {
              return
            }
            // 注册渠道 registration channel
            if (copyObj.registrationChannelCheckbox.length && copyObj.registration_channel.length) {
              tmpArr.push({
                config_value: copyObj.registration_channel.join(),
                type_id: 20
              })
            }
            if (copyObj.registrationChannelCheckbox.length && !copyObj.registration_channel.length) {
              return
            }
            // 第一次交易日期first transaction date
            if (copyObj.firstTransactionDateCheck.length && (copyObj.first_transaction_date || copyObj.first_transaction_date2)) {
              if (copyObj.first_transaction_date === 'Custom range') {
                if (copyObj.first_transaction_date2) {
                  tmpArr.push({
                    config_value: [moment(copyObj.first_transaction_date2[0]).format('YYYY/MM/DD') + '-' + moment(copyObj.first_transaction_date2[1]).format('YYYY/MM/DD')].join(),
                    type_id: 24
                  })
                }
              } else {
                tmpArr.push({
                  config_value: [copyObj.first_transaction_date].join(),
                  type_id: 24
                })
              }
            }
            if (copyObj.firstTransactionDateCheck.length && copyObj.first_transaction_date !== 'Custom range' && !copyObj.first_transaction_date) {
              return
            }
            if (copyObj.firstTransactionDateCheck.length && copyObj.first_transaction_date === 'Custom range' && !copyObj.first_transaction_date2) {
              return
            }
            // 最近一次交易日期last transaction date
            if (copyObj.lastTransactionDateCheck.length && (copyObj.last_transaction_date || copyObj.last_transaction_date2)) {
              if (copyObj.last_transaction_date === 'Custom range') {
                if (copyObj.last_transaction_date2) {
                  tmpArr.push({
                    config_value: [moment(copyObj.last_transaction_date2[0]).format('YYYY/MM/DD') + '-' + moment(copyObj.last_transaction_date2[1]).format('YYYY/MM/DD')].join(),
                    type_id: 25
                  })
                }
              } else {
                tmpArr.push({
                  config_value: [copyObj.last_transaction_date].join(),
                  type_id: 25
                })
              }
            }
            if (copyObj.lastTransactionDateCheck.length && copyObj.last_transaction_date !== 'Custom range' && (!copyObj.last_transaction_date)) {
              return
            }
            if (copyObj.lastTransactionDateCheck.length && copyObj.last_transaction_date === 'Custom range' && !copyObj.last_transaction_date2) {
              return
            }
            // number of transaction
            // ---
            if (copyObj.numberOfTransactionCheck.length && (copyObj.number || copyObj.number2 || copyObj.number_no_date_limitation)) {
              if (copyObj.number_transactions_gte_times === '' && copyObj.number_transactions_lte_times === '') {
                console.log()
              } else {
                if (copyObj.number === 'Custom range') {
                  if (copyObj.number2 !== '' && copyObj.number_no_date_limitation === false) {
                    if (copyObj.number_no_date_limitation === false) {
                      this.validateNumberTimes(tmpArr, copyObj.number_transactions_gte_times, copyObj.number_transactions_lte_times, copyObj.number2[0], copyObj.number2[1], 26)
                    } else { // no date
                      this.validateNumberTimes2(tmpArr, copyObj.number_transactions_gte_times, copyObj.number_transactions_lte_times, 26)
                    }
                  }
                  if (copyObj.number_no_date_limitation) {
                    this.validateNumberTimes2(tmpArr, copyObj.number_transactions_gte_times, copyObj.number_transactions_lte_times, 26)
                  }
                } else {
                  if (copyObj.number_no_date_limitation === false) {
                    this.validateNumberTimes2(tmpArr, copyObj.number_transactions_gte_times, copyObj.number_transactions_lte_times, 26, copyObj.number)
                  } else {
                    this.validateNumberTimes2(tmpArr, copyObj.number_transactions_gte_times, copyObj.number_transactions_lte_times, 26)
                  }
                }
              }
            }
            if (copyObj.numberOfTransactionCheck.length && copyObj.number === 'Custom range' && !copyObj.number2 && !copyObj.number_no_date_limitation) {
              return
            }
            if (copyObj.numberOfTransactionCheck.length && copyObj.number !== 'Custom range' && !copyObj.number && !copyObj.number_no_date_limitation) {
              return
            }
            if (copyObj.numberOfTransactionCheck.length && copyObj.number_transactions_gte_times === '' && copyObj.number_transactions_lte_times === '') {
              return
            }
            if (copyObj.numberOfTransactionCheck.length && copyObj.number_transactions_gte_times !== '' && copyObj.number_transactions_lte_times !== '' && copyObj.number_transactions_gte_times - 0 > copyObj.number_transactions_lte_times - 0) {
              return
            }
            // amount of transaction
            if (copyObj.amountOfTransactionCheck.length && (copyObj.amount || copyObj.amount2 || copyObj.amount_no_date_limitation)) {
              if (copyObj.amount_transactions_gte_usd === '' && copyObj.amount_transactions_lte_usd === '') {
                console.log()
              } else {
                if (copyObj.amount === 'Custom range') {
                  if (copyObj.amount2 !== '' && copyObj.amount_no_date_limitation === false) {
                    if (copyObj.amount_no_date_limitation === false) {
                      this.validateNumberTimes(tmpArr, copyObj.amount_transactions_gte_usd, copyObj.amount_transactions_lte_usd, copyObj.amount2[0], copyObj.amount2[1], 29)
                    } else { // no date
                      this.validateNumberTimes2(tmpArr, copyObj.amount_transactions_gte_usd, copyObj.amount_transactions_lte_usd, 29)
                    }
                  }
                  if (copyObj.amount_no_date_limitation) {
                    this.validateNumberTimes2(tmpArr, copyObj.amount_transactions_gte_usd, copyObj.amount_transactions_lte_usd, 29)
                  }
                } else {
                  if (copyObj.amount_no_date_limitation === false) {
                    this.validateNumberTimes2(tmpArr, copyObj.amount_transactions_gte_usd, copyObj.amount_transactions_lte_usd, 29, copyObj.amount)
                  } else {
                    this.validateNumberTimes2(tmpArr, copyObj.amount_transactions_gte_usd, copyObj.amount_transactions_lte_usd, 29)
                  }
                }
              }
            }
            if (copyObj.amountOfTransactionCheck.length && copyObj.amount === 'Custom range' && !copyObj.amount2 && !copyObj.amount_no_date_limitation) {
              return
            }
            if (copyObj.amountOfTransactionCheck.length && copyObj.amount !== 'Custom range' && !copyObj.amount && !copyObj.amount_no_date_limitation) {
              return
            }
            if (copyObj.amountOfTransactionCheck.length && copyObj.amount_transactions_gte_usd === '' && copyObj.amount_transactions_lte_usd === '') {
              return
            }
            if (copyObj.amountOfTransactionCheck.length && copyObj.amount_transactions_gte_usd !== '' && copyObj.amount_transactions_lte_usd !== '' && copyObj.amount_transactions_gte_usd - 0 > copyObj.amount_transactions_lte_usd - 0) {
              return
            }
            // average basket value
            this.validateAverageBasket(tmpArr, copyObj.averageBasketValueCheck, copyObj.average_basket_value_gte_usd, copyObj.average_basket_value_lte_usd, 32)
            if (copyObj.averageBasketValueCheck.length && (copyObj.average_basket_value_gte_usd === '' && copyObj.average_basket_value_lte_usd === '')) {
              return
            }
            if (copyObj.averageBasketValueCheck.length && copyObj.average_basket_value_gte_usd !== '' && copyObj.average_basket_value_lte_usd !== '' && (copyObj.average_basket_value_gte_usd - 0 > copyObj.average_basket_value_lte_usd - 0)) {
              return
            }
            // average basket items
            this.validateAverageBasket(tmpArr, copyObj.averageBasketItemsCheck, copyObj.average_basket_items_gte_usd, copyObj.average_basket_items_lte_usd, 34)
            if (copyObj.averageBasketItemsCheck.length && (copyObj.average_basket_items_gte_usd === '' && copyObj.average_basket_items_lte_usd === '')) {
              return
            }
            if (copyObj.averageBasketItemsCheck.length && copyObj.average_basket_items_gte_usd !== '' && copyObj.average_basket_items_lte_usd !== '' && (copyObj.average_basket_value_gte_usd - 0 > copyObj.average_basket_value_lte_usd - 0)) {
              return
            }
            // select product brands
            const brandCodeArr = []
            for (let i = 0; i < this.productBrandsTableData.length; i++) {
              brandCodeArr.push(this.productBrandsTableData[i].id)
            }
            if (copyObj.purchasedBrandsCheck.length && this.productBrandsTableData.length) {
              tmpArr.push({
                config_value: brandCodeArr.join(),
                type_id: 37
              })
            }
            if (copyObj.purchasedBrandsCheck.length && !this.productBrandsTableData.length) {
              return
            }
            // select product categories
            const categoryCodeArr = []
            for (let i = 0; i < this.productCategoryTableData.length; i++) {
              categoryCodeArr.push(this.productCategoryTableData[i].id)
            }
            if (copyObj.purchasedCategoryCheck.length && this.productCategoryTableData.length) {
              tmpArr.push({
                config_value: categoryCodeArr.join(),
                type_id: 38
              })
            }
            if (copyObj.purchasedCategoryCheck.length && !this.productCategoryTableData.length) {
              return
            }
            // select products
            const productCodeArr = []
            for (let i = 0; i < this.productTableData.length; i++) {
              productCodeArr.push(this.productTableData[i].id)
            }
            if (copyObj.purchasedProductsCheck.length && this.productTableData.length) {
              tmpArr.push({
                config_value: productCodeArr.join(),
                type_id: 39
              })
            }
            if (copyObj.purchasedProductsCheck.length && !this.productTableData.length) {
              return
            }
            // campaign email open
            if (copyObj.campaignEmailsOpenedCheck.length && (copyObj.campaign_emails_open_least !== undefined || copyObj.campaign_emails_open_out !== undefined)) {
              if (copyObj.campaign_emails_open_least !== undefined && copyObj.campaign_emails_open_out !== undefined) {
                if (copyObj.campaign_emails_open_least - 0 <= copyObj.campaign_emails_open_out - 0) {
                  tmpArr.push({
                    config_value: [copyObj.campaign_emails_open_least, copyObj.campaign_emails_open_out].join(),
                    type_id: 40
                  })
                }
              } else {
                tmpArr.push({
                  config_value: [copyObj.campaign_emails_open_least, copyObj.campaign_emails_open_out].join(),
                  type_id: 40
                })
              }
            }
            if (copyObj.campaignEmailsOpenedCheck.length && (copyObj.campaign_emails_open_least === undefined && copyObj.campaign_emails_open_out === undefined)) {
              return
            }
            if (copyObj.campaignEmailsOpenedCheck.length && (copyObj.campaign_emails_open_least - 0 > copyObj.campaign_emails_open_out - 0)) {
              return
            }
            // campaign email not open
            if (copyObj.campaignEmailsNotOpenedCheck.length && (copyObj.campaign_emails_not_open_least !== undefined || copyObj.campaign_emails_not_open_out !== undefined)) {
              if (copyObj.campaign_emails_not_open_least !== undefined && copyObj.campaign_emails_not_open_out !== undefined) {
                if (copyObj.campaign_emails_not_open_least - 0 <= copyObj.campaign_emails_not_open_out - 0) {
                  tmpArr.push({
                    config_value: [copyObj.campaign_emails_not_open_least, copyObj.campaign_emails_not_open_out].join(),
                    type_id: 43
                  })
                }
              } else {
                tmpArr.push({
                  config_value: [copyObj.campaign_emails_not_open_least, copyObj.campaign_emails_not_open_out].join(),
                  type_id: 43
                })
              }
            }
            if (copyObj.campaignEmailsNotOpenedCheck.length && (copyObj.campaign_emails_not_open_least === undefined && copyObj.campaign_emails_not_open_out === undefined)) {
              return
            }
            if (copyObj.campaignEmailsNotOpenedCheck.length && (copyObj.campaign_emails_not_open_least - 0 > copyObj.campaign_emails_not_open_out - 0)) {
              return
            }
            // campaign notification open
            if (copyObj.campaignNotificationsOpenedCheck.length && (copyObj.campaign_notifications_open_least !== undefined || copyObj.campaign_notifications_open_out !== undefined)) {
              if (copyObj.campaign_notifications_open_least !== undefined && copyObj.campaign_notifications_open_out !== undefined) {
                if (copyObj.campaign_notifications_open_least - 0 <= copyObj.campaign_notifications_open_out - 0) {
                  tmpArr.push({
                    config_value: [copyObj.campaign_notifications_open_least, copyObj.campaign_notifications_open_out].join(),
                    type_id: 46
                  })
                }
              } else {
                tmpArr.push({
                  config_value: [copyObj.campaign_notifications_open_least, copyObj.campaign_notifications_open_out].join(),
                  type_id: 46
                })
              }
            }
            if (copyObj.campaignNotificationsOpenedCheck.length && (copyObj.campaign_notifications_open_least === undefined && copyObj.campaign_notifications_open_out === undefined)) {
              return
            }
            if (copyObj.campaignNotificationsOpenedCheck.length && (copyObj.campaign_notifications_open_least - 0 > copyObj.campaign_notifications_open_out - 0)) {
              return
            }
            // campaign notification not open
            if (copyObj.campaignNotificationsNotOpenedCheck.length && (copyObj.campaign_notifications_not_open_least !== undefined || copyObj.campaign_notifications_not_open_out !== undefined)) {
              if (copyObj.campaign_notifications_not_open_least !== undefined && copyObj.campaign_notifications_not_open_out !== undefined) {
                if (copyObj.campaign_notifications_not_open_least - 0 <= copyObj.campaign_notifications_not_open_out - 0) {
                  tmpArr.push({
                    config_value: [copyObj.campaign_notifications_not_open_least, copyObj.campaign_notifications_not_open_out].join(),
                    type_id: 49
                  })
                }
              } else {
                tmpArr.push({
                  config_value: [copyObj.campaign_notifications_not_open_least, copyObj.campaign_notifications_not_open_out].join(),
                  type_id: 49
                })
              }
            }
            if (copyObj.campaignNotificationsNotOpenedCheck.length && (copyObj.campaign_notifications_not_open_least === undefined && copyObj.campaign_notifications_not_open_out === undefined)) {
              return
            }
            if (copyObj.campaignNotificationsNotOpenedCheck.length && (copyObj.campaign_notifications_not_open_least - 0 > copyObj.campaign_notifications_not_open_out - 0)) {
              return
            }
            // privacy
            if (copyObj.optInCheckbox.length && copyObj.privacyCheckList.length) {
              tmpArr.push({
                config_value: copyObj.privacyCheckList.join(),
                type_id: 50
              })
            }
            if (copyObj.optInCheckbox.length && !copyObj.privacyCheckList.length) {
              return
            }
          }
          tmpObj.tag_config_list = tmpArr
          tmpObj.tag_name = copyObj.tag_name
          // 判断到底是add还是edit
          if (valid) {
            // 如果当前选择的是有条件的，必须要勾选一�
            if (this.form.type !== 'UnconditionalTag') {
              if (!copyObj.genderCheckbox.length && !copyObj.age.length && !copyObj.birthdayCheckbox.length && !copyObj.birthdayMonthCheckbox.length && !copyObj.countryCheckbox.length && !copyObj.provinceCheckbox.length && !copyObj.cityCheckbox.length && !copyObj.tierCheckbox.length && !copyObj.registrationDateCheckbox.length && !copyObj.availablePointsCheckbox.length && !copyObj.registrationStoreCheckbox.length && !copyObj.registrationChannelCheckbox.length && !copyObj.firstTransactionDateCheck.length && !copyObj.lastTransactionDateCheck.length && !copyObj.numberOfTransactionCheck.length && !copyObj.amountOfTransactionCheck.length && !copyObj.averageBasketValueCheck.length && !copyObj.averageBasketItemsCheck.length && !copyObj.purchasedBrandsCheck.length && !copyObj.purchasedCategoryCheck.length && !copyObj.purchasedProductsCheck.length && !copyObj.campaignEmailsOpenedCheck.length && !copyObj.campaignEmailsNotOpenedCheck.length && !copyObj.campaignNotificationsOpenedCheck.length && !copyObj.campaignNotificationsNotOpenedCheck.length && !copyObj.optInCheckbox.length) {
                this.$message.error('A condition must be selected')
                return
              }
            }
            this.save_loading = true
            if (this.$route.params.hasOwnProperty('id')) { // edit
              tmpObj['tag_id'] = this.$route.params.id
              editMemberTag(tmpObj).then(res => {
                this.save_loading = false
                this.detail_loading = false
                if (res.return_result) {
                  this.$message.success(this.$t('member.fc_member_group_edit_feedback_label'))
                  this.$router.push({ path: '/member/member-tag', query: { update: true }})
                } else {
                  this.$message.error(res.msg)
                }
              }).catch(err => {
                this.$message.error(err)
                this.detail_loading = false
                this.save_loading = false
              })
            } else { // add
              addMemberTag(tmpObj).then(res => {
                this.save_loading = false
                this.detail_loading = false
                if (res.return_result) {
                  this.$message.success(this.$t('member.fc_member_tag_add_feedback_label'))
                  this.$router.push({ path: '/member/member-tag', query: { update: true }})
                } else {
                  this.$message.error(res.msg)
                }
              }).catch(err => {
                this.$message.error(err)
                this.detail_loading = false
                this.save_loading = false
              })
            }
          }
        })
      },
      // add member tag end
      handleDialogVisible(bl) {
        this.dialog_show = bl
      },
      handleProductDialogVisible(val) {
        this.dialog_show_product = val
      },
      handleRegisterStoreDialogVisible(val) {
        this.dialog_show_registration_store = val
      }
    },
    watch: {
      'form.country': {
        deep: true,
        handler(val) {
          console.log(111111, val)
        }
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.addNewTagPage {
  .tag-error {
    font-size: 12px;
    color: #f56c6c;
  }
  .el-checkbox {
    width: 180px;
  }
  .el-checkbox.descLabelCheckbox {
    width: auto;
  }
  .general-div, .loyalty-div, .campaign-div {
    margin-bottom: 20px;
    margin-top: 20px;
    .label-46 {
      width: 46px;
      display: inline-block;
    }
    .transaction-input {
      width: 100px !important;
    }
  }
  .transaction-div {
    margin-bottom: 20px;
    margin-top: 20px;
    .label-46 {
      width: 46px;
      display: inline-block;
    }
    .transaction-input {
      width: 100px !important;
    }
    .transaction-inp1, .transaction-inp2 {
      .transaction-input {
        width: 92px !important;
      }
    }
  }
  .general-div /deep/ .el-input-number {
    width: 140px !important;
  }
  .general-div /deep/ .el-select {
    width: 250px !important;
  }
  .general-div-birth /deep/ .el-select {
    width: 300px !important;
  }
  .campaign-div /deep/ .el-input-number {
    width: 140px !important;
  }
  .loyalty-div /deep/ .el-input-number {
    width: 140px !important;
  }
  .campaign-div /deep/ .el-checkbox {
    width: auto !important;
  }
  .privacy-div /deep/ .el-checkbox {
    width: auto !important;
  }
  .loyalty-div-channel .el-checkbox-group /deep/ .el-checkbox {
    width: auto !important;
  }
  .campaign-div .campaign-div-email-open,
  .campaign-div .campaign-div-email-not-open, .campaign-div .campaign-div-noti-open, .campaign-div .campaign-div-noti-not-open {
    display: flex;
    height: 36px;
    .el-form-item {
      display: block;
      padding-top: 0 !important;
      margin-left: 0px;
      border-bottom: none !important;
      &:not(:last-child) {
        margin-left: 0px;
      }
    }
  }
  .transaction-div .transaction-div-number,
  .transaction-div .transaction-div-amount,
  .transaction-div .transaction-div-average-value,
  .transaction-div .transaction-div-average-items,
  .transaction-div .transaction-div-first,
  .transaction-div .transaction-div-last,
  .loyalty-div .loyalty-div-tier,
  .loyalty-div .loyalty-div-date,
  .loyalty-div .loyalty-div-points,
  .loyalty-div .loyalty-div-store,
  .loyalty-div .loyalty-div-channel,
  .general-div .general-div-region,
  .general-div .general-div-month,
  .general-div .general-div-birth,
  .general-div .general-div-age,
  .general-div .general-div-gender,
  .transaction-div .transaction-div-brands,
  .transaction-div .transaction-div-category,
  .transaction-div .transaction-div-products,
  .privacy-div .privacy-div-opt {
    display: flex;
    height: 36px;
    .el-form-item {
      display: block;
      border-bottom: none !important;
      &:first-child {
        margin-left: 0px;
      }
      &:last-child {
        padding-top: 0px;
      }
    }
  }
  .transaction-div /deep/ .transaction-div-number .el-form-item .el-form-item__content .el-select {
    width: 202px !important;
  }
  .transaction-div /deep/ .transaction-div-number .el-form-item .el-form-item__content .el-date-editor {
    width: 224px;
    margin-right: 5px;
  }
  .transaction-div /deep/ .transaction-div-number .el-form-item .el-form-item__content .el-date-editor.el-range-editor.el-input__inner,
  .transaction-div /deep/ .transaction-div-amount .el-form-item .el-form-item__content .el-date-editor.el-range-editor.el-input__inner {
    padding: 3px 5px !important;
  }
  .transaction-div /deep/ .transaction-div-amount .el-form-item .el-form-item__content .el-select {
    width: 202px !important;
  }
  .transaction-div /deep/ .transaction-div-amount .el-form-item .el-form-item__content .el-date-editor {
    width: 224px;
    margin-right: 5px;
  }
  .transaction-div /deep/ .el-checkbox__label {
    padding-left: 5px;
  }
  .general-div .general-div-age,
  .loyalty-div .loyalty-div-points {
    .el-form-item {
      &:last-child {
        margin-left: 0;
      }
    }
  }
  .general-div .general-div-gender .el-checkbox-group .el-checkbox, .privacy .el-checkbox-group .el-checkbox {
    width: auto;
  }
  // error border
  .errors /deep/ input {
    border-color: #f56c6c !important;
  }
}
  .addNewTagPage {
    .category_add_button{
      background-color: $new-primary;
      border-color: $new-primary;
      min-width: 60px !important;
    }
    .content{
      display: flex;
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
      &.transaction-item {
        margin-left: 10px;
      }
      &.transaction-parent-item {
        margin-right: 5px;
      }
      &.transaction-inp1 {
        margin: 0 0 70px 0px;
      }
      &.transaction-inp2 {
        margin: 0 0 70px 4px;
      }
      &.transaction-custom-date {
        margin-left: 0px;
      }
      min-height: 76px;
      line-height: 76px;
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
  .addNewTagPage{
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
