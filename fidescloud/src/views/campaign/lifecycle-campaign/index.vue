<template>
  <div class="lifecycle-campaign">
    <section class="top">
      <h1>{{$t('campaign.fc_campaign_lifecycle_title_label')}}</h1>
      <p>{{$t('campaign.fc_campaign_lifecycle_sub_title_label')}}</p>
    </section>
    <section class="list">
      <el-row :gutter="20">
        <el-col :span="6">
          <ul>
            <!--Activate-->
            <li class="make greetings">
              <h2>
                <svg-icon icon-class="bookmake"></svg-icon>
                <p>{{$t('campaign.fc_campaign_lifecycle_activate_section_label')}}</p>
              </h2>
            </li>
            <li class="li" v-if="list.activate.length > 0">
              <div class="list-detail" @click="handleRouteLink(list.activate[0])">
                <span class="middle" v-if="list.activate[0].status === 3"><label>Available soon...</label></span>
                <!--左边有图片和活跃标识-->
                <div class="left">
                  <div class="tip" :class="{'col-1010' : list.activate[0].status === 2}" v-if="list.activate[0].status !== 3">
                    <label>{{handleStatus(list.activate[0].status)}}</label>
                  </div>
                  <div class="image">
                    <svg-icon icon-class="prospect"></svg-icon>
                  </div>
                </div>
                <!--右边详情-->
                <div class="right">
                  <div>
                    <p>{{list.activate[0].name_resource_key ? $t(`campaign.${list.activate[0].name_resource_key}`) : list.activate[0].campaign_name }}</p>
                    <label>{{list.activate[0].description_resource_key ? $t(`campaign.${list.activate[0].description_resource_key}`) : list.activate[0].desc }}</label>
                    <span>{{$t('campaign.fc_campaign_lifecycle_btn_details_label')}} >> </span>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </el-col>
        <el-col :span="6">
          <ul>
            <!--Nurture-->
            <li class="make reminders">
              <h2>
                <svg-icon icon-class="bookmake"></svg-icon>
                <p>{{$t('campaign.fc_campaign_lifecycle_nurture_section_label')}}</p>
              </h2>
            </li>
            <li class="li" v-if="list.nurture.length > 0">
              <div class="list-detail" @click="handleRouteLink(list.nurture[0])">
                <span class="middle" v-if="list.nurture[0].status === 3"><label>Available soon...</label></span>
                <!--左边有图片和活跃标识-->
                <div class="left">
                  <div class="tip" :class="{'col-1010' : list.nurture[0].status === 2}" v-if="list.nurture[0].status !== 3">
                    <label>{{handleStatus(list.nurture[0].status)}}</label>
                  </div>
                  <div class="image">
                    <svg-icon icon-class="new_buyer"></svg-icon>
                  </div>
                </div>
                <!--右边详情-->
                <div class="right">
                  <div>
                    <p>{{list.nurture[0].name_resource_key ? $t(`campaign.${list.nurture[0].name_resource_key}`) : list.nurture[0].campaign_name }}</p>
                    <label>{{list.nurture[0].description_resource_key ? $t(`campaign.${list.nurture[0].description_resource_key}`) : list.nurture[0].desc }}</label>
                    <span>{{$t('campaign.fc_campaign_lifecycle_btn_details_label')}} >> </span>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </el-col>
        <el-col :span="6">
          <ul>
            <!--Energize-->
            <li class="make notifications">
              <h2>
                <svg-icon icon-class="bookmake"></svg-icon>
                <p>{{$t('campaign.fc_campaign_lifecycle_energize_section_label')}}</p>
              </h2>
            </li>
            <li class="li" v-if="list.energize.length > 0">
              <div class="list-detail" @click="handleRouteLink(list.energize[0])">
                <span class="middle" v-if="list.energize[0].status === 3"><label>Available soon...</label></span>
                <!--左边有图片和活跃标识-->
                <div class="left">
                  <div class="tip" :class="{'col-1010' : list.energize[0].status === 2}" v-if="list.energize[0].status !== 3">
                    <label>{{handleStatus(list.energize[0].status)}}</label>
                  </div>
                  <div class="image">
                    <svg-icon icon-class="repeat_customer"></svg-icon>
                  </div>
                </div>
                <!--右边详情-->
                <div class="right">
                  <div>
                    <p>{{list.energize[0].name_resource_key ? $t(`campaign.${list.energize[0].name_resource_key}`) : list.energize[0].campaign_name }}</p>
                    <label>{{list.energize[0].description_resource_key ? $t(`campaign.${list.energize[0].description_resource_key}`) : list.energize[0].desc }}</label>
                    <span>{{$t('campaign.fc_campaign_lifecycle_btn_details_label')}} >> </span>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </el-col>
        <el-col :span="6">
          <ul>
            <!--Awake-->
            <li class="make add_trigger">
              <h2>
                <svg-icon icon-class="bookmake"></svg-icon>
                <p>{{$t('campaign.fc_campaign_lifecycle_awake_section_label')}}</p>
              </h2>
            </li>
            <li class="li" v-if="list.awake.length > 0">
              <div class="list-detail" @click="handleRouteLink(list.awake[0])">
                <span class="middle" v-if="list.awake[0].status === 3"><label>Available soon...</label></span>
                <!--左边有图片和活跃标识-->
                <div class="left">
                  <div class="tip" :class="{'col-1010' : list.awake[0].status === 2}" v-if="list.awake[0].status !== 3">
                    <label>{{handleStatus(list.awake[0].status)}}</label>
                  </div>
                  <div class="image">
                    <svg-icon icon-class="sleeping_customer"></svg-icon>
                  </div>
                </div>
                <!--右边详情-->
                <div class="right">
                  <div>
                    <p>{{list.awake[0].name_resource_key ? $t(`campaign.${list.awake[0].name_resource_key}`) : list.awake[0].campaign_name }}</p>
                    <label>{{list.awake[0].description_resource_key ? $t(`campaign.${list.awake[0].description_resource_key}`) : list.awake[0].desc }}</label>
                    <span>{{$t('campaign.fc_campaign_lifecycle_btn_details_label')}} >> </span>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </el-col>
      </el-row>
    </section>
  </div>
