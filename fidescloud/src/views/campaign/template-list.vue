<!--模板列表-->
<template>
  <div class="template-list">
    <div style="overflow-y: hidden;min-height: 400px;width: 100%">
      <el-scrollbar style="height:100%;">
        <ul style=" height:400px;">
          <li v-for="(item, index) in options[0].template" v-if="item!== null" :class="{'item_check': sms_id === index }"  @click="sms_id = index" >
            <p v-html="item.content"></p>
            <div class="bottom-button">
              <div class="edit" @click="dialog_state = true; textarea2 = item.content; edit_state = true; edit_id = item.id">
                <i class="el-icon-edit"></i>
                <p>Edit</p>
              </div>
            </div>
          </li>
          <li class="add" @click="dialog_state = true; textarea2 = ''">
            <i class="el-icon-plus"></i>
          </li>
        </ul>
      </el-scrollbar>
    </div>
  </div>
</template>
<script>
  export default {

  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .template-list {
    padding: 34px 24px 0 20px;
    ul{
      display: flex;
      flex-wrap: wrap;
      li{
        display: flex;
        margin: 0 20px 20px 0;
        width: 290px;
        height: 140px;
        background-color: rgba(255, 255, 255, 0);
        border: 1px solid rgba(187, 187, 187, 1);
        p{
    display: -webkit-box;
    text-overflow: ellipsis;
    overflow : hidden;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    padding: 10px;
    line-height: 24px;
    color: rgba(16, 16, 16, 1);
    font-size: 14px;
  }
        position: relative;
        .bottom-button{
          position: absolute;
          bottom: 0;
          height: 40px;
          width: 100%;
          display: flex;
          align-items: center;
          background: rgba(242, 242, 242, 1);
        }
        .line{
          height: 45%;
          border-right: 1px solid #000;
        }
        .edit, .delete{
    width: 100%;
    cursor: pointer;
    line-height: 40px;
    text-align: center;
    color: #101010;
  p{
    display: inline;
    font-size: 14px!important;
    line-height: 1!important;
    padding: 0!important;
  }
  border: 1px solid rgba(255, 255, 255, 0);
  }
       }
      .add{
    border-style: dashed;
    border-color: $primary;
    text-align: center;
    cursor: pointer;
    border-width: 2px;
  i{
    line-height: 140px;
    font-size: 56px;
    color: $primary;
  }
  }
    }
  }
</style>
