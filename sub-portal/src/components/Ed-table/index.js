/* 表单 */
import EdTableComponent from "./ed-table";

const EdTable = {
  install: function(Vue) {
    Vue.component("ed-table", EdTableComponent);
  }
};

export default EdTable;
