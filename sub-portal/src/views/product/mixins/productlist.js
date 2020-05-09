import {
  getProductList,
  deleteProduct,
  getBrandList,
  getCategoryList,
  advancedSearch,
  productExport
} from "@/api/product";
export const productListMixins = {
  data() {
    return {
      setnull: false,
      advanced: false,
      loadingTable: true,
      loadingSearch: true,
      loadingExport: false,
      list: [],
      total_count: "",
      active: false,
      brandList: [],
      categoryList: [],
      advacnedInfo: {},
      listQueryAdvanced: {
        page_no: 1,
        page_size: 10
      },
      listQuery: {
        page_no: 1,
        asc: false,
        page_size: 10,
        condition: ""
      }
    };
  },
  methods: {
    getList() {
      console.log(11111);
      return getProductList(this.listQuery)
        .then(res => {
          console.log(11111, res);
          if (res.return_result) {
            const result = res.return_result;
            this.total_count = result.total_count;
            this.list = result.results;
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(err => {
          this.$message.error(err);
        });
    },
    getBrand() {
      return getBrandList({
        condition: "",
        id_list: [],
        page_no: 1,
        page_size: 1000
      })
        .then(res => {
          if (res.return_result) {
            this.brandList = res.return_result.results;
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(err => {
          this.$message.error(err);
        });
    },
    getCategory() {
      return getCategoryList({
        condition: "",
        id_list: [],
        page_no: 1,
        page_size: 1000
      })
        .then(res => {
          if (res.return_result) {
            this.categoryList = res.return_result.results;
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(err => {
          this.$message.error(err);
        });
    },
    async handleAdvacedSearch(query, flag) {
      if (!flag) {
        this.listQueryAdvanced = { page_no: 1, page_size: 10 };
        this.listQuery = {
          page_no: 1,
          page_size: 10,
          condition: "",
          asc: false
        };
      }
      // 告诉search组件的input，把值设置为空
      this.setnull = true;
      // flag: 1，表示点击高级搜索按钮之后，还点击了search按钮
      this.advacnedInfo = { ...query, flag: 1 };
      this.loadingTable = true;
      await advancedSearch({ ...query, ...this.listQueryAdvanced })
        .then(res => {
          if (res.return_result) {
            const result = res.return_result;
            this.total_count = result.total_count;
            this.list = result.results;
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(err => {
          this.$message.error(err);
        });
      this.loadingTable = false;
    },
    handleDelete(id) {
      this.deleteItem(
        this.$t("loyalty.fc_operation_delete_confirm_title_label"),
        this.$t("configuration.fc_product_delete_popup_content_label")
      )
        .then(() => {
          this.loadingTable = true;
          return deleteProduct({
            id
          })
            .then(async res => {
              if (res.return_result) {
                this.listQuery = {
                  page_no: 1,
                  page_size: this.listQuery.page_size,
                  condition: "",
                  asc: false
                };
                this.$message.success(
                  this.$t(
                    "configuration.fc_operation_feedback_notification_label"
                  )
                );
                await this.getList();
                this.loadingTable = false;
              } else {
                this.$message.error(res.msg);
              }
            })
            .catch(err => {
              this.loadingTable = false;
              this.$message.error(err);
            });
        })
        .catch(() => {
          this.loadingTable = false;
        });
    },
    async handleSearch(val) {
      this.setnull = false;
      this.loadingTable = true;
      this.listQuery.page_no = 1;
      this.listQuery.page_size = 10;
      this.listQuery.condition = val;
      this.listQuery.asc = false;
      this.listQueryAdvanced.page_no = 1;
      this.listQueryAdvanced.page_size = 10;
      this.active = false;
      await this.getList();
      this.loadingTable = false;
    },
    async handleAdvanced() {
      this.active = !this.active;
      if (!this.active) {
        this.advacnedInfo = {};
      }
      if (this.loadingSearch) {
        await this.getCategory();
        await this.getBrand();
        this.loadingSearch = false;
      }
    },
    async handleCurrentChange(val) {
      this.loadingTable = true;
      this.listQuery.page_no = val;
      if (this.active && this.advacnedInfo.flag) {
        // advanced search
        this.listQueryAdvanced.page_no = val;
        await this.handleAdvacedSearch(this.advacnedInfo, true);
      } else {
        // normal
        await this.getList();
      }
      this.loadingTable = false;
    },
    async handleSizeChange(val) {
      this.loadingTable = true;
      this.listQuery.page_no = 1;
      this.listQuery.page_size = val;
      this.listQueryAdvanced.page_no = 1;
      if (this.active && this.advacnedInfo.flag) {
        // advanced search
        this.listQueryAdvanced.page_size = val;
        await this.handleAdvacedSearch(this.advacnedInfo, true);
      } else {
        // is normal
        await this.getList();
      }
      this.loadingTable = false;
    },
    handleExport() {
      this.loadingExport = true;
      if (!this.active) {
        this.advacnedInfo = {};
      }
      const {
        code = null,
        name = null,
        category = null,
        brand = null
      } = this.advacnedInfo;
      const obj = {
        asc: false,
        coding: "utf-8",
        code: code,
        name: name,
        category: category,
        brand: brand,
        page_no: null,
        page_size: 5000,
        is_code_and_name: false,
        currency: "¥",
        header: {
          code: this.$t("configuration.fc_product_table_code_label"),
          name: this.$t("configuration.fc_product_table_name_label"),
          category: this.$t("configuration.fc_product_table_category_label"),
          unit: this.$t("configuration.fc_product_table_unit_label"),
          brand: this.$t("configuration.fc_product_table_brand_label"),
          retail_market_price: this.$t(
            "configuration.fc_product_table_market_price_label"
          ),
          purchased_price: this.$t(
            "configuration.fc_product_table_purchased_price_label"
          )
        }
      };
      return productExport({ ...obj })
        .then(res => {
          this.loadingExport = false;
          if (res.return_result) {
            const url = res.return_result.url;
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "product.csv");
            document.body.appendChild(link);
            link.click();
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(err => {
          this.loadingExport = false;
          this.$message.error(err);
        });
    }
  }
};
