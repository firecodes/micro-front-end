/*
 * 2019/12/27
 * cct 配置的处理
 * */

// 获取配置中的千分位  默认为,
function thousandsFormat(num) {
  var reg = /\d{1,3}(?=(\d{3})+$)/g;
  return (num + "").replace(reg, "$&,");
}

export default {
  thousandsFormat
};
