export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null;
  }
  const format = cFormat || "{y}-{m}-{d} {h}:{i}:{s}";
  let date;
  if (typeof time === "object") {
    date = time;
  } else {
    if (("" + time).length === 10) time = parseInt(time) * 1000;
    date = new Date(time);
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  };
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key];
    if (key === "a")
      return ["一", "二", "三", "四", "五", "六", "日"][value - 1];
    if (result.length > 0 && value < 10) {
      value = "0" + value;
    }
    return value || 0;
  });
  return time_str;
}

export function formatTime(time, option) {
  time = +time * 1000;
  const d = new Date(time);
  const now = Date.now();

  const diff = (now - d) / 1000;

  if (diff < 30) {
    return "刚刚";
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + "分钟前";
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + "小时前";
  } else if (diff < 3600 * 24 * 2) {
    return "1天前";
  }
  if (option) {
    return parseTime(time, option);
  } else {
    return (
      d.getMonth() +
      1 +
      "月" +
      d.getDate() +
      "日" +
      d.getHours() +
      "时" +
      d.getMinutes() +
      "分"
    );
  }
}

// 格式化时间
export function getQueryObject(url) {
  url = url == null ? window.location.href : url;
  const search = url.substring(url.lastIndexOf("?") + 1);
  const obj = {};
  const reg = /([^?&=]+)=([^?&=]*)/g;
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1);
    let val = decodeURIComponent($2);
    val = String(val);
    obj[name] = val;
    return rs;
  });
  return obj;
}

export function cleanArray(actual) {
  const newArray = [];
  for (let i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i]);
    }
  }
  return newArray;
}

export function param(json) {
  if (!json) return "";
  return cleanArray(
    Object.keys(json).map(key => {
      if (json[key] === undefined) return "";
      return encodeURIComponent(key) + "=" + encodeURIComponent(json[key]);
    })
  ).join("&");
}

export function param2Obj(url) {
  const search = url.split("?")[1];
  if (!search) {
    return {};
  }
  return JSON.parse(
    '{"' +
      decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"') +
      '"}'
  );
}

export function html2Text(val) {
  const div = document.createElement("div");
  div.innerHTML = val;
  return div.textContent || div.innerText;
}

export function objectMerge(target, source) {
  /* Merges two  objects,
     giving the last one precedence */

  if (typeof target !== "object") {
    target = {};
  }
  if (Array.isArray(source)) {
    return source.slice();
  }
  Object.keys(source).forEach(property => {
    const sourceProperty = source[property];
    if (typeof sourceProperty === "object") {
      target[property] = objectMerge(target[property], sourceProperty);
    } else {
      target[property] = sourceProperty;
    }
  });
  return target;
}

export function scrollTo(element, to, duration) {
  if (duration <= 0) return;
  const difference = to - element.scrollTop;
  const perTick = (difference / duration) * 10;
  setTimeout(() => {
    console.log(new Date());
    element.scrollTop = element.scrollTop + perTick;
    if (element.scrollTop === to) return;
    scrollTo(element, to, duration - 10);
  }, 10);
}

export function toggleClass(element, className) {
  if (!element || !className) {
    return;
  }
  let classString = element.className;
  const nameIndex = classString.indexOf(className);
  if (nameIndex === -1) {
    classString += "" + className;
  } else {
    classString =
      classString.substr(0, nameIndex) +
      classString.substr(nameIndex + className.length);
  }
  element.className = classString;
}

export const pickerOptions = [
  {
    text: "last week",
    onClick(picker) {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      picker.$emit("pick", [start, end]);
    }
  },
  {
    text: "last month",
    onClick(picker) {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      picker.$emit("pick", [start, end]);
    }
  },
  {
    text: "last 3 month",
    onClick(picker) {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
      picker.$emit("pick", [start, end]);
    }
  }
];

export function getTime(type) {
  if (type === "start") {
    return new Date().getTime() - 3600 * 1000 * 24 * 90;
  } else {
    return new Date(new Date().toDateString());
  }
}

export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result;

  const later = function() {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp;

    // 上次被包装函数被调用时间间隔last小于设定时间间隔wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      }
    }
  };

  return function(...args) {
    context = this;
    timestamp = +new Date();
    const callNow = immediate && !timeout;
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }

    return result;
  };
}

export function deepClone(source) {
  if (!source && typeof source !== "object") {
    throw new Error("error arguments", "shallowClone");
  }
  const targetObj = source.constructor === Array ? [] : {};
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === "object") {
      targetObj[keys] = source[keys].constructor === Array ? [] : {};
      targetObj[keys] = deepClone(source[keys]);
    } else {
      targetObj[keys] = source[keys];
    }
  });
  return targetObj;
}

