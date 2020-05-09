// function formatDate(val) {
//   // 格式化时间
//   const start = new Date(val)
//   const y = start.getFullYear()
//   const m = (start.getMonth() + 1) > 10 ? (start.getMonth() + 1) : '0' + (start.getMonth() + 1)
//   const d = start.getDate() > 10 ? start.getDate() : '0' + start.getDate()
//   return y + '-' + m + '-' + d
// }

// function mistiming(sDate1, sDate2) {
//   // 计算开始和结束的时间差
//   let aDate = null
//   let oDate1 = null
//   let oDate2 = null
//   let iDays = null
//   aDate = sDate1.split('-')
//   oDate1 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0])
//   aDate = sDate2.split('-')
//   oDate2 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0])
//   iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24)
//   return iDays + 1
// }

// function countDate(start, end) {
//   // 判断开始和结束之间的时间差是否在90天内
//   const days = mistiming(start, end)
//   const stateT = days > 90 ? Boolean(0) : Boolean(1)
//   return {
//     state: stateT,
//     day: days
//   }
// }
// function timeForMat(count) {
//   // 拼接时间
//   const time1 = new Date()
//   time1.setTime(time1.getTime() - (24 * 60 * 60 * 1000))
//   const Y1 = time1.getFullYear()
//   const M1 = ((time1.getMonth() + 1) > 10 ? (time1.getMonth() + 1) : '0' + (time1.getMonth() + 1))
//   const D1 = (time1.getDate() > 10 ? time1.getDate() : '0' + time1.getDate())
//   const timer1 = Y1 + '-' + M1 + '-' + D1 // 当前时间
//   const time2 = new Date()
//   time2.setTime(time2.getTime() - (24 * 60 * 60 * 1000 * count))
//   const Y2 = time2.getFullYear()
//   const M2 = ((time2.getMonth() + 1) > 10 ? (time2.getMonth() + 1) : '0' + (time2.getMonth() + 1))
//   const D2 = (time2.getDate() > 10 ? time2.getDate() : '0' + time2.getDate())
//   const timer2 = Y2 + '-' + M2 + '-' + D2 // 之前的7天或者30天
//   return {
//     t1: timer1,
//     t2: timer2
//   }
// }

// function yesterday(start, end) {
//   // 校验是不是选择的昨天
//   const timer = timeForMat(1)
//   return timer
// }

// function sevenDays() {
//   // 获取最近7天
//   const timer = timeForMat(7)
//   return timer
// }

// function thirtyDays() {
//   // 获取最近30天
//   const timer = timeForMat(30)
//   return timer
// }

// function formatTransactionDate(num) {
//   return timeForMat(num)
// }

// function recentMonth() {
//   var dataArr = []
//   var data = new Date()
//   // var year = data.getFullYear()
//   data.setMonth(data.getMonth() + 1, 1) // 获取到当前月份,设置月份
//   for (var i = 0; i < 18; i++) {
//     data.setMonth(data.getMonth() - 1) // 每次循环一次 月份值减1
//     var m = data.getMonth() + 1
//     m = m < 10 ? '0' + m : m
//     dataArr.push(data.getFullYear() + '-' + (m))
//   }
//   return dataArr
// }

// export {
//   formatDate,
//   countDate,
//   yesterday,
//   sevenDays,
//   thirtyDays,
//   formatTransactionDate,
//   recentMonth
// }

/**
    1. Yesterday
    2. Recent 7 days
    3. Recent 30 days
    4. Recent 90 days
    5. Recent 12 months
    6. Recent 18 months
    7. Recent 24 months
    */
function formatTransactionDate(num) {
  // 获取当前的年月日
  var currDate = getYMD(getCurrTimeStamp())
  return getTimeStrByDays(num, currDate)
}
function getTimeStrByDays(num, obj) {
  // 说明当前是想获取yesterday的时间字符串
  if (num === 0) {
    return obj.date
  }
  if (num === 1) {
    const stamp = getCurrTimeStamp(obj.fullDate) - 1
    return getYMD(stamp).date
  } else {
    const stamp = getCurrTimeStamp(obj.fullDate) - num * 24 * 60 * 60 * 1000
    return {
      start: getYMD(stamp).date,
      end: getYMD(getCurrTimeStamp()).date,
      fullDate: `${getYMD(stamp).date} - ${getYMD(getCurrTimeStamp()).date}`
    }
  }
}
// 获取当前时间戳
function getCurrTimeStamp(time) {
  if (time) {
    return new Date(time).valueOf()
  } else {
    return new Date().valueOf()
  }
}
function getYMD(stamp) {
  var date = new Date(stamp)
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  if (month < 10) {
    month = String(month).padStart(2, 0)
  }
  if (day < 10) {
    day = String(day).padStart(2, 0)
  }
  return {
    date: `${year}/${month}/${day}`,
    fullDate: `${year}/${month}/${day} 00:00:00`,
    year: year,
    month: month,
    day: day
  }
}
export {
  formatTransactionDate
}
