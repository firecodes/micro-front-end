/*
 * Form
 * */
import EdFormComponent from "./ed-form";

const EdForm = {
  install: function(Vue) {
    Vue.component("ed-form", EdFormComponent);
  }
};

export default EdForm;
