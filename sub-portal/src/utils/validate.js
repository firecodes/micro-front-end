export function isvalidUsername(str) {
  // const valid_map = ['admin', 'editor', 'admin1']
  // return valid_map.indexOf(str.trim()) >= 0
  return str.length > 0;
}

/* 合法uri*/
export function validateURL(textval) {
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
  return urlregex.test(textval);
}

/* 小写字母*/
export function validateLowerCase(str) {
  const reg = /^[a-z]+$/;
  return reg.test(str);
}

/* 大写字母*/
export function validateUpperCase(str) {
  const reg = /^[A-Z]+$/;
  return reg.test(str);
}

/* 大小写字母*/
export function validateAlphabets(str) {
  const reg = /^[A-Za-z]+$/;
  return reg.test(str);
}

/* 电话号码*/
export function validateMobile(str) {
  const re = /^1\d{10}$/;
  return re.test(str);
}

/* 邮件*/
export function validateEmail(str) {
  const reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
  return reg.test(str);
}

// 正整数
export function validatePositiveInteger(str, callback) {
  if (parseInt(str) <= 0 || isNaN(parseInt(str))) {
    callback(
      new Error(this.handleGlobalI18n("validation", "compare_the_size_error"))
    );
  } else {
    callback();
  }
}

// 比较大小(整数)
export function validateCompare(from, to, callback) {
  if (
    (from === undefined && to !== undefined) ||
    (from !== undefined && to === undefined)
  ) {
    callback();
  }
  if (
    parseInt(to) <= 0 ||
    isNaN(parseInt(to)) ||
    parseInt(to) < parseInt(from)
  ) {
    callback(
      new Error(this.handleGlobalI18n("validation", "compare_the_size_error"))
    );
  } else {
    callback();
  }
}

// 比较大小(小数)
export function validateCompareFloat(from, to, callback) {
  if (
    (from === undefined && to !== undefined) ||
    (from !== undefined && to === undefined)
  ) {
    callback();
  }
  if (
    parseFloat(to) <= 0 ||
    isNaN(parseInt(to)) ||
    parseFloat(to) < parseFloat(from)
  ) {
    callback(
      new Error(this.handleGlobalI18n("validation", "compare_the_size_error"))
    );
  } else {
    callback();
  }
}

// 验证邮箱
export function checkEmail(val) {
  var regular = /^[a-zA-Z0-9][\w\.-]*[a-zA-Z0-9]@[a-zA-Z0-9][\w\.-]*[a-zA-Z0-9]\.[a-zA-Z][a-zA-Z\.]*[a-zA-Z]$/;
  if (regular.test(val)) {
    return true;
  } else {
    return false;
  }
}
