<template>
  <div class="image" ref="image">
    <el-upload
      v-loading="upload_loading"
      class="avatar-uploader"
      :action="upload_img_url"
      :http-request="handleHttpRequest"
      :show-file-list="false"
      :before-upload="beforeAvatarUpload">
      <img v-if="image_url!== null && image_url!== ''" :src="image_url" class="avatar">
      <i v-else class="el-icon-picture avatar-uploader-icon"></i>
    </el-upload>
    <div class="delete-img" v-if="image_url!== null && image_url!== ''" @click="handleDelete"><i class="el-icon-error" ></i></div>
  </div>
</template>
<script>
  import { uploadImage } from '@/api/master'
  import { projectName } from '@/api/api'
  export default {
    props: {
      image: {
        type: String,
        default: ''
      }
    },
    watch: {
      image() {
        this.image_url = this.image
      }
    },
    data() {
      return {
        upload_loading: false,
        upload_img_url: '',
        image_url: this.image,
        file: ''
      }
    },
    methods: {
      handleDelete() {
        this.image_url = ''
        this.$emit('handleImgUrl', this.image_url)
      },
      handleHttpRequest() {
        if (this.file === '' || this.file === undefined) {
          return true
        }
        this.upload_loading = true
        this.image_url = ''
        var formData = new FormData()
        formData.append('file', this.file)
        formData.append('oldUrl', this.image_url)
        formData.append('project', projectName)
        formData.append('module', 'gift')
        uploadImage(formData).then(res => {
          this.image_url = res.return_result.url[0]
          this.$emit('handleImgUrl', this.image_url)
          this.upload_loading = false
          this.file = ''
        }).catch(() => {
          this.upload_loading = false
        })
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type
        const isLt2M = file.size / 1024 / 1024 < 2
        //
        if (isJPG.indexOf('image') < 0) {
          this.$message.error(this.handleGlobalI18n('validation', 'upload_image_type_error'))
          return isJPG
        }
        if (!isLt2M) {
          this.$message.error(this.handleGlobalI18n('validation', 'upload_gift_size_error'))
          return false
        }
        this.file = file
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .image{
    position: relative;
    .delete-img{
      position: absolute;
      top: 3px;
      left: 211px;
      cursor: pointer;
      i{
        font-size: 23px;
      }
    }
    .avatar-uploader {
      width: 240px;
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      img{
        width: 240px;
        display: block;
      }
    }
    /deep/ .el-upload{
      display: block!important;
    }
    .avatar-uploader:hover {
      border-color: $primary;
    }
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 240px;
      line-height: 240px;
      text-align: center;
      height: 240px;
    }
  }
</style>
