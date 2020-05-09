import { productDetail } from '@/api/product'
export const productDetails = {
  data() {
    return {
      ruleForm: {},
      loading_detail: false,
      dialogImageUrl: '',
      dialogVisible: false,
      fileList: [],
      info: {}
    }
  },
  created() {
    this.init()
  },
  methods: {
    async init() {
      this.loading_detail = true
      await this.getDetail()
      if (this.info.desc) {
        this.info.decode_desc = await this.handleHtml2str(this.info.desc)
      } else {
        this.info.decode_desc = this.info.desc
      }
      this.loading_detail = false
    },
    handleSave() {
      this.$router.push(`/configuration/product/edit/${this.$route.params.id}`)
    },
    getDetail() {
      return productDetail({ id: +this.$route.params.id }).then(res => {
        if (res.return_result) {
          const result = res.return_result.images.reduce((pre, item, index) => {
            pre.push({ url: item, name: index })
            return pre
          }, [])
          this.fileList = result
          this.info = { ... res.return_result }
        } else {
          this.$message.error(res.msg)
        }
      }).catch(err => {
        this.$message.error(err)
      })
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    }
  }
}
