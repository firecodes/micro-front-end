<template>
  <div class="gift-tile-index new-tile-list-css-gift">
    <top-search :menu_type_list="menu_type_list" :multiple_selection="multiple_selection" @handleSearch="handleSearch" @selectMultipleLinesDeleteGift="selectMultipleLinesDeleteGift" class="new-theme-css" />
    <div class="tile-index">
      <div v-loading="listLoading">
        <el-checkbox-group v-model="multiple_selection">
          <ul>
            <router-link tag="li" class="add" :to="{ path: '/loyalty/gift/add', query: { type: 'add' }}">
              <svg-icon icon-class="add1" />
            </router-link>
            <li class="page" v-for="item in table_data" >
              <div class="top">
                <el-image class="image" :lazy="true" :fit="fit" :src="item.image_url" @click.native="handleRouter(item.gift_code, 'detail', item)">
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline" style="color: #999999;font-size: 48px;line-height: 180px;display: flex;justify-content: center; background: #6666;" />
                  </div>
                </el-image>
                <div class="operation">
                  <div class="edit" @click.stop="handleRouter(item.gift_code, 'edit', item)">
                    <svg-icon icon-class="tile-modify" />
                    <label>{{$t('loyalty.fc_tile_btn_edit_label')}}</label>
                  </div>
                  <div class="line"></div>
                  <div class="copy" @click.stop="handleRouter(item.gift_code, 'copy', item)">
                    <svg-icon icon-class="copy1" />
                    <label>{{$t('loyalty.fc_tile_btn_copy_label')}}</label>
                  </div>
                </div>
                <el-checkbox :label="item" />
              </div>
              <div class="bottom">
                <p><ed-clamp :max-lines="1" autoresize>{{item.gift_name}}</ed-clamp></p>
                <label><ed-clamp :max-lines="1" autoresize>{{item.gift_category_name}}</ed-clamp></label>
                <div><ed-clamp :max-lines="1" autoresize>{{!item.is_limited_inventory ? $t('loyalty.fc_add_gift_stock_option_label') : item.available_inventory}}</ed-clamp></div>
                <!--11-->
              </div>
            </li>
          </ul>
        </el-checkbox-group>
      </div>
      <pagination-container :page = "listQuery.page_no" :page_size = 'listQuery.page_size' :total = 'total' @handleCurrentChange = "handleCurrentChange" @handleSizeChange="handleSizeChange" layout="total, prev, pager, next, jumper" style="background-color: rgba(0,0,0,0);" />
    </div>
  </div>