// 获取焦点位置

export function getSelectPosition(oTxt) {
  var nullvalue = -1;
  var selectStart; // 选中开始位置
  var selectEnd; // 选中结束位置
  var position; // 焦点位置
  var selectText; // 选中内容
  if (oTxt.setSelectionRange) {
    // 非IE浏览器
    selectStart = oTxt.selectionStart;
    selectEnd = oTxt.selectionEnd;
    if (selectStart === selectEnd) {
      position = oTxt.selectionStart;
      selectStart = nullvalue;
      selectEnd = nullvalue;
    } else {
      position = nullvalue;
    }
    selectText = oTxt.value.substring(selectStart, selectEnd);
  } else {
    // IE
    var range = document.selection.createRange();
    selectText = range.text;
    range.moveStart("character", -oTxt.value.length);
    position = range.text.length;
    selectStart = position - selectText.length;
    selectEnd = selectStart + selectText.length;
    if (selectStart !== selectEnd) {
      position = nullvalue;
    } else {
      selectStart = nullvalue;
      selectEnd = nullvalue;
    }
  }
  return position;
}

// 格式化时间(Complete date plus hours and minutes: YYYY-MM-DDThh:mmTZD (eg 1997-07-16T19:20+01:00))

export function parse2Time() {
  const today = new Date();
  const split_array = today.toString().split("GMT");
  const split_length = split_array.length;
  const fun = {
    padStart(value) {
      return value.toString().padStart(2, "0");
    }
  };
  const formatObj = {
    y: today.getFullYear(),
    m: fun.padStart(today.getMonth() + 1),
    d: fun.padStart(today.getDate()),
    h: fun.padStart(today.getHours()),
    i: fun.padStart(today.getMinutes()),
    s1: split_array[split_length - 1].substr(0, 1),
    sh: split_array[split_length - 1].substr(1, 2),
    sm: split_array[split_length - 1].substr(3, 2)
  };
  return `${formatObj.y}-${formatObj.m}-${formatObj.d}T${formatObj.h}:${formatObj.i}${formatObj.s1}${formatObj.sh}:${formatObj.sm}`;
}

// 获取年月日(yyyy-mm-dd)
export function parse2Date() {
  const today = new Date();
  const fun = {
    padStart(value) {
      return value.toString().padStart(2, "0");
    }
  };
  const formatObj = {
    y: today.getFullYear(),
    m: fun.padStart(today.getMonth() + 1),
    d: fun.padStart(today.getDate())
  };
  return `${formatObj.y}-${formatObj.m}-${formatObj.d}`;
}

/* format money */
export function formatMonty(m) {
  if (m === "" || m <= 0) {
    return 0;
  }
  if (m > 0 && m < 1000) {
    return m.toFixed(2);
  } else if (m >= 1000 && m < 1000000) {
    return (m / 1000).toFixed(2) + '<span style="font-size:18px;"> K</span>';
  } else if (m >= 1000000 && m < 100000000) {
    return (m / 1000000).toFixed(2) + '<span style="font-size:18px;"> M</span>';
  } else if (m >= 100000000) {
    return (
      (m / 100000000).toFixed(2) + '<span style="font-size:18px;"> B</span>'
    );
  }
}

/* format money */
export function formatMonty2(m, fix = 2) {
  if (m === "" || m <= 0) {
    return 0;
  }
  if (m > 0 && m < 1000) {
    return m.toFixed(fix);
  } else if (m >= 1000 && m < 1000000) {
    return (m / 1000).toFixed(fix) + "K";
  } else if (m >= 1000000 && m < 100000000) {
    return (m / 1000000).toFixed(fix) + "M";
  } else if (m >= 100000000) {
    return (m / 100000000).toFixed(fix) + "B";
  }
}

/* 保留两位小数(四舍五入) */
export function decimal2FormatValue(v, fixed = 2) {
  if (v === undefined) {
    v = 0;
  }
  return (v * 100).toFixed(fixed);
}

/**
 * 时间戳格式化函数
 */
export function date(obj, spacer = "-") {
  var date = new Date(obj);
  var y = 1900 + date.getYear();
  var m = "0" + (date.getMonth() + 1);
  var d = "0" + date.getDate();
  return (
    y +
    spacer +
    m.substring(m.length - 2, m.length) +
    spacer +
    d.substring(d.length - 2, d.length)
  );
}

