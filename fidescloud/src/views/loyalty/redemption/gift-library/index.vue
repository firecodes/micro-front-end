<!--gift library-->
<template>
  <div class="gift-library">
    <div class="operation">
      <el-button type="primary" @click="toAddGift"><i class="el-icon-plus"></i>Add</el-button>
      <el-button type="warning"><i class="el-icon-edit-outline"></i>Edit</el-button>
      <el-button type="danger"><i class="el-icon-delete">Delete</i></el-button>
    </div>
    <div class="search">
      <el-form>
        <el-form-item>
          <el-input type="text" placeholder=" Please enter gift name or  gift code"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="tableData" v-loading.body="listLoading" border :empty-text="$t('member.fc_table_no_data_label')">
      <el-table-column prop="id" align="center" label='Id' width="125"></el-table-column>
      <el-table-column prop="gift_picture" align="center" label="Gift picture"></el-table-column>
      <el-table-column prop="gift_code" align="center" label="Gift code"></el-table-column>
      <el-table-column prop="gift_name" align="center" label="Gift name"></el-table-column>
      <el-table-column prop="category_name" align="center" label="Category name"></el-table-column>
      <el-table-column prop="status" align="center" label="Status"></el-table-column>
    </el-table>
  </div>
</template>
<script>
  export default{
    data() {
      return {
        listLoading: false,
        tableData: [
          { id: '1', gift_picture: 'none', gift_code: '2016103601', gift_name: '50元代金券', category_name: 'Self-issued Voucher', status: 'Active' },
          { id: '2', gift_picture: 'none', gift_code: '2016103602', gift_name: '10元代金券', category_name: 'Self-issued Voucher', status: 'Active' },
          { id: '3', gift_picture: 'none', gift_code: '2016103603', gift_name: '30元代金券', category_name: 'Self-issued Voucher', status: 'Active' },
          { id: '4', gift_picture: 'none', gift_code: '2016103604', gift_name: '20元代金券', category_name: 'Self-issued Voucher', status: 'Active' },
          { id: '5', gift_picture: 'none', gift_code: '2016103605', gift_name: '150元代金券', category_name: 'Self-issued Voucher', status: 'Active' },
          { id: '6', gift_picture: 'none', gift_code: '2016103606', gift_name: '120元代金券', category_name: 'Self-issued Voucher', status: 'Active' }]
      }
    },
    methods: {
      toAddGift() {
        this.$router.push({
          path: '/loyalty/add-gift'
        })
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .gift-library{
    .operation{
      margin-top:20px;
      background-color: #FFFFFF;
      padding:5px 0;
      .el-button{
        &:first-child{
          margin-left:20px;
        }
      }
    }
    .search{
      .el-form{
        margin-top:20px;
      }
      .el-input{
        width: 30%;
      }
    }
    .p{
      margin-bottom:20px;
    }
  }
</style>
