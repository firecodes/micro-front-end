import specialChar from './special-char'

const install = function(Vue) {
  Vue.directive('filterSpecialChar', specialChar)
}

if (window.Vue) {
  window.specialChar = specialChar
  Vue.use(install); // eslint-disable-line
}

specialChar.install = install
export default specialChar
