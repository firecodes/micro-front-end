<!--Upload members-->
<template>
  <div class="spot_campaign_who_upload_members">
    <el-form-item label=" " style="border-bottom: 1px solid #e6e6e6;">
      <div class="button">
        <!--Download template-->
        <a download="member.csv" href="../../../../../../../static/member.csv"><el-button class="download-template">{{$t('campaign.fc_campaign_spot_create_who_btn_download_label')}}</el-button></a>
        <el-upload
          :action="url"
          :before-upload="beforeAvatarUpload"
          :http-request="handleHttpRequest"
          :on-change="handleChange"
          :show-file-list="false"
          class="upload-file"
          list-type
        >
          <!--Upload member info-->
          <el-button :loading="upload_loading" class="upload-member-info">{{$t('campaign.fc_campaign_spot_create_who_btn_upload_label')}}</el-button>
        </el-upload>
      </div>
      <label :class="{'success': file_url}" class="tip">{{file_url ? 'Upload successfully!': $t('campaign.fc_campaign_spot_create_who_upload_failed_label')}}</label>
    </el-form-item>
  </div>
</template>
<script>
  import { uploadMixin } from '@/views/data/upload'
  export default {
    mixins: [uploadMixin],
    props: {
      campaign_wizard_id: {
        type: Number | String
      },
      target: {
        type: Object
      }
    },
    data() {
      return {
        url: '',
        file: '',
        upload_loading: false,
        file_url: ''
      }
    },
    created() {
      this.init()
    },
    methods: {
      init() {
        if (this.target) {
          this.file_url = this.target.import_file_name || ''
        }
      },
      handleHttpRequest() {
        if (this.file === '' || this.file === undefined) {
          return true
        }
        this.upload_loading = true
        this.file_url = ''
        this.handleUpload(this.file, 'file').then(res => {
          this.file_url = res
          this.upload_loading = false
          this.file = ''
        }).catch(() => {
          this.upload_loading = false
        })
      },
      handleChange(file, fileList) {
      },
      beforeAvatarUpload(file) {
        this.file = file
      },
      handleCalcParams() {
        return {
          import_file_name: this.file_url
        }
      },
      handleSaveValue() {
        return {
          import_file_name: this.file_url
        }
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  .spot_campaign_who_upload_members{
    .tip{
      font-size: 12px;
      display: flex;
      align-items: center;
      font-family: HelveticaNeue1-Bold;
      color: #d50000;
      line-height: 1;
      padding-top: 4px;
      position: relative;
      top: 100%;
      left: 168px;
      &:before {
        font-family: "iconfont";
        content: '\e727';
        font-size: 14px;
        margin-right: 4px;
      }
    }
    .success{
      color: rgba(8, 255, 0, 1);
      &:before {
        color: rgba(8, 255, 0, 1);
      }
    }
    .button{
      display: flex;
      .download-template{
        min-width: 140px;
        border-color: $new-primary;
        color: $new-primary;
        background-color: #ffffff;
      }
      .upload-member-info{
        margin-left: 8px;
        min-width: 152px;
        background: $new-primary;
        border-color: $new-primary;
        color: #ffffff;
      }
    }
  }
</style>
