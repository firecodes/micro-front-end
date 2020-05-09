<template>
  <div class="legal-page">
    <div class="left-side">
      <el-menu
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose"
        background-color="#0f377e"
        text-color="#fff !important"
        active-text-color="#ffd04b">
        <div class="logo">
          <img :src="require('@/assets/images/fidessuite.png')" alt="">
        </div>
        <el-menu-item @click.native="handleClick('terms')" ref="terms" class="first-menu-item" :class="{'is-active': activeA}">
          <span>Terms & conditions</span>
        </el-menu-item>
        <el-menu-item @click.native="handleClick('privacy')" ref="privacy" :class="{'is-active': activeB}">
          <span>Privacy policy</span>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="container">
      <div class="header">
        <div class="language">
          <el-dropdown @command="handleChange">
            <span class="el-dropdown-link">
              <svg-icon :icon-class="current" class="nationalFlag"></svg-icon><span>{{ current }}</span><i class="el-icon-arrow-down el-icon--right"></i>
              <!-- <img class="internationalcalls" :src="require(`@/assets/images/legal/${current}.png`)" alt="">{{ current }}<i class="el-icon-arrow-down el-icon--right"></i> -->
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="International">International</el-dropdown-item>
              <el-dropdown-item command="China">China</el-dropdown-item>
              <el-dropdown-item command="Hong Kong">Hong Kong</el-dropdown-item>
              <el-dropdown-item command="India">India</el-dropdown-item>
              <el-dropdown-item command="Japan">Japan</el-dropdown-item>
              <el-dropdown-item command="Singapore">Singapore</el-dropdown-item>
              <el-dropdown-item command="Taiwan">Taiwan</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>

        <div class="btn-groups btn-groups-mini">
          <el-button class="cancel-btn" size="mini"><a :href="href" target="_blank">Try for free</a></el-button>
          <el-button type="primary" size="mini"><a :href="href2" target="_blank">Login</a></el-button>
        </div>
        <div class="btn-groups btn-groups-normal">
          <el-button class="cancel-btn"><a :href="href" target="_blank">Try for free</a></el-button>
          <el-button type="primary"><a :href="href2" target="_blank">Login</a></el-button>
        </div>
      </div>

      <div class="main">
        <div class="title-box">
          <header-title :title="headerTitle"></header-title>
        </div>
        <div class="main-box">
          <div class="inner-box">
            <div style="height: 545px;">
              <el-scrollbar style="height:100%;">
                <router-view></router-view>
                <div class="copyright-mini">
                  <span>Copyright © Edenred {{new Date().getFullYear()}}. All rights reserved</span>
                </div>
              </el-scrollbar>
            </div>
          </div>
          <div class="copyright">
            <span>Copyright © Edenred {{new Date().getFullYear()}}. All rights reserved</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import EdHeaderTitle from '@/components/Ed-header-title/ed-header-title'
