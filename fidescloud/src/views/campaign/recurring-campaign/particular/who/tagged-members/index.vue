<!--
  Tagged members
-->
<template>
  <div class="spot_campaign_who_tagged_members" ref="TaggedMembers" v-loading="tagged_member_loading">
    <el-form-item label=" ">
      <div class="target-member-mode">
        <div :key="index"  class="profile-target t" v-for="(item,index) in tags_list">
          <label class="title">{{item.category_name}}:</label>
          <div class="ul">
            <div :class="{'check': list.length>0}" :key="index1" class="li" v-for="(item1, index1) in item.groups">
              <p @click="handleDialogClick(item1)">
                <span>+</span>{{item1.group_name}}
              </p>
              <by-profile :data="list" :list="item1.tags" @handleDelete="handleDelete" />
            </div>
          </div>
        </div>
      </div>
    </el-form-item>
    <ed-dialog>
      <el-dialog :title="dialog_title" :visible.sync="dialog" width="350px">
        <div class="dialog_body_height">
          <dialog-select :list2="dialog_tags" :show_state="dialog" :value="list" ref="dialog_select"></dialog-select>
        </div>
        <div class="dialog-footer" slot="footer">
          <el-button @click="dialog = false" class="cancel">Cancel</el-button>
          <el-button @click="closeDialog" class="save" type="primary">Save</el-button>
        </div>
      </el-dialog>
    </ed-dialog>
  </div>
</template>
<script>
  import ByProfile from './by-profile'
  import { queryAllTags } from '@/api/member'
  import DialogSelect from './dialog-select'
  export default {
    components: {
      ByProfile,
      DialogSelect
    },
    data() {
      return {
        list: [],
        tagged_member_loading: false,
        tags_list: [],
        dialog: false,
        dialog_tags: [],
        dialog_title: ''
      }
    },
    props: {
      target: {
        type: Object
      }
    },
    watch: {
      target() {
        this.init()
      }
    },
    created() {
      this.getList()
    },
    methods: {
      init() {
        if (this.target) {
          var tags_content = this.target.tags_content || ''
          tags_content = JSON.parse(tags_content)
          var arr = []
          if (tags_content && tags_content.length > 0) {
            for (var item of tags_content) {
              for (var item1 of item) {
                arr.push(item1)
              }
            }
            this.list = arr
          } else {
            this.list = tags_content
          }
          console.log(this.list)
        }
      },
      handleDialogClick(tags) {
        this.dialog_tags = []
        this.dialog_tags = tags.tags
        this.dialog_title = tags.group_name
        this.dialog = true
      },
      closeDialog() {
        var arr = this.$refs['dialog_select'].change()
        for (var value of arr) {
          if (this.list.indexOf(value) <= -1) {
            this.list.push(value)
          }
        }
        this.dialog = false
      },
      handleDelete(id) {
        const key = this.list.indexOf(id)
        this.list.splice(key, 1)
      },
      getList() {
        queryAllTags().then(res => {
          this.tags_list = res.return_result.ref || []
          this.tagged_member_loading = false
          this.init()
        }).catch(res => {
          this.tagged_member_loading = false
        })
      },
      handleSelectTaggedMembers() {
        if (this.list.length <= 0) {
          return JSON.stringify(this.list)
        } else {
          var copy_list = JSON.parse(JSON.stringify(this.list)) || []
          var new_list = []
          var check_tags = []
          for (var item of this.tags_list) {
            if (copy_list.length <= 0) {
              break
            }
            for (var item2 of item.groups) {
              if (copy_list.length <= 0) {
                break
              }
              check_tags = []
              for (var item1 of item2.tags) {
                if (copy_list.length <= 0) {
                  break
                }
                if (copy_list.indexOf(item1.tag_id) > -1) {
                  check_tags.push(item1.tag_id)
                  copy_list.splice(copy_list.indexOf(item1.tag_id), 1)
                }
              }
              if (check_tags.length > 0) {
                new_list.push(check_tags)
              }
            }
          }
          return JSON.stringify(new_list)
        }
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  .spot_campaign_who_tagged_members{
    .dialog-footer{
      .el-button{
        min-width: 80px;
        border-color: $new-primary;
      }
      .cancel{
        background-color: #ffffff;
        color: $new-primary;
      }
      .save{
        background-color: $new-primary;
      }
    }
    .el-input-number, .el-select{
      width: 210px;
    }
    .target-member-mode {
      .t {
        display: flex;
        flex:1;
        &:not(:first-child){
          margin-top: 10px;
        }
        .title {
          min-width: 150px;
          text-align: left;
          font-size:14px;
          font-family: Helvetica-medium-1;
          color: rgba(51,51,51,1);
          line-height: 30px;
        }
      }
      .ul {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
      }
    }
  }
  .li {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    margin-right: 10px;
    cursor: pointer;
    margin-bottom: 15px;
    height: 30px;
    p {
      line-height: 17px;
      font-size: 14px;
      padding: 6px 17px;
      border-radius: 15px;
      border: 1px dashed rgba(198,219,255,1);
      background: #e8f0fb;
      z-index:11;
      color: $new-primary;
      display: flex;
      align-items: center;
      span {
        padding-right: 3px;
        margin-top: -2px;
      }
    }
  }
  .check{
    p{
      border-style: solid;
      border-color: $new-primary;
      color: $new-primary;
    }
  }
  .dialog-footer{
    .el-button{
      min-width: 80px;
      border-color: $new-primary;
    }
    .cancel{
      background-color: #ffffff;
      color: $new-primary;
    }
    .save{
      background-color: $new-primary;
    }
  }
  .el-select, .el-input-number{
    width: 300px!important;
  }
  .dialog_body_height{
    height: 220px;
  }
  /deep/ .el-form-item{
    border: none!important;
  }
  /deep/ .el-form-item__label, /deep/ .el-form-item {
    line-height: 20px!important;
  }

</style>
