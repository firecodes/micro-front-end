<template>
  <div class="add-gift">
    <div class="click-button">
      <el-button type="primary" class="save">Save</el-button>
      <el-button>Cancel</el-button>
    </div>
    <div class="contain">
      <div class="header">
        <p>Add gift</p>
      </div>
      <div class="info">
        <el-form ref="form" :model="form" label-width="130px">
          <el-form-item label="Gift code:">
            <el-input></el-input>
          </el-form-item>
          <el-form-item label="Gift name:">
            <el-input></el-input>
          </el-form-item>
          <el-form-item label="Status:">
            <el-select v-model="form.gift_status" placeholder="please select" clearable>
              <el-option label="Active" value="active"></el-option>
              <el-option label="Inactive" value="Inactive"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Gift category:">
            <el-select v-model="form.category" placeholder="please select" clearable>
              <el-option label="1" value="1"></el-option>
              <el-option label="2" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Upload picture:">
            <el-input ></el-input>
            <el-button>Browse..</el-button>
          </el-form-item>
          <el-form-item label="Unit price:">
            <el-input ></el-input>
            <el-select v-model="form.unit"  style="width: 100px;" clearable>
              <el-option label="¥" value="1"></el-option>
              <el-option label="$" value="2"></el-option>
              <el-option label="€" value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Description :">
            <el-input
              type="textarea"
              :rows="3"
              placeholder=""
              style="width:500px;"
              v-model="textarea">
            </el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'add-gift',
    data() {
      return {
        centerDialogVisible: false,
        form: {
          product_name: '',
          gift_status: '',
          unit: '1',
          category: ''
        }
      }
    },
    methods: {}
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .add-gift {
    .el-input,.el-select,.el-date-picker{
      width: 25%;
    }
    margin: 25px;
    .click-button {
      padding:5px 0;
      width: 100%;
      background-color: #ffffff;
      .save {
        margin-left: 20px;
      }
    }
    .contain {
      margin-top: 30px;
      background-color: #ffffff;
      position: relative;
      padding-bottom: 30px;
      &:before {
        content: '';
        position: absolute;
        top: -4px;
        left: 0;
        width: 100%;
        height: 3px;
        background-color: rgba(51, 51, 51, 0.07);
      }
      .header {
        height: 30px;
        line-height: 30px;
        position: relative;
        &:after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 1px;
          background-color: rgba(51, 51, 51, 0.07);
        }
        p {
          margin-left: 20px;
          font-weight: 600;
          font-size:17px;
          color: rgba(51, 51, 51, 0.6);
        }
      }
      .info {
        margin-top: 30px;
      }
      .ul {
        padding: 0;
        li {
          width: 640px;
          height: 45px;
          box-shadow: none;
          background: #F2F2F2;
          &:not(:first-child) {
            margin-top: 20px;
          }
          span {
            margin-left: 20px;
          }
          position: relative;
          .switch {
            position: absolute;
            right: 20px;
            top: 0;
            bottom: 0;
            margin: auto;
          }
        }
      }
    }
  }
</style>
