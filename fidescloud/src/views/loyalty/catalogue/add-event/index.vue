<template>
  <div class="add-event">
    <div class="click-button">
      <el-button class="cancel" @click="goBack()">{{handleGlobalI18n('loyalty', 'cancel')}}</el-button>
      <el-button type="primary" class="save" :loading="saveLoading" @click="submitForm('addEvent')" v-if="!disabled">{{handleGlobalI18n('loyalty', 'save')}}</el-button>
    </div>
    <!--info-->
    <div class="contain" v-loading="editLoading">
      <div class="header">
        <p v-html="headerHtml"></p>
      </div>
      <div class="info">
        <el-form ref="addEvent" :model="form"  label-width="150px" :rules="rules" :disabled="disabled">
          <el-form-item :label="handleGlobalI18n('loyalty', 'event_name') + ':'" prop="redemption_event_name" :rules="[
            { required: true, message: handleGlobalI18n('validation', 'event_name_null'), trigger: 'change' }
          ]">
            <el-input v-model="form.redemption_event_name" style="width:300px"  maxlength="32"></el-input>
          </el-form-item>
          <el-form-item :label="handleGlobalI18n('loyalty', 'start_date') + ':'" prop="effective_from_time"
          :rules="[
            { required: true, message: handleGlobalI18n('validation', 'event_start_date_null'), trigger: 'change' }
          ]">
            <el-date-picker
            style="width:300px"
            value-format="yyyy-MM-dd"
            :format="globalData.value.date_format"
            v-model="form.effective_from_time"
            :picker-options="pickerOptions0"
            ></el-date-picker>
          </el-form-item>
          <el-form-item :label="handleGlobalI18n('loyalty', 'end_date') + ':'"  prop="effective_to_time"
          :rules="[
            { required: true, message: handleGlobalI18n('validation', 'event_end_date_null'), trigger: 'change' }
          ]">
            <el-date-picker
              style="width:300px"
              value-format="yyyy-MM-dd"
              :format="globalData.value.date_format"
              v-model="form.effective_to_time"
              :picker-options="pickerOptions0"
            ></el-date-picker>
          </el-form-item>
          <!-- edit show  add none-->
          <el-form-item :label="handleGlobalI18n('loyalty', 'status') + ':'" v-if="edit" prop="status">
            <el-select v-model.number="form.status" style="width:300px">
              <el-option :label="handleGlobalI18n('loyalty', 'active')" :value="parseInt(1)"></el-option>
              <el-option :label="handleGlobalI18n('loyalty', 'inActive')" :value="parseInt(0)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="handleGlobalI18n('loyalty', 'description') + ':'">
            <el-input
              type="textarea"
              style="width: 463px"
              maxlength="150"
              :autosize="{ minRows: 2, maxRows: 4}"
              v-model="form.description">
            </el-input>
          </el-form-item>
          <el-form-item :label="handleGlobalI18n('loyalty', 'select_gift') + ':'">
             <el-button @click="clickSelectGiftCoupon('1')"><i class="el-icon-plus"></i>{{handleGlobalI18n('loyalty', 'add')}}</el-button>
          </el-form-item>
          <div class="select_gift_list">
            <p class="p">{{handleGlobalI18n('loyalty', 'selected_gift_list')}}:</p>
            <el-table :data="gift.tableDataGift" v-loading = "deleteLoading" border :empty-text="$t('member.fc_table_no_data_label')">
              <el-table-column prop="gift_name" align="center" :label="handleGlobalI18n('loyalty', 'gift_name')" width="130"></el-table-column>
              <el-table-column prop="current_inventory" align="center" :label="handleGlobalI18n('loyalty', 'current_inventory')" width="140">
                <template slot-scope="scope">
                  <template v-if = "!scope.row.is_limited_inventory">
                    NA
                  </template>
                  <template v-else>
                    {{scope.row.current_inventory || scope.row.total_inventory}}
                  </template>
                </template>
              </el-table-column>
              <el-table-column prop="total_inventory" align="center" :label="handleGlobalI18n('loyalty', 'total_inventory')" width="140">
                <template slot-scope="scope">
                  <template v-if = "!scope.row.is_limited_inventory">
                    NA
                  </template>
                  <template v-else>
                    {{scope.row.total_inventory}}
                  </template>
                </template>
              </el-table-column>
              <el-table-column prop="gift_code" align="center" :label="handleGlobalI18n('loyalty', 'gift_code')"width="140" ></el-table-column>
              <el-table-column prop="limited_times" align="center" :label="handleGlobalI18n('loyalty', 'total_redeem_times')" width="130">
                <template slot-scope="scope">
                  <template v-if = "!scope.row.limited_times">
                    NA
                  </template>
                  <template v-else>
                    {{scope.row.limited_times}}
                  </template>
                </template>
              </el-table-column >
              <el-table-column prop="redeem_point" align="center" :label="handleGlobalI18n('loyalty', 'redeemed_points')" width="140"></el-table-column>
              <el-table-column prop="status" align="center" :label="handleGlobalI18n('loyalty', 'status')">
                <template slot-scope="scope">
                    {{scope.row.status === 1 ? 'Active' : 'Inactive'}}
                </template>
              </el-table-column>
              <el-table-column  align="center" :label="handleGlobalI18n('loyalty', 'operation')">
                <template slot-scope="scope" >
                  <el-button @click="editSelectGiftCoupon(scope.row,'1',scope.$index)">{{handleGlobalI18n('loyalty', 'edit')}}</el-button>
                  <el-button type="danger" @click="hasDelete('1',scope)" v-show="deleteStatus">{{handleGlobalI18n('loyalty', 'delete')}}</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <el-form-item :label="handleGlobalI18n('loyalty', 'select_coupon')+ ':'" style="margin-top: 20px;">
             <el-button @click="clickSelectGiftCoupon('2')"><i class="el-icon-plus"></i>{{handleGlobalI18n('loyalty', 'add')}}</el-button>
          </el-form-item>
           <div class="select_coupon_list">
            <p class="p">{{handleGlobalI18n('loyalty', 'selected_coupon_list')}}:</p>
            <el-table :data="coupon.tableDataCoupon" v-loading="deleteLoadingCoupon" border :empty-text="$t('member.fc_table_no_data_label')">
              <el-table-column prop="coupon_name" align="center" :label="handleGlobalI18n('loyalty', 'coupon_name')" width="130"></el-table-column>
              <el-table-column prop="current_inventory" align="center" :label="handleGlobalI18n('loyalty', 'current_inventory')" width="150">
                <template slot-scope="scope">
                  <template v-if = "!scope.row.is_limited_inventory">
                    NA
                  </template>
                  <template v-else>
                    {{scope.row.current_inventory || scope.row.total_inventory}}
                  </template>
                </template>
              </el-table-column>
              <el-table-column prop="total_inventory" align="center" :label="handleGlobalI18n('loyalty', 'total_inventory')" width="140">
                <template slot-scope="scope">
                  <template v-if = "!scope.row.is_limited_inventory">
                    NA
                  </template>
                  <template v-else>
                    {{scope.row.total_inventory}}
                  </template>
                </template>
              </el-table-column>
              <el-table-column prop="coupon_type" align="center" :label="handleGlobalI18n('loyalty', 'coupon_type')" width="130"></el-table-column>
              <el-table-column prop="coupon_amount" align="center" :label="handleGlobalI18n('loyalty', 'coupon_amount')" width="130"></el-table-column>
              <el-table-column prop="limited_times" align="center" :label="handleGlobalI18n('loyalty', 'total_redeem_times')" width="130">
                <template slot-scope="scope">
                  <template v-if = "!scope.row.limited_times">
                    NA
                  </template>
                  <template v-else>
                    {{scope.row.limited_times}}
                  </template>
                </template>
              </el-table-column>
              <el-table-column prop="redeem_point" align="center" :label="handleGlobalI18n('loyalty', 'redeemed_points')" width="130"></el-table-column>
              <el-table-column prop="status" align="center" :label="handleGlobalI18n('loyalty', 'status')">
                <template slot-scope="scope">
                    {{scope.row.status === 1 ? 'Active' : 'Inactive'}}
                </template>
              </el-table-column>
              <el-table-column  align="center" :label="handleGlobalI18n('loyalty', 'operation')">
                <template slot-scope="scope" >
                  <el-button @click="editSelectGiftCoupon(scope.row,'2',scope.$index)">{{handleGlobalI18n('loyalty', 'edit')}}</el-button>
                  <el-button type="danger" @click="hasDelete('2',scope)" v-show="deleteStatus">{{handleGlobalI18n('loyalty', 'delete')}}</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-form>
      </div>
    </div>
    <!--选择gift 或者 coupon-->
    <el-dialog :title="selectName" :visible.sync="dialogFormVisible">
      <div style="overflow-y: hidden;height: 600px;">
      <el-scrollbar style="height:100%; width: 100%">
        <div>
          <!--select gift-->
          <div v-show="selectRadio === '1'">
            <div class="search-name-code" >
              <el-input type="text" :placeholder="selectPlaceholder" maxlength="32" v-model="gift.listQuery.gift_name" @keyup.enter.native="handleSearchGift"></el-input>
              <el-button type="primary" icon="el-icon-search" @click = 'handleSearchGift'>{{handleGlobalI18n('loyalty', 'search')}}</el-button>
            </div>
            <p style="margin-top: 10px; margin-bottom: -20px;">{{handleGlobalI18n('loyalty', 'select_a_gift')}}</p>
            <div class="searchGift" v-loading="gift.listLoadingSearchGift">
              <el-table :data="gift.searchDataGift"  highlight-current-row border :empty-text="$t('member.fc_table_no_data_label')">
                <el-table-column prop="gift_name" align="center" :label="handleGlobalI18n('loyalty','gift_name')"></el-table-column>
                <el-table-column prop="gift_code" align="center" :label="handleGlobalI18n('loyalty','gift_code')"></el-table-column>
                <el-table-column  align="center" :label="handleGlobalI18n('loyalty','operation')">
                  <template slot-scope="scope" >
                    <el-button @click="addGiftData(scope.$index)" icon="el-icon-plus">{{handleGlobalI18n('loyalty', 'add')}}</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div class="pagination-container">
                <pagination-container
                  :page = "gift.listQuery.page_no"
                  :page_size = 'gift.listQuery.page_size'
                  :total = 'gift.total'
                  :page_sizes="page_sizes"
                  @handleCurrentChange = "giftHandleCurrentChange"
                  @handleSizeChange="handleSizeChangeGift"
                ></pagination-container>
              </div>
            </div>
            <div class="selected_gift">
              <p>{{handleGlobalI18n('loyalty', 'selected_gift_list')}}:</p>
              <el-table :data="gift.tableDataGift" v-loading="deleteLoading" border :empty-text="$t('member.fc_table_no_data_label')">
                <el-table-column prop="gift_name" align="center" :label="handleGlobalI18n('loyalty','gift_name')"></el-table-column>
                <el-table-column prop="gift_code" align="center" :label="handleGlobalI18n('loyalty','gift_code')"></el-table-column>
                <!-- <el-table-column prop="redeemed_point" align="center" label="Redeemed point"></el-table-column>
                <el-table-column prop="inventory" align="center" label="Inventory"></el-table-column>
                <el-table-column prop="limited_times" align="center" label="Limited times"></el-table-column> -->
                <el-table-column  align="center" :label="handleGlobalI18n('loyalty','operation')">
                  <template slot-scope="scope" >
                    <el-button @click="editSelectGiftCoupon(scope.row,'1',scope.$index)">{{handleGlobalI18n('loyalty', 'edit')}}</el-button>
                    <el-button type="danger" @click="hasDelete('1',scope)" v-show="deleteStatus">{{handleGlobalI18n('loyalty', 'delete')}}</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
          <!--select coupon-->
          <div v-show="selectRadio === '2'">
            <div class="search-name-code" >
              <el-input type="text" :placeholder="selectPlaceholder" @keyup.enter.native="handleSearchCoupon" maxlength="32" v-model="coupon.listQuery.coupon_name"></el-input>
              <el-button type="primary" icon="el-icon-search" @click='handleSearchCoupon'>{{handleGlobalI18n('loyalty', 'search')}}</el-button>
            </div>
            <p style="margin-top: 10px; margin-bottom: -20px;">{{handleGlobalI18n('loyalty', 'select_a_coupon')}}</p>
            <div class="searchCoupon" v-loading="coupon.listLoadingSearchCoupon">
              <el-table :data="coupon.searchDataCoupon" border :empty-text="$t('member.fc_table_no_data_label')">
                <el-table-column prop="coupon_name" align="center" :label="handleGlobalI18n('loyalty', 'coupon_name')"></el-table-column>
                <el-table-column prop="coupon_type_name" align="center" :label="handleGlobalI18n('loyalty', 'coupon_type')"></el-table-column>
                <el-table-column prop="amount" align="center" :label="handleGlobalI18n('loyalty', 'coupon_amount')"></el-table-column>
                <el-table-column  align="center" :label="handleGlobalI18n('loyalty', 'operation')">
                  <template slot-scope="scope" >
                    <el-button @click="addCouponData(scope.$index)" icon="el-icon-plus">{{handleGlobalI18n('loyalty', 'add')}}</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div class="pagination-container">
                <pagination-container
                  :page = "coupon.listQuery.page_no"
                  :page_size = 'coupon.listQuery.page_size'
                  :total = 'coupon.total'
                  :page_sizes="page_sizes"
                  @handleCurrentChange = "couponHandleCurrentChange"
                  @handleSizeChange="handleSizeChangeCoupon"
                ></pagination-container>
              </div>
            </div>
            <div class="selected_coupon">
              <p>{{handleGlobalI18n('loyalty', 'selected_coupon_list')}}:</p>
              <el-table :data="coupon.tableDataCoupon" v-loading="deleteLoadingCoupon" border :empty-text="$t('member.fc_table_no_data_label')">
                <el-table-column prop="coupon_name" align="center" :label="handleGlobalI18n('loyalty', 'coupon_name')"></el-table-column>
                <el-table-column prop="coupon_type" align="center" :label="handleGlobalI18n('loyalty', 'coupon_type')"></el-table-column>
                <el-table-column prop="coupon_amount" align="center" :label="handleGlobalI18n('loyalty', 'coupon_amount')"></el-table-column>
                <!-- <el-table-column prop="redeemed_point" align="center" label="Redeemed point"></el-table-column>
                <el-table-column prop="limited_times" align="center" label="Limited times"></el-table-column> -->
                <el-table-column  align="center" :label="handleGlobalI18n('loyalty', 'operation')">
                  <template slot-scope="scope" >
                    <el-button @click="editSelectGiftCoupon(scope.row,'2',scope.$index)">{{handleGlobalI18n('loyalty', 'edit')}}</el-button>
                    <el-button type="danger" @click="hasDelete('2',scope)" v-show="deleteStatus">{{handleGlobalI18n('loyalty', 'delete')}}</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </el-scrollbar>
      </div>
      <div style="width: 100%;text-align: center">
        <el-button style="margin-top:10px;" type="primary" @click="dialogFormVisible=false">{{handleGlobalI18n('loyalty', 'confirm')}}</el-button>
      </div>
    </el-dialog>
    <!--配置选中的-->
    <el-dialog :title="handleGlobalI18n('loyalty', 'configure_the_gift_coupon__for_redemption')" :visible.sync="dialogEditGiftCoupon" width="590px">
      <el-form :model="configuration.form" ref="configure" label-width="200px" :rules="rulesConfiguration">
        <el-form-item label="Point calculation method:" v-if="selectRadio === '1' && !editGiftCoupon">
          <el-select v-model="point_calc_method" placeholder="please select" style="width: 250px;">
            <el-option :label="handleGlobalI18n('loyalty', 'unit_price')" :value="parseInt(1)"></el-option>
            <el-option :label="handleGlobalI18n('loyalty', 'purchased_price')" :value="parseInt(2)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="handleGlobalI18n('loyalty', 'redemption_points') + ':'" prop="redeem_point">
          <el-input-number :min="0" :precision="0" :step="1" v-model="configuration.form.redeem_point" style="width: 250px;"></el-input-number>
        </el-form-item>
        <el-form-item :label="handleGlobalI18n('loyalty', 'tier_selection') + ':'" prop="limited_tier_list" >
          <el-select
            style="width: 250px; margin-right:10px;"
            v-model="configuration.form.limited_tier_list"
            :disabled="configuration.form.is_limited_tier"
            multiple>
            <el-option
              v-for="item in configuration.tierList"
              :key="item.member_tier_code"
              :label="item.member_tier_name"
              :value="item.member_tier_code">
            </el-option>
          </el-select>
          <label v-show="deleteStatus" >
            <el-checkbox v-model="configuration.form.is_limited_tier"></el-checkbox><span style="margin-left:-20px;">{{handleGlobalI18n('loyalty', 'not_limited')}}</span>
          </label>
        </el-form-item>
        <el-form-item :label="handleGlobalI18n('loyalty', 'status') + ':'" v-if="edit && editGiftCoupon">
          <el-select v-model="configuration.form.status" :placeholder="handleGlobalI18n('loyalty', 'please_select')" style="width: 250px;">
            <el-option :label="handleGlobalI18n('loyalty', 'active')" :value="parseInt(1)"></el-option>
            <el-option :label="handleGlobalI18n('loyalty', 'inActive')" :value="parseInt(0)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="handleGlobalI18n('loyalty', 'limited_inventory')" prop="total_inventory">
          <el-input-number :min="0" :precision="0" :step="1" v-model="configuration.form.total_inventory" :disabled="configuration.form.is_limited_inventory" style="width:250px;margin-right:10px;"></el-input-number>
          <label v-show="deleteStatus">
            <el-checkbox v-model="configuration.form.is_limited_inventory" :disabled="edit && configuration.form.is_limited_inventory && !oldConfigure.is_limited_inventory && !deleteStatus && editGiftCoupon"></el-checkbox><span style="margin-left:-20px;">{{handleGlobalI18n('loyalty', 'not_limited')}}</span>
          </label>
        </el-form-item>
        <el-form-item :label="handleGlobalI18n('loyalty', 'limited_times')" prop="limited_times">
          <el-input-number :min="0" :precision="0" :step="1" v-model="configuration.form.limited_times" :disabled="configuration.form.is_limited_redeem_times" style="width:250px;margin-right:10px;"></el-input-number>
          <label v-show="deleteStatus">
            <el-checkbox v-model="configuration.form.is_limited_redeem_times"></el-checkbox><span style="margin-left:-20px;">{{handleGlobalI18n('loyalty', 'not_limited')}}</span>
          </label>
        </el-form-item>
      </el-form>
      <div style="margin-top:14px; text-align: center">
        <el-button @click="confirmConfigure('configure')" :loading="configurationLoading">{{handleGlobalI18n('loyalty', 'save')}}</el-button>
        <el-button @click="dialogEditGiftCoupon=false">{{handleGlobalI18n('loyalty', 'cancel')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { newRedemptionEvent, searchGift, getRedemptionEventDetail, addGiftForRedemptionEvent, removeGiftForRedemptionEvent, addCouponForRedemptionEvent, removeCouponForRedemptionEvent, editRedemptionEventBasicInfo, editGiftForRedemptionEvent, editCouponForRedemptionEvent } from '@/api/redemption'
  import PaginationContainer from '@/components/PaginationContainer'
  import { queryMemberTierList, queryCouponListBy } from '@/api/loyalty'
  import { DateTime } from 'luxon'
  import { queryPointRule } from '@/api/loyalty'
  export default {
    data() {
      var validateRedeemPoint = (rule, value, callback) => {
        if (value <= 0) {
          callback(new Error(this.handleGlobalI18n('validation', 'configure_redemption_point_null')))
        } else {
          callback()
        }
      }
      var validateTotalInventory = (rule, value, callback) => {
        if (!this.configuration.form.is_limited_inventory && value <= 0) {
          callback(new Error(this.handleGlobalI18n('validation', 'configure_limited_inventory_null')))
        }
        if (this.edit && value < this.oldConfigure.total_inventory - this.oldConfigure.current_inventory) {
          callback(new Error(this.handleGlobalI18n('validation', 'point_error')))
        }
        callback()
      }
      var validateLimitedTimes = (rule, value, callback) => {
        if (!this.configuration.form.is_limited_redeem_times && value <= 0) {
          callback(new Error(this.handleGlobalI18n('validation', 'configure_limited_times_null')))
        } else {
          callback()
        }
      }
      var validateLimitedTierList = (rule, value, callback) => {
        if (!this.configuration.form.is_limited_tier && value.length <= 0) {
          callback(new Error(this.handleGlobalI18n('validation', 'configure_tier_selection_null')))
        } else {
          callback()
        }
      }
      return {
        page_sizes: [5, 10, 20, 30],
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7
          }
        },
        deleteLoadingCoupon: false,
        deleteLoading: false,
        configurationLoading: false,
        editLoading: false,
        saveLoading: false,
        rules: {},
        rulesConfiguration: {
          redeem_point: [
            { required: true, message: 'The redemption points is empty', trigger: 'change' },
            { validator: validateRedeemPoint, trigger: ['blur', 'change'] }
          ],
          total_inventory: [
            { validator: validateTotalInventory, trigger: ['blur', 'change'] }
          ],
          limited_times: [
            { validator: validateLimitedTimes, trigger: ['blur', 'change'] }
          ],
          limited_tier_list: [
            { validator: validateLimitedTierList, trigger: ['blur', 'change'] }
          ]
        },
        gift: {
          listLoadingSearchGift: false,
          listQuery: {
            gift_name: '',
            page_no: 1,
            page_size: 5,
            status: 1
          },
          searchDataGift: [],
          total: null,
          tableDataGift: [],
          selectIndex: null,
          tableIndex: null
        },
        coupon: {
          listLoadingSearchCoupon: false,
          listQuery: {
            coupon_name: '',
            page_no: 1,
            page_size: 5,
            status: 1
          },
          searchDataCoupon: [],
          total: null,
          tableDataCoupon: [],
          selectIndex: null,
          tableIndex: null
        },
        configuration: {
          tierList: [],
          form: {
            redeem_point: 0,
            is_limited_redeem_times: false,
            limited_times: 0,
            is_limited_inventory: false,
            total_inventory: 0,
            is_limited_tier: false,
            limited_tier_list: [],
            status: null
          }
        },
        searchDataCoupon: [],
        dialogEditGiftCoupon: false,
        listLoading1: false,
        dialogFormVisible: false,
        listLoading: false,
        tableDataGift: [],
        tableDataCoupon: [],
        centerDialogVisible: false,
        form: {
          redemption_event_name: '',
          status: '',
          effective_from_time: '',
          effective_to_time: '',
          description: '',
          generate_time: ''
        },
        selectRadio: '',
        selectEditDetails: '',
        listQuery: {
          page: 1,
          limit: 10,
          title: undefined,
          sort: 'desc'
        },
        edit: false,
        editGiftCoupon: false,
        editIndex: '',
        edit_redemption_code: '',
        postfix: '',
        oldConfigure: {},
        deleteStatus: true,
        disabled: false,
        point_ratio: null,
        point_calc_method: 1,
        id: null
      }
    },
    components: {
      PaginationContainer
    },
    computed: {
      selectName() {
        if (this.selectRadio === '1') {
          return this.handleGlobalI18n('loyalty', 'select_gift')
        } else {
          return this.handleGlobalI18n('loyalty', 'select_coupon')
        }
      },
      selectPlaceholder() {
        if (this.selectRadio === '1') {
          return this.handleGlobalI18n('loyalty', 'gift_input_placeholder')
        } else {
          return this.handleGlobalI18n('loyalty', 'input_placeholder')
        }
      },
      headerHtml() {
        if (this.edit) {
          return this.handleGlobalI18n('loyalty', 'edit_event')
        } else {
          return this.handleGlobalI18n('loyalty', 'add_event')
        }
      }
    },
    created() {
      //  获取Tier list
      this.getTierList()
      this.searchCoupon()
      this.searchGift()
      const id = this.$route.params.id
      this.id = id
      this.edit_redemption_code = this.$route.params.rid
      this.edit = id === '2' ? 1 : false
      // 查询详情
      if (this.edit_redemption_code !== '' && this.edit_redemption_code !== undefined) {
        this.getRedeemDetail()
      }
      if (id === '3') {
        this.disabled = true
      }
      this.queryPointRule()
    },
    methods: {
      queryPointRule() {
        queryPointRule().then(res => {
          this.point_ratio = res.return_result.point_ratio
        })
      },
      // 保存编辑event的基本信息
      saveEditBasicInfo(formName) {
        if (this.edit_redemption_code === '' || this.edit_redemption_code === undefined) {
          return true
        }
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.saveLoading = true
            this.setDateTime()
            editRedemptionEventBasicInfo({ ...this.form, redemption_event_code: this.edit_redemption_code, effective_from_time: `${this.form.effective_from_time.substring(0, 10)}T00:00:00.000${this.postfix}`, effective_to_time: `${this.form.effective_to_time.substring(0, 10)}T23:59:59.999${this.postfix}` }).then(res => {
              this.saveLoading = false
              this.goBack()
            }).catch(() => {
              this.saveLoading = false
            })
          } else {
            console.log('error')
          }
        })
      },
      setDateTime() {
        this.form.generate_time = DateTime.local().toISO()
        const nowDateLength = this.form.generate_time.length
        this.postfix = this.form.generate_time.substring(nowDateLength - 6, nowDateLength)
      },
      getRedeemDetail() {
        this.editLoading = true
        getRedemptionEventDetail({ redemption_event_code: this.edit_redemption_code }).then(res => {
          const obj = res.return_result
          this.form.redemption_event_name = obj.redemption_event_name
          this.form.status = obj.status
          this.form.effective_from_time = obj.effective_from_time
          this.form.effective_to_time = obj.effective_to_time
          this.form.description = obj.description
          if (obj.hasOwnProperty('gift_rel')) {
            if (obj.gift_rel !== null && obj.gift_rel.length > 0) {
              this.gift.tableDataGift = obj.gift_rel
            }
          }
          if (obj.hasOwnProperty('coupon_rel')) {
            if (obj.coupon_rel !== null && obj.coupon_rel.length > 0) {
              this.coupon.tableDataCoupon = obj.coupon_rel
            }
          }
          // 判断兑换是否开始
          const now_date = new Date().valueOf()
          const end_date = DateTime.fromISO(obj.effective_from_time).toFormat('x')
          if (now_date >= end_date) {
            this.deleteStatus = false
          }
          this.editLoading = false
        }).catch(() => {
          this.editLoading = false
        })
      },
      // 查询coupon
      searchCoupon() {
        this.coupon.listLoadingSearchCoupon = true
        queryCouponListBy(this.coupon.listQuery).then(res => {
          const obj = res.return_result
          this.coupon.searchDataCoupon = obj.coupons
          this.coupon.total = obj.total_count
          this.coupon.listLoadingSearchCoupon = false
        }).catch(() => {
          this.coupon.listLoadingSearchCoupon = false
        })
      },
      addGiftData(index) {
        this.dialogEditGiftCoupon = true
        this.gift.selectIndex = index
      },
      addCouponData(index) {
        this.dialogEditGiftCoupon = true
        this.coupon.selectIndex = index
      },
      // 获取Tier 列表
      getTierList() {
        queryMemberTierList({ page_no: 1, page_size: 10 }).then(res => {
          const obj = res.return_result
          this.configuration.tierList = obj.tiers
        })
      },
      giftHandleCurrentChange(val) {
        this.gift.listQuery.page_no = val
        this.searchGift()
      },
      handleSizeChangeGift(val) {
        this.gift.listQuery.page_size = val
        this.searchGift()
      },
      handleSizeChangeCoupon(val) {
        this.coupon.listQuery.page_size = val
        this.searchCoupon()
      },
      couponHandleCurrentChange(val) {
        this.coupon.listQuery.page_no = val
        this.searchCoupon()
      },
      handleSearchCoupon() {
        this.coupon.listQuery.page_no = 1
        this.searchCoupon()
      },
      handleSearchGift() {
        this.gift.listQuery.page_no = 1
        this.searchGift()
      },
      // 查询gift 列表
      searchGift() {
        this.gift.listLoadingSearchGift = true
        searchGift(this.gift.listQuery).then(res => {
          const obj = res.return_result
          this.gift.searchDataGift = obj.gifts
          this.gift.total = obj.total_count
          this.gift.listLoadingSearchGift = false
        }).catch(() => {
          this.gift.listLoadingSearchGift = false
        })
      },
      editSelectGiftCoupon(row, id, index) {
        this.dialogEditGiftCoupon = true
        this.editGiftCoupon = true
        this.selectRadio = id
        this.$nextTick(() => {
          var con = this.configuration.form
          con.redeem_point = row.redeem_point
          con.is_limited_redeem_times = row.is_limited_redeem_times === 0
          con.limited_times = row.limited_times
          con.is_limited_inventory = row.is_limited_inventory === 0
          con.is_limited_tier = row.is_limited_tier === 0
          con.limited_tier_list = row.limited_tier_list ? row.limited_tier_list : []
          con.total_inventory = row.total_inventory
          con.status = row.status
          this.oldConfigure = row
        })
        this.setDateTime()
        if (id === '1') {
          // gift
          this.gift.tableIndex = index
        } else if (id === '2') {
          this.coupon.tableIndex = index
        }
      },
      clickSelectGiftCoupon(id) {
        this.selectRadio = id
        this.dialogFormVisible = !this.dialogFormVisible
      },
      submitForm(formName) {
        if (this.edit) {
          this.saveEditBasicInfo(formName)
        } else {
          this.add(formName)
        }
      },
      add(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // this.goBack()
            // 判断是否选择了gift 或者 coupon
            if (!this.checkSelectLeastOne()) {
              this.$notify({
                title: this.handleGlobalI18n('loyalty', 'warning'),
                message: this.handleGlobalI18n('validation', 'no_select_gift_or_coupon'),
                type: 'warning'
              })
              return true
            }
            this.saveLoading = true
            this.setDateTime()
            newRedemptionEvent(Object.assign({}, this.form, { gift_rel: this.gift.tableDataGift, coupon_rel: this.coupon.tableDataCoupon, effective_from_time: `${(this.form.effective_from_time).substring(0, 10)}T00:00:00.000${this.postfix}`, effective_to_time: `${this.form.effective_to_time.substring(0, 10)}T23:59:59.999${this.postfix}` })).then(res => {
              this.goBack()
              this.saveLoading = false
            }).catch(() => {
              this.saveLoading = false
            })
          } else {
            this.saveLoading = false
            return false
          }
        })
      },
      checkSelectLeastOne() {
        if (this.gift.tableDataGift.length <= 0 && this.coupon.tableDataCoupon.length <= 0) {
          return false
        }
        return true
      },
      handleSizeChange(val) {
        this.listQuery.limit = val
      },
      handleCurrentChange1(val) {
        this.listQuery.page = val
      },
      hasDelete(type, scope) {
        if (type === '1') {
          // gift
          if (this.edit_redemption_code !== '' && this.edit_redemption_code !== undefined) {
            this.deleteLoading = true
            removeGiftForRedemptionEvent({
              redemption_event_code: this.edit_redemption_code,
              gift_code: scope.row.gift_code
            }).then(res => {
              this.gift.tableDataGift.splice(scope.$index, 1)
              this.deleteLoading = false
              this.$notify({
                title: 'Success',
                message: this.$t('configuration.fc_operation_feedback_notification_label'),
                type: 'success'
              })
            }).catch(() => {
              this.deleteLoading = false
            })
          } else {
            this.gift.tableDataGift.splice(scope.$index, 1)
          }
        } else {
          if (this.edit_redemption_code !== '' && this.edit_redemption_code !== undefined) {
            this.deleteLoadingCoupon = true
            removeCouponForRedemptionEvent({
              redemption_event_code: this.edit_redemption_code,
              coupon_code: scope.row.coupon_code
            }).then(res => {
              this.coupon.tableDataCoupon.splice(scope.$index, 1)
              this.deleteLoadingCoupon = false
              this.$notify({
                title: 'Success',
                message: this.$t('configuration.fc_operation_feedback_notification_label'),
                type: 'success'
              })
            }).catch(() => {
              this.deleteLoadingCoupon = false
            })
          } else {
            this.coupon.tableDataCoupon.splice(scope.$index, 1)
          }
        }
      },
      handleCurrentChange(val) {
        this.selectEditDetails = val
      },
      confirmConfigure(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.confirmEdit()
          }
        })
      },
      confirmEdit() {
        this.dialogEditGiftCoupon = false
        var c = this.configuration.form
        var giftObj = this.gift
        var newObj = Object.assign({}, c, { is_limited_redeem_times: c.is_limited_redeem_times ? 0 : 1, is_limited_inventory: c.is_limited_inventory ? 0 : 1, is_limited_tier: c.is_limited_tier ? 0 : 1 })
        // 编辑
        if (this.editGiftCoupon) {
          if (this.selectRadio === '1') {
            newObj.gift_code = giftObj.tableDataGift[giftObj.tableIndex].gift_code
            newObj.gift_name = giftObj.tableDataGift[giftObj.tableIndex].gift_name
            if (this.edit_redemption_code !== '' && this.edit_redemption_code !== undefined) {
              this.deleteLoading = true
              editGiftForRedemptionEvent(Object.assign({}, { redemption_event_code: this.edit_redemption_code, current_time: this.form.generate_time }, newObj)).then(res => {
                this.$set(giftObj.tableDataGift, giftObj.tableIndex, newObj)
                this.deleteLoading = false
                this.$notify({
                  title: 'Success',
                  message: this.$t('configuration.fc_operation_feedback_notification_label'),
                  type: 'success'
                })
              }).catch(() => {
                this.deleteLoading = false
              })
            } else {
              this.$set(giftObj.tableDataGift, giftObj.tableIndex, newObj)
            }
          } else {
            // coupon
            const obj = this.coupon
            newObj.coupon_name = obj.tableDataCoupon[obj.tableIndex].coupon_name
            newObj.coupon_code = obj.tableDataCoupon[obj.tableIndex].coupon_code
            newObj.coupon_type = obj.tableDataCoupon[obj.tableIndex].coupon_type
            newObj.coupon_amount = obj.tableDataCoupon[obj.tableIndex].coupon_amount
            if (this.edit_redemption_code !== '' && this.edit_redemption_code !== undefined) {
              this.deleteLoadingCoupon = true
              editCouponForRedemptionEvent(Object.assign({}, newObj, { redemption_event_code: this.edit_redemption_code, current_time: this.form.generate_time })).then(res => {
                this.deleteLoadingCoupon = false
                this.$set(obj.tableDataCoupon, obj.tableIndex, newObj)
                this.$notify({
                  title: 'Success',
                  message: this.$t('configuration.fc_operation_feedback_notification_label'),
                  type: 'success'
                })
              }).catch(() => {
                this.deleteLoadingCoupon = false
              })
            } else {
              this.$set(obj.tableDataCoupon, obj.tableIndex, newObj)
            }
          }
          return true
        }
        // 新增
        this.setDateTime()
        if (this.selectRadio === '1') {
          // gift
          newObj.gift_name = this.gift.searchDataGift[giftObj.selectIndex].gift_name
          newObj.gift_code = this.gift.searchDataGift[giftObj.selectIndex].gift_code
          newObj.status = 1
          if (this.edit_redemption_code !== '' && this.edit_redemption_code !== undefined) {
            // 保存
            this.configurationLoading = true
            addGiftForRedemptionEvent({ ...newObj, current_time: this.form.generate_time, redemption_event_code: this.edit_redemption_code }).then(res => {
              this.configurationLoading = false
              giftObj.tableDataGift.push(newObj)
              this.$notify({
                title: 'Success',
                message: this.$t('configuration.fc_operation_feedback_notification_label'),
                type: 'success'
              })
            }).catch(() => {
              this.configurationLoading = false
            })
          } else {
            giftObj.tableDataGift.push(newObj)
          }
        } else if (this.selectRadio === '2') {
          // coupon
          const obj = this.coupon
          newObj.coupon_name = obj.searchDataCoupon[obj.selectIndex].coupon_name
          newObj.coupon_code = obj.searchDataCoupon[obj.selectIndex].coupon_code
          newObj.coupon_type = obj.searchDataCoupon[obj.selectIndex].coupon_type_name
          newObj.coupon_amount = obj.searchDataCoupon[obj.selectIndex].amount
          newObj.status = 1
          if (this.edit_redemption_code !== '' && this.edit_redemption_code !== undefined) {
            this.configurationLoading = true
            addCouponForRedemptionEvent({ ...newObj, current_time: this.form.generate_time, redemption_event_code: this.edit_redemption_code }).then(res => {
              this.configurationLoading = false
              obj.tableDataCoupon.push(newObj)
              this.$notify({
                title: 'Success',
                message: this.$t('configuration.fc_operation_feedback_notification_label'),
                type: 'success'
              })
            }).catch(() => {
              this.configurationLoading = false
            })
          } else {
            obj.tableDataCoupon.push(newObj)
          }
        }
      }
    },
    watch: {
      dialogEditGiftCoupon() {
        if (!this.dialogEditGiftCoupon) {
          this.editGiftCoupon = false
        }
        this.configuration.form = {
          redeem_point: 0,
          is_limited_redeem_times: false,
          limited_times: 0,
          is_limited_inventory: false,
          total_inventory: 0,
          is_limited_tier: false,
          limited_tier_list: [],
          status: 1
        }
        this.point_calc_method = 1
        if (this.selectRadio === '1' && !this.editGiftCoupon) {
          if (this.point_calc_method === 1) {
            this.configuration.form.redeem_point = this.point_ratio * (this.gift.searchDataGift[this.gift.selectIndex].unit_price || 0)
          } else {
            this.configuration.form.redeem_point = this.point_ratio * (this.gift.searchDataGift[this.gift.selectIndex].purchased_price || 0)
          }
        }
        if (this.dialogEditGiftCoupon) {
          this.$nextTick(() => {
            this.$refs['configure'].clearValidate()
          })
        }
      },
      'point_calc_method': {
        handler(val) {
          if (this.selectRadio === '1' && !this.editGiftCoupon) {
            if (this.point_calc_method === 1) {
              this.configuration.form.redeem_point = this.point_ratio * (this.gift.searchDataGift[this.gift.selectIndex].unit_price || 0)
            } else {
              this.configuration.form.redeem_point = this.point_ratio * (this.gift.searchDataGift[this.gift.selectIndex].purchased_price || 0)
            }
          }
        }
      },
      'configuration.form.is_limited_tier': {
        handler(val) {
          if (val) {
            this.configuration.form.limited_tier_list = []
          }
        }
      },
      'configuration.form.is_limited_inventory': {
        handler(val) {
          if (val) {
            this.configuration.form.total_inventory = 0
          }
        }
      },
      'configuration.form.is_limited_redeem_times': {
        handler(val) {
          if (val) {
            this.configuration.form.limited_times = 0
          }
        }
      },
      'configuration.form.redeem_point': {
        handler(val) {
          if (val === undefined || val === '' || val === null) {
            this.$nextTick(() => {
              this.configuration.form.redeem_point = 0
            })
          }
        }
      },
      'configuration.form.limited_times': {
        handler(val) {
          if (val === undefined || val === '' || val === null) {
            this.$nextTick(() => {
              this.configuration.form.limited_times = 0
            })
          }
        }
      },
      'configuration.form.total_inventory': {
        handler(val) {
          if (val === undefined || val === '' || val === null) {
            this.$nextTick(() => {
              this.configuration.form.total_inventory = 0
            })
          }
        }
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .add-event {
    .pagination-container {
      text-align: right;
      padding: 15px 0;
      background-color: #ffffff;
    }
    .el-input,.el-select,.el-date-picker{
      width: 25%;
    }
    .el-dialog{
      .el-input,.el-select,.el-date-picker{
        width: 60%;
      }
    }
    margin: 25px;
    .click-button {
      padding:5px 0;
      width: 100%;
      text-align: right;
      background-color: #ffffff;
      .save{
        margin-left: 20px;
        margin-right: 20px;
      }
    }
    .contain {
      margin-top: 30px;
      background-color: #ffffff;
      position: relative;
      padding-bottom: 30px;
      &:before {
        content: '';
        position: absolute;
        top: -4px;
        left: 0;
        width: 100%;
        height: 3px;
        background-color: rgba(51, 51, 51, 0.07);
      }
      .header {
        height: 30px;
        line-height: 30px;
        position: relative;
        &:after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 1px;
          background-color: rgba(51, 51, 51, 0.07);
        }
        p {
          margin-left: 20px;
          font-weight: 600;
          font-size:17px;
          color: rgba(51, 51, 51, 0.6);
        }
      }

    }
    .info{
      padding:20px;
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
    .el-table{
      margin-top:30px;
    }
  }
</style>
