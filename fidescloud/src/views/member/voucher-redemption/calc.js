export function calcOptimalPoint(val) {
  // if (val === 0) {
  //   return 0
  // }
  if (val <= 250) {
    return 250
  }
  if (val >= 4000) {
    return 4000
  }
  if (val % 250 === 0) {
    return val
  }
  for (var i = 1, y = 0; i <= (4000 / 250); i++) {
    y = i * 250
    if (y > val) {
      return (i - 1) * 250
    }
  }
}

export function calcAmount(value, b) {
  var arr = []
  arr[250] = 10
  arr[500] = 25
  arr[750] = 45
  arr[1000] = 70
  if (value < 250 || b < 250) {
    return 0
  }
  if (value <= 1000 && value >= 250) {
    return arr[value]
  }
  if (value <= 2000 && value > 1000) {
    return arr[value - 1000] + arr[1000]
  }
  if (value <= 3000 && value > 2000) {
    return arr[1000] + arr[1000] + arr[value - 2000]
  }
  if (value <= 4000 && value > 3000) {
    return arr[1000] + arr[1000] + arr[1000] + arr[value - 3000]
  }
}
