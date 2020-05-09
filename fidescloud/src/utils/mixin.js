export const GlobalMixin = {
  data() {
    return {
    }
  },
  methods: {
    deleteItem(title = 'Delete', content = 'Are you sure delete?') {
      return new Promise((resolve, reject) => {
        this.$confirm(content, title, {
          dangerouslyUseHTMLString: true,
          confirmButtonText: this.$t('loyalty.fc_operation_btn_confirm_label'),
          cancelButtonText: this.$t('loyalty.fc_operation_btn_cancel_label')
        }).then(() => {
          resolve()
        }).catch(() => {
          reject()
        })
      })
    }
  }
}
