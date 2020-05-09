import {
  transactionList,
  transactionType as transactionTypeApi,
  transactionExport,
  transactionSearch
} from '@/api/transaction'
import {
  queryStoreList,
  queryChannelList
} from '@/api/master'
export const transactionIndex = {
  data() {
    return {
      setnull: false,
      listQuery: {
        asc: false,
        condition: '',
        page_no: 1,
        page_size: 10
      },
      listQueryAdvanced: {
        page_no: 1,
        page_size: 10
      },
      advacnedInfo: {},
      tableData: [],
      total: 0,
      lodingExport: false,
      loading: false,
      active: false,
      loadingAdvanced: false,
      typeList: [],
      channelList: [],
      storelList: [],
      storeCounts: 0,
      loadingStore: false,
      purchasedList: [
        { id: '1', label: 'fc_member_tag_date_select_1st_label', name: 'yesterday' },
        { id: '2', label: 'fc_member_tag_date_select_2nd_label', name: 'recente 7 days' },
        { id: '3', label: 'fc_member_tag_date_select_3rd_label', name: 'recent 30 days' },
        { id: '4', label: 'fc_member_tag_date_select_4th_label', name: 'recent 90 days' },
        { id: '5', label: 'fc_member_tag_date_select_5th_label', name: 'recent 180 days' },
        { id: '6', label: 'fc_member_tag_date_select_6th_label', name: 'recent 12 month' },
        { id: '7', label: 'fc_member_tag_date_select_7th_label', name: 'recent 18 month' },
        { id: '8', label: 'fc_member_tag_date_select_8th_label', name: 'recent 24 month' }
      ],
      storeListQuery: {
        page_no: 1,
        page_size: 20
      }
    }
  },
  methods: {
    init() {
      this.getTransactionList()
    },
    getTransactionList() {
      this.loading = true
      return transactionList({
        ...this.listQuery
      }).then(res => {
        this.loading = false
        if (res.return_result) {
          this.tableData = res.return_result.results
          this.total = res.return_result.total_count
        } else {
          this.$message.error(res.msg)
        }
      }).catch(err => {
        this.loading = false
        this.$message.error(err)
      })
    },
    handleSizeChange(val) {
      this.listQuery.page_size = val
      this.listQueryAdvanced.page_no = 1
      this.listQuery.page_no = 1
      if (this.active && this.advacnedInfo.flag) { // advanced search
        this.listQueryAdvanced.page_size = val
        this.handleAdvancedSearch(this.advacnedInfo, true)
      } else { // normal
        this.getTransactionList(this.listQuery)
      }
    },
    handleCurrentChange(val) {
      this.listQuery.page_no = val
      if (this.active && this.advacnedInfo.flag) {
        this.listQueryAdvanced.page_no = val
        this.handleAdvancedSearch(this.advacnedInfo, true)
      } else {
        this.getTransactionList(this.listQuery)
      }
    },
    handleSearch(val) {
      this.listQuery = {
        asc: false,
        condition: val,
        page_no: 1,
        page_size: 10
      }
      this.setnull = false
      this.listQueryAdvanced.page_no = 1
      this.listQueryAdvanced.page_size = 10
      this.active = false
      this.getTransactionList()
    },
    async handleAdvanced(val) {
      this.active = !this.active
      if (!this.active) {
        this.advacnedInfo = {}
      } else {
        this.loadingAdvanced = true
        this.storelList = []
        this.storeCounts = 0
        this.loadingStore = false
        await this.initStore()
        await this.initChannel()
        await this.initType()
        this.loadingAdvanced = false
      }
    },
    initStore(obj = {}) {
      return queryStoreList(obj).then(res => {
        if (res.return_result) {
          this.storelList = this.storelList.concat(res.return_result.stores)
          this.storeCounts = res.return_result.total_count
        } else {
          this.$message.error(res.msg)
        }
      }).catch(err => {
        this.$message.error(err)
      })
    },
    initChannel() {
      return queryChannelList({}).then(res => {
        if (res.return_result) {
          this.channelList = res.return_result.channels || []
        } else {
          this.$message.error(res.msg)
        }
      }).catch(err => {
        this.$message.error(err)
      })
    },
    initType() {
      return transactionTypeApi({
        asc: false,
        condition: '',
        page_no: 1,
        page_size: 1000
      }).then(res => {
        if (res.return_result) {
          this.typeList = res.return_result.results
        } else {
          this.$message.error(res.msg)
        }
      }).catch(err => {
        this.$message.error(err)
      })
    },
    handleAdvancedSearch(val, flag) {
      // flag: 1 表示点击高级搜索且点击了其下面的搜索按钮
      if (!flag) {
        this.listQueryAdvanced = { page_no: 1, page_size: 10 }
        this.listQuery = { page_no: 1, page_size: 10, condition: '' }
      }
      this.setnull = true
      this.advacnedInfo = { ...val, flag: 1 }
      this.loading = true
      const { transactionChannel, transactionCode, transactionType, start_time, end_time, transactionStore, memberName } = val
      return transactionSearch({
        asc: false,
        channel: transactionChannel,
        code: transactionCode,
        member_name: memberName,
        store: transactionStore,
        type: transactionType,
        purchase_time_start: start_time,
        purchase_time_end: end_time,
        ...this.listQueryAdvanced
      }).then(res => {
        this.loading = false
        if (res.return_result) {
          this.tableData = res.return_result.results
          this.total = res.return_result.total_count
        } else {
          this.$message.error(res.msg)
        }
      }).catch(err => {
        this.loading = false
        this.$message.error(err)
      })
    },
    reGetStore() {
      if (this.storelList.length >= this.storeCounts) {
        this.loadingStore = false
        return
      }
      this.loadingStore = true
      ++this.storeListQuery.page_no
      this.initStore({ ...this.storeListQuery })
    },
    handleExport() {
      this.lodingExport = true
      if (!this.active) {
        this.advacnedInfo = {}
      }
      const { transactionCode = null, transactionType = null, transactionChannel = null, transactionStore = null, start_time = null, end_time = null, memberName = null } = this.advacnedInfo
      const obj = {
        'asc': false,
        'coding': 'utf-8',
        'code': transactionCode,
        'type': transactionType,
        'channel': transactionChannel,
        'store': transactionStore,
        'purchase_time_start': start_time,
        'purchase_time_end': end_time,
        'member_name': memberName,
        'page_no': null,
        'page_size': 5000,
        'currency': this.globalData.value.currency_symbol,
        'header': {
          'index': this.handleGlobalI18n('system', 'index'),
          'channel_name': this.$t('configuration.fc_transaction_table_channel_label'),
          'member_name': this.$t('configuration.fc_transaction_table_member_name_label'),
          'store_name': this.$t('configuration.fc_transaction_table_store_label'),
          'transaction_amount': this.$t('configuration.fc_transaction_table_amount_label'),
          'transaction_code': this.$t('configuration.fc_transaction_table_code_label'),
          'transaction_time': this.$t('configuration.fc_transaction_table_time_label'),
          'transaction_type': this.$t('configuration.fc_transaction_table_type_label')
        }
      }
      return transactionExport({ ...obj }).then(res => {
        this.lodingExport = false
        if (res.return_result) {
          const url = res.return_result.url
          const link = document.createElement('a')
          link.href = url
          link.setAttribute('download', 'transaction.csv')
          document.body.appendChild(link)
          link.click()
        } else {
          this.$message.error(res.msg)
        }
      }).catch(err => {
        this.lodingExport = false
        this.$message.error(err)
      })
    }
  }
}