/* 比较两个对象是否相等*/
export function isObjectValueEqual(x, y) {
  if (x === y) {
    return true;
  }
  if (!(x instanceof Object) || !(y instanceof Object)) {
    return false;
  }
  if (x.constructor !== y.constructor) {
    return false;
  }
  for (var p in x) {
    if (x.hasOwnProperty(p)) {
      if (!y.hasOwnProperty(p)) {
        return false;
      }
      if (x[p] === y[p]) {
        continue;
      }
      if (typeof x[p] !== "object") {
        return false;
      }
      if (!Object.equals(x[p], y[p])) {
        return false;
      }
    }
  }
  for (p in y) {
    if (y.hasOwnProperty(p) && !x.hasOwnProperty(p)) {
      return false;
    }
  }
  return true;
}

// 处理不允许值为空
// state 为1时  判断不能为空 为2时  判断大于0
export function handleValChangeIsUndefined(val, state = 1) {
  if (state === 1) {
    if (val === undefined || val === "") {
      return 1;
    }
  } else if (state === 2) {
    if (parseInt(val) <= 0 || val === "") {
      return 1;
    }
  }
  return true;
}

// 拼接占位符
export function signMix(str, arr) {
  if (arr.length === 0) {
    return this;
  }
  var param = arr[0];
  if (typeof param === "object") {
    for (var key in param) {
      str = str.replace(new RegExp("\\{" + key + "\\}", "g"), param[key]);
    }
    return str;
  } else {
    for (var i = 0; i < arr.length; i++) {
      str = str.replace(new RegExp("\\{" + i + "\\}", "g"), arr[i]);
    }
    return str;
  }
}

// 判断对象是否存在并且是否为空
export function checkObjHasOwnProperty(obj, key) {
  const has = Object.prototype.hasOwnProperty;
  if (has.call(obj, key)) {
    if (Object.keys(obj[key]).length !== 0) {
      // 存在
      return true;
    }
  }
  return false;
}
// 获取当前访问地址的URl1
var getUrlHost = function() {
  var protocol = window.location.protocol;
  var host = window.location.host;
  return host !== "localhost:9528"
    ? `${protocol}//${host}`
    : process.env.BASE_URL;
  // return host !== '172.31.212.51:9528' ? `${protocol}//${host}` : 'https://www.fidescloud.com'
  // return host !== 'localhost:9528' ? `${protocol}//${host}` : 'https://uat.fidescloud.com'
  // return host !== 'localhost:9528' ? `https://uat.fidescloud.com` : 'https://uat.fidescloud.com'
  // return host !== 'localhost:9528' ? `https://fctest.accuat.com` : 'https://fctest.accuat.com'
  //   // return process.env.BASE_URLSSS
};
export { getUrlHost };

// 首字母大写
export function firstWordUpperCase(str) {
  return str.toLowerCase().replace(/( |^)[a-z]/g, L => L.toUpperCase());
}

// 获取登录用户code
function getTenantCode() {
  var tenant_info = JSON.parse(window.localStorage.tenantInfo || "{}");
  return Object.keys(tenant_info).length > 0 ? tenant_info.code : "";
}

// 判断用户是否使用member portal
export function isUsedMemberPortalTenant() {
  var tenant_info = JSON.parse(window.localStorage.tenantInfo || "{}");
  var apps = Object.keys(tenant_info).length > 0 ? tenant_info.apps : [];
  if (apps.length > 0) {
    for (var item of apps) {
      if (item.name === "MemberPortal") {
        return true;
      }
      break;
    }
  }
  return false;
}

// 判断是否登录用户是BHG
export function isBHGLoginUser() {
  var code = getTenantCode();
  return code && code.toLowerCase().indexOf("bhg") > -1;
}

// 判断是否登录用户是CN
export function isCNLoginUser() {
  var code = getTenantCode();
  return code && code.toLowerCase().indexOf("china19") > -1;
}

// 判断是否登录用户是brotzeit19
export function isBrotzeit19User() {
  const code = getTenantCode();
  return code && code.toLowerCase().indexOf("brotzeit") > -1;
}

// 判断是否登录用户是FloorXpert
export function isFloorXpertUser() {
  var code = getTenantCode();
  return code && code.toLowerCase().indexOf("floorxpert") > -1;
}

// 判断kpi是否使用DW true 是  false 不是
export function isDWAccessKpi() {
  return this.globalData.value.get_kpi_access === "dw";
}

// 报表数据来源 (fake, local,dw)
export function reportDataSource() {
  var source_list = ["fake", "local", "dw"];
  var global_value = this.globalData.value;
  const has = Object.prototype.hasOwnProperty;
  if (has.call(global_value, "report_data_source")) {
    if (source_list.includes(global_value.report_data_source)) {
      return global_value.report_data_source;
    }
  }
  return "fake";
}

