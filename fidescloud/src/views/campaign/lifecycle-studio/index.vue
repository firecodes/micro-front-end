<template>
  <div class="trigger-campaign">
    <section class="top">
      <h1>Lifecycle Campaigns</h1>
      <p>Increase your Member's engagement level during their loyalty journey</p>
    </section>
    <section class="list">
      <el-row :gutter="20">
        <el-col :span="6">
          <ul>
            <li class="make greetings">
              <h2>
                <svg-icon icon-class="bookmake"></svg-icon>
                <p>Activate</p>
              </h2>
            </li>
            <li class="li">
              <router-link class="list-detail" to="/campaign/lifecycle-studio/prospect/3" tag="div">
                <!--左边有图片和活跃标识-->
                <div class="left">
                  <div class="tip">
                    <label>Active</label>
                  </div>
                  <div class="image">
                    <svg-icon icon-class="prospects-svg"></svg-icon>
                  </div>
                </div>
                <!--右边详情-->
                <div class="right">
                  <div>
                    <p>Prospects</p>
                    <label>Members who registered but never purchased.</label>
                    <span>Details >> </span>
                  </div>
                </div>
              </router-link>
            </li>
          </ul>
        </el-col>
        <el-col :span="6">
          <ul>
            <li class="make reminders">
              <h2>
                <svg-icon icon-class="bookmake"></svg-icon>
                <p>Nurture</p>
              </h2>
            </li>
            <li class="li">
              <router-link class="list-detail" to="/campaign/lifecycle-studio/new-buyer/0" tag="div">
                <!--左边有图片和活跃标识-->
                <div class="left">
                  <div class="tip">
                    <label>Active</label>
                  </div>
                  <div class="image">
                    <svg-icon icon-class="new-buyers-svg"></svg-icon>
                  </div>
                </div>
                <!--右边详情-->
                <div class="right">
                  <div>
                    <p>New buyers</p>
                    <label>Members who purchased one-time only.</label>
                    <span>Details >> </span>
                  </div>
                </div>
              </router-link>
            </li>
          </ul>
        </el-col>
        <el-col :span="6">
          <ul>
            <li class="make notifications">
              <h2>
                <svg-icon icon-class="bookmake"></svg-icon>
                <p>Energize</p>
              </h2>
            </li>
            <li class="li">
              <router-link class="list-detail" to="/campaign/lifecycle-studio/repeat-customer/1" tag="div">
                <!--左边有图片和活跃标识-->
                <div class="left">
                  <div class="tip">
                    <label>Active</label>
                  </div>
                  <div class="image">
                    <svg-icon icon-class="lapsed-members-svg"></svg-icon>
                  </div>
                </div>
                <!--右边详情-->
                <div class="right">
                  <div>
                    <p>Lapsed members</p>
                    <label>Active Members that are about to fall asleep. </label>
                    <span>Details >> </span>
                  </div>
                </div>
              </router-link>
            </li>
          </ul>
        </el-col>
        <el-col :span="6">
          <ul>
            <li class="make add_trigger">
              <h2>
                <svg-icon icon-class="bookmake"></svg-icon>
                <p>Awake</p>
              </h2>
            </li>
            <li class="li">
              <router-link class="list-detail" to="/campaign/lifecycle-studio/sleeping-customer/2" tag="div">
                <!--左边有图片和活跃标识-->
                <div class="left">
                  <div class="tip">
                    <label>Active</label>
                  </div>
                  <div class="image">
                    <svg-icon icon-class="sleeping-members-svg"></svg-icon>
                  </div>
                </div>
                <!--右边详情-->
                <div class="right">
                  <div>
                    <p>Sleeping members</p>
                    <label>Members that didn’t purchase for a while.</label>
                    <span>Details >> </span>
                  </div>
                </div>
              </router-link>
            </li>
          </ul>
        </el-col>
      </el-row>
    </section>
  </div>
</template>
<script>
  import { mapMutations } from 'vuex'
  import { getLifeCycleCampaignWarzdList } from '@/api/lifecycleStudio'
  import { setLifecycleConfiguration as setLCC } from '@/utils/auth'
  export default{
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