</template>
<script>
  import TopSearch from './search'
  import PaginationContainer from '@/components/PaginationContainerNew'
  import { searchGift } from '@/api/loyalty'
  import { DateTime } from 'luxon'
  import AdvancedSearch from './advanced-search'
  import { deleteCategoryMixin } from './mixins'
  export default {
    mixins: [
      deleteCategoryMixin
    ],
    components: {
      TopSearch,
      PaginationContainer,
      AdvancedSearch
    },
    data() {
      return {
        advanced_search_obj: {},
        quick_obj: {},
        search_type: 1,
        menu_type_list: false,
        fit: 'cover',
        multiple_selection: [],
        table_data: [],
        advanced_state: false,
        timeSubstring(value) {
          if (!value) return ''
          value = value.toString()
          return value.substring(0, 10)
        },
        radio: '',
        listLoading: true,
        tableData: [],
        type_id: 2,
        listQuery: {
          page_size: 11,
          page_no: 1,
          asc: false,
          status: 1,
          order_by: 'id'
        },
        total: 0,
        error_image: require('../../../assets/images/error-image .png')
      }
    },
    created() {
      this.getList()
      this.new_table_data = this.table_data
    },
    methods: {
      handleRouter(gift_code, type, detail) {
        this.$router.push({
          path: `/loyalty/gift/${type}`,
          query: {
            id: gift_code,
            type: type
          }
        })
        sessionStorage.setItem('gift_list_info_detail', JSON.stringify(detail))
      },
      checkEffective(effective_to) {
        const now_date = new Date().valueOf()
        const end_date = DateTime.fromISO(effective_to).toFormat('x')
        return now_date < end_date
      },
      getList(obj = {}) {
        this.listLoading = true
        searchGift(Object.assign({}, this.listQuery, obj)).then(res => {
          const obj = res.return_result
          this.table_data = obj.gifts || []
          this.total = obj.total_count
          this.listLoading = false
        }).catch(() => {
          this.listLoading = false
        })
      },
      selectType(id) {
        this.type_id = id
      },
      addRedemption(id, index = 0) {
        let path
        if (id === '1') {
          path = `/loyalty/catalogue/add-event/${id}`
        } else if (id === '2') {
          path = `/loyalty/catalogue/edit-event/${id}/${index}`
        } else {
          path = `/loyalty/catalogue/view-event/${id}/${index}`
        }
        this.$router.push({
          path: path
        })
      },
      handleSearch(obj = {}, type) {
        this.search_type = type
        this.listQuery.page_no = 1
        if (type === 2) {
          this.advanced_search_obj = obj
        } else {
          this.quick_obj = obj
        }
        this.getList(obj)
      },
      handleCurrentChange(val) {
        this.listQuery.page_no = val
        let obj = {}
        if (this.search_type === 2) {
          obj = this.advanced_search_obj
        } else {
          obj = this.quick_obj
        }
        this.getList(obj)
      },
      handleSizeChange(val) {
        this.listQuery.page_size = val
        this.getList()
      }
    },
    watch: {
      '$route': {
        handler() {
          this.getList()
        }
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .gift-tile-index {
    margin: 50px;
  }
  .tile-index {
    width: 100%;
    margin-top: 40px;
    ul{
      .add{
        cursor: pointer;
        border-radius:4px;
        border:1px dashed $new-primary;
        display: flex;
        align-items: center;
        justify-content: center;
        .svg-icon{
          cursor: pointer;
          font-size: 40px;
          color: $new-primary;
        }
      }
      display: flex;
      flex-wrap: wrap;
      .page{
        background:rgba(255,255,255,1);
        box-shadow:0 5px 15px -3px rgba(204,204,204,1);
      }
      .top{
        cursor: pointer;
        position: relative;
        .el-checkbox{
          position: absolute;
          right: 10px;
          top: 10px;
        }
        &:hover{
          .operation{
            opacity: 1;
          }
        }
      }
      li{
        width:21%;
        height:280px;
        margin-right: 4%;
        margin-bottom: 29px;
        .image{
          height: 180px;
          width: 100%;
        }

      }
      .operation{
        opacity: 0;
        height: 30px;
        width: 100%;
        z-index: 99;
        background:rgba(1,33,87,0.7);;
        margin-top: -30px;
        color: #ffffff;
        display: flex;
        position: absolute;
        align-items: center;
        justify-content: space-evenly;
        cursor: pointer;
        i, .svg-icon{
          font-size: 17px;
          margin-right: 9px;
        }
        label{
          cursor: pointer;
          font-size:14px;
          width:55px;
          height:20px;
          font-weight:600;
          font-family: HelveticaNeue1, sans-serif;
          color:rgba(255,255,255,1);
          letter-spacing: .5px;
        }
        .line{
          width:2px;
          height:20px;
          background:rgba(255,255,255,1);
        }
      }
      .bottom{
        text-align: center;
        padding: 0 12px;
        p{
          color:rgba(51,51,51,1);
          line-height:25px;
          margin-top: 16px;
          font-size:18px;
          font-weight: 600;
          font-family: HelveticaNeue1, sans-serif;
        }
        label{
          font-family: Helvetica-medium-1, sans-serif;
          display: block;
          font-size:14px;
          font-weight:400;
          color:rgba(51,51,51,1);
          line-height:20px;
          margin-top: 3px;
        }
        div{
          font-family: HelveticaNeue1, sans-serif;
          margin-top: 4px;
          font-size:16px;
          font-weight:600;
          color:rgba(51,51,51,1);
          line-height:22px;
        }
      }
    }
  }
</style>
<style rel="stylesheet/scss" lang="scss">
  @import '../new-theme-css';
</style>
