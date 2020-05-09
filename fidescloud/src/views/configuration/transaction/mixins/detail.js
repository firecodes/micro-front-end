import {
  transactionDetail as transactionDetails
} from '@/api/transaction'
export const transactionDetail = {
  data() {
    return {
      loading: false,
      ruleForm: {},
      rules: {}
    }
  },
  methods: {
    init() {
      this.getdetail()
    },
    hrefsSkip(url, id) {
      return this.getHostInfo(url, id)
    },
    hrefStore(url, id) {
      return this.getHostInfo(url, id)
    },
    hrefAssisant(url, id) {
      return this.getHostInfo(url, id)
    },
    getHostInfo(api, id) {
      const host = location.host
      const protocol = location.protocol
      return protocol + '//' + host + api + id
    },
    getdetail() {
      this.loading = true
      return transactionDetails({ id: this.$route.params.id }).then(res => {
        setTimeout(() => {
          this.loading = false
        }, 1000)
        if (res.return_result) {
          const payment_method = res.return_result.payment_list.reduce((pre, item) => {
            pre.push(item.payment_method)
            return pre
          }, []).join(',')
          if (res.return_result.relate_list === null || res.return_result.relate_list === '') {
            res.return_result.relate_list = []
          }
          this.ruleForm = { ...res.return_result, payment_method }
        } else {
          this.$message.error(res.msg)
        }
      }).catch(err => {
        this.loading = false
        this.$message.error(err)
      })
    }
  }
}
