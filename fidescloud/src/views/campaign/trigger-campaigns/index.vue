<template>
  <div class="trigger-campaign" v-loading="loading">
    <section class="top">
      <!--Trigger campaign -->
      <h1>{{$t('campaign.fc_campaign_trigger_title_label')}}</h1>
      <!--Select, set and activate your member's trigger events-->
      <p>{{$t('campaign.fc_campaign_trigger_sub_title_label')}}</p>
    </section>
    <section class="list">
      <el-row :gutter="20">
        <el-col :span="6">
          <ul>
            <!--Greetings-->
            <li class="make greetings">
              <h2>
                <svg-icon icon-class="bookmake" />
                <p>{{$t('campaign.fc_campaign_trigger_greetings_section_label')}}</p>
              </h2>
            </li>
            <li :key="item.trigger_name" @click="handleRouteLink(item)" class="li" v-for="(item) in list.greetings">
              <div :class="{'available_soon' : item.status === 3}" class="list-detail">
                  <span class="middle" v-if="item.status === 3"><label>{{$t('campaign.fc_campaign_trigger_available_soon_label')}}...</label></span>
                  <!--左边有图片和活跃标识-->
                  <div class="left">
                    <div class="tip" :class="{'col-1010' : item.status === 2}" v-if="item.status !== 3">
                      <label>{{handleStatus(item.status)}}</label>
                    </div>
                    <div class="image">
                      <svg-icon :icon-class="item.icon_name" />
                    </div>
                  </div>
                  <!--右边详情-->
                  <div class="right">
                    <div>
                      <p>{{$t(`campaign.${item.trigger_name}`)}}</p>
                      <label>{{$t(`campaign.${item.desc}`)}}</label>
                      <span>{{$t('campaign.fc_campaign_trigger_btn_details_label')}} >> </span>
                    </div>
                  </div>
                </div>
            </li>
          </ul>
        </el-col>
        <el-col :span="6">
          <ul>
            <!--Reminders-->
            <li class="make reminders">
              <h2>
                <svg-icon icon-class="bookmake" />
                <p>{{$t('campaign.fc_campaign_trigger_reminders_section_label')}}</p>
              </h2>
            </li>
            <li :key="item.trigger_name" @click="handleRouteLink(item)" class="li" v-for="(item) in list.reminders">
                <div class="list-detail" :class="{'available_soon' : item.status === 3}">
                  <span class="middle" v-if="item.status === 3"><label>{{$t('campaign.fc_campaign_trigger_available_soon_label')}}</label></span>
                  <!--左边有图片和活跃标识-->
                  <div class="left">
                    <div class="tip" :class="{'col-1010' : item.status === 2}" v-if="item.status !== 3">
                      <label>{{handleStatus(item.status)}}</label>
                    </div>
                    <div class="image">
                      <svg-icon :icon-class="item.icon_name" />
                    </div>
                  </div>
                  <!--右边详情-->
                  <div class="right">
                    <div>
                      <p>{{$t(`campaign.${item.trigger_name}`)}}</p>
                      <label>{{$t(`campaign.${item.desc}`)}}</label>
                      <span>{{$t('campaign.fc_campaign_trigger_btn_details_label')}} >> </span>
                    </div>
                  </div>
                </div>
              </li>
          </ul>
        </el-col>
        <el-col :span="6">
          <ul>
            <!--Notifications-->
            <li class="make notifications">
              <h2>
                <svg-icon icon-class="bookmake" />
                <p>{{$t('campaign.fc_campaign_trigger_notifications_section_label')}}</p>
              </h2>
            </li>
            <li :key="item.trigger_name" @click="handleRouteLink(item)" class="li" v-for="(item) in list.notifications">
                <div class="list-detail" :class="{'available_soon' : item.status === 3}">
                  <span class="middle" v-if="item.status === 3"><label>$t('campaign.fc_campaign_trigger_available_soon_label')</label></span>
                  <!--左边有图片和活跃标识-->
                  <div class="left">
                    <div class="tip" :class="{'col-1010' : item.status === 2}" v-if="item.status !== 3">
                      <label>{{handleStatus(item.status)}}</label>
                    </div>
                    <div class="image">
                      <svg-icon :icon-class="item.icon_name" />
                    </div>
                  </div>
                  <!--右边详情-->
                  <div class="right">
                    <div>
                      <p>{{$t(`campaign.${item.trigger_name}`)}}</p>
                      <label>{{$t(`campaign.${item.desc}`)}}</label>
                      <span>{{$t('campaign.fc_campaign_trigger_btn_details_label')}} >> </span>
                    </div>
                  </div>
                </div>
              </li>
          </ul>
        </el-col>
        <el-col :span="6">
          <ul>
            <!--Add a trigger-->
            <li class="make add_trigger">
              <h2>
                <svg-icon icon-class="bookmake" />
                <p>{{$t('campaign.fc_campaign_trigger_add_section_label')}}</p>
              </h2>
            </li>
            <li class="li border-dashed" @click="add_trigger_dialog = true">
              <svg-icon icon-class="add" />
            </li>
          </ul>
        </el-col>
      </el-row>
    </section>
    <el-dialog
      :visible.sync="add_trigger_dialog"
      width="580px"
      center>
      <div class="dialog">
        <h1>Would you like a new trigger?</h1>
        <p>Please fill in the below request form and we'll get in touch right away</p>
        <el-form :model="form_new_trigger" :rules="rules" ref="form">
          <el-form-item :label="$t('campaign.fc_campaign_trigger_add_category_label')" prop="category">
            <el-select placeholder="Please select a category for your trigger" v-model="form_new_trigger.category">
              <el-option :label="$t('campaign.fc_campaign_trigger_add_category_menu1_label')" value="Greetings" />
              <el-option :label="$t('campaign.fc_campaign_trigger_add_category_menu2_label')" value="Reminders" />
              <el-option :label="$t('campaign.fc_campaign_trigger_add_category_menu3_label')" value="Notifications" />
              <el-option :label="$t('campaign.fc_campaign_trigger_add_category_menu4_label')" value="Other" />
            </el-select>
          </el-form-item>
          <!--Describe-->
          <el-form-item :label="$t('campaign.fc_campaign_trigger_add_desc_label')" prop="user_feedback">
            <el-input
              maxlength="512"
              v-model="form_new_trigger.user_feedback"
              type="textarea"
              :rows="4">
            </el-input>
          </el-form-item>
          <!--contact number-->
          <el-form-item :label="$t('campaign.fc_campaign_trigger_add_contact_number_label')" prop="contract_mobile">
            <el-input maxlength="64" v-model="form_new_trigger.contract_mobile" />
          </el-form-item>
        </el-form>
        <!--submit-->
        <div class="submit" @click="submit">
          <el-button type="primary" :loading="submit_loading">{{$t('campaign.fc_campaign_trigger_add_btn_submit_label')}}</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import { queryTriggerCampaignList, submitTriggerCampaignFeedback } from '@/api/campaign'
  export default{
    data() {
      return {
        loading: false,
        submit_loading: false,
        add_trigger_dialog: false,
        rules: {
          category: [
            { required: true, message: this.handleGlobalI18n('validation', 'is_null'), trigger: ['blur', 'change'] }
          ],
          user_feedback: [
            { required: true, message: this.handleGlobalI18n('validation', 'is_null'), trigger: ['blur', 'change'] }
          ],
          contract_mobile: [
            { required: true, message: this.handleGlobalI18n('validation', 'is_null'), trigger: ['blur', 'change'] }
          ]
        },
        list: {
          'greetings': [],
          'reminders': [],
          'notifications': []
        },
        // list: data,
        form_new_trigger: {
          category: '',
          user_feedback: '',
          contract_mobile: ''
        }
      }
    },
    created() {
      this.getList()
    },
    methods: {
      handleRouteLink(item) {
        window.localStorage.trigger_cam_info = JSON.stringify(item)
        let path = ''
        if (item.status === 1) {
          path = '/campaign/trigger-studio/detail/' + item.campaign_wizard_id
        } else if (item.status === 2) {
          path = '/campaign/trigger-studio/edit'
        }
        this.$router.push({
          path: path
        })
      },
      handleStatus(status) {
        const data = [this.$t('campaign.fc_campaign_trigger_tag_active_label'), this.$t('campaign.fc_campaign_trigger_tag_activate_label'), 'not support']
        return data[status - 1]
      },
      getList() {
        this.loading = true
        queryTriggerCampaignList().then(res => {
          const list = res.return_result
          for (const item of list) {
            const category = item.category
            if (category === 'Greetings') {
              this.list.greetings.push(item)
            }
            if (category === 'Reminders') {
              this.list.reminders.push(item)
            }
            if (category === 'Notifications') {
              this.list.notifications.push(item)
            }
          }
          for (const index in this.list) {
            this.list[index].sort((a, b) => {
              return a.limit_by - b.limit_by
            })
          }
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      },
      submit() {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.submit_loading = true
            submitTriggerCampaignFeedback(this.form_new_trigger).then(() => {
              this.submit_loading = false
              this.$message.success(this.$t('configuration.fc_operation_feedback_notification_label'))
              this.add_trigger_dialog = false
            }).catch(() => {
              this.submit_loading = false
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
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
  .trigger-campaign{
    margin: 15px 20px;
    background: #ffffff;
    text-align: center;
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
            border-radius: 4px 0 20px 0;
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
          min-width: 80px;
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
