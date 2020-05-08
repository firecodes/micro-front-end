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