export default {
  name: '',
  components: {
    'header-title': EdHeaderTitle
  },
  data() {
    return {
      current: 'International',
      activeA: true,
      activeB: false,
      headerTitle: '',
      href: ''
    }
  },
  created() {
    // this.current = this.setDownName()
    this.current = this.$route.meta.name
    if (this.$route.meta.title === 'terms') {
      this.headerTitle = 'Terms & conditions'
    } else {
      this.headerTitle = 'Privacy policy'
    }
    if (this.$route.path.indexOf('terms') > -1) { // terms
      this.activeA = true
      this.activeB = false
    } else {
      this.activeA = false
      this.activeB = true
    }
    if (this.current && this.current.toLowerCase() === 'china') {
      this.href = 'https://www.edenredchina.com/CN/product/fidescloud'
      this.href2 = 'https://www.fidescloud.cn/'
    } else {
      this.href = 'https://crm.fidescloud.com/'
      this.href2 = 'https://www.fidescloud.com/'
    }
  },
  methods: {
    setDownName(name) {
      if (sessionStorage.getItem('tp')) {
        return sessionStorage.getItem('tp')
      } else {
        if (this.$route.name === 'termscncondition' || this.$route.name === 'privacycncondition') {
          return 'China'
        } else {
          return 'International'
        }
      }
    },
    handleClick(val) {
      // index="/legal/terms"
      console.log(val)
      if (val === 'terms') {
        this.headerTitle = 'Terms & conditions'
      } else {
        this.headerTitle = 'Privacy policy'
      }
      if (this.$route.path.indexOf('terms') > -1) {
        this.$router.push(this.$route.path.replace('terms', val))
        this.activeA = false
        this.activeB = true
      } else {
        this.$router.push(this.$route.path.replace('privacy', val))
        this.activeA = true
        this.activeB = false
      }
    },
    handleChange(val) {
      this.current = val
      if (val && val.toLowerCase() === 'china') {
        this.href = 'https://www.edenredchina.com/CN/product/fidescloud'
        this.href2 = 'https://www.fidescloud.cn/'
      } else {
        this.href = 'https://crm.fidescloud.com/'
        this.href2 = 'https://www.fidescloud.com/'
      }
      if (this.$route.meta.title === 'terms') {
        this.activeA = true
        this.activeB = false
        switch (val) {
          case 'International':
            this.$router.push('/legal/terms')
            sessionStorage.setItem('tp', 'International')
            break
          case 'China':
            this.$router.push('/legal/terms/CN')
            sessionStorage.setItem('tp', 'China')
            break
          case 'Hong Kong':
            this.$router.push('/legal/terms/HK')
            sessionStorage.setItem('tp', 'Hong Kong')
            break
          case 'India':
            this.$router.push('/legal/terms/IN')
            sessionStorage.setItem('tp', 'India')
            break
          case 'Singapore':
            this.$router.push('/legal/terms/SG')
            sessionStorage.setItem('tp', 'Singapore')
            break
          case 'Japan':
            this.$router.push('/legal/terms/JP')
            sessionStorage.setItem('tp', 'Japan')
            break
          case 'Taiwan':
            this.$router.push('/legal/terms/TW')
            sessionStorage.setItem('tp', 'Taiwan')
            break
          default:
            this.$router.push('/legal/terms')
            sessionStorage.setItem('tp', 'International')
            break
        }
      }
      if (this.$route.meta.title === 'privacy') {
        this.activeA = false
        this.activeB = true
        switch (val) {
          case 'International':
            this.$router.push('/legal/privacy')
            sessionStorage.setItem('tp', 'International')
            break
          case 'China':
            this.$router.push('/legal/privacy/CN')
            sessionStorage.setItem('tp', 'China')
            break
          case 'Hong Kong':
            this.$router.push('/legal/privacy/HK')
            sessionStorage.setItem('tp', 'Hong Kong')
            break
          case 'India':
            this.$router.push('/legal/privacy/IN')
            sessionStorage.setItem('tp', 'India')
            break
          case 'Singapore':
            this.$router.push('/legal/privacy/SG')
            sessionStorage.setItem('tp', 'Singapore')
            break
          case 'Japan':
            this.$router.push('/legal/privacy/JP')
            sessionStorage.setItem('tp', 'Japan')
            break
          case 'Taiwan':
            this.$router.push('/legal/privacy/TW')
            sessionStorage.setItem('tp', 'Taiwan')
            break
          default:
            this.$router.push('/legal/privacy')
            sessionStorage.setItem('tp', 'International')
            break
        }
      }
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath)
    }
  }
}
</script>