</template>
<script>
  import { getLifeCycleCampaignWarzdList } from '@/api/lifecycleStudio'
  export default{
    data() {
      return {
        loading: false,
        list: {
          'activate': [],
          'nurture': [],
          'energize': [],
          'awake': []
        }
      }
    },
    created() {
      this.getData()
    },
    methods: {
      handleRouteLink(item) {
        window.localStorage.lifecycle_cam_info = JSON.stringify(item)
        var path = ''
        if (item.status === 1) {
          path = '/campaign/lifecycle-studio/detail/' + item.campaign_warzd_id
        } else if (item.status === 2) {
          path = '/campaign/lifecycle-studio/edit'
        }
        this.$router.push({
          path: path
        })
      },
      getData() {
        this.loading = true
        getLifeCycleCampaignWarzdList().then((res) => {
          this.loading = false
          var list = res.return_result.campaign_warzd_list
          // 处理生成配置
          for (var item of list) {
            var category = item.category
            if (category === 'Activate') {
              this.list.activate.push(item)
            }
            if (category === 'Nurture') {
              this.list.nurture.push(item)
            }
            if (category === 'Energize') {
              this.list.energize.push(item)
            }
            if (category === 'Awake') {
              this.list.awake.push(item)
            }
          }
        }).catch(() => {
          this.loading = false
        })
      },
      handleStatus(status) {
        const data = [this.$t('campaign.fc_campaign_lifecycle_tag_active_label'), this.$t('campaign.fc_campaign_lifecycle_tag_activate_label'), 'not support']
        return data[status - 1]
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  $height: 160px;
  .greetings{
    .svg-icon{
      color:#9AD3CD
    }
  }
  .reminders{
    .svg-icon{
      color:#FFBC60
    }
  }
  .notifications{
    .svg-icon{
      color:#B08AF0
    }
  }
  .add_trigger{
    .svg-icon{
      color:#E58D9E
    }
  }
  .lifecycle-campaign{
    position: absolute;
    right: 20px;
    left: 20px;
    margin: 15px 0;
    background: #ffffff;
    text-align: center;
    height: calc(100% - 37px);
    .top{
      padding-top: 3%;
      h1{
        line-height: 46px;
        color: rgba(16, 16, 16, 1);
        font-size: 32px;
      }
      p{
        color: rgba(136, 136, 136, 1);
        font-size: 20px;
      }
    }
    .list{
      padding: 60px 30px;
    }
    ul{
      .make{
        margin-bottom: 20px;
        .svg-icon{
          font-size: 23px;
        }
        h2{
          display: flex;
          align-items: flex-end;
          justify-content: flex-start;
          p{
            color: rgba(68, 68, 68, 1);
            font-size: 24px;
            margin-left: 6px;
          }
        }
      }
      .li{
        &:not(:first-child) {
          margin-top: 20px;
          cursor: pointer;
        }
        position: relative;
      }
      .list-detail{
        height: $height;
        line-height: 20px;
        border-radius: 4px;
        text-align: center;
        border: 1px solid rgba(0,0,0,.1);
        width: 100%;
        display: flex;
        flex:1;
        &:hover{
          box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
        }
        .left{
          flex: 0 0 33%;
          position: relative;
          .tip{
            position: absolute;
            top: 0;
            left:0;
            width: 70px;
            height: 25px;
            line-height: 20px;
            border-radius: 4px 0px 20px 0px;
            background-color: rgba(251, 115, 115, 1);
            text-align: center;
            color: #ffffff;
            border: 1px solid rgba(251, 115, 115, 1);
          }
          .col-1010{
            background-color: #bbbbbb;
            border-color:#bbbbbb;
          }
          .image{
            position: absolute;
            top: 0;
            bottom: 0;
            left: 5px;
            right: 0;
            margin: auto;
            width: 72%;
            height:4.3vw;
            line-height: 20px;
            border-radius: 16px;
            background-color: $primary;
            border: 1px solid $primary;
          }
          .svg-icon{
            width: 2.5vw;
            height: 2.5vw;
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            color: #ffffff;
            margin: auto;
          }
        }
        .right{
          position: relative;
          width: 100%;
          text-align: left;
          div{
            position: absolute;
            padding: 0 10px 0 0 ;
            top: 50%;
            left:0; right:0;
            transform: translate(0, -50%);
          }
          p{
            color: rgba(16, 16, 16, 1);
            font-size: 18px;
            text-align: left;
          }
          label{
            color: rgba(136, 136, 136, 1);
            font-size: 14px;
            text-align: left;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }
          span{
            display: block;
            color: rgba(64, 158, 255, 1);
            font-size: 14px;
            text-align: left;
          }
        }
      }
      .border-dashed{
        height: $height;
        border: 2px dashed $primary;
        position: relative;
        .svg-icon{
          line-height: 1;
          position: absolute;
          top: 50%;
          bottom: 0;
          left: 50%;
          right: 0;
          transform: translate(-50%, -50%);
          color:$primary;
          font-size: 55px;
        }
      }
    }
    .dialog{
      h1{
        text-align: center;
        color: rgba(16, 16, 16, 1);
        font-size: 18px;
      }
      p{
        margin-top: 5px;
        color: rgba(136, 136, 136, 1);
        font-size: 16px;
        text-align: center;
      }
      .el-form{
        margin-top: 29px;
      }
      .el-select{
        width: 100%;
      }
      .submit{
        text-align: center;
        .el-button{
          width: 80px;
        }
      }
    }
    .available_soon{
      border: 1px solid red;
      position: relative;
      &:before{
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: 100;
        background-color: rgba(255, 255, 255, .7);
      }
    }
    .middle{
      position: absolute;
      z-index: 101;
      line-height: 160px;
      width: 100%;
      height: 100%;
      color: rgba(16, 16, 16, 1);
      font-size: 20px;
    }
  }
</style>
