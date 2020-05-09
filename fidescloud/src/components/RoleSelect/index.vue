<template>
  <el-dropdown trigger="hover" class='international' @command="handleSetRole">
    <div>
      {{ $t('homepage.fc_account_menu_first_label') }}
    </div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item :command="item.role_id" :key="item.role_id" v-for="item in list">{{handleGlobalI18n('configuration', item.role_name)}}</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { checkObjHasOwnProperty } from '@/utils'
  export default {
    data() {
      return {
        list: []
      }
    },
    watch: {
      '$store.getters.language': {
        handler() {
          // this.getList()
        }
      }
    },
    computed: {
      ...mapGetters([
        'role_data'
      ])
    },
    created() {
      if (this.checkObjHasOwnProperty(this.role_data, 'top-menu-config')) {
        // 查看配置的权限
        var top_menu_config = this.role_data['top-menu-config']
        if (this.checkObjHasOwnProperty(top_menu_config, 'configuration')) {
          if (this.checkObjHasOwnProperty(top_menu_config.configuration, 'store_list')) {
            this.list.push({
              role_id: 1,
              role_name: 'store_list'
            })
          }
          if (this.checkObjHasOwnProperty(top_menu_config.configuration, 'employee_list')) {
            this.list.push({
              role_id: 2,
              role_name: 'employee'
            })
          }
        }
      }
    },
    methods: {
      checkObjHasOwnProperty,
      handleSetRole(role) {
        if (+role === 1) {
          this.$router.push('/configuration/store/list/index')
        }
        if (+role === 2) {
          this.$router.push('/configuration/employee/list/index')
        }
      },
      handleClickItem(name) {
        console.log('name', name)
      }
    }
  }
</script>

<style scoped>
  .international-icon {
    font-size: 20px;
    cursor: pointer;
    vertical-align: -5px!important;
  }
</style>
