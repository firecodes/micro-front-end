<template>
  <div class="coupon">
    <!-- <el-input type="text" style="width: 360px; margin-bottom:10px"  :placeholder="handleGlobalI18n('loyalty', 'input_placeholder')" v-model="listQuery.coupon_name" v-filter-special-char></el-input> -->
    <el-select v-model="value" class="width200" @change="currentstatus">
      <el-option label='未审核' :value="parseInt(0)"></el-option>
      <el-option label='通过' :value="parseInt(1)"></el-option>
      <el-option label="未通过" :value="parseInt(2)"></el-option>
      <el-option label='全部' value=""></el-option>
    </el-select>
    <el-date-picker
      v-model="value2"
      type="daterange"
      align="right"
      unlink-panels
      range-separator="至"
      start-placeholder="审核开始日期"
      end-placeholder="审核结束日期"
      size='small'
      value-format = 'yyyy-MM-dd'
      style="width: 300px; margin-bottom:10px"
      @change='hah'
      :picker-options="pickerOptions">
    </el-date-picker>
    <el-button type="primary" icon="el-icon-search" style="margin-bottom:10px" @click="getDatas">{{handleGlobalI18n('loyalty', 'search')}}</el-button>
    <el-button type="primary" icon="el-icon-download" style="margin-bottom:10px" @click="upDatas">下载</el-button>
    <!-- <el-button icon="el-icon-plus" style="margin-left: 0" @click="dialogFormVisible = true;edit = false;">{{handleGlobalI18n('loyalty', 'add')}}</el-button> -->
    <el-table :data="tableData" v-loading="loading" border :empty-text="$t('member.fc_table_no_data_label')" :row-style = "rowstyle">
      <!-- <el-table-column :label="handleGlobalI18n('loyalty', 'member_code')" align="center" prop="coupon_code"  type="selection"></el-table-column> -->
      <el-table-column :label="handleGlobalI18n('loyalty', 'member_code')" align="center" prop="member_code"  >
        <template slot-scope="scope">
          <div style="cursor:pointer;color:#0099ff" @click="toMemberDetails(scope.row.member_code)">
            {{ scope.row.member_code }}
          </div>
        </template>
      </el-table-column>
      <el-table-column :label="handleGlobalI18n('loyalty', 'member_name')" align="center" prop="member_name"  ></el-table-column>
      <el-table-column :label="handleGlobalI18n('system', 'mobile')" align="center" prop="mobile"  ></el-table-column>
      <el-table-column :label="handleGlobalI18n('loyalty', 'createdate')" align="center" prop="purchase_date"  >
        <template slot-scope="scope">
          <template >
            {{scope.row.purchase_date ? (scope.row.purchase_date).substring(0, 10) : table_placeholder}}
          </template>
        </template>
      </el-table-column>
      <el-table-column :label="handleGlobalI18n('loyalty', 'bugstore')" align="center" prop="store_name">
      </el-table-column>
      <el-table-column :label="handleGlobalI18n('loyalty', 'bugdate')" align="center" prop="transaction_date">
        <template slot-scope="scope">
          <template >
            {{scope.row.transaction_date ? (scope.row.transaction_date).substring(0, 10) : table_placeholder}}
          </template>
        </template>
      </el-table-column>
      <el-table-column :label="handleGlobalI18n('loyalty', 'bugshop')" align="center" prop="order_upload_details" >
        <template slot-scope="scope" >
          <el-popover trigger="hover" placement="top" >
            <div v-for="(item,index) in scope.row.order_upload_details" :key="index" >
              <p style="max-width:400px;">商品名: {{ item.product_name}}</p>
              <p style="max-width:400px;"> 尺寸: {{ item.product_spec_name}}</p>
              <p style="max-width:400px;"> 个数: {{ item.quantity+ '个' }}</p>
            </div>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium" class="alitag">商品明细</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column :label="handleGlobalI18n('loyalty', 'paymoney')" align="center" prop="total_amount" >
        <!-- <template slot-scope="scope">
          <template v-if="scope.row.effective_type === 2">
            {{scope.row.specific_effective_date_to ? globalData.formatDate((scope.row.specific_effective_date_to).substring(0, 10)) : table_placeholder}}
          </template>
          <template v-else>
            {{`${(handleGlobalI18n('member', 'issue_date')).toLowerCase()} + ${scope.row.relative_value}`}} {{handleRelativeUnit(scope.row.relative_unit)}}
          </template>
        </template> -->
      </el-table-column>
      <el-table-column :label="handleGlobalI18n('loyalty', 'ticketphoto')" align="center" prop="invoice_image_urls">
        <template slot-scope="scope">

          <el-popover
            placement="right"
            width="400"
            trigger="click">
            <div style="display:flex;flex-wrap:wrap">
              <div v-for="(item,index) in scope.row.invoice_image_urls" :key="index">
                <el-image
                  style="width: 100px; height: 100px;margin-right:30px;"
                  :src="item"
                  :preview-src-list="scope.row.invoice_image_urls">
                </el-image>
              </div>
            </div>
            <el-button slot="reference" >缩略图</el-button>
          </el-popover>

        </template>
      </el-table-column>
      <el-table-column :label="handleGlobalI18n('loyalty', 'auditstatus')" align="center" prop="approved_status">
        <template slot-scope="scope">
          {{scope.row.approved_status===0? '未审核': '已审核'}}
        </template>
      </el-table-column>
      <el-table-column label="审核时间" align="center" prop="approved_date"  >
        <template slot-scope="scope">
          <template >
            {{scope.row.approved_date ? (scope.row.approved_date).substring(0, 10) : table_placeholder}}
          </template>
        </template>
      </el-table-column>
      <el-table-column :label="handleGlobalI18n('loyalty', 'abnormal')" align="center" prop="approved_status">
        <template slot-scope="scope">
          {{scope.row.approved_status===1? '已通过': scope.row.approved_status===2? '未通过':'-'}}
        </template>
      </el-table-column>
      <el-table-column :label="handleGlobalI18n('loyalty', 'tips')" align="center" prop="approved_remark">
        <template slot-scope="scope">
          <div >
            {{(scope.row.approved_remark===null||scope.row.approved_remark==='')? '-': scope.row.approved_remark}}
          </div>
        </template>
      </el-table-column>
      <el-table-column :label="handleGlobalI18n('loyalty', 'operation')" align="center" width='200'>
        <template slot-scope="scope">
          <!-- <el-button
            icon="el-icon-edit"
            @click="handleEdit(scope.$index, scope.row)">{{handleGlobalI18n('loyalty', 'edit')}}
          </el-button> -->
          <div v-if="scope.row.approved_status===1||scope.row.approved_status===2">
            <el-button type="success" plain @click="handleEdit(scope.$index, scope.row)"   :disabled="true" :class="scope.row.approved_status===1?'active':'isactive'">通过</el-button>
            <!-- <el-button type="success" plain @click="handleEdit(scope.$index, scope.row)" >通过</el-button> -->
            <el-button type="info" plain :disabled="true" :class="scope.row.approved_status===2?'active':'isactive'">不通过</el-button>
          </div>
          <div v-else>
            <el-button type="success" plain @click="handleEdit(scope.$index, scope.row,'active')" >通过</el-button>
            <!-- <el-button type="success" plain @click="handleEdit(scope.$index, scope.row)" >通过</el-button> -->
            <el-button type="info" plain @click="handleEdit(scope.$index, scope.row,'isactive')">不通过</el-button>
          </div>
          <!-- <el-button type="info" plain >不通过</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <pagination-container
      :page = "listQuery.page_no"
      :page_size = 'listQuery.page_size'
      :total = 'total'
      @handleCurrentChange = "handleCurrentChange"
      @handleSizeChange="handleSizeChange"
    ></pagination-container>
  </div>
