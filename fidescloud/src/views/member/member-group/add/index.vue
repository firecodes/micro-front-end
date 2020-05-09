<template>
  <div class="new-theme-css addNewGroupPage">
    <div class="click-button">
      <template>
        <div>
          <el-button class="cancel" @click="goBack()">{{$t('loyalty.fc_operation_btn_cancel_label')}}</el-button>
          <el-button type="primary" :loading="save_loading" class="save" @click="submitForm('membertag')">{{handleGlobalI18n('loyalty', 'save')}}</el-button>
        </div>
      </template>
    </div>
    <!--info-->
    <div class="contain" v-loading="loading">
      <ed-header-title :title="this.$route.params.id ? $t('member.fc_member_group_edit_title_label') : $t('member.fc_member_group_add_new_title_label')" />
      <el-form ref="membertag" label-position="left" :model="form" :rules="rules"  label-width="300px" v-loading="loading">
        <div class="content">
          <div class="info">
              <!--group name-->
              <el-form-item style="padding-top: 15px;" :label="$t('member.fc_member_group_add_new_name_label')" prop="group_name" ref="group_name">
                <template>
                  <el-input v-model="form.group_name" maxlength="32" :placeholder="$t('member.fc_member_group_add_new_name_input_label')"></el-input>
                </template>
              </el-form-item>
              <!-- Transaction -->
              <el-form-item :label="$t('member.fc_member_group_add_new_select_label')" class="select-members" prop="member_type">
                <div class="select-member-select">
                  <el-select :disabled="this.$route.params.id ? true : false" :placeholder="$t('member.fc_member_group_add_new_name_input_label')" v-model="form.member_type" clearable filterable style="width: 300px;">
                    <el-option class="new-select-option" :label="$t('member.fc_member_group_add_new_select_1st_label')" :value="'member_tags'"></el-option>
                    <!-- <el-option class="new-select-option" :label="$t('member.fc_member_group_add_new_select_2nd_label)" :value="'member_import'"></el-option> -->
                  </el-select>
                </div>
              </el-form-item>
              <el-form-item class="download-upload" label=" " v-if="form.member_type === 'member_import'">
                <button class="down-btn">{{$t('member.fc_member_group_add_new_select_import_download_label')}}</button>
                <button class="upload-btn">{{$t('member.fc_member_group_add_new_select_import_upload_label')}}</button>
              </el-form-item>
              <el-form-item label=" " class="category-tags" v-else>
                <div class="select-member-div" v-for="(item, index) in categoryAndTags" :key="index">
                  <span>{{ categoryName(item.category_name) }}</span>
                  <span class="tagdemo" v-for="(keyItem, idx) in item.groups" :key="idx">
                    <span class="no-select" :class="{'group-name': computedGroupName(keyItem.tags)}" @click="handleClickTag(keyItem.tags, keyItem.group_name)"><i class="el-icon-plus"></i>{{ keyItem.group_name }}</span>
                    <span class="sub-tag-name" v-for="(key, ind) in keyItem.tags" v-if="key.checked" :key="key.tag_id">{{ key.tag_name && key.tag_name.length > 45 ? key.tag_name.substring(0, 42) + '...' : key.tag_name }}<i class="el-icon-close" @click="handleCloseTag(keyItem.tags, ind, key.tag_id)"></i></span>
                  </span>
                </div>
              </el-form-item>
              <!--estimated audience-->
              <el-form-item :label="$t('member.fc_member_group_add_new_estimated_audience_label')" prop="gift_name">
                <template>
                  <span class="estimated-audience-span">{{ form.member_num }}</span>
                  <el-button class="deep-blue" :disabled="!totalIdArr.length" :loading="calculateLoading" type="primary" @click="handleCalculate">{{$t('member.fc_member_group_add_new_btn_calculate_label')}}</el-button>
                </template>
              </el-form-item>
          </div>
        </div>
      </el-form>
    </div>
    <!-- <calculate @saveModelTag="saveModelTag" @deleteTag="deleteTag" :origin="categoryAndTags" :content="alltags" @closeSelectCategory="closeSelectCategory" :dialog_show="dialog_show" @handleDialogVisible="handleDialogVisible" /> -->
    <model @select="selectSub" :title="subModelTitle" :content="subTags" @handleDialogVisible="handleDialogVisible" :dialog_show="dialog_show"/>
  </div>
</template>

