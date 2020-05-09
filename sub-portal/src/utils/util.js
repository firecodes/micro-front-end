import router from "../router";
import Loading from "@/components/Loading";
import store from "../store";
const moment = require("moment");
var i18n_data = store.getters.i18n_data;
var global_items = store.getters.global_data;
var business_data = store.getters.business_data.common;
export default {
  install(Vue, options) {
    // 返回上一页面
    Vue.prototype.goBack = () => {
      router.go(-1);
    };
    // 过滤下拉信息
    Vue.prototype.createFilter = queryString => {
      return item => {
        return (
          item.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1
        );
      };
    };
    // i18n
    Vue.prototype.handleGlobalI18n = (module, key) => {
      const module_list = i18n_data[store.getters.language].language.module;
      // var i18n_data = store.getters.i18n_data
      // const module_list = i18n_data.module
      const has = Object.prototype.hasOwnProperty;
      if (!has.call(module_list, module) && !has.call(module_list, "system")) {
        return "-";
      }
      const module_data = module_list[module];
      if (has.call(module_data, key)) {
        return module_data[key];
      } else {
        if (has.call(module_list["system"], key)) {
          return module_list["system"][key];
        } else {
          return "-";
        }
      }
    };
    // 定义日期格式1
    // Vue.prototype.date_format = 'dd/MM/yyyy'
    Vue.prototype.date_format = "yyyy/MM/dd";
    // 表格省略字符
    Vue.prototype.table_placeholder = "-";
    // Global
    Vue.prototype.globalData = {
      value: {
        ...global_items,
        ...business_data
      },
      // currency_symbol
      // 格式化数字
      formatNumber: (data, fixed = 0) => {
        if (data && typeof data === "number") {
          var _this = Vue.prototype.globalData.value;
          const thousandsSeparator = _this.thousandsSeparator || ",";
          return data
            .toFixed(fixed)
            .replace(
              /\d{1,3}(?=(\d{3})+(\.\d*)?$)/g,
              `$&${thousandsSeparator}`
            );
        } else {
          return data;
        }
      },
      // 格式化日期
      formatDate: val => {
        if (val === null || val === undefined) {
          return "";
        }
        var _this = Vue.prototype.globalData.value;
        var date_format = _this.date_format.toUpperCase();
        return moment(val).format(date_format);
      },
      // 验证手机号
      validateMobile: str => {
        // "mobile_format": "\/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\\d{8}$\/",
        self.removeStartAndEnd = function(string) {
          return string ? string.substring(1, string.length - 1) : string;
        };
        const _this = Vue.prototype.globalData.value;
        const re = new RegExp(self.removeStartAndEnd(_this.mobile_format));
        return re.test(str);
      }
    };
    var d = (Vue.prototype.globalData.value.date_format || "").toLowerCase();
    var result = "";
    if (d) {
      var arr1 = d.split("-");
      var arr2 = d.split("/");
      if (arr1.length >= 2) {
        var a1 = arr1[1].toUpperCase();
        if (a1 !== "MM") {
          a1 = "MM";
        }
        result = `${arr1[0]}-${a1}-${arr1[2]}`;
      } else if (arr2.length >= 2) {
        var a2 = arr2[1].toUpperCase();
        if (a2 !== "MM") {
          a2 = "MM";
        }
        result = `${arr2[0]}/${a2}/${arr2[2]}`;
      } else {
        result = "yyyy/MM/dd";
      }
    } else {
      result = "yyyy/MM/dd";
    }
    Vue.prototype.globalData.value.date_format = result;
    Vue.directive("selectLoadmore", {
      bind(el, binding) {
        const SELECTWRAP_DOM =
          el.querySelector(".el-select-dropdown__wrap") ||
          el.querySelector(".el-scrollbar__wrap");
        SELECTWRAP_DOM.addEventListener("scroll", () => {
          let sign = 40;
          const CONDITION =
            SELECTWRAP_DOM.scrollHeight - SELECTWRAP_DOM.scrollTop ===
              SELECTWRAP_DOM.clientHeight && SELECTWRAP_DOM.scrollTop > sign;
          if (SELECTWRAP_DOM.scrollTop > sign) {
            sign = SELECTWRAP_DOM.scrollTop;
            // console.log('向下')
          }
          if (SELECTWRAP_DOM.scrollTop < sign) {
            sign = SELECTWRAP_DOM.scrollTop;
            // console.log('向上')
          }

          if (CONDITION) {
            binding.value();
          }
        });
      }
    });
    // 按钮权限指令
    Vue.directive("allow", {
      inserted: (el, binding, vnode) => {
        const noPermissionList = vnode.context.$route.meta.noPermission;
        if (noPermissionList !== undefined) {
          if (noPermissionList.includes(binding.value)) {
            el.parentNode.removeChild(el);
          }
        }
      }
    });
    Vue.directive("selectLoadmore2", {
      bind(el, binding) {
        const SELECTWRAP_DOM = el.querySelector(".el-scrollbar__wrap");
        SELECTWRAP_DOM.addEventListener("scroll", () => {
          let sign = 80;
          const CONDITION =
            SELECTWRAP_DOM.scrollHeight - SELECTWRAP_DOM.scrollTop ===
              SELECTWRAP_DOM.clientHeight && SELECTWRAP_DOM.scrollTop > sign;
          if (SELECTWRAP_DOM.scrollTop > sign) {
            sign = SELECTWRAP_DOM.scrollTop;
            // console.log('向下')
          }
          if (SELECTWRAP_DOM.scrollTop < sign) {
            sign = SELECTWRAP_DOM.scrollTop;
            // console.log('向上')
          }

          if (CONDITION) {
            binding.value();
          }
        });
      }
    });
    Vue.component("loading", Loading);
  }
};

