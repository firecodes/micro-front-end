<template>
  <div class="top-search">
    <div class="search">
      <el-input :placeholder="$t('loyalty.fc_gift_search_input_empty_tips')" @keyup.enter.native="handleSearch" maxlength="32" type="text" v-model= "gift_name" />
      <el-button type="primary" icon="el-icon-search" class="search" @click="handleSearch">{{$t('loyalty.fc_gift_btn_search_label')}}</el-button>
      <el-button type="primary" icon="el-icon-search" class="advanced_search" @click="advanced_state = !advanced_state">{{$t('loyalty.fc_gift_btn_advanced_search_label')}}</el-button>
      <el-button type="primary" icon="el-icon-circle-plus-outline" @click="toAddGift" v-show="menu_type_list" class="add_gift">{{$t('loyalty.fc_gift_btn_add_label')}}</el-button>
      <el-button icon="el-icon-delete" @click="selectMultipleLinesDeleteGift(multiple_selection)" :disabled="multiple_selection.length <= 0" class="delete">{{$t('loyalty.fc_gift_btn_delete_label')}}</el-button>
      <div class="icon-menu">
        <router-link to="/loyalty/gift/tile">
          <svg-icon icon-class="tile_card_list" v-show="menu_type_list" />
        </router-link>
        <router-link to="/loyalty/gift">
          <img alt="" class="tile" src="../../../assets/images/coupon/tile.png" v-show="!menu_type_list" />
        </router-link>
      </div>
    </div>
    <el-collapse-transition>
      <advanced-search
        :category_list="category_list"
        :category_list_status="category_list_status"
        v-show="advanced_state"
        @advanced_search="advanced_search"
      />
    </el-collapse-transition>
  </div>
</template>
<script>
  import { queryGiftCategory } from '@/api/loyalty'
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
    watch: {
    },
    components: {
      AdvancedSearch
    },
    data() {
      return {
        gift_name: '',
        advanced_state: false,
        category_list: [],
        category_list_status: true
      }
    },
    created() {
      this.getCategoryList()
    },
    methods: {
      toAddGift() {
        this.$router.push({
          path: `/loyalty/gift/add`,
          query: {
            type: 'add'
          }
        })
      },
      getCategoryList() {
        this.category_list_status = true
        queryGiftCategory({ page_no: 1, page_size: 100000, asc: false }).then(res => {
          this.category_list = res.return_result.results
          this.category_list_status = false
        }).catch(() => {
          this.category_list_status = false
        })
      },
      advanced_search(obj) {
        this.$emit('handleSearch', obj, 2)
      },
      handleSearch() {
        this.$emit('handleSearch', { gift_name: this.gift_name.trim() }, 1)
      },
      selectMultipleLinesDeleteGift() {
        this.$emit('selectMultipleLinesDeleteGift', this.multiple_selection)
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .search{
    .el-input{
      width: 31%;
      height: 36px;
    }
    .tile{
      width: 30px;
      height: 24px;
    }
    .advanced_search, .search, .add_gift{
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
    }
    .search, .add_gift, .delete{
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
