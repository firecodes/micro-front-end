<template>
  <div class="operate-guide new-theme-css" v-loading="loading">
    <div class="click-button">
      <p class="top-p-left"></p>
      <div>
        <el-button @click="goCouponList()" class="cancel">{{$t('loyalty.fc_operation_btn_back_label')}}</el-button>
      </div>
    </div>
    <!--info-->
    <div class="contain detail-contain">
      <ed-header-title :title="handleGlobalI18n('loyalty', 'coupon_guide')" />
      <div class="info">
        <ol class="serial">
          <li>
            <p>Set Basic information</p>
            <p>Input fields’ value of a coupon in “Add” page then ensure the success of verifications.</p>
            <div><img src="../../../assets/images/coupon/guidance/step1.png"/></div>
          </li>
          <li>
            <p>Configure coupon view</p>
            <p>Click the “configure” button in “Add” page, then pop up a “Confirm” box.</p>
            <div><img src="../../../assets/images/coupon/guidance/step2.png"/></div>
          </li>
          <li>
            <p>Copy coupon code</p>
            <p>Click the “copy” button in “Confirm” box, then it will copy this code in browser.</p>
            <div><img src="../../../assets/images/coupon/guidance/step3.png"/></div>
          </li>
          <li>
            <p>Load coupon view configuration center</p>
            <p>Click the “Confirm” button in “Confirm” box, then the current window will show the “operation guidance” page and open a new window to display coupon view configuration center.</p>
            <div><img src="../../../assets/images/coupon/guidance/step4.png"/></div>
          </li>
          <li>
            <p>Input coupon code</p>
            <p>Step1.Paste or input the coupon code to “coupon name” text in “Add Coupon” box of coupon view configuration center (must).</p>
            <p>Step2.Click “Regular” tab, then current window will close “Add Coupon” box and pop up “Select a template” box.</p>
            <div><img src="../../../assets/images/coupon/guidance/step5.png"/></div>
          </li>
          <li>
            <p>Select a template</p>
            <p>Select a template in “Select a template” box, then the current window will close “Select a template” box and display “add template” page.</p>
            <div><img src="../../../assets/images/coupon/guidance/step6.png"/></div>
          </li>
          <li>
            <p>Set coupon’s view</p>
            <p>You can set the coupon’s view and QR-code or barcode in “add template” of coupon view configuration center, you can according to the guidance which show in left panel in “add template” page.</p>
            <div><img src="../../../assets/images/coupon/guidance/step7-1.png"/></div>
            <p>Attention：</p>
            <ol>
              <li>
                <p>You can skip the entree page when you don’t need the coupon cover.</p>
                <p>Step1. Turn on the “skip entree page” switch control in Homepage.</p>
                <div><img src="../../../assets/images/coupon/guidance/step7-2.png"/></div>
              </li>
              <li>
                <p>When setting how to validate the coupon, you need to set it in either of the following two ways:</p>
                <ol type="a">
                  <li>
                    <p>Select “use the unique coupon code” as barcode value view style.</P>
                    <div><img src="../../../assets/images/coupon/guidance/attention2-a.png"/></div>
                  </li>
                  <li>
                    <p>Select “Generate” as barcode value view style.</p>
                    <p>Suggestion: the length of “followed by” is between 6-12 bit will be better.</p>
                    <p>Remark: “alphanumeric” supports combination of letters and numbers, and “numeric” supports combination of numbers.</p>
                    <div><img src="../../../assets/images/coupon/guidance/attention2-b.png"/></div>
                  </li>
                </ol>
              </li>
              <li>
                <p>Save coupon view</p>
                <p>You need click “Save” button in “Add coupon” page of coupon view configuration center.</p>
              </li>
            </ol>
          </li>
          <li>
            <p>Back to Coupon List</p>
            <p>After having been configured of coupon view in coupon view configuration center, you can click “Go back” button in “operation guidance” page of Fides Cloud, then the current window will display coupon list page in Fides Cloud.</p>
          </li>
        </ol>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    components: {
    },
    data() {
      return {
        loading: false
      }
    },
    watch: {
    },
    created() {},
    methods: {
      goCouponList() {
        this.$router.push({
          path: '/loyalty/coupon'
        })
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .operate-guide {
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
      .cancel{
        border-color: $new-primary;
        color: $new-primary;
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
        .serial{
          padding: 20px;
          font-size: 14px;
          color: #606266;
          li {
            margin-left: 15px;
            list-style-type: decimal;
            ol li {
              list-style-type: upper-roman;
              ol li {
                list-style-type: lower-latin;
              }
            }
          }
          p {
            line-height: 23px;
          }
          img {
            max-width: 1200px;
            margin-bottom: 15px;
          }
        }
      }
    }
  }
</style>

<style rel="stylesheet/scss" lang="scss">
  @import "../new-theme-css";
</style>