// 根据全局配置 例如 将 2020-01-01 转 01/01/2020
export function dateConversion(val) {
  var _this = this.globalData.value;
  var date_format = _this.date_format.toUpperCase();
  var date_arr = val.split("-");
  if (date_format === "YYYY-MM-DD" || date_format === "YYYY/MM/DD") {
    return `${date_arr[0]}/${date_arr[1]}/${date_arr[2]}`;
  }
  if (date_format === "DD-MM-YYYY" || date_format === "DD/MM/YYYY") {
    return `${date_arr[2]}/${date_arr[1]}/${date_arr[0]}`;
  }
}

// 根据全局配置 例如 将 2019-10-31 转 31 Oct 2019
export function dateConversion1(val) {
  var _this = this.globalData.value;
  var date_format = _this.date_format.toUpperCase();
  var date_arr = val.split("-");
  var m = [
    "",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Spt",
    "Oct",
    "Nov",
    "Dec"
  ];
  if (date_format === "YYYY-MM-DD" || date_format === "YYYY/MM/DD") {
    return `${date_arr[0]} ${m[parseInt(date_arr[1])]} ${date_arr[2]}`;
  }
  if (date_format === "DD-MM-YYYY" || date_format === "DD/MM/YYYY") {
    return `${date_arr[2]} ${m[parseInt(date_arr[1])]} ${date_arr[0]}`;
  }
}

// 获取指定日期的前一天 或者后一天 date 代表指定的日期, day 如果是-1表示前一天  1表示后一天
export function getNextDate(date, day) {
  var dd = new Date(date);
  dd.setDate(dd.getDate() + day);
  var y = dd.getFullYear();
  var m =
    dd.getMonth() + 1 < 10 ? "0" + (dd.getMonth() + 1) : dd.getMonth() + 1;
  var d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate();
  return `${y}-${m}-${d}`;
}

// 计算两个时间相差的秒数
export function calcDateDiffer(start_date, end_date) {
  if (typeof start_date === "string") {
    start_date = new Date(start_date);
  }
  if (typeof end_date === "string") {
    end_date = new Date(end_date);
  }
  var s1 = start_date.getTime();
  var s2 = end_date.getTime();
  return (s2 - s1) / 1000;
}

// 唯一字符串
export const kjfUUID = (len, radix) => {
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split(
    ""
  );
  var uuid = [];
  var i;
  radix = radix || chars.length;

  if (len) {
    // Compact form
    for (i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radix)];
  } else {
    // rfc4122, version 4 form
    let r;

    // rfc4122 requires these characters
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = "-";
    uuid[14] = "4";

    // Fill in random data.  At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | (Math.random() * 16);
        uuid[i] = chars[i === 19 ? (r & 0x3) | 0x8 : r];
      }
    }
  }

  return uuid.join("");
};

// 取整
export function calcNumberInt(value) {
  return Math.floor(value);
}
import { DateTime } from "luxon";
// 获取时区 +800
export function getTimeZone() {
  var generate_time = DateTime.local().toISO();
  const nowDateLength = generate_time.length;
  var postfix = generate_time.substring(nowDateLength - 6, nowDateLength);
  return postfix;
}

// 验证json 是否正确
export function checkJsonFormat(data) {
  if (typeof data === "string") {
    try {
      var obj = JSON.parse(data);
      if (typeof obj === "object" && obj) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  }
  return false;
}

// 将月份转成大写转换
export function transformMonth(val) {
  var m = [
    "",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Spt",
    "Oct",
    "Nov",
    "Dec"
  ];
  if (val <= 12) {
    return m[parseInt(val)];
  }
  return "-";
}

// 获取当前时间年月日时分秒
export function getRightNow() {
  var date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var hour = date.getHours();
  var minute = date.getMinutes();
  var second = date.getSeconds();
  var mill = date.getMilliseconds();
  return {
    year: year,
    month: month.toString().padStart(2, 0),
    day: day.toString().padStart(2, 0),
    hour: hour.toString().padStart(2, 0),
    minute: minute.toString().padStart(2, 0),
    second: second.toString().padStart(2, 0),
    mill: mill
  };
}

// 复制传入值
export function copyText(val) {
  var createObj = document.createElement("input");
  createObj.value = val;
  document.body.appendChild(createObj);
  createObj.select();
  document.execCommand("Copy");
  createObj.style.display = "none";
  return true;
}
