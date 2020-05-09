function colorRgb(color, opacity) {
  var sColor = color.toLowerCase()
  // 十六进制颜色值的正则表达式
  var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/
  // 如果是16进制颜色
  if (sColor && reg.test(sColor)) {
    if (sColor.length === 4) {
      var sColorNew = '#'
      for (var i = 1; i < 4; i += 1) {
        sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1))
      }
      sColor = sColorNew
    }
    // 处理六位的颜色值
    var sColorChange = []
    for (var i1 = 1; i1 < 7; i1 += 2) {
      sColorChange.push(parseInt('0x' + sColor.slice(i1, i1 + 2)))
    }
    return 'rgba(' + sColorChange.join(',') + ',' + opacity + ')'
  }
  return sColor
}
var Wave = /** @class */ (function() {
  function Wave(container, options) {
    var originOption = {
      number: 3,
      smooth: 50,
      velocity: 1,
      height: 0.3,
      colors: ['#ff7657'],
      border: {
        show: false,
        width: 2,
        color: ['']
      },
      opacity: 0.5,
      position: 'bottom'
    }
    this.sX = 0
    this.container = document.querySelector(container)
    this.mW = this.container.offsetWidth
    this.axisLength = this.mW
    this.mH = this.container.offsetHeight
    this.options = Object.assign(originOption, options)
    this.lines = []
    this.frame = null
    this.step = 0
    this.status = 'pause'
    this.waveWidth = 0.009
    this.waveHeight = 2
    this.nowRange = 40
    this.xOffset = 0
    this.speed = 0.018 // 波浪速度，数越大速度越快
    this.init()
  }
  Wave.prototype.init = function() {
    var canvas = document.createElement('canvas')
    this.container.appendChild(canvas)
    // }
    this.canvas = this.container.querySelector('canvas')
    this.canvas.width = this.container.offsetWidth
    this.canvas.height = this.container.offsetHeight
    this.ctx = this.canvas.getContext('2d')
    this.draw()
  }
  Wave.prototype.reset = function() {
    this.init()
  }
  Wave.prototype.draw = function() {
    var _this = this
    var ctx = _this.ctx
    ctx.clearRect(0, 0, this.mW, this.mH)
    this.draw1()
    this.xOffset += this.speed
    var that = this
    requestAnimationFrame(function() {
      that.draw()
    })
  }
  Wave.prototype.draw1 = function() {
    // this.drawSin(this.xOffset + Math.PI * 0.7 + 30, colorRgb('#ffffff', 0.1), 80)
    // this.drawSin(this.xOffset, colorRgb('#ffffff', 0.3), 70)
    // this.drawSin(this.xOffset + 5, colorRgb('#ffffff', 0.4), 60)
    this.drawSin(this.xOffset + 100, colorRgb('#ffffff', 0.1), 30, 0.7, 0.2, 85)
    this.drawSin(this.xOffset + 200, colorRgb('#ffffff', 0.2), 20, 0.8, 0.2, 95)
    this.drawSin(this.xOffset + 300, colorRgb('#ffffff', 0.3), 25, 0.8, 0.5)
    this.drawSin(this.xOffset + 100, colorRgb('#ffffff', 0.4), 25, 0.8, 1)
    this.drawSin(this.xOffset + 200, colorRgb('#ffffff', 0.9), 18, 0.8, 3)
    // requestAnimationFrame(_this.draw)
  }
  Wave.prototype.drawSin = function(xOffset, color, waveHeight, aa, bb, cc = 100) {
    var _this = this
    var ctx = _this.ctx
    ctx.save()
    var points = []
    ctx.beginPath()
    for (var x = _this.sX; x < _this.sX + _this.axisLength; x += 1500 / _this.axisLength) {
      var y = Math.sin((-_this.sX - x) * _this.waveWidth + xOffset) * aa + bb
      var dY = _this.mH * (1 - _this.nowRange / cc)
      points.push([x, dY + y * waveHeight])
      ctx.lineTo(x, dY + y * waveHeight)
    }
    ctx.lineTo(_this.axisLength, _this.mH)
    ctx.lineTo(_this.sX, _this.mH)
    ctx.lineTo(points[0][0], points[0][1])
    ctx.fillStyle = color
    ctx.fill()
    ctx.restore()
  }
  return Wave
}())

export default Wave