</template>

<script>
  import {
    allOrderInfo,
    approveOrderInfo,
    exportallOrderInfo
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
          approved_status: '',
          approval_start_date: '',
          approval_end_date: ''
        },
        total: 0,
        form: {
          discount_amount: null,
          cash_amount: null,
          coupon_name: null,
          coupon_code: null,
          coupon_type_code: 'cash',
          active_flag: 1,
          product_code: null,
          effective_type: 1,
          relative_value: null,
          relative_unit: 1,
          specific_effective_date_from: null,
          specific_effective_date_to: null,
          description: ''
        },
        loading: false,
        saveLoading: false,
        edit: false,
        postfix: '',
        headers: {},
        value: '',
        value2: ''
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
      // console.log(axios)
      // this.queryCouponTypeList()
    },
    methods: {
      rowstyle({ row, rowindex }) {
        if (row.mark_flag === 1) {
          return 'color:red'
        } else {
          return ''
        }
      },
      hah(e) {
        this.value2 = e
        if (e === [] || e === undefined || e === null) {
          this.listQuery.approval_start_date = ''
          this.listQuery.approval_end_date = ''
        } else {
          this.listQuery.approval_start_date = this.value2[0]
          this.listQuery.approval_end_date = this.value2[1]
        }
        console.log(this.listQuery)
      },
      toMemberDetails(id) {
        this.$router.push({
          path: `/member/member-view/member-details/${id}`
        })
      },
      currentstatus() {
        this.listQuery.approved_status = this.value
      },
      handleRelativeUnit(val) {
        var data = ['days', 'months', 'years']
        return this.handleGlobalI18n('loyalty', data[val - 1])
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
        exportallOrderInfo(this.listQuery).then(res => {
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
      handleCurrentChange(val) {
        this.listQuery.page_no = val
        this.getData()
      },
      handleSizeChange(val) {
        this.listQuery.page_size = val
        this.getData()
      },
      getCouponList() {
        // this.headers['signature'] = md5(`${guid}&${tstamp}&` + `${JSON.stringify({ 'bu_content': this.listQuery })}&`)
        this.loading = true
        allOrderInfo(this.listQuery).then(res => {
          console.log(res)
          this.total = res.return_result.total_count
          this.tableData = res.return_result.results
          this.loading = false
        }).catch(res => {
          this.loading = false
        })
      },
      handleClose(tag) {
        // console.log(typeof tag, typeof this.multipleSelection)
        // console.log(tag, this.multipleSelection)
        this.multipleSelection.splice(this.multipleSelection.indexOf(tag))
        this.form.product_code = ''
      },
      // check(index) {
      //   return index % 2 === 0
      // },
      handleEdit(index, row, active) {
        console.log(row)
        const subOrder = {}
        subOrder['mobile'] = row.mobile
        if (active === 'active') {
          subOrder['approved_remark'] = ''
          subOrder['approved_status'] = 1
          subOrder['invoice_code'] = row.invoice_no
          this.loading = true
          approveOrderInfo(subOrder).then(res => {
            console.log(res)
            this.getCouponList()
            this.loading = false
          }).catch(res => {
            this.loading = false
          })
        } else {
          this.$prompt('请输入备注信息', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputValue: row.approved_remark
          }).then(({ value }) => {
            if (value === '' || value == null) {
              this.$message({
                type: 'info',
                message: '请输入备注信息'
              })
            } else {
              subOrder['approved_remark'] = value
              subOrder['approved_status'] = 2
              subOrder['invoice_code'] = row.invoice_no
              // this.headers['signature'] = md5(`${guid}&${tstamp}&` + `${JSON.stringify({ 'bu_content': subOrder })}&`)
              this.loading = true
              approveOrderInfo(subOrder).then(res => {
                this.$message({
                  type: 'success',
                  message: '提交成功'
                })
                console.log(res)
                this.getCouponList()
                this.loading = false
              }).catch(res => {
                this.loading = false
              })
            }
          }).catch(() => {

          })
        }
        // this.headers['signature'] = md5(`${guid}&${tstamp}&` + `${JSON.stringify({ 'bu_content': subOrder })}&`)
      },
      open(index, row) {
        const subOrder = {}
        if (row.approved_status === 0) {
          this.$message({
            type: 'info',
            message: '请先审核'
          })
        } else {
          this.$prompt('请输入备注信息', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputValue: row.approved_remark
          }).then(({ value }) => {
            subOrder['approved_remark'] = value
            subOrder['approved_status'] = row.approved_status
            subOrder['invoice_code'] = row.invoice_no
            // this.headers['signature'] = md5(`${guid}&${tstamp}&` + `${JSON.stringify({ 'bu_content': subOrder })}&`)
            this.loading = true
            approveOrderInfo(subOrder).then(res => {
              this.$message({
                type: 'success',
                message: '提交成功'
              })
              console.log(res)
              this.getCouponList()
              this.loading = false
            }).catch(res => {
              this.loading = false
            })
          }).catch(() => {

          })
        }
      }
      // handleDelete(index, row) {
      //   console.log(index, row)
      // },
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
      'form.relative_value': {
        handler(val) {
          if (this.form.relative_value === '' || this.form.relative_value === undefined || this.form.relative_value <= 0) {
            this.$nextTick(() => {
              this.form.relative_value = 0
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
  .alitag.el-tag{
    background: #fff;
    border:none;

  }
  .el-button--success.is-plain.active, .el-button--success.is-plain.active:hover, .el-button--success.is-plain.active:focus, .el-button--success.is-plain.active:active{
    background-color: #67C23A;
    color: #fff;
  }
  .el-button--info.is-plain.active, .el-button--info.is-plain.active:hover, .el-button--info.is-plain.active:focus, .el-button--info.is-plain.active:active{
    color: #FFFFFF;
    background-color: #909399;
    border-color: #909399;
  }
  .alipop{
    border: solid 2px #ccc;
    border-radius: 8px
  }

</style>
