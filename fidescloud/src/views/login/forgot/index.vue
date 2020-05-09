<template>
  <div @click="globalClick" class="forgot">
    <div class="slanguage">
      <div @click.stop="switchClick" class="switch-language" v-for="item in language_list" v-if="language1 === item.identify">
        <img :src="item.lang_img_url" />
        <label>{{item.name}}</label>
      </div>
    </div>
    <div class="select" >
      <div @click="language1='lang_zh'; switchClick()" class="switch-language1"  v-if="language1!=='lang_zh'">
        <img src="../../../assets/images/login/China.png" />
        <label>简体中文</label>
      </div>
      <div :class="{'switch-language2' : language1 === 'lang_ja', 'switch-language1' : language1 !== 'lang_ja' }" @click="language1='lang_en';switchClick()" v-if="language1!=='lang_en'">
        <img src="../../../assets/images/login/yingguo.png" />
        <label>English</label>
      </div>
      <div @click="language1='lang_ja';switchClick()" class="switch-language2" v-if="language1!=='lang_ja'">
        <img src="../../../assets/images/login/riben.png" />
        <label>日本語</label>
      </div>
    </div>
    <div class="width-420">
      <div style="height: 80px">
        <img class="logo" src="../../../assets/images/login/logo.png" />
      </div>
      <h1 class="forgot-password">{{$t('login.fc_forgot_password_title_label')}}</h1>
      <div class="back">
        <router-link tag="span" to="/login">< {{$t('login.fc_forgot_password_btn_back_label')}}</router-link>
      </div>
      <section class="form1">
        <el-form :model="form" :rules="rules" class="login-form" ref="loginForm">
          <!--company code-->
          <el-form-item prop="company_code">
            <el-input :placeholder="$t('login.fc_forgot_password_company_code_label')" autocomplete="off" v-model="form.company_code"></el-input>
          </el-form-item>
          <!--Professional email address-->
          <el-form-item prop="professional_email_address">
            <el-input :placeholder="$t('login.fc_forgot_password_email_label')" autocomplete="off" v-model="form.professional_email_address"></el-input>
          </el-form-item>
          <!--verification code-->
          <el-form-item prop="verification_code">
            <div class="verification_code">
              <el-input :placeholder="$t('login.fc_forgot_password_verification_label')" autocomplete="off" maxlength="10" v-model="form.verification_code"></el-input>
              <el-button :class="{'disable-send': handleSendState || is_count_down}" :disabled="handleSendState || is_count_down" @click="send" class="send">
                <template v-if="is_count_down">
                  <div class="count-down">
                    <img src="../../../assets/images/login/countdown.png" />
                    <label>{{count_down_value}}</label>
                  </div>
                </template>
                <template v-else>
                  {{$t('login.fc_forgot_password_btn_send_label')}}
                </template>
              </el-button>
            </div>
          </el-form-item>
          <!--new password-->
          <el-form-item prop="new_password" ref="new_password">
            <el-input :placeholder="$t('login.fc_forgot_password_new_label')" autocomplete="new-password" show-password type="password" v-model="form.new_password"></el-input>
          </el-form-item>
          <!--confirm password-->
          <el-form-item prop="confirm_password" ref="confirm_password">
            <el-input :placeholder="$t('login.fc_forgot_password_confirm_label')" autocomplete="new-password" show-password type="password" v-model="form.confirm_password"></el-input>
          </el-form-item>
          <el-button :loading="loading" @click.native.prevent="submit" class="submit-button"><label>{{$t('login.fc_forgot_password_btn_submit_label')}}</label></el-button>
        </el-form>
      </section>
    </div>
    <div class="star-circle"></div>
    <div class="w1">
      <div class="wave" id="wave1" style="opacity: 0">
        <canvas />
      </div>
    </div>
  </div>
