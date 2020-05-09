<template>
  <div class="header2Component">
    <el-row :gutter="20">
      <el-col :lg="6" :md="12" :sm="12" :xs="24">
        <span>Execution Status :&nbsp;</span><span>Failure</span>
      </el-col>
      <el-col :lg="6" :md="12" :sm="12" :xs="24">
        <span>Total Errors :&nbsp;</span><span><span>1998</span>/2000</span>
      </el-col>
      <el-col :lg="6" :md="12" :sm="12" :xs="24">
        <span>Execution Start Time :&nbsp;</span><span>25/9/2019 9:00:00</span>
      </el-col>
      <el-col :lg="6" :md="12" :sm="12" :xs="24">
        <span>Execution End Time :&nbsp;</span><span>25/9/2019 9:15:00</span>
      </el-col>
    </el-row>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="Basic Info" name="basic"></el-tab-pane>
      <el-tab-pane label="Template Info" name="template"></el-tab-pane>
      <el-tab-pane label="File Location" name="file"></el-tab-pane>
      <el-tab-pane label="Schedule Info" name="schedule"></el-tab-pane>
      <!-- basic info -->
      <div v-if="activeName === 'basic'">
        <el-row :gutter="20">
          <el-col :lg="6" :md="12" :sm="12" :xs="24">
            <span>File Import Name :&nbsp;</span><span>Member Import</span>
          </el-col>
          <el-col :lg="6" :md="12" :sm="12" :xs="24">
            <span>File Format :&nbsp;</span><span>TXT</span>
          </el-col>
          <el-col :lg="6" :md="12" :sm="12" :xs="24">
            <span>Separator :&nbsp;</span><span>\\</span>
          </el-col>
          <el-col :lg="6" :md="12" :sm="12" :xs="24">
            <span>Need File Header :&nbsp;</span><span>Need</span>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :lg="6" :md="12" :sm="12" :xs="24">
            <span>File Encoder :&nbsp;</span><span>UTF-8</span>
          </el-col>
          <el-col :lg="6" :md="12" :sm="12" :xs="24">
            <span>File Name Pattern :&nbsp;</span><span>(.*)_Member_(\d*).csv - Limit the file name</span>
          </el-col>
        </el-row>
      </div>
      <!-- template -->
      <el-table
        v-if="activeName === 'template'"
        :data="tableData"
        border
        style="width: 100%">
        <el-table-column
          align="center"
          type="index"
          width="50">
        </el-table-column>
        <el-table-column
          prop="fieldname"
          label="Field Name"
          width="180">
        </el-table-column>
        <el-table-column
          prop="fieldtype"
          label="Field Type"
          width="180">
        </el-table-column>
        <el-table-column
          prop="mandatory"
          label="Mandatory">
        </el-table-column>
        <el-table-column
          prop="unique"
          label="Unique Field">
        </el-table-column>
        <el-table-column
          prop="maxlength"
          label="Maxlength">
        </el-table-column>
        <el-table-column
          prop="minimumLength"
          label="Minimum Length">
        </el-table-column>
        <el-table-column
          prop="maximumValue"
          label="Maximum Value">
        </el-table-column>
        <el-table-column
          prop="minimumValue"
          label="Minimum Value">
        </el-table-column>
      </el-table>
      <!-- file location -->
      <el-row :gutter="20" v-if="activeName === 'file'">
        <el-col :lg="6" :md="12" :sm="12" :xs="24">
          <span>File Type :&nbsp;</span><span>SFTP</span>
        </el-col>
        <el-col :lg="6" :md="12" :sm="12" :xs="24">
          <span>SFTP URL :&nbsp;</span><span>sftp username@remote ip</span>
        </el-col>
        <el-col :lg="6" :md="12" :sm="12" :xs="24">
          <span>SFTP Account :&nbsp;</span><span>Jenny970215</span>
        </el-col>
        <el-col :lg="6" :md="12" :sm="12" :xs="24">
          <span>SFTP Password :&nbsp;</span><span>**********</span>
        </el-col>
      </el-row>
      <!-- schedule -->
      <el-row :gutter="20" v-if="activeName === 'schedule'">
        <el-col :lg="6" :md="12" :sm="12" :xs="24">
          <span>Timing :&nbsp;</span><span>Weekly&nbsp; -&nbsp; Monday&nbsp; -&nbsp; 02:00:00</span>
        </el-col>
      </el-row>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeName: 'basic',
      tableData: [
        {
          fieldname: 'Last name',
          fieldtype: '',
          mandatory: 'Yes',
          unique: 'Yes',
          maxlength: '',
          minimumLength: '',
          maximumValue: '',
          minimumValue: ''
        }
      ]
    }
  },
  methods: {
    handleClick(tab, event) {
    }
  }
}
</script>

<style lang="scss" scoped>
.header2Component {
  font-size: 16px;
  color: rgba(16, 16, 16, 1);
  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
}
</style>
