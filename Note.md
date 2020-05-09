# 主应用
1. 创建 vue create master
2. npm i qiankun -S
3. 改造main.js
  1. 导入qiankun内置函数


# 子应用
1. 创建 vue create subone
2. 设置子应用的端口号
3. 设置子应用允许跨域


# 主应用路由之间切换不会刷新页面，但是从主应用切换到子应用之间的路由切换，会刷新页面
## 需要解决主应用之间路由无法正常切换的问题？

# 跨应用之间的路由跳转需要使用：window.history.pushState()
# 非跨应用之间的路由跳转采用：this.$router.push()


# 如何监视跨应用路由的变化？
1. location.reload()

#　如何把一个旧的项目转为主应用？
1. npm install qiankun -S
2. 改造main.js文件

# 如何处理样式沙箱（主应用与子应用之间的样式互不影响）

# 主应用和子应用之间如何通信

1. hash模式和history模式区别
hash模式，刷新浏览器的时候，页面显示正常，但是对于history模式，刷新浏览器的时候，如果不做任何的处理，会说路由找不到


