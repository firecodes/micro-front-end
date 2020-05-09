 <template>
  <div class="bhg-redeem">
    <back-button />
    <div class="detail">
      <div style="margin: 24px 26px 46px 57px;">
        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <div class="left">
            <div class="total">
              <div class="voucher-total">
                <p>Voucher total</p>
                <el-input v-model="voucher_total" disabled />
              </div>
              <div class="points-redeem">
                <p>Points redeem</p>
                <el-input v-model="point_redeem" disabled />
              </div>
            </div>
            <div class="ticket-calc">
              <div class="t-10 flex">
                <div class="image">
                  <svg-icon icon-class="ticket" />
                  <span>$10</span>
                </div>
                <div class="way">
                  <svg-icon class-name='error' icon-class="error"/>
                </div>
                <el-input-number :min="0" :precision="0" :step="1" :max="28" v-model="count_10" />
                <label>=</label>
                <el-input v-model="num_10" disabled />
              </div>
              <div class="t-15 flex">
                <div class="image">
                  <svg-icon icon-class="ticket" />
                  <span>$15</span>
                </div>
                <div class="way">
                  <svg-icon class-name='error' icon-class="error"/>
                </div>
                <el-input-number :min="0" :precision="0" :step="1" :max="18" v-model="count_15" />
                <label>=</label>
                <el-input v-model="num_15" disabled />
              </div>
            </div>
            <div class="button">
              <el-button type="primary" @click="redeem">Redeem</el-button>
              <el-button @click="cancel">Cancel</el-button>
            </div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <div class="right">
            <p class="voucher-p">Voucher</p>
              <div class="voucher-number">
                <label>Voucher number:</label>
                <el-form :model="voucher" ref="voucher" label-width="0px" style="width: 100%">
                  <el-form-item prop="voucher_number" :rules="[
              { required: true, message: handleGlobalI18n('validation', 'is_null'), trigger: 'trigger'},
              { validator: validateVoucherNumber, trigger: 'trigger' }
            ]">
                    <el-input v-model="voucher.voucher_number" max="13" min="13" />
                    <el-button type="primary" @click="addVoucher" :disabled="voucher.voucher_number === ''" :loading="add_voucher_loading">Add voucher</el-button>
                  </el-form-item>
                </el-form>
              </div>
            <p class="voucher-list-p">Voucher list:</p>
            <div style="height: 300px;">
              <el-scrollbar style="height:100%; width: 100%">
                <el-table
              :data="tableData"
              style="width: 100%">
              <el-table-column min-width="90" align="center" type="index" :index="calcIndex" label="#"></el-table-column>
              <el-table-column
                prop="coupon_serial_no"
                label="Voucher number">
              </el-table-column>
              <el-table-column
                prop="Operation"
                label="Operation">
                <template slot-scope="scope">
                  <el-button @click="deleteVoucherList(scope.row)">Delete</el-button>
                </template>
              </el-table-column>
            </el-table>
              </el-scrollbar>
            </div>
            <div class="stat">
              <ul>
                <li>
                  <label>$10 :</label>
                  <span>{{total_10}}</span>
                </li>
                <li>
                  <label>Invalid :</label>
                  <span>0</span>
                </li>
                <li>
                  <label>$15 :</label>
                  <span>{{total_15}}</span>
                </li>
                <li>
                  <label>Total :</label>
                  <span>{{total_15 + total_10}}</span>
                </li>
              </ul>
            </div>
          </div>
        </el-col>
      </div>
    </div>
    <el-dialog
      class="dialog-bhg"
      title="Supervisor login"
      :visible.sync="dialog"
      width="450px">
      <el-form label-width="145px" :model="form" ref="dialog">
        <el-form-item label="Login name: " prop="login_name" :rules="[{ required: true, message: handleGlobalI18n('validation', 'is_null'), trigger: ['change', 'trigger'] }]">
          <el-input v-model="form.login_name" />
        </el-form-item>
        <el-form-item label="Password: " prop="password" :rules="[{ required: true, message: handleGlobalI18n('validation', 'is_null'), trigger: ['change', 'trigger'] }]">
          <el-input type="password" v-model="form.password" />
        </el-form-item>
        <el-form-item label="">
          <el-button style="min-width: 80px;" type="primary" @click="handleLogin" :loading="login_loading">Login</el-button>
        </el-form-item>
        <p v-if="login_state" style="text-align: center">Login name or Password are not correct</p>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
  import { checkMemberCouponCode } from '@/api/loyalty'
  import BackButton from '@/components/BackButton'
  import { memberRedeemOrderByTotalPointAndCouponCodes } from '@/api/redemption'
  import { DateTime } from 'luxon'
  import { calcOptimalPoint, calcAmount } from './calc'
  export default{
    components: {
      BackButton
    },
    data() {
      return {
        redemption_event_code: 'REDEEM-BHG-1015CPN',
        coupon_code_10: 'BHG10CPN',
        coupon_code_15: 'BHG15CPN',
        member_code: '',
        login_loading: false,
        login_state: false,
        dialog: false,
        form: {
          login_name: '',
          password: ''
        },
        voucher: {
          voucher_number: ''
        },
        add_voucher_loading: false,
        count_10: 0,
        count_15: 0,
        num_10: 0,
        num_15: 0,
        total_10: 0,
        total_15: 0,
        voucher_total: 0,
        point_redeem: 0,
        tableData: [],
        tableData_10: [],
        tableData_15: [],
        account_code: '',
        account_type_code: ''
      }
    },
    created() {
      // 获取传递的参数
      var query = this.$route.query
      this.member_code = query.member_code
      this.account_code = query.account_code
      this.account_type_code = query.account_type_code
      this.point_redeem = query.point_redeem
      if (this.point_redeem) {
        this.calcPoint()
      }
    },
    watch: {
      count_10() {
        this.num_10 = this.count_10 * 10
      },
      count_15() {
        this.num_15 = this.count_15 * 15
      }
    },
    methods: {
      calcOptimalPoint,
      calcAmount,
      calcIndex(index) {
        return index + 1
      },
      redeem() {
        if (this.total_10 !== this.count_10 || this.total_15 !== this.count_15 || this.num_10 + this.num_15 !== this.voucher_total) {
          this.$message.error("The number of voucher doesn't match")
          return false
        }
        this.dialog = true
      },
      handleLogin() {
        this.$refs['dialog'].validate((valid) => {
          if (valid) {
            this.login_loading = true
            this.login_state = false
            var tenant_info = JSON.parse(window.localStorage.tenantInfo)
            var company_code = tenant_info.code
            if (!company_code) {
              this.login_loading = false
              this.login_state = true
              return true
            }
            this.$store.dispatch('Login', { user_name: this.form.login_name, company_code: company_code, password: this.form.password }).then((response) => {
              // 提示登录成功  调用兑换接口
              this.handleRedeem(response)
            }).catch(() => {
              this.login_loading = false
              this.login_state = true
            })
          }
        })
      },
      handleRedeem(token = '') {
        var obj = {
          redemption_event_code: this.redemption_event_code,
          member_code: this.member_code,
          channel_code: '',
          order_time: DateTime.local().toISO(),
          redeemed_account_detail: {
            account_code: this.account_code,
            account_type_code: this.account_type_code,
            redeemed_points: this.point_redeem
          },
          order_detail: this.tableData,
          supervisor: token
        }
        memberRedeemOrderByTotalPointAndCouponCodes(obj).then(res => {
          this.login_loading = false
          this.$message({
            message: 'Success',
            type: 'success'
          })
          // 兑换成功
          this.$router.go(-1)
        }).catch((res) => {
          this.login_loading = false
          this.$message.error('redeem fail')
        })
      },
      cancel() {
        this.$router.go(-1)
      },
      validateVoucherNumber(rule, value, callback) {
        if (!value) {
          callback(new Error(this.handleGlobalI18n('validation', 'is_null')))
          return false
        }
        // 长度限制 13位
        if (value.length !== 13) {
          callback(new Error('Physical voucher number is 13 digits'))
          return false
        }
        // 查询输入的值是否已经存在
        this.tableData.forEach((item) => {
          if (item.coupon_serial_no === this.voucher.voucher_number) {
            callback(new Error('Duplicate voucher number'))
            return false
          }
        })
        // 验证coupon code 格式是否正确
        var a = this.checkCouponCodeFormat(value)
        if (a !== '10' && a !== '15') {
          callback(new Error('The voucher number is incorrect'))
          return false
        }
        this.add_voucher_loading = true
        // 查询coupon code 是否正确
        checkMemberCouponCode({ coupon_code: this.voucher.voucher_number }).then(res => {
          callback()
          this.add_voucher_loading = false
        }).catch(res => {
          this.add_voucher_loading = false
          callback(new Error('Voucher number has been used.'))
          return false
        })
      },
      // 验证coupon code 格式是否正确
      checkCouponCodeFormat(src) {
        var lth = src.substr(-3, 2)
        return lth
      },
      deleteVoucherList(tag) {
        var a = this.checkCouponCodeFormat(tag.coupon_serial_no)
        if (a === '15') {
          this.total_15--
          this.tableData_15.splice(this.tableData_15.indexOf(tag), 1)
        } else if (a === '10') {
          this.total_10--
          this.tableData_10.splice(this.tableData_10.indexOf(tag), 1)
        }
        this.tableData.splice(this.tableData.indexOf(tag), 1)
      },
      calcPoint() {
        this.voucher_total = this.calcAmount(this.calcOptimalPoint(this.point_redeem, this.point_redeem))
        // 计算最优券方案
        this.count_10 = 0
        this.count_15 = 0
        if (this.voucher_total % 10 === 0) {
          this.count_10 = parseInt(this.voucher_total / 10)
        } else {
          this.count_10 = parseInt(this.voucher_total / 10) - 1
          this.count_15 = 1
        }
      },
      addVoucher() {
        this.$refs['voucher'].validate((valid) => {
          if (valid) {
            var coupon_code = ''
            var a = this.checkCouponCodeFormat(this.voucher.voucher_number)
            if (a === '10') {
              ++this.total_10
              coupon_code = this.coupon_code_10
              this.tableData_10.push({
                coupon_code: coupon_code,
                coupon_serial_no: this.voucher.voucher_number
              })
            }
            if (a === '15') {
              ++this.total_15
              coupon_code = this.coupon_code_15
              this.tableData_15.push({
                coupon_code: coupon_code,
                coupon_serial_no: this.voucher.voucher_number
              })
            }
            this.tableData.push({
              coupon_code: coupon_code,
              coupon_serial_no: this.voucher.voucher_number
            })
            this.voucher.voucher_number = ''
          }
        })
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .bhg-redeem{
    margin: 20px;
    .detail{
      display: inline-block;
      margin-top: 16px;
      width: 100%;
      line-height: 20px;
      border-radius: 2px;
      background-color: rgba(255, 255, 255, 1);
      text-align: center;
      border: 1px solid rgba(255, 255, 255, 0);
    }
    .left{
      text-align: right;
      border-right: 1px solid #bbbbbb;
      .total{
        width: 100%;
        height: 150px;
        line-height: 50px;
        border-radius: 4px;
        background-color: rgba(245, 247, 250, 1);
        border: 1px solid rgba(255, 255, 255, 0);
        p{
          line-height: 41px;
          color: rgba(68, 68, 68, 1);
          font-size: 28px;
          min-width: 200px;
        }

        .voucher-total, .points-redeem{
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .voucher-total{
          margin-top: 25px;
        }
      }
      .el-input{
        width: percentage(155/690);
        padding-right: percentage(37/690);
      }
      .ticket-calc{
        .image{
          svg{
            font-size: 126px;
          }
          position: absolute;
          left: 0;
          margin-right: percentage(102/690);
          span{
            position: absolute;
            top: 50%;
            left: 42%;
            line-height: 52px;
            font-size: 36px;
            color: $primary;
            font-weight: bold;
            transform: translate(-50%, -50%);
          }
        }
        label{
          margin: 0 percentage(40/690);
          font-size: 35px;
          color: #666666;
          font-weight: bold;
        }
        .t-10{
          margin: 17px 0 -6px 0;
        }
        .flex{
          height: 126px;
          position: relative;
          display: flex;
          justify-content: flex-end;
          align-items: center;
        }
        .way{
          position: absolute;
          left: 30%;
          .svg-icon{
            color: #666666;
            font-size: 30px;
            font-weight: bold;
          }
        }
      }
      .button{
        margin-right:37px;
        margin-top: 46px;
        padding-bottom: 49px;
        .el-button{
          font-size: 20px;
          height:40px;
          width: 120px;
        }
      }
    }
    .right{
      margin-left: 27px;
      .voucher-p{
        line-height: 41px;
        color: rgba(68, 68, 68, 1);
        font-size: 28px;
        text-align: left;
      }
      .voucher-number{
        margin-top: 19px;
        display: flex;
        height: 45px;
        justify-content: space-between;
        align-items: end;
        margin-bottom: 25px;
        width: 100%;
        .el-button{
          width: 160px;
          height: 40px;
          font-size: 18px;
        }
        label{
          text-align: left;
          min-width: 190px;
          line-height: 35px;
          color: rgba(68, 68, 68, 1);
          font-size: 24px;
        }
        .el-input{
          margin: 0 25px 0 8px;
        }
      }
      .voucher-list-p{
        line-height: 35px;
        color: rgba(68, 68, 68, 1);
        font-size: 24px;
        text-align: left;
        margin-bottom: 14px;
      }
      .stat{
        margin-top: 27px;
        margin-bottom: 30px;
        ul{
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          li{
            text-align: left;
            flex: 0 0 50%;
            display: flex;
            &:nth-child(2n) {
              label{
                min-width: 100px;
                text-align: right;
              }
            }
          }
          label{
            line-height: 29px;
            color: rgba(68, 68, 68, 1);
            font-size: 20px;
            text-align: left;
          }
          span{
            line-height: 29px;
            color: rgba(229, 28, 35, 1);
            font-size: 20px;
            text-align: left;
            margin-left: 26px;
          }
        }
      }
    }
  }
</style>
<style rel="stylesheet/scss" lang="scss">
  $height: 40px;
  .bhg-redeem{
    .el-input{
      font-size: 18px!important;
    }
    input{
      height: $height!important;
      line-height: $height!important;
    }
    .el-input-number__decrease, .el-input-number__increase{
      width: 38px!important;
      height: 38px!important;
      line-height: 38px!important;
    }
    .voucher-number{
      .el-form-item__content{
        display: flex;
      }
    }
  }
  .dialog-bhg{
    .el-input{
      font-size: inherit!important;
    }
    input{
      height: 30px!important;
      line-height: 30px!important;
    }
  }
</style>
