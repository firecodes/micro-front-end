<template>
  <div class="edit-segmentation">
    <div class="header-top cursor-pointer" @click.stop="goBack">
      <p><< {{handleGlobalI18n('member', 'back')}}</p>
    </div>
    <div class="container">
      <div class="header">
        <p>{{handleGlobalI18n('member', 'segmentation')}}</p>
      </div>
      <div class="details">
        <!--member type-->
        <div class="member_type li">
          <label class="label">{{handleGlobalI18n('member', 'member_type')}}:</label>
          <el-radio-group v-model="member_type">
            <el-radio-button label="Business travellers"></el-radio-button>
            <el-radio-button label="Family trip"></el-radio-button>
          </el-radio-group>
        </div>
        <!--age bracket-->
        <div class="age_bracket li">
          <label class="label">{{handleGlobalI18n('member', 'age_bracket')}}:</label>
          <el-radio-group v-model="age_bracket">
            <el-radio-button label="<23"></el-radio-button>
            <el-radio-button label="23~25"></el-radio-button>
            <el-radio-button label="36~45"></el-radio-button>
            <el-radio-button label="46~55"></el-radio-button>
            <el-radio-button label=">55"></el-radio-button>
          </el-radio-group>
        </div>
        <!--gender-->
        <div class="gender li">
          <label class="label">{{handleGlobalI18n('member', 'gender')}}:</label>
          <el-radio-group v-model="gender">
            <el-radio-button label="Male"></el-radio-button>
            <el-radio-button label="Female"></el-radio-button>
            <el-radio-button label="Unknown"></el-radio-button>
          </el-radio-group>
        </div>
        <!--Language-->
        <div class="language li">
          <label class="label">{{handleGlobalI18n('member', 'language')}}:</label>
          <el-radio-group v-model="language">
            <el-radio-button label="Chinese"></el-radio-button>
            <el-radio-button label="English"></el-radio-button>
            <el-radio-button label="Other"></el-radio-button>
          </el-radio-group>
        </div>
        <!--Interests -->
        <div class="interests li">
          <label class="label">{{handleGlobalI18n('member', 'interests')}}:</label>
          <el-radio-group v-model="interests">
            <el-radio-button label="Travel"></el-radio-button>
            <el-radio-button label="Football"></el-radio-button>
            <el-radio-button label="Music"></el-radio-button>
            <el-radio-button label="Reading"></el-radio-button>
          </el-radio-group>
        </div>
        <!--Preferred Channel  -->
        <div class="preferred_channel li">
          <label class="label">{{handleGlobalI18n('member', 'preferred_channel')}}:</label>
          <el-radio-group v-model="preferred_channel">
            <el-radio-button label="POS"></el-radio-button>
            <el-radio-button label="e-commerce"></el-radio-button>
          </el-radio-group>
        </div>
      </div>
      <div class="button">
        <el-button type="primary">{{handleGlobalI18n('member', 'save')}}</el-button>
        <el-button>{{handleGlobalI18n('member', 'cancel')}}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        member_type: '',
        age_bracket: '',
        gender: '',
        language: '',
        interests: '',
        preferred_channel: ''
      }
    },
    methods: {
      goBack() {
        this.$router.go(-1)
      }
    }
  }
</script>

<style scoped rel="stylesheet/scss" lang="scss">
  .el-radio-button {

  }

  .edit-segmentation {
    margin: 20px;
    .header-top {
      height: 30px !important;
      width: 100px;
      color: #ffffff;
      line-height: 30px;
      background-color: $primary;
      text-align: center;
    }
    .container {
      margin-top: 20px;
      background-color: #ffffff;
      position: relative;
      &:after {
        content: '';
        position: absolute;
        height: 3px;
        width: 100%;
        left: 0;
        top: -2px;
        background-color: #E8EBED;
      }
      .header {
        height: 40px;
        line-height: 40px;
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
          margin-left: 15px;
          font-weight: 600;
          font-size: 18px;
          color: rgba(51, 51, 51, 0.5);
        }
      }
      .details {
        margin: 30px;
        .li {
          align-items: center;
          display: flex;
          &:not(:first-child) {
            margin-top: 30px;
          }
        }
        .label {
          width: 150px;
          text-align: right;
          margin-right: 15px;
        }
      }
      .button {
        margin-left: 195px;
        padding-bottom: 100px;
      }
    }
  }
</style>