export const loyaltyInfoMixins = {
  props: {
    member_code: {
      type: String
    }
  },
  data() {
    return {
      total: 0,
      listQuery: {
        page_no: 1
      }
    };
  }
};
// 设置选择今天和今天以后的日期
export const pickerOptions0Mixins = {
  data() {
    return {
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      }
    };
  }
};

// 设置选择今天以及今天以前的日期
export const pickerOptions1Mixins = {
  data() {
    return {
      pickerOptions1: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6;
        }
      }
    };
  }
};

// 整数的验证(不包含小数)
export const validatePositiveInteger1Mixins = {
  methods: {
    checkPositiveInteger(rule, value, callback) {
      if (!value) {
        return callback(
          new Error(
            this.handleGlobalI18n("validation", "compare_the_size_error")
          )
        );
      }
      setTimeout(() => {
        if (!Number.isInteger(parseInt(value))) {
          callback(
            new Error(
              this.handleGlobalI18n("validation", "compare_the_size_error")
            )
          );
        } else {
          if (value < 0) {
            callback(
              new Error(
                this.handleGlobalI18n("validation", "compare_the_size_error")
              )
            );
          } else {
            callback();
          }
        }
      }, 100);
    }
  }
};

// 大于零的验证(小数)
export const validateMoreThanZeroMixins = {
  methods: {
    checkMoreThanZeroValue(rule, value, callback) {
      if (!value) {
        return callback(
          new Error(
            this.handleGlobalI18n("validation", "compare_the_size_error")
          )
        );
      }
      setTimeout(() => {
        if (parseInt(value) < 0) {
          callback(
            new Error(
              this.handleGlobalI18n("validation", "compare_the_size_error")
            )
          );
        } else {
          callback();
        }
      }, 1000);
    }
  }
};

// 过滤器 去掉搜索的% character
export const filterCharacter = {
  filters: {
    filterCharacterPercent(value) {
      return value.replace(/[\%\?]/g, "");
    }
  }
};

export const parseIntVal = {
  computed: {
    parseInt(val) {
      return parseInt(val);
    }
  }
};

export const handleTrim = {
  methods: {
    MixTrim(str) {
      return str.replace(/^\s+|\s+$/gm, "");
    }
  }
};

export const mixLoading = {
  data() {
    return {
      mixLoadingState: true
    };
  },
  methods: {
    handleMixLoadingStateTrue() {
      this.mixLoadingState = true;
    },
    handleMixLoadingStateFalse() {
      this.mixLoadingState = false;
    }
  }
};

// 重置页码
export const handlePageNoMixins = {
  methods: {
    handlePageNo(page) {
      this.listQuery.page_no = page;
    }
  }
};

// 截取时间长度
export const substringDate = {
  filters: {
    substringDate: function(date) {
      return date ? date.substring(0, 10) : "";
    }
  }
};
