import VClampComponent from 'vue-clamp'
/* <ed-clamp :max-lines="1" autoresize>*/
const EdClamp = {
  install: function(Vue) {
    Vue.component('ed-clamp', VClampComponent)
  }
}

export default EdClamp
