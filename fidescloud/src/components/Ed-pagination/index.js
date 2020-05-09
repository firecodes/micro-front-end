/*
分页
*/
import EdPaginationComponent from './ed-pagination'

const EdPagination = {
  install: function(Vue) {
    Vue.component('ed-pagination', EdPaginationComponent)
  }
}

export default EdPagination
