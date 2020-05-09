<template>
      <el-select
        clearable
        v-selectLoadmore="selectLoadmore"
        v-model="staff"
        :disabled="disabled"
        :placeholder="$t('member.fc_member_recruitment_registration_staff_input_label')"
        filterable
        style="width:100%"
        @change = "change"
      >
        <el-option
          v-for="(item,index) in list"
          :key="index + item.employee_code"
          :label="item.full_name"
          :value="item.employee_code">
        </el-option>
        <div style="text-align: center" >
          <!-- <i class="el-icon-loading"  v-if="list.length<total_count"></i>
          <span style="font-size:13px;" v-if="list.length>=total_count && page>1">{{handleGlobalI18n('system', 'after_loaded')}}</span> -->
          <span style="font-size:13px;" v-if="list.length>=total_count"></span>
          <i class="el-icon-loading"  v-else></i>
        </div>
      </el-select>
</template>
<script>
  import { queryEmployeeList } from '@/api/master'
  import { pageLimit } from '@/api/api'
  export default{
    props: {
      disabled: {
        type: Boolean,
        default: false
      },
      value: {
        type: String,
        default: ''
      },
      parentStoreCode: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        staff: '',
        list: [],
        total_count: 0,
        page: ''
      }
    },
    methods: {
      selectLoadmore() {
        if (this.list.length >= this.total_count) {
          return
        }
        this.getStaffList()
      },
      getStaffList() {
        this.page = ++this.page
        queryEmployeeList({
          store_code: this.parentStoreCode,
          page_no: this.page,
          page_size: pageLimit
        }).then((res) => {
          this.total_count = res.return_result.total_count
          this.list = this.list.concat(res.return_result.employees)
        }).catch((res) => {
          // this.$message(res.return_message)
        })
      },
      change() {
        this.$emit('registration_staff', { value: this.staff, type: 'staff' })
      }
    },
    watch: {
      parentStoreCode(newValue, oldValue) {
        if (this.parentStoreCode.length > 0 && newValue !== oldValue) {
          [this.staff, this.list, this.page, this.total_count] = ['', [], 0, 0]
          this.getStaffList()
        }
      },
      value() {
        this.staff = this.value
      }
    }
  }
</script>
<style scoped lang="scss" rel="stylesheet/scss"></style>
