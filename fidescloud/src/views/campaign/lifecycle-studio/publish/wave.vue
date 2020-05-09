<template>
  <section class="detail">
    <el-row class="configuration">
      <el-col :span="6">
        <div class="item" :class="{'select-before': configuration_id === 1}" @click="configuration_id=1">
          <div class="image"><svg-icon icon-class="When" style="color:red" /></div>
          <p>
            <label>{{handleGlobalI18n('campaign', 'lifecycle_when')}}</label>
            <span><svg-icon icon-class="Description" /></span>
          </p>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="item" :class="{'select-before': configuration_id === 2}" @click="configuration_id=2">
          <div class="image"><svg-icon icon-class="Who" /></div>
          <p>
            <label>{{handleGlobalI18n('campaign', 'lifecycle_who')}}</label>
            <span><svg-icon icon-class="Description" /></span>
          </p>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="item" :class="{'select-before': configuration_id === 3}" @click="configuration_id=3">
          <div class="image"><svg-icon icon-class="What" /></div>
          <p>
            <label>{{handleGlobalI18n('campaign', 'lifecycle_what')}}</label>
            <span><svg-icon icon-class="Description" /></span>
          </p>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="item" :class="{'select-before': configuration_id === 4}" @click="configuration_id=4">
          <div class="image"><svg-icon :icon-class="handleCommunicationSvg" class="how-svg" /></div>
          <p>
            <label>{{handleGlobalI18n('campaign', 'lifecycle_how')}}</label>
            <span><svg-icon icon-class="Description" /></span>
          </p>
        </div>
      </el-col>
    </el-row>
    <!--when-->
    <when-item
      v-if="configuration_id===1"
      :edit_state="edit_state"
      :nonius_id="nonius_id"
      :lifecycle_type="lifecycle_type"
      @next = "next"
      @save = "save"
    />
    <!--who-->
    <who-item
      v-if="configuration_id===2"
      :edit_state="edit_state"
      :nonius_id="nonius_id"
      :register_channel_data="register_channel_data"
      @next="next"
      @save = "save"
    />
    <!--what-->
    <what-item
      v-if="configuration_id===3"
      :edit_state="edit_state"
      :nonius_id="nonius_id"
      @next="next"
      @save = "save"
    />
    <!--how-->
    <how-item
      v-if="configuration_id===4"
      :edit_state="edit_state"
      :nonius_id="nonius_id"
      :communication_channel_list="communication_channel_list"
      @setCommunicationChannel="setCommunicationChannel"
      @save = "save"
    />

  </section>
</template>

<script>
  import WhenItem from './when'
  import WhatItem from './what'
  import WhoItem from './who'
  import HowItem from './how'
  import { getCommunicationChannelTypeList } from '@/api/campaign'
  export default {
    props: {
      edit_state: {
        type: Boolean,
        default: false
      },
      nonius_id: {
        type: Number,
        default: 1
      },
      lifecycle_type: {
        type: Number,
        default: 0
      },
      register_channel_data: {
        type: Array,
        default: []
      }
    },
    components: {
      WhenItem,
      WhatItem,
      WhoItem,
      HowItem
    },
    data() {
      return {
        configuration_id: null,
        how_radio: 'SMS',
        communication_channel_list: []
      }
    },
    computed: {
      handleCommunicationSvg() {
        const id = this.how_radio
        if (id === 'SMS') {
          return 'sms'
        } else if (id === 'WeChat') {
          return 'What – 1'
        } else if (id === 'EDM') {
          return 'email'
        }
      }
    },
    created() {
      // init
      this.init()
    },
    methods: {
      init() {
        this.getCommunicationChannelList()
      },
      getCommunicationChannelList() {
        return getCommunicationChannelTypeList().then(res => {
          this.communication_channel_list = res.return_result
          this.configuration_id = 1
        })
      },
      setCommunicationChannel(val) {
        this.how_radio = val
      },
      next(id) {
        this.configuration_id = id
      },
      save(state) {
        this.$emit('save', 'save')
      }
    }

  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .configuration {
    cursor: pointer;
    height: 180px;
    position: relative;
    &:after{
       content: '';
       width: 97%;
       position: absolute;
       bottom: 0px;
       left: 0;
       right: 0;
       margin: 0 auto;
       height: 1px;
       border-top:1px solid #bbb;
       background: #bbbbbb;
     }
    .el-col {
      text-align: center;
    .item{
      display: inline-block;
      min-height: 180px;
      position: relative;
    }
    .image{
      top: 28px;
      left:0;
      right:0;
      margin: 0 auto;
      position: relative;
      width: 64px;
      height: 64px;
    }
    .svg-icon{
      font-size: 64px;
    }
    .how-svg{
      color: #8fbf5f;
    }
    p{
      position: relative;
      top:60px;
      display: inline-block;
    }
    span{
      position: absolute;
      top: -12px;
      right: -32px;
      display: -webkit-inline-box;
      width: 24px;
      height: 24px;
      border-radius: 24px;
      .svg-icon{
        font-size: 18px;
      }
    }
    label {
      font-size: 22px;
    }
    color: rgba(16, 16, 16, 1);
    background-color: #ffffff;
    &:not(:last-child) {
       position: relative;
      &:after {
         content: '';
         position: absolute;
         width: 1px;
         height: 110px;
         background: rgba(228, 228, 228, 1);
         top: 0;
         bottom: 0;
         margin: auto;
         right: 0;
      }
    }
  }
  .select-before {
    label{
      color: #3D8EE3;
    }
    position: relative;
    &:before {
       content: '';
       bottom: -16px;
       left: 0;
       right: 0;
       z-index: 1;
       margin: auto;
       position: absolute;
       display: inline-block;
       width: 0;
       height: 0;
       border-style: solid;
       border-width: 18px;
       border-color: #fff #fff #fff #fff;
       transform: rotate(135deg);
       box-shadow: 1px -1px 0px 0 #bbb;
    }
  }
}
</style>
