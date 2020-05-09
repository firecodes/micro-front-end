<template>
  <div @click="globalClick" class="login" id="login">
    <div class="slanguage">
      <div @click.stop="switchClick" class="switch-language" v-for="item in language_list" v-if="language1 === item.identify">
        <img :src="item.lang_img_url" />
        <label>{{item.name}}</label>
      </div>
    </div>
    <div class="select" >
        <div @click="language1='lang_zh'; switchClick()" class="switch-language1"  v-if="language1!=='lang_zh'">
          <img src="../../assets/images/login/China.png" />
          <label>简体中文</label>
        </div>
        <div :class="{'switch-language2' : language1 === 'lang_ja', 'switch-language1' : language1 !== 'lang_ja' }" @click="language1='lang_en';switchClick()" v-if="language1!=='lang_en'">
          <img src="../../assets/images/login/yingguo.png" />
          <label>English</label>
        </div>
        <div @click="language1='lang_ja';switchClick()" class="switch-language2" v-if="language1!=='lang_ja'">
          <img src="../../assets/images/login/riben.png" />
          <label>日本語</label>
        </div>
      </div>
    <div class="width-420">
      <div style="height: 80px">
        <img class="logo" src="../../assets/images/login/logo.png" />
      </div>
      <h1 class="sign-in">{{$t('login.fc_login_title_label')}}</h1>
      <section class="form1">
        <!--<el-form :model="login_form" :rules="login_rules" ref="loginForm" class="login-form">-->
        <el-form :model="login_form" :rules="login_rules" class="login-form" ref="loginForm" >
          <el-form-item prop="company_code">
            <el-input :placeholder="$t('login.fc_login_company_code_label')" autocomplete="off" v-model="login_form.company_code"></el-input>
          </el-form-item>
          <el-form-item prop="user_name">
            <el-input :placeholder="$t('login.fc_login_username_label')" autocomplete="off" v-model="login_form.user_name"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input :placeholder="$t('login.fc_login_password_label')" autocomplete="new-password" type="password" v-model="login_form.password"></el-input>
          </el-form-item>
          <div class="other-operation">
            <el-checkbox v-model="remember_password">{{$t('login.fc_login_remember_me_label')}}</el-checkbox>
            <router-link class="forgot-password" tag="div" to="/login/forgot-password">{{$t('login.fc_login_forgot_password_label')}}</router-link>
          </div>
          <el-button :loading="loading" @click.native.prevent="handleLogin" class="login-button"><label>{{$t('login.fc_login_btn_login_label')}}</label></el-button>
          <a :href="handleUrl" target="_blank"><span class="register">{{$t('login.fc_login_not_use_tips')}}</span></a>
        </el-form>
      </section>
      <!-- <dialog-privacy :content="dialogPrivacys" @handleAgree="handleAgree"></dialog-privacy> -->
    </div>
    <div class="copyright">
      <p class="desc" v-if="gethost">雅智捷（上海）企业管理有限公司&nbsp;&nbsp;上海市静安区天目西路128号企业中心第一座801室，200070，中国</p>
      <p class="contact" v-if="gethost">服务咨询:400-666-7820 | 公司电话:+86 21-2306 6000 | Email:loyalty-cn@edenred.com</p>
      <p>
        <span>{{$t('login.fc_login_copyright_content_label').split('{')[0] | filterCopyRight}}</span>
        <router-link :to=" language1 === 'lang_zh' ? '/legal/privacy/CN' : '/legal/privacy'" style="color: #2777FF" target="_blank">{{$t('login.fc_login_copyright_content_label').split('{')[1].split('}')[0]}}</router-link>
        <span v-if="gethost">|</span> <a class="beian" href="http://www.beian.miit.gov.cn/" target="_blank" v-if="gethost">沪ICP备07509309号-45</a>
        <span v-if="gethost">| <img :src="require('@/assets/images/beian.png')" class="beianimg" /><a class="beiantxt" href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=31010602005336" target="_blank">沪公网安备 31010602005336号</a></span>
      </p>
    </div>
    <div class="star-circle"></div>
    <div class="w1">
      <div class="wave" id="wave1" style="opacity: 0">
      </div>
    </div>
  </div>
