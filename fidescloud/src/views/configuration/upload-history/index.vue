<template>
  <div class="uploadHistoryPage">
    <div class="top">
      <!-- pattern -->
      <el-select v-model="patternValue" placeholder="">
        <el-option
          v-for="item in patternList"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <!-- source -->
      <el-select v-model="sourceValue" placeholder="">
        <el-option
          v-for="item in sourceList"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <!-- status -->
      <el-select v-model="statusValue" placeholder="">
        <el-option
          v-for="item in statusList"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <!-- all format -->
      <el-select v-model="formatValue" placeholder="">
        <el-option
          v-for="item in formatList"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <!-- date picker -->
      <el-date-picker
        v-model="datePicker"
        type="daterange"
        :range-separator="handleGlobalI18n('system', 'range_separator')"
        :start-placeholder="handleGlobalI18n('system', 'start_date')"
        :end-placeholder="handleGlobalI18n('system', 'end_date')">
      </el-date-picker>
      <!-- search -->
      <button @click="search" class="el-button el-button--primary el-button--medium">Search</button>
    </div>
    <!-- table -->
    <List :content="query"></List>
  </div>
</template>

<script>
import { queryAll } from '@/api/configuration'
import { Message } from 'element-ui'
import List from './components/list'
import * as filters from '@/filters'
export default {
  components: {
    List
  },
  data() {
    return {
      patternList: [
        {
          value: null,
          label: 'All File Import Pattern'
        }
      ],
      sourceList: [
        {
          value: null,
          label: 'All File Source'
        },
        {
          value: 'sftp',
          label: 'SFTP'
        },
        {
          value: 'local',
          label: 'Local Folder'
        }
      ],
      statusList: [
        {
          value: null,
          label: 'All Status'
        },
        {
          value: 0,
          label: 'Pending'
        },
        {
          value: 1,
          label: 'Progress'
        },
        {
          value: 2,
          label: 'Completed With Errors'
        },
        {
          value: 4,
          label: 'Completed'
        },
        {
          value: -1,
          label: 'Failed Validation'
        },
        {
          value: -2,
          label: 'Canceled'
        },
        {
          value: -4,
          label: 'System Error'
        }
      ],
      formatList: [
        {
          value: null,
          label: 'All Format'
        },
        {
          value: 'txt',
          label: 'TXT'
        },
        {
          value: 'csv',
          label: 'CSV'
        }
      ],
      patternValue: null,
      sourceValue: null,
      statusValue: null,
      formatValue: null,
      datePicker: [],
      query: {}
    }
  },
  created() {
    this.getPatterns()
  },
  methods: {
    getPatterns() {
      queryAll().then(res => {
        if (res.return_result) {
          this.patternList.push(...this.convertKey(res.return_result, ['value', 'label']))
        } else {
          Message({ message: res.msg, type: 'error' })
        }
      }).catch(err => {
        Message({ message: err, type: 'error' })
      })
    },
    convertKey(arr, key) {
      const newArr = []
      arr.forEach((item, index) => {
        const newObj = {}
        for (let i = 0; i < key.length; i++) {
          newObj[key[i]] = item[Object.keys(item)[i]]
        }
        newArr.push(newObj)
      })
      return newArr
    },
    search() {
      const obj = {
        'file_import_pattern_id': this.patternValue,
        'file_source': this.sourceValue,
        'status': this.statusValue,
        'file_format': this.formatValue,
        'process_start_time': this.datePicker[0] ? filters.formatDate(new Date(this.datePicker[0]).valueOf()) : null,
        'process_end_time': this.datePicker[1] ? filters.formatDate(new Date(this.datePicker[1]).valueOf()) : null
      }
      this.query = { ...obj }
    }
  }
}
</script>

<style lang="scss" scoped>
.uploadHistoryPage {
  margin: 29px 24px;
  .top {
    text-align: right;
    margin-bottom: 22px;
  }
}
</style>
