<!--upload-history-->
<template>
  <div class="upload-history">
    <el-form ref="form" :model="form" label-width="80px" >
      <el-row>
        <el-col :xs="12" :sm="12"  :lg="8">
          <el-form-item :label="$t('configuration.fc_configuration_upload_type_lable')">
            <el-select v-model="form.file_type" :placeholder="$t('configuration.fc_configuration_upload_type_input_lable')">
              <el-option :label="$t('configuration.fc_configuration_upload_type_input_menu1_lable')" value="all"></el-option>
              <el-option :label="$t('configuration.fc_configuration_upload_type_input_menu2_lable')" value="store"></el-option>
              <el-option :label="$t('configuration.fc_configuration_upload_type_input_menu3_lable')" value="store_employee"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24"  :lg="8">
          <el-form-item :label="$t('configuration.fc_configuration_upload_date_from_lable')">
            <el-date-picker
              v-model="form.date_from"
              type="daterange"
              align="right"
              unlink-panels
              :range-separator="$t('configuration.fc_configuration_upload_date_to_lable')"
              :format = 'globalData.value.date_format'
              start-placeholder="DD-MM-YYYY"
              end-placeholder="DD-MM-YYYY"
              :picker-options="pickerOptions2" style="margin-left:10px;">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24"  :lg="8">
          <div style="padding-left: 90px">
            <el-button type="primary">{{$t('configuration.fc_configuration_upload_btn_search_lable')}}</el-button>
            <el-button >{{$t('configuration.fc_configuration_upload_btn_export_lable')}}</el-button>
          </div>
        </el-col>
      </el-row>
    </el-form>
     <el-table :data="tableData" v-loading.body="listLoading" :empty-text="$t('member.fc_table_no_data_label')" stripe style="margin-top:20px;">
       <!--ID-->
      <el-table-column prop="id" align="center" :label="$t('configuration.fc_configuration_upload_table_id_lable')" width="95"></el-table-column>
       <!--Upload date-->
      <el-table-column :label="$t('configuration.fc_configuration_upload_table_upload_date_lable')" align="center" prop="upload_date"></el-table-column>
       <!--File name-->
      <el-table-column :label="$t('configuration.fc_configuration_upload_table_name_lable')" align="center" prop="file_name"></el-table-column>
       <!--File type-->
      <el-table-column :label="$t('configuration.fc_configuration_upload_table_type_lable')" align="center" prop="file_type"></el-table-column>
       <!--Creation date-->
      <el-table-column :label="$t('configuration.fc_configuration_upload_table_creation_date_lable')" align="center" prop="creation_date"></el-table-column>
       <!--Publisher-->
      <el-table-column :label="$t('configuration.fc_configuration_upload_table_publisher_lable')" align="center" prop="uploading_person"></el-table-column>
       <!--Result-->
      <el-table-column :label="$t('configuration.fc_configuration_upload_table_result_lable')" align="center" prop="result"></el-table-column>
    </el-table>
  </div>
</template>
<script>
  export default{
    data() {
      return {
        tableData: [
          { id: '1', upload_date: '25/12/2017', file_name: 'member.txt', file_type: 'Member', creation_date: '25/12/2017', uploading_person: 'Done', result: '495/500' },
          { id: '2', upload_date: '21/04/2018', file_name: 'trans.csv', file_type: 'Transaction', creation_date: '21/04/2018', uploading_person: 'Done', result: 'Done' },
          { id: '3', upload_date: '24/04/2018', file_name: 'product.xlsx', file_type: 'Product', creation_date: '24/04/2018', uploading_person: 'Done', result: '45/45' },
          { id: '4', upload_date: '01/05/2018', file_name: 'Store_update.xlsx', file_type: 'Store', creation_date: '01/05/2018', uploading_person: 'Waited', result: '-' }],
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
            text: 'latest three month',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }]
        },
        form: {
          file_type: '',
          date_from: ''
        }
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .upload-history{
    margin:25px;
    .export{
      height:40px;
      line-height:40px;
      background-color: #ffffff;
      label{
        margin-left:15px;
      }
    }
    .el-form{
      margin-top:20px;
      background-color:#f9f9f9 ;
      padding-top:20px;
      .el-select{
        width: 250px;
      }
    }
  }
</style>
