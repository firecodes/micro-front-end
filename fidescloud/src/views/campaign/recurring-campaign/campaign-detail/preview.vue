<!--
  preview
-->
<template>
  <section class="recurring_campaign_detail_sub_preview">
    <ed-header-title :title="$t('campaign.fc_campaign_spot_details_module_preview_label')" />
    <div class="recurring_campaign_detail_sub_preview__content">
      <!--iPad-->
      <div class="img ipad" v-if="communication_channels.communication_channel_code !== '1'">
        <img :src="require('@/assets/images/iPad.png')">
        <div class="content" style="width: 85%">
          <el-scrollbar style="height:100%; width: 100%">
            <p class="center">
              <label>To:</label>
              <span>Target Group</span>
            </p>
            <p class="center subject">
              <label>Subject:</label>
              <span>{{communication_info.subject || table_placeholder}}</span>
            </p>
            <div class="line"></div>
            <p class="html" v-html="communication_info.content || table_placeholder"></p>
          </el-scrollbar>
        </div>
      </div>
      <!--iphone-->
      <div class="img iphone" v-else>
        <img :src="require('@/assets/images/iPhone-x.png')">
        <div class="content">
          <ed-clamp :max-lines="10" autoresize style="text-align: left; word-wrap:break-word;word-break:break-all;">{{communication_info.content || table_placeholder}}</ed-clamp>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
  export default {
    // 1是 iphone
    props: {
      communication_info: {
        type: Object
      },
      communication_channels: {
        type: Object
      }
    },
    data() {
      return {

      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  .recurring_campaign_detail_sub_preview{
    height: 100%;
    .html{
      /deep/ img{
        max-width: 100%;
      }
    }
    &__content{
      width: 100%;
      height: calc(100% - 50px);
      background: rgba(255,255,255,1);
      box-shadow: 0 5px 15px -3px rgba(204,204,204,1);
      .icon{
        position: absolute;
        bottom: 3%;
        right: 5%;
        font-size: 24px;
        color: $new-primary;
      }
      background: #fff;
      .ipad{
        width: 337px;
        .content{
          overflow-y: hidden;
          height: 325px;
          top: 0;
          position: absolute;
          bottom:0;
          margin: 100px 24px 60px;
          padding: 2%;
          background: #ffffff;
          label{
            color: #000;
            font-size: 14px;
            font-weight: bold;
          }
          p{
            line-height: 1.3;
            color: rgba(16, 16, 16, 1);
            font-size: 14px;
            text-align: left;
          }
          .center{
            display: flex;
            label{
              display: block;
              width: 35%;
              text-align: left;
            }
          }
          .subject{
            margin-top: 3px;
          }
          .line{
            margin: 8px 0;
            width: 100%;
            border-top: 1px solid rgba(187, 187, 187, 1);
          }
        }
      }
      .img{
        position: relative;
        margin: auto;
        img{
          width: 100%;
        }
      }
      .iphone{
        width: 226px;
        padding-top: 20px;
        .content{
            display: inline-table;
            background: #e5e5e8;
            border-radius: 6px;
            width: 131px;
            line-height: 14px;
            color: rgba(16, 16, 16, 1);
            top: 0;
            color: #101010;
            position: absolute;
            left:0;
            margin: 110px 22px 85px;
            padding: 4px;
            font-size: 10px;
            p{
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 10;
              -webkit-box-orient: vertical;
            }
          }
      }
    }
  }
</style>
