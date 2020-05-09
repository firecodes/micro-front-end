<!--member detail import-->
<template>
  <div class="import">
    <div class="confirm">
      <label>confirm</label>
    </div>
    <div class="contain">
      <div class="info">
        <div class="block">
          <p>Do not have the template ?  Please click here to  <label>download the template .</label></p>
        </div>
        <el-form ref="form" :model="form" label-width="180px" label-position="left"  style="margin-top: 20px;">
          <el-row :gutter="44" class="list1">
            <el-col :xs="24" :sm="24" :lg="6">
              <div class="grid-content">
                <el-form-item label="Import member from files:">
                  <el-upload
                    action="https://jsonplaceholder.typicode.com/posts/"
                  >
                    <el-input type="text"></el-input>
                  </el-upload>
                </el-form-item>
              </div>
            </el-col>
            <el-col :xs="24" :sm="24" :lg="8">
              <el-button>Upload</el-button>
            </el-col>
            <el-col :xs="24" :sm="24" :lg="24">
              <el-form-item label="Upload history ：">
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :lg="24">
              <el-form-item label="Creation date :">
                <el-date-picker
                  v-model="form.creation_date_from"
                  type="daterange"
                  align="right"
                  unlink-panels
                  range-separator="to"
                  start-placeholder="YYMMDD"
                  end-placeholder="YYMMDD"
                  :picker-options="pickerOptions2" style="margin-left:10px;">
                </el-date-picker>
                <el-button type="primary">Query</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-table :data="tableData" v-loading.body="listLoading" border :empty-text="$t('member.fc_table_no_data_label')">
          <el-table-column prop="id" align="center" label='Id' width="95"></el-table-column>
          <el-table-column prop="upload_date" align="center" label="Upload date"></el-table-column>
          <el-table-column prop="file_name" align="center" label="File name"></el-table-column>
          <el-table-column prop="file_type" align="center" label="File type"></el-table-column>
          <el-table-column prop="creation_date" align="center" label="Creation date"></el-table-column>
          <el-table-column prop="uploading_person" align="center" label="Publisher"></el-table-column>
          <el-table-column prop="result" align="center" label="Result"></el-table-column>
        </el-table>
      </div>

    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        tableData: [],
        listLoading: false,
        pickerOptions2: {
          shortcuts: [{
            text: 'latest week',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: 'latest month',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: 'latest three week',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }]
        },
        form: {
          creation_date_from: ''
        }
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .import{
    margin:25px;
    .confirm {
      background-color: #ffffff;
      height: 40px;
      line-height: 40px;
      label {
        margin-left: 20px;
      }
    }
    .el-input{
      width: 200px;
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
      .info {
        padding: 20px;
        .block{
          height:40px;
          background-color: rgba(51, 51, 51,0.07);
          p{
            line-height: 40px;
            color:rgb(51, 51, 51);
            font-size:13px;
            margin-left:15px;
            label{
              color:#3366FF;
            }

          }
        }
        .upload-history{
          label{
            text-align: right;
            font-size: 14px;
            color: #606266;
          }
        }
      }
    }
  }
</style>
