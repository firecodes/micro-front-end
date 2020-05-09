<template>
    <div class="lifecycle-studio" v-loading="loading">
        <el-scrollbar style="height:100%;">
        <div class="instructions">
            <p>{{handleGlobalI18n('campaign', 'welcome_to_the')}}</p>
            <p>{{handleGlobalI18n('campaign', 'lifecycle_studio_tool')}}</p>
            <p>{{handleGlobalI18n('campaign', 'choose_customer')}}</p>
        </div>
        <el-row class="list">
            <el-col :xs="24" :sm="12" :lg="6">
                <router-link class="detail" to="/campaign/lifecycle-studio/prospect/3" tag="div">
                    <div class="image">
                        <img src="../../../assets/images/lifecycle-studio/prospect.png" />
                    </div>
                    <div class="button">
                        <span>{{list.length>0 ? handleGlobalI18n('campaign', list[3].lifecycle_campaign_type) : ''}}</span>
                    </div>
                </router-link>
            </el-col>
            <el-col :xs="24" :sm="12" :lg="6">
                <router-link class="detail" to="/campaign/lifecycle-studio/new-buyer/0" tag="div">
                    <div class="image">
                        <img src="../../../assets/images/lifecycle-studio/new_buyer.png" />
                    </div>
                    <div class="button">
                        <span>{{list.length>0 ? handleGlobalI18n('campaign', list[0].lifecycle_campaign_type) : ''}}</span>
                    </div>
                </router-link>
            </el-col>
            <el-col :xs="24" :sm="12" :lg="6">
                <router-link class="detail" to="/campaign/lifecycle-studio/repeat-customer/1" tag="div">
                    <div class="image">
                        <img src="../../../assets/images/lifecycle-studio/repeat_customer.png" />
                    </div>
                    <div class="button">
                        <span>{{list.length>0 ? handleGlobalI18n('campaign', list[1].lifecycle_campaign_type) : ''}}</span>
                    </div>
                </router-link>
            </el-col>
            <el-col :xs="24" :sm="12" :lg="6">
                <router-link class="detail" to="/campaign/lifecycle-studio/sleeping-customer/2" tag="div">
                    <div class="image">
                        <img src="../../../assets/images/lifecycle-studio/sleeping_customer.png" />
                    </div>
                    <div class="button">
                        <span>{{list.length>0 ? handleGlobalI18n('campaign', list[2].lifecycle_campaign_type) : ''}}</span>
                    </div>
                </router-link>
            </el-col>
        </el-row>
        </el-scrollbar>
    </div>
</template>
<script>
import { getLifeCycleCampaignWarzdList } from '@/api/lifecycleStudio'
import { setLifecycleConfiguration as setLCC } from '@/utils/auth'
import { mapMutations } from 'vuex'
export default {
  name: 'lifecycle-index',
  data() {
    return {
      list: [],
      loading: false
    }
  },
  created() {
    this.getData()
  },
  methods: {
    ...mapMutations({
      setLifecycleConfiguration: 'SET_LIFECYCLE_CONFIGURATION'
    }),
    getData() {
      this.loading = true
      getLifeCycleCampaignWarzdList().then((res) => {
        this.loading = false
        this.list = res.return_result.campaign_warzd_list
        // 处理生成配置
        this.list = this.list.map(item => {
          return item
        })
        this.setLifecycleConfiguration(this.list)
        setLCC(JSON.stringify(this.list))
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.lifecycle-studio {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 100%;
  background: url("../../../assets/images/lifecycle-studio/bg.png") no-repeat;
  background-size: cover;
  text-align: center;
  .instructions {
    padding-top: 7%;
    p {
      &:nth-child(1) {
        line-height: 70px;
        color: rgba(85, 81, 123, 1);
        font-size: 48px;
        margin-bottom: 12px;
      }
      &:nth-child(2) {
        font-style: italic;
        padding: 3px 20px;
        display: inline;
        line-height: 67px;
        background-color: rgba(102, 99, 136, 1);
        color: rgba(255, 255, 255, 1);
        font-size: 46px;
        border: 1px solid rgba(187, 187, 187, 1);
      }
      &:nth-child(3) {
        margin-top: 11px;
        line-height: 46px;
        color: rgba(85, 81, 123, 1);
        font-size: 32px;
      }
    }
  }
  .list{
      margin: 80px 10% 0 10%;
      .detail{
          text-align: center;
          position: relative;
          .image{
            top: 0;
            left:50%;
            transform: translate(-50%);
            width: 200px;
            height: 200px;
            background-color: rgba(183, 218, 253, 1);
            box-shadow: 0 0 6px 3px rgba(255, 255, 255, 0.4);
            border: 1px solid rgba(255, 255, 255, 0);
            border-radius: 50%;
            position: relative;
          }
      }
      .button{
        &:hover{
            cursor: pointer;
        }
        margin-bottom: 30px;
        position: relative;
        left:50%;
        transform: translate(-50%);
        margin-top: 50px;
        height: 50px;
        line-height: 48px;
        width: 250px;
        border-radius: 4px;
        background-color: rgba(64, 158, 255, 1);
        color: rgba(255, 255, 255, 1);
        font-size: 22px;
        text-align: center;
        border: 1px solid rgba(64, 158, 255, 1);
      }
  }
}
</style>
