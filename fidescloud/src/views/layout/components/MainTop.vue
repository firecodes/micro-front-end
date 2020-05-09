<template>
  <div class="top" >
    <div class="left">
      <el-menu class="navbar" mode="horizontal">
        <hamburger :isActive="!sidebar.opened" :toggleClick="toggleSideBar" class="hamburger-container" />
        <breadcrumb />
      </el-menu>
    </div>
    <div class="right">
      <span class="user-name">
        {{(userInfo.first_name || '') + ' '+ (userInfo.last_name || '')}}
      </span>
      <div class="line"></div>
      <el-tooltip effect="dark" :content="handleGlobalI18n('system', 'fullscreen')" placement="bottom" style="display:none;">
        <screenfull class="screenfull" />
      </el-tooltip>
      <div class="right-menu">
        <el-dropdown class="avatar-container right-menu-item" trigger="click">
          <div class="avatar-wrapper">
            <img class="user-avatar" :src="tenant_logo" alt="user avatar"/>
            <i class="el-icon-caret-bottom" />
          </div>
          <el-dropdown-menu class="user-dropdown" slot="dropdown">
            <!--login name-->
            <router-link class="inlineBlock" to="/">
              <el-dropdown-item class="user-info-dropdown dropdown-light-center" v-if="configuration_state">
                {{(userInfo.login_name || '')}}
              </el-dropdown-item>
            </router-link>
            <!--configuration-->
            <el-dropdown-item class="configuration-dropdown dropdown-light-center" divided v-if="configuration_state">
              <role-select />
            </el-dropdown-item>
            <!--language-->
            <el-dropdown-item class="language-dropdown dropdown-light-center" divided>
              <lang-select class="international right-menu-item" />
            </el-dropdown-item>
            <!--logout-->
            <el-dropdown-item class="dropdown-light-center" divided>
              <span @click="logout" style="display:block;">{{ $t('homepage.fc_account_menu_third_label') }}</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'
  import LangSelect from '@/components/LangSelect'
  import RoleSelect from '@/components/RoleSelect'
  import StyleSelect from '@/components/StyleSelect'
  import Screenfull from '@/components/Screenfull'
  import Breadcrumb from '@/components/Breadcrumb'
  import Hamburger from '@/components/Hamburger'
  import { checkObjHasOwnProperty } from '@/utils'
  export default {
    data() {
      return {
        tenant_logo: window.localStorage.tenantInfo ? (JSON.parse(window.localStorage.tenantInfo)).logo : '',
        tenant_name: window.localStorage.tenantInfo ? (JSON.parse(window.localStorage.tenantInfo)).name : '',
        default_user_avatar: require('../../../assets/images/employee.png'),
        configuration_state: true,
        language_state: false
      }
    },
    components: {
      Breadcrumb,
      Hamburger,
      LangSelect,
      RoleSelect,
      Screenfull,
      StyleSelect
    },
    computed: {
      ...mapGetters([
        'userInfo',
        'sidebar',
        'role_data'
      ])
    },
    created() {
      if (this.checkObjHasOwnProperty(this.role_data, 'top-menu-config')) {
        // 是否有configuration
        var top_menu_config = this.role_data['top-menu-config']
        if (!this.checkObjHasOwnProperty(top_menu_config, 'configuration')) {
          this.configuration_state = false
        }
        // // 是否有language
        // if (this.checkObjHasOwnProperty(top_menu_config, 'language')) {
        //   if (top_menu_config.language.display_all) {
        //     this.language_state = true
        //   }
        // }
      }
    },
    methods: {
      checkObjHasOwnProperty,
      toggleSideBar() {
        this.$store.dispatch('ToggleSideBar')
      },
      logout() {
        this.$store.dispatch('FedLogOut').then(() => {
          window.localStorage.removeItem('tenantInfo')
          window.sessionStorage.removeItem('route')
          location.reload()
        })
      }
    }
  }
</script>
<style scoped rel="stylesheet/scss" lang="scss">
  .configuration-dropdown{
    margin-top: 0;
    border-top-color: #303133;
  }
  .dropdown-light-center{
    text-align: center;
  }
  .top {
    .navbar {
      border:0;
      display: flex;
      .hamburger-container {
        display: flex;
        align-items: center;
        height: 50px;
        float: left;
        padding: 0 10px;
      }
      .avatar-container {
        height: 50px;
        display: inline-block;
        position: absolute;
        right: 35px;
        top:0;
        cursor: pointer;
      }
    }
    .el-dropdown-link {
      cursor: pointer;
    }
    .right {
      display: flex;
      align-items: center;
      margin-right: 20px;
      .user-img {
        margin-right: 30px;
        /*width: 35px;*/
        /*height:35px;*/
        // mcc
        /*width: 74px;*/
        /*height: 33.4px;*/
        //bhg
        img{
          height: 35px;
          // border-radius: 50%;
        }
      }
      .user-name{
        color:#000000;
      }
      .right-menu-item{
        display: inline-block;
        margin:0 18px;
      }
      .line {
        height: 30px;
        width: 2px;
        background: #99a9bf;
        margin: 0 10px;
      }
      .screenfull {
        height: 20px;
      }
      .international{
        vertical-align: top;
      }
      .right-menu {
        .user-avatar {
          // width: 40px;
          height: 40px;
          border-radius: 10px;
          vertical-align: baseline;
        }
        .avatar-container {
          cursor: pointer;
        }
        .el-icon-caret-bottom {
          position: absolute;
          right: -20px;
          top: 20px;
          font-size: 12px;
        }
      }
    }
  }
</style>
