const moment = require('moment')
export function formatDate(date, flag = false, char = '-') {
  if (!date) return '-'
  const time = new Date(date)
  const year = time.getFullYear()
  const month = String(time.getMonth() + 1).padStart(2, '0')
  const day = String(time.getDate()).padStart(2, '0')
  const hour = String(time.getHours()).padStart(2, '0')
  const minutes = String(time.getMinutes()).padStart(2, '0')
  const seconds = String(time.getSeconds()).padStart(2, '0')
  if (flag) {
    return `${year}${char}${month}${char}${day} ${hour}:${minutes}:${seconds}`
  } else {
    return `${year}${char}${month}${char}${day}`
  }
}
// filter status
export function filterStatus(status) {
  let ret
  if (status === 0) {
    ret = 'Pending'
  } else if (status === 1) {
    ret = 'Progress'
  } else if (status === 2) {
    ret = 'Completed With Errors'
  } else if (status === 4) {
    ret = 'Completed'
  } else if (status === -1) {
    ret = 'Failed Validation'
  } else if (status === -2) {
    ret = 'Canceled'
  } else if (status === -4) {
    ret = 'System Error'
  }
  return ret
}

export function formatTimeStamp(dataStr, pattern = 'DD/MM/YYYY') {
  if (dataStr) {
    return moment(dataStr).format(pattern)
  } else {
    return '-'
  }
}

export function placeholder(data, char) {
  if (data === '' || data === null || data === undefined) {
    return char || '-'
  }
  return data
}
