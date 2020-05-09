<template>
  <div class="top-search">
    <div class="search">
      <el-input type="text" v-model= "coupon_name" maxlength="32" :placeholder="$t('loyalty.fc_coupon_search_input_empty_tips')" @keyup.enter.native="handleSearch"></el-input>
      <el-button type="primary" icon="el-icon-search" class="search" @click="handleSearch">{{$t('loyalty.fc_coupon_btn_search_label')}}</el-button>
      <el-button type="primary" icon="el-icon-search" class="advanced_search" @click="advanced_state = !advanced_state">{{$t('loyalty.fc_coupon_btn_advanced_search_label')}}</el-button>
      <el-button type="primary" icon="el-icon-circle-plus-outline" @click="toAddCoupon" v-show="menu_type_list" class="add_coupon">{{$t('loyalty.fc_coupon_btn_add_label')}}</el-button>
      <el-button icon="el-icon-delete" @click="selectMultipleLinesDeleteCoupon(multiple_selection)" :disabled="multiple_selection.length <= 0" class="delete">{{$t('loyalty.fc_coupon_btn_delete_label')}}</el-button>
      <div class="icon-menu">
        <router-link to="/loyalty/coupon/tile"><svg-icon icon-class="tile_card_list" v-show="menu_type_list" ></svg-icon></router-link>
        <router-link to="/loyalty/coupon"><img src="../../../assets/images/coupon/tile.png" class="tile" v-show="!menu_type_list" /></router-link>
      </div>
    </div>
    <el-collapse-transition>
      <advanced-search
        v-show="advanced_state"
        @advanced_search="advanced_search"
      />
    </el-collapse-transition>
  </div>
</template>
<script>
  import AdvancedSearch from './advanced-search'
  export default {
    props: {
      multiple_selection: {
        type: Array,
        default: []
      },
      menu_type_list: {
        type: Boolean,
        default: true
      }
    },
    components: {
      AdvancedSearch
    },
    data() {
      return {
        coupon_name: '',
        advanced_state: false
      }
    },
    methods: {
      toAddCoupon() {
        this.$router.push({
          path: `/loyalty/coupon/add`,
          query: {
            type: 'add'
          }
        })
      },
      advanced_search(obj) {
        this.$emit('handleSearch', obj, 2)
      },
      handleSearch() {
        this.$emit('handleSearch', { coupon_name: this.coupon_name ? this.coupon_name.trim() : '' }, 1)
      },
      selectMultipleLinesDeleteCoupon(val) {
        this.$emit('selectMultipleLinesDeleteCoupon', this.multiple_selection)
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .search{
    .el-input{
      width: 600px;
      height: 36px;
    }
    .tile{
      width: 30px;
      height: 24px;
    }
    .advanced_search, .search, .add_coupon{
      background-color: $new-primary;
      border-color: $new-primary;
    }
    .advanced_search {
      min-width: 180px;
    }
    .el-button{
      margin-left: 8px;
    }
    .delete{
      border-color: $new-primary;
      color: $new-primary;
      background: none;
    }
    .search, .add_coupon, .delete{
      min-width:108px;
      border-radius:4px;
    }
    position: relative;
    .icon-menu{
      cursor: pointer;
      position: absolute;
      right: 0;
      display: flex;
      align-items: center;
      top: 0;
      bottom:0;
      margin: auto;
      .svg-icon{
        font-size: 30px;
        color: $new-primary
      }
    }
  }
</style>
