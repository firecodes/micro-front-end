<template>
  <div class="coupon">
    <!-- <el-select v-model="value" class="width200" @change="currentstatus">
            <el-option label='未审核' :value="parseInt(0)"></el-option>
            <el-option label='通过' :value="parseInt(1)"></el-option>
            <el-option label="未通过" :value="parseInt(2)"></el-option>
            <el-option label='全部' value=""></el-option>
    </el-select> -->
    <el-date-picker
      v-model="value2"
      type="daterange"
      align="right"
      unlink-panels
      range-separator="至"
      start-placeholder="提交开始日期"
      end-placeholder="提交结束日期"
      size='small'
      value-format = 'yyyy-MM-dd'
      style="width: 300px; margin-bottom:10px;"
      @change='hah'
      :picker-options="pickerOptions">
    </el-date-picker>
    <el-input type="text" style="width: 200px; margin-bottom:10px"  :placeholder="handleGlobalI18n('loyalty', 'input_placeholdername')" v-model="listQuery.contact_name" v-filter-special-char></el-input>
    <el-input type="text" style="width: 200px; margin-bottom:10px"  :placeholder="handleGlobalI18n('loyalty', 'input_placeholderphone')" v-model="listQuery.contact_phone" v-filter-special-char></el-input>
    <el-button type="primary" icon="el-icon-search" @click="getDatas" style="margin-bottom:10px">{{handleGlobalI18n('loyalty', 'search')}}</el-button>
    <el-button type="primary" icon="el-icon-download" style="margin-bottom:10px" @click="upDatas">下载</el-button>
    <!-- <el-button icon="el-icon-plus" style="margin-left: 0" @click="dialogFormVisible = true;edit = false;">{{handleGlobalI18n('loyalty', 'add')}}</el-button> -->
    <el-table :data="tableData" v-loading="loading" border :empty-text="$t('member.fc_table_no_data_label')">
      <el-table-column label="提交时间" align="center" prop="create_date" >
        <template slot-scope="scope">
          <template >
            {{scope.row.create_date ? (scope.row.create_date).substring(0, 10) : table_placeholder}}
          </template>
        </template>
      </el-table-column>
      <el-table-column :label="handleGlobalI18n('loyalty', 'member_code')" align="center" prop="member_code" ></el-table-column>
      <el-table-column :label="handleGlobalI18n('loyalty', 'ordername')" align="center" prop="contact_name">
      </el-table-column>
      <el-table-column :label="handleGlobalI18n('loyalty', 'ordermobile')" align="center" prop="contact_phone"></el-table-column>
      <el-table-column :label="handleGlobalI18n('loyalty', 'hopedata')" align="center" prop="expected_time" >
        <template slot-scope="scope">
          <template >
            {{scope.row.expected_time ? (scope.row.expected_time).substring(0, 10) : table_placeholder}}
          </template>
        </template>
      </el-table-column>
      <el-table-column :label="handleGlobalI18n('loyalty', 'province')" align="center" prop="store_province_name" >
      </el-table-column>
       <el-table-column :label="handleGlobalI18n('loyalty', 'city')" align="center" prop="store_city_name" >
      </el-table-column>
       <el-table-column :label="handleGlobalI18n('loyalty', 'storename')" align="center" prop="store_name" >
         <template slot-scope="scope">
          <template >
            {{scope.row.store_name ? scope.row.store_name : '请为我分配'}}
          </template>
        </template>
      </el-table-column>
       <el-table-column :label="handleGlobalI18n('loyalty', 'orderdir')" align="center" prop="address_detailed" >
      </el-table-column>
       <el-table-column label="问卷调查" align="center" prop="investigation_flag" >
         <template slot-scope="scope">
          <template >
            {{scope.row.investigation_flag ? '已评价' : '待评价'}}
          </template>
        </template>
      </el-table-column>
      <!-- <el-table-column :label="handleGlobalI18n('loyalty', 'substatus')" align="center" prop="operation_status">
        <template slot-scope="scope">
          {{(scope.row.operation_status===null||scope.row.operation_status===0)? '未审核':scope.row.operation_status===1? '通过':'未通过'}}
        </template>
      </el-table-column> -->
      <!-- <el-table-column :label="handleGlobalI18n('loyalty', 'subdate')" align="center" prop="acknowledging_time">
        <template slot-scope="scope">
          <template >
            {{scope.row.acknowledging_time ? (scope.row.acknowledging_time).substring(0, 16) : table_placeholder}}
          </template>
        </template>
      </el-table-column> -->
      <!-- <el-table-column :label="handleGlobalI18n('loyalty', 'overname')" align="center" prop="remark">
        <template slot-scope="scope">
          {{scope.row.remark? scope.row.remark:'-'}}
        </template>
      </el-table-column> -->
      <!-- <el-table-column :label="handleGlobalI18n('loyalty', 'operation')" align="center" >
        <template slot-scope="scope">
          <el-button
            icon="el-icon-edit"
            @click="handleEdit(scope.$index, scope.row)"
            >{{handleGlobalI18n('loyalty', 'edit')}}
          </el-button>
        </template>
      </el-table-column> -->
    </el-table>
    <pagination-container
      :page = "listQuery.page_no"
      :page_size = 'listQuery.page_size'
      :total = 'total'
      @handleCurrentChange = "handleCurrentChange"
      @handleSizeChange="handleSizeChange"
    ></pagination-container>
    <el-dialog :title="selectName" :visible.sync="dialogFormVisible" width="700px">
      <add-procuct :state="pgVisable" @handleAddProduct="handleAddProduct" @handleSelectProductInfo="handleSelectProductInfo"></add-procuct>
      <el-form ref="addCoupon" label-width="200px"  autoComplete="on" :rules="rules"  :model="form">
        <el-form-item :label="handleGlobalI18n('loyalty', 'ordername')"  >
          <el-input v-model="form.contact_name" maxlength="32"  class="width200" disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item label="订单号"  >
          <el-input v-model="form.id" maxlength="32"  class="width200" disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item :label="handleGlobalI18n('loyalty', 'member_code')" prop="member_code" v-show="this.edit">
          <el-input v-model="form.member_id"  class="width200" disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item :label="handleGlobalI18n('loyalty', 'ordermobile')" prop="contact_phone" v-show="this.edit">
          <el-input v-model="form.contact_phone"  class="width200" disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item :label="handleGlobalI18n('loyalty', 'hopedata')" prop="expected_time" v-show="this.edit">
          <el-input v-model="form.expected_time"  class="width200" disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item :label="handleGlobalI18n('loyalty', 'province')" prop="store_province_name" v-show="this.edit">
          <el-input v-model="form.store_province_name"  class="width200" disabled="disabled"></el-input>
        </el-form-item>
         <el-form-item :label="handleGlobalI18n('loyalty', 'city')" prop="store_city_name" v-show="this.edit">
          <el-input v-model="form.store_city_name"  class="width200" disabled="disabled"></el-input>
        </el-form-item>
         <el-form-item :label="handleGlobalI18n('loyalty', 'storename')" prop="store_name" v-show="this.edit">
          <el-input v-model="form.store_name"  class="width200" disabled="disabled"></el-input>
        </el-form-item>
         <el-form-item :label="handleGlobalI18n('loyalty', 'orderdir')" prop="address_detailed" v-show="this.edit">
          <el-input v-model="form.address_detailed"  class="width200" disabled="disabled"></el-input>
        </el-form-item>
        <!-- <el-form-item :label="handleGlobalI18n('loyalty', 'ordermobile')"   prop="coupon_type_code">
          <el-select v-model="form.coupon_type_code" class="width200">
            <el-option v-for="item in coupon_type_list" :label="item.coupon_type_name" :value="item.coupon_type_code" :key="item.coupon_type_code" ></el-option>
          </el-select>
        </el-form-item> -->
        <!-- <el-form-item :label="handleGlobalI18n('loyalty', 'dialog_cash_amount')" v-if="form.coupon_type_code === 'cash'" prop="cash_amount">
          <el-input-number v-model="form.cash_amount" :min="0" :step="1" :precision="2" class="width200"></el-input-number>
        </el-form-item> -->
        <!-- <el-form-item :label="handleGlobalI18n('loyalty', 'dialog_discount_amount')" v-if="form.coupon_type_code === 'discount'" prop="discount_amount">
          <el-input v-model="form.discount_amount" class="width200">
            <template slot="append">%</template>
          </el-input>
        </el-form-item> -->
        <!-- <el-form-item :label="handleGlobalI18n('loyalty', 'dialog_select_product')" v-if="form.coupon_type_code === 'gwp'"
                      prop="product_code"
                      ref="product_code"
                      :rules="[{ required: true, message: 'The select product length is up to 32', trigger: ['change', 'blur'] }]" >
          <el-button icon="el-icon-plus" @click="pgVisable=true">{{handleGlobalI18n('loyalty', 'add')}}</el-button>
          <el-tag
            v-for="tag in multipleSelection"
            :key="tag.product_name"
            closable
            size="medium"
            :disable-transitions="false"
            @close="handleClose(tag)">
            {{tag.product_name}}
          </el-tag>
        </el-form-item> -->
        <!-- <el-form-item :label="handleGlobalI18n('loyalty', 'dialog_effective_on')" prop="effective_type">
          <el-select v-model="form.effective_type" class="width200">
            <el-option :label="handleGlobalI18n('loyalty', 'dialog_specific_date')"  :value="parseInt(2)"></el-option>
            <el-option :label="handleGlobalI18n('loyalty', 'dialog_relative_date')" :value="parseInt(1)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="handleGlobalI18n('loyalty', 'dialog_relative_date')"  v-if="form.effective_type===1" prop="relative_value">
          <el-input :min="0" :step="1" v-model="form.relative_value" style="width: 200px">
            <template slot="append">
              <el-select v-model="form.relative_unit" style="width: 100px;">
                <el-option :label="firstWordUpperCase(handleGlobalI18n('loyalty', 'days'))" :value="parseInt(1)"></el-option>
                <el-option :label="firstWordUpperCase(handleGlobalI18n('loyalty', 'months'))" :value="parseInt(2)"></el-option>
                <el-option :label="firstWordUpperCase(handleGlobalI18n('loyalty', 'years'))" :value="parseInt(3)"></el-option>
              </el-select>
            </template>
          </el-input>
          <p style="font-size: 14px;color: #606266;line-height: 1;margin-top:10px;" v-text="handleGlobalI18n('loyalty', 'effective_tips')"></p>
        </el-form-item> -->
        <!-- <el-form-item :label="handleGlobalI18n('loyalty', 'dialog_effective_date_period')" v-if="form.effective_type===2" prop="specific_effective_date_from"
                      style="width:385px;"
                      :rules="[{ required: true, message: 'Please enter the correct value', trigger: 'change' }]">
          <eldate-picker :value="date" @valueDate="valueDate" :pickerOptions="pickerOptions0"  style="width:385px;"></eldate-picker>
        </el-form-item> -->
        <el-form-item :label="handleGlobalI18n('loyalty', 'substatus')" v-show="edit"  prop="operation_status">
          <el-select v-model="form.operation_status" class="width200">
            <el-option label='通过' :value="parseInt(1)"></el-option>
            <el-option label="未通过" :value="parseInt(2)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="handleGlobalI18n('loyalty', 'subdate')"  prop="acknowledging_time"
                      style="width:385px;">
           <el-date-picker
            v-model="form.acknowledging_time"
            type="datetime"
            :placeholder="handleGlobalI18n('loyalty', 'selectDate')"
            align="right"
            @change="changedate"
            >
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="handleGlobalI18n('loyalty', 'overname')"  prop="remark" >
          <el-input
            style="max-width: 385px;"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 6}"
            v-model="form.remark">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false; pgVisable = false">{{handleGlobalI18n('loyalty', 'cancel')}}</el-button>
        <el-button type="primary" @click="submitForm('addCoupon')" :loading="saveLoading">{{handleGlobalI18n('loyalty', 'save')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    allReservation,
    updateReservation,
    exportdateReservation
  } from '@/api/order'
  import PaginationContainer from '@/components/PaginationContainer'
  import {
    pageLimit
  } from '@/api/api'
  import {
    parseIntVal,
    handleTrim,
    mixLoading,
    pickerOptions0Mixins,
    validatePositiveInteger1Mixins,
    validateMoreThanZeroMixins,
    filterCharacter,
    handlePageNoMixins
  } from '@/utils/util'
  import EldatePicker from '@/components/EldatePicker'
  import filterSpecialChar from '@/directive/special-char'
  import { DateTime } from 'luxon'
  import { firstWordUpperCase } from '@/utils'
  export default {
    mixins: [parseIntVal, filterCharacter, handleTrim, mixLoading, pickerOptions0Mixins, validatePositiveInteger1Mixins, validateMoreThanZeroMixins, handlePageNoMixins],
    components: {
      PaginationContainer,
      // AddProcuct,
      EldatePicker
    },
    directives: {
      filterSpecialChar
    },
    data() {
      return {
        date: [],
        rulesSelect: {
          coupon_name: [
            { required: true, max: 32, message: this.handleGlobalI18n('validation', 'coupon_name_error'), trigger: 'change' }
          ]
        },
        rules: {
          cash_amount: [
            { required: true, message: this.handleGlobalI18n('validation', 'cash_amount_null'), trigger: ['change', 'blur'] },
            { validator: this.checkMoreThanZeroValue, trigger: ['blur'] }
          ],
          discount_amount: [
            { required: true, message: this.handleGlobalI18n('validation', 'discount_amount_null'), trigger: ['change', 'blur'] },
            // { validator: this.checkMoreThanZeroValue, trigger: ['blur'] },
            { validator: this.handleDiscountAmount, trigger: ['blur', 'change'] }
          ],
          relative_value: [
            { required: true, message: this.handleGlobalI18n('validation', 'relative_value_null'), trigger: ['change', 'blur'] },
            { validator: this.checkPositiveInteger, trigger: ['blur'] }
          ],
          coupon_name: [
            { required: true, max: 32, message: this.handleGlobalI18n('validation', 'coupon_name_null'), trigger: 'change' }
          ],
          coupon_type_code: [
            { required: true, message: this.handleGlobalI18n('validation', 'coupon_type_code_null'), trigger: 'change' }
          ],
          description: [
            { max: 125, message: this.handleGlobalI18n('validation', 'coupon_description_length'), trigger: 'change' }
          ],
          effective_type: [
            { required: true, message: this.handleGlobalI18n('validation', 'effective_type_null'), trigger: 'change' }
          ]
        },
        pgVisable: false,
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }]
        },
        multipleSelection: [],
        dialogFormVisible: false,
        tableData: [],
        // coupon_type_list: [{ coupon_type_name: this.handleGlobalI18n('loyalty', 'cash'), coupon_type_code: 'cash' }, { coupon_type_name: this.handleGlobalI18n('loyalty', 'discount'), coupon_type_code: 'discount' }, { coupon_type_name: this.handleGlobalI18n('loyalty', 'gwp'), coupon_type_code: 'gwp' }],
        listQuery: {
          page_no: 1,
          page_size: pageLimit,
          contact_name: '',
          contact_phone: '',
          start_date: '',
          end_date: ''
        },
        total: 0,
        form: {
          contact_name: null,
          id: null,
          contact_phone: null,
          member_code: null,
          store_province_name: null,
          // coupon_type_code: 'cash',
          operation_status: null,
          store_city_name: null,
          // effective_type: 1,
          store_name: null,
          acknowledging_time: null,
          // relative_unit: 1,
          expected_time: null,
          address_detailed: null,
          remark: ''
        },
        loading: false,
        saveLoading: false,
        edit: false,
        postfix: '',
        // acknowledging_time: '',
        headers: {},
        value: '',
        value2: []
      }
    },
    computed: {
      selectName() {
        if (!this.edit) {
          return this.handleGlobalI18n('loyalty', 'add_new_coupon')
        } else {
          return this.handleGlobalI18n('loyalty', 'edit_coupon')
        }
      }
    },
    created() {
      this.getData()
      // this.queryCouponTypeList()
    },
    methods: {
      // handleRelativeUnit(val) {
      //   var data = ['days', 'months', 'years']
      //   return this.handleGlobalI18n('loyalty', data[val - 1])
      // },
      hah(e) {
        this.value2 = e
        if (e === [] || e === undefined || e === null) {
          this.listQuery.start_date = ''
          this.listQuery.end_date = ''
        } else {
          this.listQuery.start_date = this.value2[0]
          this.listQuery.end_date = this.value2[1]
        }
        console.log(this.listQuery)
      },
      currentstatus() {
        this.listQuery.operation_status = this.value
      },
      firstWordUpperCase,
      handleDiscountAmount(rule, value, callback) {
        if (!value) {
          return callback(new Error(this.handleGlobalI18n('validation', 'compare_the_size_error')))
        }
        if (!(/^[0-9]+$/.test(value))) {
          this.form.discount_amount = null
          callback()
        }
        const val = parseInt(value)
        if (val <= 0 || val >= 100) {
          callback(new Error(this.handleGlobalI18n('validation', 'compare_the_size_error')))
        } else {
          callback()
        }
      },
      getNowFormatDate(date) {
        // var date = new Date();
        var seperator1 = '-'
        var seperator2 = ':'
        var month = date.getMonth() + 1
        var strDate = date.getDate()
        var strHours = date.getHours()
        var strMinutes = date.getMinutes()
        var strSeconds = date.getSeconds()
        if (month >= 1 && month <= 9) {
          month = '0' + month
        }
        if (strDate >= 0 && strDate <= 9) {
          strDate = '0' + strDate
        }
        if (strHours >= 0 && strHours <= 9) {
          strHours = '0' + strHours
        }
        if (strSeconds >= 0 && strSeconds <= 9) {
          strSeconds = '0' + strSeconds
        }
        if (strMinutes >= 0 && strMinutes <= 9) {
          strMinutes = '0' + strMinutes
        }
        var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate + ' ' + strHours + seperator2 + strMinutes + seperator2 + strSeconds
        return currentdate
      },
      handleSelectProductInfo(val) {
        this.$refs.product_code.clearValidate()
        this.multipleSelection[0] = val
        this.form.product_code = val.product_code
      },
      valueDate(val) {
        [this.form.specific_effective_date_from, this.form.specific_effective_date_to] = val
      },
      setDateTime() {
        const now_date = DateTime.local().toISO()
        const now_date_length = now_date.length
        this.postfix = now_date.substring(now_date_length - 6, now_date_length)
      },
      changedate(e) {
        console.log(e)
        this.form.acknowledging_time = this.getNowFormatDate(e)
        // this.form.acknowledging_time = e
      },
      handleAddProduct(state) {
        this.pgVisable = state
      },
      getData() {
        this.getCouponList()
      },
      getDatas() {
        this.listQuery.page_no = 1
        this.getCouponList()
      },
      upDatas() {
        this.exportCouponList()
      },
      exportCouponList() {
        this.loading = true
        exportdateReservation(this.listQuery).then(res => {
          const elink = document.createElement('a')
          elink.style.display = 'none'
          elink.href = res.return_result.url
          document.body.appendChild(elink)
          elink.click()
          URL.revokeObjectURL(elink.href) // 释放URL 对象
          document.body.removeChild(elink)
          this.loading = false
        }).catch(res => {
          console.log(res)
          this.loading = false
        })
      },
      // checkCouponCode(rule, value, callback) {
      //   checkCouponCode(this.form.coupon_code).then(res => {
      //     callback()
      //   }).catch(res => {
      //     callback(new Error(res.return_message))
      //   })
      // },
      handleCurrentChange(val) {
        this.listQuery.page_no = val
        this.getData()
      },
      handleSizeChange(val) {
        this.listQuery.page_size = val
        this.getData()
      },
      // queryCouponTypeList() {
      //   queryCouponTypeList({ page_no: 1, page_size: 100 }).then(res => {
      //     this.coupon_type_list = res.return_result.coupon_types
      //   }).catch(res => {
      //     console.log(res.return_message)
      //   })
      // },
      getCouponList() {
        this.loading = true
        allReservation(this.listQuery).then(res => {
          console.log(res)
          this.total = res.return_result.total_count
          this.tableData = res.return_result.reservations
          this.loading = false
        }).catch(res => {
          this.loading = false
        })
      },
      submitForm(formName) {
        console.log(this.form, '8888')
        const formdata = {}
        formdata['id'] = this.form.id
        formdata['operation_status'] = this.form.operation_status
        formdata['remark'] = this.form.remark
        formdata['acknowledging_time'] = this.form.acknowledging_time
        if (this.form.operation_status === null || this.form.operation_status === 0) {
          this.$notify({
            title: '警告',
            message: '请选择处理状态',
            type: 'warning'
          })
          return false
        } else {
          if (this.form.acknowledging_time === null || this.form.acknowledging_time === '') {
            console.log(this.form)
            this.$notify({
              title: '警告',
              message: '请选择确认时间',
              type: 'warning'
            })
            return false
          } else {
            // console.log(formdata, '888')
            this.Loading = true
            // this.headers['signature'] = md5(`${guid}&${tstamp}&` + `${JSON.stringify({ 'bu_content': formdata })}&`)
            // updateReservation().then
            updateReservation(formdata).then(res => {
              console.log(res)
              // this.total = res.data.result.total_count
              // this.tableData = res.data.result.reservations
              this.loading = false
              this.dialogFormVisible = false
              this.$notify({
                title: this.handleGlobalI18n('loyalty', 'success'),
                message: res.return_message,
                type: 'success'
              })
              // this.headers['signature'] = md5(`${guid}&${tstamp}&` + `${JSON.stringify({"bu_content":this.listQuery})}&`)
              this.getCouponList()
            }).catch(res => {
              this.loading = false
            })
          }
        }
        // this.$refs[formName].validate((valid) => {
        //   this.saveLoading = true
        //   if (valid) {
        //     this.setDateTime()
        //     if (this.form.coupon_type_code === 'cash') {
        //       this.form.amount = this.form.cash_amount
        //     }
        //     if (this.form.coupon_type_code === 'discount') {
        //       this.form.amount = this.form.discount_amount / 100
        //     }
        //     addOrUpdateCoupon({ ...this.form, discount_amount: this.form.discount_amount / 100, specific_effective_date_from: this.form.specific_effective_date_from ? `${(this.form.specific_effective_date_from).substring(0, 10)}T00:00:00.000${this.postfix}` : null, specific_effective_date_to: this.form.specific_effective_date_to ? `${(this.form.specific_effective_date_to).substring(0, 10)}T23:59:59.999${this.postfix}` : null }).then(res => {
        //       this.saveLoading = false
        //       this.dialogFormVisible = false
        //       this.$notify({
        //         title: this.handleGlobalI18n('loyalty', 'success'),
        //         message: res.return_message,
        //         type: 'success'
        //       })
        //       this.listQuery = {
        //         page_no: 1,
        //         page_size: pageLimit,
        //         coupon_name: ''
        //       }
        //       this.getCouponList()
        //     }).catch(res => {
        //       this.saveLoading = false
        //     })
        //   } else {
        //     this.saveLoading = false
        //     return false
        //   }
        // })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields()
      },
      handleClose(tag) {
        // console.log(typeof tag, typeof this.multipleSelection)
        // console.log(tag, this.multipleSelection)
        this.multipleSelection.splice(this.multipleSelection.indexOf(tag))
        this.form.product_code = ''
      },
      check(index) {
        return index % 2 === 0
      },
      handleEdit(index, row) {
        // this.resetForm('addCoupon')
        // console.log(row)
        this.multipleSelection = []
        // if (row.product_code !== undefined && row.product_code !== null && row.product_name !== undefined && row.product_name !== null) {
        //   this.multipleSelection[0] = { product_code: row.product_code, product_name: row.product_name }
        // }
        this.dialogFormVisible = true
        // this.form = Object.assign(JSON.parse(JSON.stringify(row)), { cash_amount: 0, discount_amount: 0 })
        this.form = Object.assign(JSON.parse(JSON.stringify(row)))
        if (this.form.operation_status === 0) {
          this.form.cash_amount = null
        }
        // if (this.form.coupon_type_code === 'discount') {
        //   this.form.discount_amount = this.form.amount * 100 || 0
        // }
        // this.$nextTick(() => {
        //   this.$set(this.date, 0, row.specific_effective_date_from ? (row.specific_effective_date_from).substring(0, 10) : null)
        //   this.$set(this.date, 1, row.specific_effective_date_to ? (row.specific_effective_date_to).substring(0, 10) : null)
        // })
        this.edit = true
      },
      handleDelete(index, row) {
        console.log(index, row)
      }
      // toAddProduct() {
      //   this.$router.push({
      //     path: '/fcbo/loyalty/add-product'
      //   })
      // }
    },
    watch: {
      edit() {
        if (!this.edit) {
          this.multipleSelection = []
          this.$refs['addCoupon'].resetFields()
          this.form = {
            discount_amount: 0,
            cash_amount: 0,
            coupon_name: '',
            coupon_code: '',
            coupon_type_code: '',
            active_flag: 1,
            amount: 0,
            product_code: '',
            effective_type: 1,
            relative_value: '',
            relative_unit: 1,
            specific_effective_date_from: null,
            specific_effective_date_to: null,
            description: ''
          }
          this.$refs['addCoupon'].resetFields()
        }
      },
      'form.coupon_type_code': {
        handler(val) {
          // this.$refs.addCoupon.clearValidate(['product_code', 'cash_amount', 'discount_amount'])
        }
      },
      'form.cash_amount': {
        handler(val) {
          if (this.form.cash_amount === '' || this.form.cash_amount === undefined || this.form.cash_amount <= 0) {
            this.$nextTick(() => {
              this.form.cash_amount = 0
            })
            return true
          }
        }
      },
      'form.discount_amount': {
        handler(val) {
          if (this.form.discount_amount === '' || this.form.discount_amount === undefined || this.form.discount_amount <= 0) {
            this.$nextTick(() => {
              this.form.discount_amount = 0
            })
            return true
          }
        }
      },
      'form.operation_status': {
        handler(val) {
          if (this.form.operation_status === '' || this.form.operation_status === undefined || this.form.operation_status <= 0) {
            this.$nextTick(() => {
              this.form.operation_status = null
            })
            return true
          }
        }
      }
    }
  }
</script>

<style scoped rel="stylesheet/scss" lang="scss">
  .el-form-item {
    margin-bottom: 20px;
  }
  .width200{
    width: 200px;
  }
  .pagination-container {
    text-align: right;
    padding: 15px 0;
    background-color: #ffffff;
  }
  .coupon {
    margin: 25px;
    .gwp{
      text-align: left;
      label{
        border:1px solid #666666;
        padding:2px 20px;
        border-radius: 5px;
      }
      div{
        &:not(:first-child){
          margin-top:10px;
        }
      }
    }
  }

</style>
