<template>
  <div class="content" ref="dynamic_content">
    <el-form>
      <ul>
        <li v-for="(item, index) in list" :key="index">
          <div class="from"><el-input v-model="item.from"></el-input></div>
          <div class="to"><el-input v-model="item.to"></el-input></div>
          <div class="delete" @click="deleteLi(item)"><i class="el-icon-minus"></i></div>
        </li>
      </ul>
    </el-form>
    <div class="add" @click="addLi" :class="{'margin-top-8' : list.length <= 0}">
      <el-button class="new-button-not-primary content-add-button">{{$t('member.fc_member_tag_btn_add_label')}}</el-button>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        list: [
          {
            from: '',
            to: ''
          },
          {
            from: '',
            to: ''
          },
          {
            from: '',
            to: ''
          }
        ]
      }
    },
    watch: {
      list: {
        handler() {
          this.$emit('handleContent', this.list)
        }
      }
    },
    methods: {
      addLi() {
        if (this.list.length > 10) {
          this.$message.error('Exceed the limit')
          return false
        }
        this.list.push({
          from: '',
          to: ''
        })
      },
      deleteLi(tag) {
        this.list.splice(this.list.indexOf(tag), 1)
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .margin-top-8{
    margin-top: 8px!important;
  }
  .content-add-button{
    min-width:60px;
    background-color: $new-primary;
    color: #ffffff;
    border-color: $new-primary;
  }
  .content{
    width: 420px;
    text-align: center;
    border-radius: 4px;
    background-color: rgba(247, 245, 245, 1);
    border: 1px solid rgba(187, 187, 187, 1);
    padding: 8px 20px;
    flex-wrap: wrap;
    justify-content: center;
    li{
      .from, .to{
        margin-right: 8px;
      }
      display: flex;
      align-items: center;
      margin-bottom: 20px;
     }
    .add{
      margin-top: -9px;
    }
    .from{
      .el-input{
        width: 100px;
      }
    }
    .to{
      .el-input{
        width: 240px;
      }
    }
    .delete{
      width: 24px;
      height: 24px;
      line-height: 24px;
      cursor: pointer;
      border-radius: 24px;
      background:rgba(255,255,255,1);
      border:1px solid rgba(204,204,204,1);
    }
  }
</style>
