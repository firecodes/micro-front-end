import { uploadImage } from "@/api/master";
import { projectName } from "@/api/api";
import {
  addProduct as addNewProduct,
  getCategoryList,
  productDetail,
  editProduct,
  productCheckCode,
  getBrandList
} from "@/api/product";
export const addProduct = {
  data() {
    const validateUnit = (rule, value, callback) => {
      // 整数部分最多为15位
      if (value) {
        const temp = String(value).split(".");
        // 说明第一个输入的小数点 小数点前面没有其它数字 .2
        if (temp[0] === "") {
          return callback(new Error(" "));
        }
        // 说明3.这种情况
        if (temp[temp.length - 1] === "") {
          return callback(new Error(" "));
        }
        // 如果数组长度为3及其以上 也是error
        if (temp.length >= 3) {
          return callback(new Error(" "));
        }
        if (temp[0].length > 15) {
          return callback(new Error(" "));
        } else {
          // this.changeUnitPrice('unit')
          callback();
        }
      } else {
        // this.changeUnitPrice('unit')
        callback();
      }
    };
    const validateMarketPrice = (rule, value, callback) => {
      // 整数部分最多为9位
      if (value) {
        const temp = String(value).split(".");
        if (temp[0] === "") {
          return callback(new Error(" "));
        }
        if (temp[temp.length - 1] === "") {
          return callback(new Error(" "));
        }
        if (temp.length >= 3) {
          return callback(new Error(" "));
        }
        if (temp[0].length > 9) {
          return callback(new Error(" "));
        } else {
          this.changeUnitPrice("marketPrice");
          callback();
        }
      } else {
        this.changeUnitPrice("marketPrice");
        callback();
      }
    };
    const validatePrice = (rule, value, callback) => {
      // 整数部分最多为9位
      if (value) {
        const temp = String(value).split(".");
        if (temp[0] === "") {
          return callback(new Error(" "));
        }
        if (temp[temp.length - 1] === "") {
          return callback(new Error(" "));
        }
        if (temp[0].length > 9) {
          return callback(new Error(" "));
        } else {
          this.changeUnitPrice("price");
          callback();
        }
      } else {
        this.changeUnitPrice("price");
        callback();
      }
    };
    return {
      unitlist: [
        {
          id: 1,
          label: "ml"
        },
        {
          id: 2,
          label: "g"
        }
      ],
      currencyList: [],
      loading: false,
      saveloading: false,
      ruleForm: {
        code: "",
        name: "",
        brand: "",
        category: "",
        subCategory: "",
        unit: "",
        marketPrice: "",
        price: "",
        image: "",
        checked: false,
        unitselect: "ml",
        retailpriceselect: "",
        purpriceselect: "",
        detailInformation: "",
        detailUrl: ""
      },
      fileList: [],
      brandsList: [],
      categorysList: [],
      subCategorysList: [],
      dialog_brand_show: false,
      dialog_category_show: false,
      dialog_sub_category_show: false,
      dialog_category_id: "",
      dialogVisible: false,
      upload_img_url: "",
      image_url: [],
      file: "",
      rules: {
        name: [{ required: true, message: " ", trigger: "blur" }],
        code: [
          { required: true, validator: this.handleBlurCode, trigger: "blur" }
        ],
        unit: [{ validator: validateUnit, trigger: ["change", "blur"] }],
        marketPrice: [
          { validator: validateMarketPrice, trigger: ["change", "blur"] }
        ],
        price: [{ validator: validatePrice, trigger: ["change", "blur"] }]
      },
      uploadImageLoading: false,
      parentCategoty: {
        page_no: 1,
        page_size: 10000000
      }
    };
  },
  computed: {
    computedImageUrl() {
      if (this.image_url.length >= 3) {
        return "hide";
      } else {
        return "";
      }
    }
  },
  watch: {
    "ruleForm.detailInformation": {
      handler(val) {
        if (val && val.length > 400000) {
          this.ruleForm.detailInformation = val.substr(0, 400000);
        }
      }
    }
  },
  methods: {
    async getProductDetail(id) {
      this.loading = true;
      await productDetail({ id })
        .then(async res => {
          if (res.return_result) {
            const {
              code,
              name,
              brand,
              brand_name,
              category,
              category_name,
              parent_category,
              parent_category_name,
              unit,
              retail_market_price,
              purchased_price,
              images,
              desc
            } = res.return_result;
            this.ruleForm.code = code;
            this.ruleForm.name = name;
            this.ruleForm.brand = brand_name ? (+brand === 0 ? "" : brand) : "";
            this.ruleForm.category = parent_category_name
              ? +parent_category === 0
                ? ""
                : parent_category
              : "";
            await this.getAllSubCategory(this.ruleForm.category);
            this.ruleForm.subCategory = category_name
              ? +category === 0
                ? ""
                : category
              : "";
            if (unit) {
              const tempArr = unit.split(" ");
              if (tempArr[0] === "") {
                this.ruleForm.unit = "";
                this.ruleForm.unitselect = "ml";
              } else {
                this.ruleForm.unit = tempArr[0];
                this.ruleForm.unitselect = tempArr[1];
              }
            } else {
              this.ruleForm.unit = unit;
              this.ruleForm.unitselect = "ml";
            }
            this.ruleForm.marketPrice = retail_market_price;
            this.ruleForm.price = purchased_price;
            this.ruleForm.desc = desc;
            this.image_url = images;
            this.fileList = images.map(item => {
              return { url: item };
            });
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(err => {
          this.loading = false;
          this.$message.error(err);
        });
      if (this.ruleForm.desc) {
        this.ruleForm.detailInformation = await this.handleHtml2str(
          this.ruleForm.desc
        );
      } else {
        this.ruleForm.detailInformation = "";
      }
      this.loading = false;
    },
    getCurrency() {
      const currency = this.globalData.value.currency_symbol;
      this.ruleForm.retailpriceselect = currency;
      this.ruleForm.purpriceselect = currency;
      this.currencyList.push({ id: 1, label: currency });
    },
    handleAddBrand() {
      this.dialog_brand_show = true;
    },
    closeAddBrand() {
      this.dialog_brand_show = false;
    },
    updateBrandDatas(arg) {
      this.getAllBrand();
      // let flag = false
      // datas.forEach(item => {
      //   if (item.id === this.ruleForm.brand) {
      //     flag = true // 说明并未删除
      //   }
      // })
      // if (!flag) { // 已经删除
      //   this.ruleForm.brand = ''
      // }
      // this.brandsList = datas.filter((item) => item.id !== '' && item.name !== '')
    },
    handleChangeCategory(id) {
      this.ruleForm.subCategory = "";
      this.getAllSubCategory(id);
    },
    // 获取brand
    getAllBrand() {
      return getBrandList({ page_no: 1, page_size: 1000 })
        .then(res => {
          if (res.return_result) {
            const temp = res.return_result.results || [];
            temp.sort((a, b) => a.name.localeCompare(b.name));
            this.brandsList = temp;
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(err => {
          this.$message.error(err);
        });
    },
    // 获取category
    getParentCategory() {
      return getCategoryList(this.parentCategoty)
        .then(res => {
          if (res.return_result) {
            let temp = res.return_result.results;
            temp = temp.filter(item => {
              return !item.category_parent_id;
            });
            temp.sort((a, b) => a.name.localeCompare(b.name));
            this.categorysList = temp;
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(err => {
          this.$message.error(err);
        });
    },
    // 获取子sub category
    getAllSubCategory(id) {
      return getCategoryList({
        page_no: 1,
        page_size: 1000000,
        category_parent_id: +id || null
      })
        .then(res => {
          if (res.return_result) {
            let temp = res.return_result.results || [];
            temp = temp.filter(item => {
              return item.category_parent_id;
            });
            temp.sort((a, b) => a.name.localeCompare(b.name));
            this.subCategorysList = temp;
            if (!this.subCategorysList.length) {
              this.ruleForm.subCategory = "";
            }
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(err => {
          this.$message.error(err);
        });
    },
    handleAddCategory() {
      this.dialog_category_show = true;
    },
    closeAddCategory() {
      this.dialog_category_show = false;
    },
    updateCategoryDatas(arg) {
      this.getParentCategory();
      // let flag = false
      // datas.forEach(item => {
      //   if (item.id === this.ruleForm.category) {
      //     flag = true // 说明并未删除
      //   }
      // })
      // if (!flag) { // 已经删除
      //   this.ruleForm.category = ''
      // }
      // this.categorysList = datas.filter(item => item.id !== '' && item.name !== '')
    },
    closeAddSubCategory() {
      this.dialog_sub_category_show = false;
    },
    updateSubCategoryDatas(arg) {
      this.getAllSubCategory(this.ruleForm.category);
      // let flag = false
      // datas.forEach(item => {
      //   if (item.id === this.ruleForm.subCategory) {
      //     flag = true // 说明并未删除
      //   }
      // })
      // if (!flag) { // 已经删除
      //   this.ruleForm.subCategory = ''
      // }
      // this.subCategorysList = datas.filter(item => item.id !== '' && item.name !== '')
    },
    handleAddSubCategory() {
      // 获取的父级选中的category id 传递给subCategory组件
      this.dialog_category_id = this.ruleForm.category;
      this.dialog_sub_category_show = true;
    },
    handleRemove(file, fileList, flag) {
      let imgType = sessionStorage.getItem("img_type");
      if (imgType && file.status === "success") {
        imgType = JSON.parse(imgType);
        const index = imgType.indexOf(file.name);
        imgType.splice(index, 1);
        sessionStorage.setItem("img_type", JSON.stringify(imgType));
      }
      for (let i = 0; i < this.image_url.length; i++) {
        if (file.status === "success") {
          if (!file.name) {
            if (file.url === this.image_url[i]) {
              this.image_url.splice(i, 1);
            }
          } else if (this.image_url[i].name === file.name) {
            this.image_url.splice(i, 1);
          }
        }
      }
    },
    async loadImage(file) {
      return new Promise((resolve, reject) => {
        const _URL = window.URL || window.webkitURL;
        const img = new Image();
        img.onload = () => {
          resolve("success");
        };
        img.src = _URL.createObjectURL(file);
      });
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      const whiteList = ["jpg", "png", "jpeg", "tag", "exif", "fpx", "webp"];
      let imgType = sessionStorage.getItem("img_type");
      if (imgType) {
        imgType = JSON.parse(imgType);
      } else {
        imgType = [];
      }
      // 需要判断当前名称当前类型的图片是否已经上传成功，如果是，则拒绝上传
      let isGoOnUpload = true;
      for (let i = 0; i < this.image_url.length; i++) {
        if (this.image_url[i].name === file.name) {
          isGoOnUpload = false;
          break;
        }
      }
      if (!isGoOnUpload) {
        file.times = "error";
        this.$message.error(
          "Uploading pictures with the same name (i.e. the same name and format) is not allowed"
        );
        return false;
      }
      const names = file.name.split(".");
      if (whiteList.indexOf(names[names.length - 1]) < 0) {
        this.$message.error(
          this.handleGlobalI18n("validation", "upload_image_type_error")
        );
        return false;
      }
      if (!isLt2M) {
        this.$message.error(
          this.handleGlobalI18n("validation", "upload_gift_size_error")
        );
        return false;
      }
      if (imgType.includes(file.name)) {
        file.times = "error";
        this.$message.error(
          "Uploading pictures with the same name (i.e. the same name and format) is not allowed"
        );
        return false;
      }
      imgType.push(file.name);
      sessionStorage.setItem("img_type", JSON.stringify(imgType));
      this.file = file;
      this.loadImage(file);
    },
    handleHttpRequest() {
      this.uploadImageLoading = true;
      if (this.file === "" || this.file === undefined) {
        return true;
      }
      this.upload_loading = true;
      // this.image_url = []
      var formData = new FormData();
      formData.append("file", this.file);
      // formData.append('oldUrl', this.image_url)
      formData.append("project", projectName);
      formData.append("module", "gift");
      return uploadImage(formData)
        .then(res => {
          this.uploadImageLoading = false;
          this.image_url.push({
            url: res.return_result.url[0],
            name: this.file.name
          });
          this.upload_loading = false;
          this.file = "";
        })
        .catch(() => {
          this.uploadImageLoading = false;
          this.upload_loading = false;
        });
    },
    changeCode() {
      this.$nextTick(() => {
        if (this.ruleForm.code) {
          this.ruleForm.code = this.ruleForm.code.replace(
            /[\u4E00-\u9FA5]/g,
            ""
          );
        }
      });
    },
    changeUnitPrice(type) {
      this.$nextTick(() => {
        if (this.ruleForm[type]) {
          this.replaceDot(this.ruleForm[type], type);
          this.ruleForm[type] = String(this.ruleForm[type]).replace(
            /[^\d.]/g,
            ""
          );
          const arr = String(this.ruleForm[type]).split(".");
          if (arr.length === 2) {
            if (arr[1].length > 2) {
              this.ruleForm[type] = Number(+this.ruleForm[type]).toFixed(2);
            }
          }
        }
      });
    },
    replaceDot(val, type) {
      let flag = true;
      val &&
        String(val).replace(/\./gi, (a, b, c) => {
          if (!flag) {
            // 不是第一个
            this.ruleForm[type] = this.ruleForm[type].substring(
              0,
              this.ruleForm[type].lastIndexOf(".")
            );
            return "";
          } else {
            flag = false;
            return ".";
          }
        });
    },
    editors(content) {
      this.ruleForm.detailInformation = content;
    },
    handleBlurCode(rule, value, callback) {
      if (this.$route.params.id) {
        callback();
        return;
      }
      if (this.ruleForm.checked) {
        callback();
        return;
      } else {
        if (!value) {
          callback(new Error(" "));
          return;
        }
        if (value && !value.trim()) {
          callback(new Error(" "));
          return;
        }
      }
      return productCheckCode({ code: value.trim() })
        .then(res => {
          if (res.return_result) {
            if (res.return_result.success) {
              // 此code已经存在
              callback(new Error("product already exists"));
            } else {
              // 此code没有存在
              callback();
            }
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(err => {
          callback(new Error(" "));
          this.$message.error(err);
        });
    },
    handleClickSave() {
      this.$refs["ruleForm"].validate(async valid => {
        if (valid) {
          // 处理editor
          this.saveloading = true;
          if (this.ruleForm.detailInformation) {
            await this.handleStr2html(this.ruleForm.detailInformation, true)
              .then(url => {
                this.ruleForm.detailUrl = url;
              })
              .catch(() => {
                this.saveloading = false;
                this.$message.error("Fail");
              });
          }
          const {
            brand,
            category,
            subCategory,
            code,
            name,
            unit,
            marketPrice: retail_market_price,
            price: purchased_price,
            detailUrl,
            checked,
            unitselect
          } = this.ruleForm;
          this.image_url = this.image_url.reduce((pre, item) => {
            if (item === null || !item.url) {
              pre.push(item);
            } else {
              pre.push(item.url);
            }
            return pre;
          }, []);
          const paramsData = {
            automated_generated: checked,
            brand: brand === "" ? 0 : brand,
            // 现在的sub category
            category:
              category === "" ? 0 : subCategory === "" ? 0 : subCategory,
            // 之前的category
            category_parent: category === "" ? 0 : category,
            code: code ? code.trim() : "",
            name: name ? name.trim() : "",
            unit: String(unit) ? unit + " " + unitselect : "",
            retail_market_price: retail_market_price || 0,
            purchased_price: purchased_price || 0,
            detail_info: detailUrl,
            images: this.image_url
          };
          if (this.$route.params.id) {
            return editProduct({
              ...paramsData,
              id: this.$route.params.id
            })
              .then(res => {
                this.saveloading = false;
                if (res.return_result) {
                  sessionStorage.removeItem("img_type");
                  this.$message.success(
                    this.$t("member.fc_member_group_edit_feedback_label")
                  );
                  setTimeout(() => {
                    this.$router.push("/configuration/product");
                  }, 1000);
                } else {
                  this.$message.error(res.msg);
                }
              })
              .catch(err => {
                this.saveloading = false;
                this.$message.error(err);
              });
          }
          return addNewProduct({
            ...paramsData
          })
            .then(res => {
              this.saveloading = false;
              if (res.return_result) {
                this.$message.success(
                  this.$t("member.fc_member_tag_add_feedback_label")
                );
                sessionStorage.removeItem("img_type");
                setTimeout(() => {
                  this.$router.push("/configuration/product");
                }, 1000);
              } else {
                this.$message.error(res.msg);
              }
            })
            .catch(err => {
              this.saveloading = false;
              this.$message.error(err);
            });
        }
      });
    }
  }
};