</template>
<script>
  var sha1 = require('sha1')
  import Wave from '../wave.es'
  import anime from 'animejs'
  import { mapActions, mapGetters, mapMutations } from 'vuex'
  import { setI18nData as setI18nDataSession } from '@/utils/auth'
  import { getTenantInfo } from '@/api/common'
  import { checkEmail } from '@/utils/validate'
  import { sendEmail, changeForgot, temporaryAccessToken } from '@/api/user'
  import { RegExp } from '@/utils/RegExp'

  export default {
    computed: {
      ...mapGetters([
        'language'
      ]),
      handleSendState() {
        if (this.form.professional_email_address === '' || this.form.professional_email_address === null || this.form.professional_email_address === undefined || this.form.company_code === '' || this.form.company_code === null || this.form.company_code === undefined || !this.checkEmail(this.form.professional_email_address)) {
          return true
        } else {
          return false
        }
      }
    },
    data() {
      return {
        token: '',
        count_down_value: 61,
        is_count_down: false,
        language_list: [{
          lang_img_url: require('../../../assets/images/login/yingguo.png'),
          name: 'English',
          identify: 'lang_en'
        }, {
          lang_img_url: require('../../../assets/images/login/China.png'),
          name: '简体中文',
          identify: 'lang_zh'
        }, {
          lang_img_url: require('../../../assets/images/login/riben.png'),
          name: '日本語',
          identify: 'lang_ja'
        }],
        animation: null,
        show_language: false,
        language1: this.language,
        login_state: false,
        loading: false,
        rules: {
          company_code: [{ required: true, message: ' ', trigger: 'blur' }],
          professional_email_address: [{ required: true, message: ' ', trigger: ['change', 'blur'] }, { validator: this.validationCheckEmail, trigger: ['blur'] }],
          new_password: [{ required: true, message: ' ', trigger: 'blur' }, { validator: this.validateComparePassword, trigger: 'blur' }],
          confirm_password: [{ required: true, message: ' ', trigger: 'blur' }, { validator: this.validateComparePassword, trigger: 'blur' }],
          verification_code: [{ required: true, message: ' ', trigger: 'blur' }]
        },
        form: {
          company_code: '',
          professional_email_address: '',
          verification_code: '',
          new_password: '',
          confirm_password: ''
        },
        timeOut: null
      }
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.__resizeHanlder)
    },
    mounted() {
      this.language1 = this.language
      this.handleSetL()
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
      this.handleTemporaryAccessToken()
    },
    destroyed() {
      this.loading = false
    },
    methods: {
      validationCheckEmail(rule, value, callback) {
        var regular = RegExp.email
        if (regular.test(value)) {
          callback()
        } else {
          this.$message.error(this.handleGlobalI18n('validation', 'email_error'))
          callback(new Error(' '))
        }
      },
      submit() {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            this.loading = true
            changeForgot({ company_code: this.form.company_code, email: this.form.professional_email_address, new_password: sha1(this.form.new_password), token: this.form.verification_code }).then(res => {
              this.$message({
                message: this.$t('validation.change_password_suc'),
                type: 'success'
              })
              this.loading = false
              // 跳转回登录页面
              this.$router.push({
                path: '/login'
              })
            }).catch(res => {
              this.loading = false
              this.$message.error(res)
            })
          }
        })
      },
      handleTemporaryAccessToken() {
        if (this.token) {
          return true
        }
        temporaryAccessToken().then(res => {
          var token = res.access_token || ''
          this.token = token
          sessionStorage.setItem('temporary_access_token', this.token)
        }).catch(res => {
          // do something
        })
      },
      checkEmail,
      countDown() {
        if (this.count_down_value === 0) {
          this.is_count_down = false
          return
        } else {
          this.count_down_value--
        }
        var _this = this
        this.timeOut = setTimeout(function() {
          _this.countDown()
        }, 1000)
      },
      // 发送验证码
      send() {
        this.is_count_down = true
        this.count_down_value = 61
        // 验证通过  调用接口  开始倒计时
        this.countDown()
        sendEmail({ company_code: this.form.company_code, content: this.$t('login.fc_login_send_email_content'), email: this.form.professional_email_address, subject: this.$t('login.fc_login_send_email_subject') }).then(res => {
          // console.log(res)
        }).catch(res => {
          // console.log(res)
          // 取消倒计时
          this.is_count_down = false
          clearTimeout(this.timeOut)
          this.$message.error(res)
        })
      },
      // 验密码与确认密码是否相同
      validateComparePassword(rule, value, callback) {
        if (this.form.new_password === '' || this.form.confirm_password === '') {
          callback()
        } else if (this.form.new_password !== this.form.confirm_password) {
          this.$message.error(this.$t('validation.compare_password'))
          callback(new Error(' '))
        } else if (!(/[a-z]/g.test(value) || /[A-Z]/g.test(value)) || !(/\d/g.test(value)) || value.length > 15 || value.length < 8) {
          this.$message.error(this.$t('validation.fc_register_password_input_wrong_tips'))
          callback(new Error(' '))
        } else if (!(/[=~!@#$%^&*()_+\/-]/.test(value))) {
          this.$message.error(this.$t('validation.fc_register_password_input_wrong_tips_3'))
          callback(new Error(' '))
        } else {
          this.$refs['new_password'].clearValidate()
          this.$refs['confirm_password'].clearValidate()
          callback()
        }
      },
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
        setLanguage: 'SET_LANGUAGE',
        setTokenMap: 'SET_TOKEN'
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
          var data = [require('../../../assets/images/star.png'), require('../../../assets/images/circle.png'), require('../../../assets/images/circle1.png')]
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
          await this.goto()
        } catch (err) {
          this.loading = false
          console.log(err)
        }
      },
      handleLogin() {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            this.loading = true
            this.$store.dispatch('Login', { user_name: this.form.user_name, company_code: this.form.company_code, password: this.form.password }).then(() => {
              this.getConfiguration()
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
        getTenantInfo(this.$store.getters.userInfo.id, this.$store.getters.userInfo.tenant_id).then(res => {
          window.localStorage.tenantInfo = JSON.stringify(res.return_result)
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
          // this.loading = false
          this.$router.push({ path: '/' })
          resolve()
        })
      }
    },
    watch: {
      form: {
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
  .forgot{
    width:100%;
    height:100vh;
    overflow: hidden;
    background:linear-gradient(135deg,rgba(0,93,119,1) 0%,rgba(0,57,80,1) 100%);
    position: relative;
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
      z-index: 999;
      width: 360px;
      position: absolute;
      left: 0;
      right: 0;
      text-align: center;
      margin: auto;
      top: percentage(109/1080);
      opacity: 0;
      .logo{
        height: 80px;
        width: 195px;
      }
      .forgot-password{
        /*margin: percentage(45/1080) 0 percentage(53/1080) 0;*/
        margin: 23px 0 17px 0;
        font-size:28px;
        color:rgba(255,255,255,1);
        line-height:34px;
      }
      .back{
        cursor: pointer;
        font-size:20px;
        font-weight:600;
        color: $new-primary;
        line-height:28px;
        margin-bottom: 30px;
      }
      .verification_code{
        position: relative;
        .send{
          position: absolute;
          right: 2px;
          top: 2px;
          width:120px;
          height:46px;
          background:$new-primary;
          border-radius:10px;
          border:2px solid rgba(39, 119, 255, .5);
          font-size:16px;
          color:rgba(255,255,255,1);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .count-down{
          display: flex;
          align-items: center;
          img{
            width: 15px;
            height: 16px;
            margin-right: 6px;
          }
          label{
            cursor: pointer;
            font-size:16px;
          }
        }
        .disable-send{
          background:rgba(30,85,104,1)!important;
        }
      }
    }
    .submit-button{
      border-radius:10px;
      cursor: pointer;
      animation-delay: .2s;
      animation: loginButtonHeight 1.2s 1 forwards;
      width: 100%;
      height: 50px;
      background: $new-primary;
      box-shadow: 0 5px 10px -3px rgba(39, 119, 255, .5);
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
    from { margin-top: 30px }
    to { margin-top: 0 }
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
  .forgot{
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
      .el-form-item.is-success .el-input__inner{
        border-color: rgba(39, 119, 255, .5)!important;
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
  }
  @media screen and (max-width: 1600px) {
    .forgot .width-420{
      width: 350px!important;
      top: 60px!important;
      .logo{
        height: 72px!important;
        width: 175.5px!important;
      }
      .send{
        height:38px!important;
        font-size:15px!important;
      }
      .forgot-password{
        margin: 15px 0 15px 0!important;
        font-size: 26px!important;
      }
      .back{
        font-size: 18px;
        margin-bottom: 24px;
      }
      input{
        height:42px!important;
        font-size: 14px!important;
      }
      .el-input{
        margin-bottom: 6px!important;
      }
      .submit-button{
        margin-top: 24px!important;
        height: 42px!important;
        font-size: 18px!important;
      }
    }
  }
</style>