<style lang='scss' scoped>
.legal-page {
  .nationalFlag {
    font-size: 30.1px;
  }
  /deep/ li {
    list-style: inherit !important;
  }
  .left-side {
    /deep/ li.el-menu-item {
      text-align: left;
      padding-left: 0px !important;
      padding-right: 0px !important;
      span {
        display: block;
        width: 126px;
        margin: 0 auto;
      }
    }
    /deep/ li.is-active {
      background: url(../../assets/images/rectangle.png) no-repeat;
      background-size: 100% 100%;
    }
    /deep/ li.first-menu-item {
      margin-top: 21px !important;
    }
    width: 235px;
    height: 100vh;
    float: left;
    position: relative;
    z-index: 8989;
    .el-menu {
      height: 100%;
      .el-menu-item {
        cursor: pointer;
        &:hover, &:focus, &:active {
          background-color: #0f377e !important;
          outline: none;
          cursor: pointer;
        }
      }
    }
    .logo {
      width: 100%;
      margin-top: 10px;
      text-align: center;
      img {
        height: 45px;
      }
    }
    @media screen and (max-width: 768px) {
      display: none !important;
    }
  }
  .container {
    @media screen and (max-width: 768px) {
      .main {
        /deep/ .title-box {
          padding-left: 12px !important;
          margin-bottom: 20px !important;
        }
        /deep/ .main-body {
          padding: 0 12px 50px 12px !important;
        }
      }
      .header {
        height: 80px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 5px;
        box-shadow: 2px 2px 20px #ccc;
        .language {
          .internationalcalls {
            height: 16px;
            margin-right: 4px;
            position: relative;
            top: 2px;
          }
          .el-dropdown-link {
            cursor: pointer;
            color: #041039;
            font-weight: bold;
            font-size: 14px;
            span {
              position: relative;
              margin-left: 6px;
              top: -5px;
            }
            .el-icon-arrow-down {
              color: #041039;
              font-size: 14px;
              position: relative;
              top: -5px;
            }
          }
        }
        .btn-groups {
          .cancel-btn {
            color: #2777FF;
            border-radius:4px;
            border:1px solid rgba(39,119,255,1);
          }
          .el-button--primary {
            background:rgba(39,119,255,1);
            border-radius:4px;
            border: 1px solid rgba(39,119,255,1);
          }
        }
        .btn-groups-mini {
          display: block;
        }
        .btn-groups-normal {
          display: none;
        }
      }
      .copyright {
        display: none !important;
      }
      .copyright-mini {
        text-align: center;
        border-top: 1px solid #ccc;
        margin-top: 14px;
        padding-top: 15px;
        color: #ccc;
        font-size: 14px;
      }
    }
    @media screen and (min-width: 769px) {
      .main {
        position: relative;
        .title-box {
          position: absolute;
          left: 266px;
          top: -48px;
        }
        .main-box {
          margin-top: 60px;
          padding-left: 265px;
          padding-right: 32px;
          .inner-box {
            background: #fff;
            box-shadow: 2px 2px 20px #ccc;
            /deep/ .el-scrollbar__wrap {
              overflow-x: hidden !important;
            }
          }
          .copyright-mini {
            display: none !important;
          }
          .copyright {
            text-align: center;
            border-top: 1px solid #ccc;
            margin-top: 20px;
            padding-top: 15px;
            color: #ccc;
            font-size: 12px;
          }
        }
      }
      .header {
        height: 80px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 50px;
        box-shadow: 2px 2px 20px #ccc;
        .language {
          .internationalcalls {
            height: 20px;
            margin-right: 6px;
            position: relative;
            top: 2px;
          }
          .el-dropdown-link {
            cursor: pointer;
            color: #041039;
            font-weight: bold;
            font-size: 18px;
            span {
              position: relative;
              top: -5px;
              margin-left: 6px;
            }
            .el-icon-arrow-down {
              color: #041039;
              font-size: 14px;
              font-size: 12px;
              position: relative;
              top: -5px;
            }
          }
        }
      }
      .btn-groups {
        .cancel-btn {
          color: #2777FF;
          border-radius:4px;
          border:1px solid rgba(39,119,255,1);
        }
        .el-button--primary {
          background:rgba(39,119,255,1);
          border-radius:4px;
          border: 1px solid rgba(39,119,255,1);
        }
      }
      .btn-groups-mini {
        display: none;
      }
      .btn-groups-normal {
        display: block;
      }
    }
  }
}
</style>