<script>
  import { queryAllTag } from '@/api/memberTag'
  import { calc, addMemberGroup, updateMemberGroup, getMemberGroupInfo } from '@/api/memberGroup'
  import LabelContent from './content'
  import Calculate from './clickCalculate'
  import Model from './model'
  export default {
    components: {
      LabelContent,
      Calculate,
      Model
    },
    data() {
      return {
        dialog_show: false,
        loading: false,
        save_loading: false,
        rules: {
          group_name: [{ required: true, trigger: ['change', 'blur'], message: this.$t('member.fc_field_input_empty_tips') }],
          member_type: [{ required: true, trigger: ['change', 'blur'], message: this.$t('member.fc_config_member_group_input_tips') }]
        },
        form: {
          group_name: '',
          memberList: [],
          member_num: '',
          member_type: '',
          idArr: []
        },
        categoryAndTags: [],
        alltags: [],
        calculateLoading: false,
        subTags: [],
        subModelTitle: '',
        totalIdArr: [],
        currSelectId: []
      }
    },
    watch: {
      dialog_show() {
        this.totalIdArr.push(...this.currSelectId)
      }
    },
    computed: {
      categoryName() {
        return function(name) {
          const origin = name
          name = name && name.toLowerCase()
          switch (name) {
            case 'socio demographic':
              return this.$t('campaign.fc_campaign_spot_create_who_socio_label')
            case 'general':
              return this.$t('member.fc_member_group_add_new_select_tag_general_label')
            case 'loyalty':
              return this.$t('member.fc_member_group_add_new_select_tag_loyalty_label')
            case 'transaction':
              return this.$t('member.fc_member_group_add_new_select_tag_transaction_label')
            case 'campaign':
              return this.$t('member.fc_member_group_add_new_select_tag_campaign_label')
            case 'lifecycle':
              return this.$t('member.fc_member_group_add_new_select_tag_lifecycle_label')
            case 'communication':
              return this.$t('member.fc_member_group_add_new_select_tag_communication_label')
            case 'estimated audience':
              return this.$t('member.fc_member_group_add_new_estimated_audience_label')
            default:
              return origin
          }
        }
      }
    },
    created() {
      // 先判断是不是编辑还是增加
      if (this.$route.name === 'member_group_edit') { // 编辑group
        this.editGroup()
      } else if (this.$route.name === 'member_group_copy') { // 拷贝member group
        this.copyGroup()
      } else {
        this.init()
      }
    },
    methods: {
      handleCloseTag(list, index, id) {
        this.totalIdArr = this.totalIdArr.filter(item => item !== id)
        this.$set(list, index, { checked: false, tag_id: id, tag_name: list[index].tag_name })
      },
      computedGroupName(list) {
        let flag = false
        for (let i = 0; i < list.length; i++) {
          if (list[i].checked) {
            flag = true
            break
          }
        }
        return flag
      },
      copyGroup() {
        this.getInfo()
      },
      editGroup() {
        this.getInfo()
      },
      init() {
        this.getAllTags()
      },
      getInfo() {
        this.loading = true
        getMemberGroupInfo(this.$route.params.id).then(res => {
          this.loading = false
          if (res.return_result) {
            this.categoryAndTags = res.return_result.tags.ref
            if (this.$route.name === 'member_group_edit') {
              this.form.group_name = res.return_result.group_name
              this.find(res.return_result.tags.ref)
            }
            if (this.$route.name === 'member_group_copy') {
              this.form.group_name = 'Copy - ' + res.return_result.group_name
              this.find(res.return_result.tags.ref)
            }
            this.form.member_type = (res.return_result.description === 'member_tags' || !res.return_result.description) ? 'Member tag' : 'Member import'
            this.form.member_num = sessionStorage.getItem('member_num')
          } else {
            this.$message.error(res.msg)
          }
        }).catch(err => {
          this.loading = false
          this.$message.error(err)
        })
      },
      find(refs) {
        const arrs = []
        const edArr = []
        for (let i = 0; i < refs.length; i++) {
          const groups = refs[i].groups
          for (let j = 0; j < groups.length; j++) {
            const tags = groups[j].tags
            for (let k = 0; k < tags.length; k++) {
              if (tags[k].checked) {
                arrs.push(tags[k].tag_id)
              }
              edArr.push(tags[k])
            }
          }
        }
        this.totalIdArr = [...arrs]
        this.alltags = [...edArr]
      },
      selectSub(list, ids, title) {
        // list为当前选中的tag_id
        this.currSelectId = ids
        for (let i = 0; i < this.categoryAndTags.length; i++) {
          const groups = this.categoryAndTags[i].groups
          for (let j = 0; j < groups.length; j++) {
            if (groups[j].group_name === title) {
              this.$set(groups[j], 'tags', list)
            }
          }
        }
      },
      saveModelTag(arr, flag) {
        this.form.idArr = arr
        this.dialog_show = flag
      },
      handleCalculate() {
        this.calculateLoading = true
        calc({
          tags: this.getSelectIdGroup(this.categoryAndTags)
        }).then(res => {
          this.calculateLoading = false
          if (res.return_result) {
            this.$message.success(this.$t('configuration.fc_operation_feedback_notification_label'))
            this.form.member_num = res.return_result.member_num
          } else {
            this.$message.error(res.msg)
          }
        }).catch(err => {
          this.calculateLoading = false
          this.$message.error(err)
        })
      },
      getAllTags() {
        this.loading = true
        return queryAllTag().then(res => {
          this.loading = false
          if (res.return_result) {
            this.categoryAndTags = res.return_result.ref
            this.find(res.return_result.ref)
          } else {
            this.$message.error(res.msg)
          }
        }).catch(err => {
          this.loading = false
          this.$message.error(err)
        })
      },
      closeSelectCategory(val) {},
      getSelectIdGroup(arr) {
        const result = []
        let temp = []
        for (let i = 0; i < arr.length; i++) {
          const groups = arr[i].groups
          for (let j = 0; j < groups.length; j++) {
            const tags = groups[j].tags
            temp = []
            for (let k = 0; k < tags.length; k++) {
              if (tags[k].checked) {
                temp.push(tags[k].tag_id)
                result.push(temp)
              }
            }
          }
          // temp.length && result.push(temp)
        }
        const obj = {}
        result.reduce(function(item, next) {
          if (!obj[next.join('')]) {
            obj[next.join('')] = next
            item.push(next)
          }
          return item
        }, [])
        // console.log(11, result, obj, [Object.values(obj)])
        return Object.values(obj)
      },
      submitForm(formName) {
        // this.$nextTick(() => {
        //   this.getSelectIdGroup(this.categoryAndTags)
        // })
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (!this.getSelectIdGroup(this.categoryAndTags).length) {
              this.$message.error(this.$t('member.fc_config_member_tags_empty_tips'))
              return
            }
            // 获取到所有的选中的tag_id
            // 判断是编辑还是新增还是拷贝
            this.save_loading = true
            if (this.$route.name === 'member_group_edit') {
              updateMemberGroup({
                id: this.$route.params.id,
                description: this.form.member_type,
                group_name: this.form.group_name,
                tag_ids: this.getSelectIdGroup(this.categoryAndTags)
              }).then(res => {
                this.save_loading = false
                if (res.return_result) {
                  this.$message.success(this.$t('member.fc_member_group_edit_feedback_label'))
                  this.$router.push('/member/member-group')
                } else {
                  this.$message.error(res.msg)
                }
              }).catch(err => {
                this.save_loading = false
                this.$message.error(err)
              })
            } else {
              addMemberGroup({
                description: this.form.member_type,
                group_name: this.form.group_name,
                tag_ids: this.getSelectIdGroup(this.categoryAndTags)
              }).then(res => {
                this.save_loading = false
                if (res.return_result) {
                  if (this.$route.name === 'member_group_copy') {
                    this.$message.success(this.$t('member.fc_member_group_copy_feedback_label'))
                  } else {
                    this.$message.success(this.$t('member.fc_member_tag_add_feedback_label'))
                  }
                  this.$router.push('/member/member-group')
                } else {
                  this.$message.error(res.msg)
                }
              }).catch(err => {
                this.save_loading = false
                this.$message.error(err)
              })
            }
          }
        })
      },
      // 移除选中的tags
      deleteTag(list) {
        this.alltags = [...list]
      },
      // 点击tag标签
      handleClickTag(tags, name) {
        // 每点击一次，拿到当前name下面的所有子tags小标�
        // 把tags传递给model
        this.subTags = tags
        this.subModelTitle = name
        this.dialog_show = true
      },
      // 保存
      save() {
      },
      handleDialogVisible(bl) {
        this.dialog_show = bl
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.addNewGroupPage {
  .tagdemo {
    min-width:20px;
    height:30px;
    line-height: 30px;
    background:rgba(74,144,226,0.07);
    border-radius:15px;
    border:1px dashed rgba(198,219,255,1);
    display: inline-block;
    color: #2777FF;
    margin-bottom: 30px;
    .group-name {
      display: inline-block;
      min-width:30px;
      background:rgba(243,247,253,1);
      border-radius:15px;
      border:1px solid rgba(39,119,255,1);
      color: #2777FF;
      padding: 0 8px;
      position: relative;
      top: -4px;
      i {
        font-size: 12px;
        margin-right: 5px;
        color: #2777FF;
      }
    }
    .no-select {
      padding: 0 8px;
      cursor: pointer;
      text-align: center;
    }
    .no-select.group-name {
      position: relative;
      top: -2px;
    }
    .sub-tag-name {
      font-size:14px;
      color:rgba(39,119,255,1);
      display: inline-block;
      height: 30px;
      line-height: 30px;
      position: relative;
      top: -2px;
      margin: 0 5px;
    }
  }
  .el-icon-plus {
    font-weight: 600;
    margin-right: 4px;
  }
  .el-checkbox {
    width: 200px;
  }
  .select-member-select {
    margin-bottom: 16px;
  }
  .contain {
    position: relative;
    .info{
      background:rgba(255,255,255,1);
      box-shadow:0 5px 15px -3px rgba(204,204,204,1);
      width: 100%;
    }
  }
  .click-button {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 100%;
    text-align: right;
    margin-bottom: -20px;
    position: relative;
    z-index: 2;
    .save{
      margin-left: 8px;
      background-color: $new-primary;
      border-color: $new-primary;
    }
    .cancel, .delete{
      border-color: $new-primary;
      color: $new-primary;
    }
  }
  .el-form-item{
    margin: 0 0 70px 20px;
    min-height: 66px;
    line-height: 66px;
    margin-bottom: 0!important;
    padding-bottom: 20px;
    &:not(:last-child) {
      border-bottom: 1px solid rgba(230,230,230,1);
    }
    &:last-child{
      padding: 12px 0 15px 0;
      height: auto!important;
    }
    display: flex;
    /deep/ .el-form-item__error {
      top: 35px !important;
    }
  }
  .el-select{
    width: 100px;
  }
  .select-member-div {
    display: flex;
    flex-wrap: wrap;
    div {
      display: flex;
      flex-wrap: wrap;
      flex: 1;
    }
    span {
      min-width: 50px;
      display: block;
      margin-right: 10px;
      // padding-right: 5px;
    }
    button {
      margin-bottom: 20px;
      margin-left: 0;
      margin-right: 20px;
    }
  }
  .estimated-audience-span {
    width: 140px;
    display: inline-block;
  }
  .category-tags {
    padding-top: 16px;
    .solid-button, .dash-button {
      border-radius: 18px !important;
    }
    .dash-button {
      border-style: dashed;
    }
    .selected {
      background-color: rgba(74, 144, 226, 0.07) !important;
      border-color: #2777FF;
      color: #2777FF;
    }
    .none-selected {
      background-color: rgba(74, 144, 226, 0.07) !important;
      border-color: #ccc;
      color: #333;
    }
  }
  .download-upload, .select-members {
    border-bottom: none !important;
  }
  .select-members {
    margin-top: 15px;
  }
  .download-upload {
    display: flex;
    .down-btn, .upload-btn {
      height: 30px;
      background-color: #2777FF;
      border-radius: 4px;
      font-size: 14px;
      font-weight: bold;
      color: #fff;
      outline: none;
      border: none;
    }
  }
}
  .addNewGroupPage {
    .content{
      display: flex;
    }
    .margin-left-20{
      margin-left: 20px;
    }
    .el-button{
      min-width: 88px;
    }
    .el-input {
      width: 300px;
    }
    margin: 30px;
  }
</style>
<style rel="stylesheet/scss" lang="scss">
  @import "../../new-theme-css";
  .addNewGroupPage{
    .el-form-item .el-form-item__label {
      font-size: 14px!important;
      font-weight: bold!important;
      color: rgba(51,51,51,1);
      line-height: 17px!important;
      &:before{
        // color: rgba(51,51,51,1)!important;
      }
    }
    .el-form-item__content{
      margin-left: 0!important;
      width: 100% !important
    }
  }
  .deep-blue {
  background-color: #2777FF !important;
  border-color: #2777FF !important;
}
</style>
