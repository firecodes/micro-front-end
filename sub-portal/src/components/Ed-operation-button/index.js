/*
操作按钮
*/
import EdOperationButtonComponent from "./ed-operation-button";

const EdOperationButton = {
  install: function(Vue) {
    Vue.component("ed-operation-button", EdOperationButtonComponent);
  }
};

export default EdOperationButton;
