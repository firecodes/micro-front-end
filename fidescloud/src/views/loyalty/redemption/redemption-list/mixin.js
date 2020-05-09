
export const redeemStatus = {
  methods: {
    handleStatus(val) {
      var arr = ['', 'Redeemed', 'Taken', 'Canceled']
      return arr[parseInt(val)]
    }
  }
}
