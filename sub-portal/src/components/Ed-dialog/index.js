/*
 * 弹出层新样式
 * */
import EdDialogComponent from "./ed-dialog";

const EdDialog = {
  install: function(Vue) {
    Vue.component("ed-dialog", EdDialogComponent);
  }
};

export default EdDialog;