</template>
<script>
  // import { debounce } from '@/utils'
  import { isvalidUsername } from '@/utils/validate'
  import Wave from './wave.es'
  import anime from 'animejs'
  import { mapActions, mapGetters, mapMutations } from 'vuex'
  // getRoleUserInfo setAgreePrivacy
  import { setI18nData as setI18nDataSession } from '@/utils/auth'
  import { getTenantInfo } from '@/api/common'
  import store from '../../store'
  import DialogPrivacy from './dialog-privacy'
  // import { userConfirm, userCheck } from '@/api/privacy'
  export default {
    computed: {
      ...mapGetters([
        'language'
      ]),
      handleUrl() {
        var host = window.location.host
        var international = ['fidescloud.com', 'uat.fidescloud.com']
        var type = 'china'
        international.forEach(value => {
          if (host.indexOf(value) > -1) {
            type = 'international'
          }
        })
        if (type && type.toLowerCase() === 'china') {
          return 'https://www.edenredchina.com/CN/product/fidescloud'
        } else {
          return 'https://crm.fidescloud.com'
        }
      },
      gethost() {
        if (window.location.host === 'www.fidescloud.com' || window.location.host === 'uat.fidescloud.com' || window.location.host === 'smicuat.accuat.com') {
          return false
        } else {
          return true
        }
      }
    },
    filters: {
      filterCopyRight: function(value) {
        return value.replace(value.match(/\d+/g).join(''), new Date().getFullYear())
      }
    },
    components: {
      'dialog-privacy': DialogPrivacy
    },
    data() {
      const validateUsername = (rule, value, callback) => {
        if (!value) {
          callback(new Error(' '))
        } else if (!isvalidUsername(value)) {
          callback(new Error(' '))
        } else {
          callback()
        }
      }
      const validatePass = (rule, value, callback) => {
        if (!value) {
          callback(new Error(' '))
        } else {
          callback()
        }
      }
      const validateCompanyCode = (rule, value, callback) => {
        if (!value) {
          callback(new Error(' '))
        } else {
          callback()
        }
      }
      return {
        dialogPrivacys: {
          isShow: false,
          country: null,
          condition_version_id: null,
          employee_id: null,
          privacy_country: '',
          random: null
        },
        language_list: [{
          lang_img_url: require('../../assets/images/login/yingguo.png'),
          name: 'English',
          identify: 'lang_en'
        }, {
          lang_img_url: require('../../assets/images/login/China.png'),
          name: '简体中文',
          identify: 'lang_zh'
        }, {
          lang_img_url: require('../../assets/images/login/riben.png'),
          name: '日本語',
          identify: 'lang_ja'
        }],
        animation: null,
        show_language: false,
        language1: this.language,
        login_state: false,
        loading: false,
        login_rules: {
          // user_name: [{ trigger: ['blur'], validator: validateUsername }],
          // password: [{ trigger: ['blur'], validator: validatePass }],
          // company_code: [{ trigger: 'blur', validator: validateCompanyCode }]
          user_name: [{ trigger: ['blur'], validator: validateUsername }],
          password: [{ trigger: ['blur'], validator: validatePass }],
          company_code: [{ trigger: 'blur', validator: validateCompanyCode }]
        },
        remember_password: true,
        login_form: {
          company_code: localStorage.getItem('company_code') || null,
          user_name: localStorage.getItem('username') || null,
          password: localStorage.getItem('password') || null
        }
      }
    },
    beforeDestroy() {
      // window.removeEventListener('resize', this.__resizeHanlder)
      document.onkeydown = function(e) {
        var key = e.keyCode
        if (key === 13) {
          // null
        }
      }
    },
    mounted() {
      // var client_height = document.body.clientHeight
      // console.log(client_height)
      // document.getElementById('login').style.cssText = `height: ${client_height}px; overflow-y: auto`
      this.language1 = this.language
      this.handleSetL()
      if (this.login_form.user_name && this.login_form.password) {
        this.remember_password = true
      }
      new Wave('#wave1', {
        number: 1,
        smooth: 100,
        height: 0.9,
        opacity: 0.4,
        colors: ['#ffffff'],
        position: 'bottom'
      })
      this.star()
      // this.__resizeHanlder = debounce(() => {
      //   wave.reset()
      // }, 100)
      // window.addEventListener('resize', this.__resizeHanlder)
    },
    created() {
      var _self = this
      document.onkeydown = function(e) {
        var key = e.keyCode
        if (key === 13) {
          _self.handleLogin()
        }
      }
    },
    destroyed() {
      this.loading = false
    },
    methods: {
      handleSetL() {
        this.$i18n.locale = this.language1
        this.setLanguage(this.language1)
      },
      switchClick() {
        if (!this.show_language) {
          anime({
            targets: '.select',
            direction: 'alternate',
            autoplay: true,
            opacity: 1,
            translateY: 40,
            easing: 'easeOutElastic(1, .8)',
            loop: false
          })
        } else {
          anime({
            targets: '.select',
            direction: 'alternate',
            autoplay: true,
            opacity: 0,
            translateY: 0,
            easing: 'easeOutElastic(1, .8)',
            loop: false
          })
        }
        this.show_language = !this.show_language
      },
      globalClick() {
        if (this.show_language) {
          this.show_language = !this.show_language
          anime({
            targets: '.select',
            direction: 'alternate',
            autoplay: true,
            opacity: 0,
            translateY: 0,
            easing: 'easeOutElastic(1, .8)',
            loop: false
          })
        }
      },
      setI18nDataSession,
      ...mapActions({
        storeGetConfiguration: 'getConfiguration',
        storeGetInfo: 'GetInfo'
      }),
      ...mapMutations({
        setLanguage: 'SET_LANGUAGE'
      }),
      calculate(i) {
        const dom = document.querySelector('.star-circle')
        const w = dom.clientWidth
        const w2 = w / 2
        const w1 = w2 / 10
        return [(w2 - (i * w1)) * -1 + (150 - (i * 15)), (w2 - ((i + 1) * w1)) * -1 + (150 - (i * 15))]
      },
      star() {
        const staggerVisualizerEl = document.querySelector('.star-circle')
        const fragment = document.createDocumentFragment()
        const grid = [10, 2]
        const col = grid[0]
        const row = grid[1]
        const numberOfElements = col * row
        for (let i = 0; i < numberOfElements; i++) {
          var imgObj = document.createElement('img')
          var data = [require('../../assets/images/star.png'), require('../../assets/images/circle.png'), require('../../assets/images/circle1.png')]
          imgObj.setAttribute('src', data[Math.floor(Math.random() * 3)])
          imgObj.setAttribute('width', 15)
          imgObj.setAttribute('class', 'img' + i)
          fragment.appendChild(imgObj)
        }

        staggerVisualizerEl.appendChild(fragment)
        var _this = this
        anime.timeline({
          targets: '.star-circle img',
          easing: 'easeInOutSine',
          // delay: anime.stagger(50),
          loop: false,
          autoplay: true
        }).add({
          targets: '.width-420, .slanguage',
          opacity: 1,
          delay: 300
        }, 0).add({
          targets: '.w1',
          zIndex: 1,
          backgroundColor: 'rgba(255, 255, 255, 0)',
          duration: 700
        }, 0).add({
          targets: '#wave1',
          translateY: '30%', // -> '250px'
          opacity: 1,
          duration: 1000
        }, 0).add({
          targets: '.star-circle img',
          translateX: function(el, i) {
            return anime.random((_this.calculate(i))[0], (_this.calculate(i))[1])
          },
          translateY: function(el, i) {
            if (i % 2 === 0) {
              return anime.random(-100, -130)
            } else {
              return anime.random(-160, -200)
            }
          },
          opacity: 1
        })
      },
      async getConfiguration() {
        try {
          await this.storeGetConfiguration({ app_id: 3 })
          // await this.storeGetInfo()
          await this.getTenant() // 租户信息
          await this.handleGetUserInf() // 获取用户信息
          // 处理记录密码
          await this.handleRememberPassword()
          // 跳转
          await this.goto()
        } catch (err) {
          this.loading = false
          console.log(err)
        }
      },
      // handleAgree() {
      //   this.dialogPrivacys.isShow = false
      //   userConfirm({
      //     'condition_version_id': this.dialogPrivacys.condition_version_id,
      //     'confirm_client': 'fc',
      //     'confirm_country': this.dialogPrivacys.country,
      //     'extend_info': null
      //   }, this.dialogPrivacys.employee_id).then(res => {
      //     // 如果同意了，才允许登录
      //     if (res.return_result && res.return_result.success) {
      //       setAgreePrivacy(0)
      //       this.$router.push({ path: '/homepage' })
      //     }
      //   }).catch((err) => {
      //     this.loading = false
      //     this.$message.error(err)
      //   })
      // },
      handleLogin() {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            this.loading = true
            // 获取token
            this.$store.dispatch('Login', { user_name: this.login_form.user_name, company_code: this.login_form.company_code, password: this.login_form.password }).then(() => {
              this.getConfiguration()
              // 登录成功后，如果隐私策略没有更新，且之前用户点击确认过隐私策略，则不再弹出model框
              // 如果之前用户点击确认过，但是隐私策略有更新，这个时候会弹出model需要用户点击确认
              // 如何判断隐私策略有没有更新
              // 获取到当前租户的语言，而不是当前页面显示的语言，展示对应的privacy policy
            }).catch((res) => {
              this.$message.error(this.$t('validation.login_fail'))
              this.loading = false
              this.login_state = true
              this.$nextTick(() => {
                this.$refs['loginForm'].validate(() => {})
              })
            })
          } else {
            return false
          }
        })
      },
      getTenant() {
        return getTenantInfo(this.$store.getters.userInfo.id, this.$store.getters.userInfo.tenant_id).then(res => {
          window.localStorage.tenantInfo = JSON.stringify(res.return_result)
        })
      },
      handleGetUserInf() {
        return store.dispatch('GetInfo')
      },
      handleRememberPassword() {
        return new Promise((resolve, reject) => {
          /**
           * 取消记录密码  将localstorage中的记录删除
           * 记住密码  则添加纪录
           */
          if (this.remember_password) {
            localStorage.setItem('username', this.login_form.user_name)
            localStorage.setItem('password', this.login_form.password)
            localStorage.setItem('company_code', this.login_form.company_code)
          } else {
            localStorage.removeItem('username')
            localStorage.removeItem('password')
            localStorage.removeItem('company_code')
          }
          resolve()
        })
      },
      goto() {
        return new Promise((resolve, reject) => {
          var global_items = this.$store.getters.global_data
          var business_data = this.$store.getters.business_data.common
          this.globalData.value = { ...global_items, ...business_data }
          var d = (this.globalData.value.date_format || '').toLowerCase()
          var result1 = ''
          if (d) {
            var arr1 = d.split('-')
            var arr2 = d.split('/')
            if (arr1.length >= 2) {
              var a1 = arr1[1].toUpperCase()
              if (a1 !== 'MM') {
                a1 = 'MM'
              }
              result1 = `${arr1[0]}-${a1}-${arr1[2]}`
            } else if (arr2.length >= 2) {
              var a2 = arr2[1].toUpperCase()
              if (a2 !== 'MM') {
                a2 = 'MM'
              }
              result1 = `${arr2[0]}/${a2}/${arr2[2]}`
            } else {
              result1 = 'yyyy/MM/dd'
            }
          } else {
            result1 = 'yyyy/MM/dd'
          }
          this.globalData.value.date_format = result1
          this.globalData.formatNumber = (data, fixed = 0) => {
            if (data && typeof data === 'number') {
              var _this = this.globalData.value
              const thousandsSeparator = _this.thousandsSeparator || ','
              return data.toFixed(fixed).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, `$&${thousandsSeparator}`)
            } else {
              return data
            }
          }
          // 格式化日期
          this.globalData.formatDate = (val) => {
            const moment = require('moment')
            if (val === null || val === undefined) {
              return ''
            }
            var _this = this.globalData.value
            var date_format = (_this.date_format).toUpperCase()
            return moment(val).format(date_format)
          }

          this.$router.push({ path: '/homepage' })
          resolve()

          // this.loading = false
          // 跳转到首页
          // const { tenant_id } = JSON.parse(getRoleUserInfo())
          // userCheck({
          //   'confirm_client': 'fc',
          //   'confirm_country': tenant_id ? tenant_id + '' : tenant_id
          // }, tenant_id ? +tenant_id : 1).then(res => {
          //   const result = res.return_result
          //   this.loading = false
          //   if (result && +result.condition_version_id === 0) { // 不需要确认隐私条款
          //     setAgreePrivacy(0)
          //     this.dialogPrivacys.isShow = false
          //     this.$router.push({ path: '/homepage' })
          //     resolve()
          //   } else { // 需要确认隐私条款
          //     setAgreePrivacy(1)
          //     this.dialogPrivacys.random = Math.random() * 99999999
          //     this.dialogPrivacys.condition_version_id = +result.condition_version_id
          //     this.dialogPrivacys.employee_id = tenant_id ? +tenant_id : 1
          //     this.dialogPrivacys.country = tenant_id ? +tenant_id : 1
          //     this.dialogPrivacys.privacy_country = result.content
          //     this.dialogPrivacys.isShow = true
          //   }
          // }).catch((err) => {
          //   this.loading = false
          //   this.$message.error(err)
          // })
        })
      }
    },
    watch: {
      login_form: {
        deep: true,
        handler(val) {
          this.login_state = false
          // this.$refs['loginForm'].validate(() => {})
        }
      },
      language1() {
        this.handleSetL()
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  .w1{
    width: 100%;
    background-color: rgba(255, 255, 255, 1);
    position: absolute;
    height: 100%;
    top: 0;
    bottom: 0;
    opacity: 1;
    z-index: 11111
  }
  .slanguage{
    opacity: 0;
  }
  .login{
    width:100%;
    height:100vh;
    overflow: hidden;
    background:linear-gradient(135deg,rgba(0,93,119,1) 0%,rgba(0,57,80,1) 100%);
    position: relative;
    .copyright {
      width: 100%;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      bottom: 30px;
      font-size: 14px;
      color: #333;
      z-index: 1000;
      text-align: center;
      p {
        line-height: 22px;
      }
      span {
        // color: #2777FF;
        font-weight: 500;
      }
      a.beian, a.beiantxt {
        &:hover {
          text-decoration: underline;
        }
      }
      img.beianimg {
        position: relative;
        top: 5px;
        margin-right: 2px;
        right: 1px;
      }

    }
    .switch-language, .switch-language1, .switch-language2{
      z-index: 99999;
      cursor: pointer;
      display: flex;
      width: 140px;
      align-items: center;
      position: absolute;
      top: 34px;
      right: 58px;
      img{
        width: 37px;
        margin-right: 11px;
      }
      label{
        cursor: pointer;
        font-size:20px;
        font-weight:600;
        color:rgba(255,255,255,1);
      }
    }
    .switch-language2{
      top: 34px;
      right: 0;
    }
    .el-input{
      // margin-bottom: 12px!important;
      margin-bottom: 12px;
      animation-delay: 600;
      animation: inputHeight 1.2s 1 forwards;
    }
    .width-420{
      z-index: 9999;
      width: 360px;
      position: absolute;
      left: 0;
      right: 0;
      text-align: center;
      margin: auto;
      top: 100px;
      opacity: 0;
      .logo{
        height: 80px;
        width: 195px;
      }
      .sign-in{
        margin: 32px 0 50px 0;
        color:rgba(255,255,255,1);
        font-size:40px;
      }
      .other-operation{
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size:20px;
        font-weight:400;
        color:rgba(225,249,254,1);
        .el-checkbox{
          width: 24px;
          height: 24px;
          font-size:20px;
          font-weight:400;
          color:rgba(225,249,254,1);
        }
        .forgot-password{
          cursor: pointer;
          font-size:15px;
          color: $new-primary;
          line-height:18px;
        }
      }
    }
    .login-button{
      border-radius:10px;
      cursor: pointer;
      margin-top: 30px;
      animation-delay: .2s;
      animation: loginButtonHeight 1.2s 1 forwards;
      width: 100%;
      height: 50px;
      background: $new-primary;
      box-shadow: 0 5px 10px -3px rgba(20,108,88,1);
      font-size:20px;
      color:rgba(225,249,254,1);
      line-height:25px;
      border: none;
      font-weight: bold;
      label{
        cursor: pointer;
        opacity: 0;
        animation: labelOpacity 1.2s 1 forwards;
      }
    }
    .register{
      font-size:18px;
      color:rgba(225,249,254,1);
      line-height:22px;
      cursor: pointer;
      // margin-top: 30px;
      animation: registerHeight 1.2s 1 forwards;
      margin-top: 30px;
      display: block;
      font-weight:400;
    }
    .wave{
      position: absolute;
      bottom: 0;
      left:0;
      right: 0;
      height: 100vh;
    }
  }
  @keyframes inputHeight {
    from { margin-bottom: 35px; }
    to { margin-bottom: 12px; }
  }
  @keyframes loginButtonHeight {
    from { margin-top: 58px }
    to { margin-top: 35px }
  }
  @keyframes registerHeight {
    from { margin-top: 53px }
    to { margin-top: 30px }
  }
  @keyframes labelOpacity {
    from { opacity: 0 }
    to { opacity: 1 }
  }
  @keyframes width420Opacity {
    from { opacity: 0 }
    to { opacity: 1 }
  }
  .select{
    position: absolute;
    top: 30px;
    opacity: 0;
    right: 58px;
    z-index: 9999;
    .switch-language1{
      position: absolute;
      top: 0;
      right: 0;
    }
  }
</style>
<style lang="scss" rel="stylesheet/scss">
  @keyframes imgAnimation {
    from { opacity: 0 }
    to {
      opacity: 1;
      left: 63px;
      bottom: 47px;
    }
  }
  .login{
    .star-circle{
      height: 150px;
      width: 100%;
      position: absolute;
      bottom: -80px;
      text-align: center;
      img{
        opacity: 0;
      }
    }
    .width-420{
      .el-checkbox__input.is-checked .el-checkbox__inner{
        background-color: $new-primary!important;
        border-color: $new-primary!important;
      }
      .el-checkbox__label, .el-checkbox__input.is-checked .el-checkbox__inner{
        font-size:16px;
        color:rgba(225,249,254,1)!important;
      }
      .el-checkbox__inner{
        background-color: rgba(218,244,255,0.15);
        border-color:rgba(39,119,255,.5);
        margin-top: 0.2px;
      }
      .el-form-item.is-success .el-input__inner{
         border-color: rgba(39, 119, 255, .5) !important;
       }
      .is-checked .el-checkbox__label {
        color: $new-primary!important;
        font-size:15px;
      }
      input{
        width:100%;
        height:50px;
        background:rgba(218,244,255,0.15);
        border-radius:10px;
        border:2px solid rgba(39, 119, 255, .5);
        font-size: 16px;
        font-weight:400;
        color:#ffffff;
      }
    }
    .other-operation{
      .el-checkbox__inner{
        width: 20px;
        height: 20px;
      }
      .el-checkbox__inner::after{
        height: 12px;
        left: 5px;
        top: 1px;
        width: 6px;
      }
      .el-checkbox__label{
        font-size: 15px;
        line-height: 24px;
      }
    }
  }
  /*@media screen and (min-width: 1100px) {*/
    /*.width-420{*/
      /*border: 5px solid red!important;*/
    /*}*/
  /*}*/
  /*@media screen and (min-width: 1366px) {*/
    /*.width-420{*/
      /*border: 5px solid yellow!important;*/
    /*}*/
  /*}*/
  @media screen and (max-width: 1600px) {
    .width-420{
      width: 360px!important;
      top: 60px!important;
      .logo{
        height: 72px!important;
        width: 175.5px!important;
      }
      .sign-in{
        margin: 15px 0 31px 0!important;
        font-size:38px!important;
      }
      input{
        height:42px!important;
        font-size: 14px!important;
      }
      .el-input{
        margin-bottom: 6px!important;
      }
      .login-button{
        margin-top: 24px!important;
        height: 42px!important;
        font-size: 18px!important;
      }
      .register{
        font-size:17px!important;
        margin-top: 24px!important;
      }
      .other-operation{
        .el-checkbox__inner{
          width: 18px!important;
          height: 18px!important;
        }
        .el-checkbox__inner::after{
          width: 5px!important;
          top: 0!important;
        }
        .el-checkbox__label{
          font-size: 15px!important;
        }
      }
    }
  }
</style>
