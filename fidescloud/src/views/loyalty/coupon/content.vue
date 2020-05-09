<template>
  <div class="content" ref="dynamic_content">
    <el-form>
      <ul>
        <li v-for="item in list">
          <div class="from"><el-input v-model="item.from" maxlength="32"></el-input></div>
          <div class="to"><el-input v-model="item.to" maxlength="32"></el-input></div>
          <div class="delete" @click="deleteLi(item)"><el-button icon="el-icon-minus"></el-button></div>
        </li>
      </ul>
    </el-form>
    <div class="add" @click="addLi">
      <el-button icon="el-icon-plus">Add</el-button>
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
        this.list.push({
          from: '',
          to: ''
        })
        this.$emit('handleContent', this.list)
      },
      deleteLi(tag) {
        this.list.splice(this.list.indexOf(tag), 1)
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .content{
    width: 530px;
    text-align: center;
    border-radius: 4px;
    background-color: rgba(247, 245, 245, 1);
    border: 1px solid rgba(187, 187, 187, 1);
    padding: 20px;
    .el-input{
      width: 200px;
    }
    li{
      .from, .to{
        margin-right: 20px;
      }
      display: flex;
      align-items: center;
       margin-bottom: 20px;
     }
    .add{
      margin-top: 20px;
    }
  }
</style>
