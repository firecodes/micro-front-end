<template>
  <div class="coupon-tile-index new-tile-list-css-gift">
    <top-search
      :menu_type_list="menu_type_list"
      :multiple_selection="multiple_selection"
      @handleSearch="handleSearch"
      @selectMultipleLinesDeleteCoupon="selectMultipleLinesDeleteCoupon"
    />
    <div class="tile-index">
      <div v-loading="listLoading">
        <el-checkbox-group v-model="multiple_selection">
          <ul>
            <router-link tag="li" class="add" :to="{ path: '/loyalty/coupon/add', query: { type: 'add' }}">
              <img src="../../../assets/images/coupon/add.png" />
            </router-link>
            <li class="page" v-for="(item, index) in table_data" :key="index">
              <div class="hover-div" @click="handleRouter(item.coupon_code, 'detail', item)">
                <img src="../../../assets/images/coupon/coupon-offline.png" v-if="item.channel_code === 'offline'" />
                <img src="../../../assets/images/coupon/coupon-online.png" v-else-if="item.channel_code === 'online'" />
                <img src="../../../assets/images/coupon/coupon-online-offline.png" v-else />
                <div class="content">
                  <div class="left">
                    <label class="gwp" v-if="item.coupon_type_code ==='sku'">SKU</label>
                    <label class="discount" v-else-if="item.coupon_type_code ==='discount'">
                      <span>{{parseInt(item.amount) < parseFloat(item.amount) ? ( item.amount* 100).toFixed(2) || 0 : (item.amount* 100) || 0}}%</span>
                      <span>OFF</span>
                    </label>
                    <label class="discount" v-else>
                      <span>${{item.amount || 0}}</span>
                      <span>OFF</span>
                    </label>
                  </div>
                  <div class="right">
                    <div class="padding-20">
                      <div class="coupon-channel-type">
                        <label>{{item.channel_name === 'All' ? 'Online + Offline' : item.channel_name}}</label>
                        <img src="../../../assets/images/coupon/offline-icon.png" v-if="item.channel_code === 'offline'" />
                        <img src="../../../assets/images/coupon/online-icon.png" v-else-if="item.channel_code === 'online'" />
                      </div>
                      <div class="coupon-name">
                        {{item.coupon_name}}
                      </div>
                      <div class="expiry-date">
                        <label>{{$t('loyalty.fc_coupon_tile_expiry_date_label')}}</label>
                        <template v-if="item.effective_type === 2">
                          {{item.specific_effective_date_from ? globalData.formatDate((item.specific_effective_date_from).substr(0, 10)) : table_placeholder}}{{handleGlobalI18n('system', 'to')}}{{item.specific_effective_date_to ? globalData.formatDate((item.specific_effective_date_to).substr(0, 10)) : table_placeholder}}
                        </template>
                        <template v-else>
                           {{$t('loyalty.fc_coupon_table_effective_to_relative_label').replace('{10}', item.relative_value)}}
                        </template>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="operation">
                  <div class="edit" @click.stop="handleRouter(item.coupon_code, 'edit', item)">
                    <svg-icon icon-class="tile-modify" />
                    <label>{{$t('loyalty.fc_tile_btn_edit_label')}}</label>
                  </div>
                  <div class="line" v-if="enable_coupon_tools === 'false'"></div>
                  <div @click.stop="handleRouter(item.coupon_code, 'copy', item)" class="copy" v-if="enable_coupon_tools === 'false'">
                    <svg-icon icon-class="copy1"></svg-icon>
                    <label>{{$t('loyalty.fc_tile_btn_copy_label')}}</label>
                  </div>
                </div>
              </div>
              <el-checkbox :label="item" class="checkbox"></el-checkbox>
            </li>
          </ul>
        </el-checkbox-group>
      </div>
      <pagination-container
        style="background-color: rgba(0,0,0,0)"
        :page = "listQuery.page_no"
        :page_size = 'listQuery.page_size'
        :total = 'total'
        layout="total, prev, pager, next, jumper"
        @handleCurrentChange = "handleCurrentChange"
        @handleSizeChange="handleSizeChange"
      ></pagination-container>
    </div>
  </div>
</template>
<script>
  import TopSearch from './search'
  import PaginationContainer from '@/components/PaginationContainerNew'
  import { queryCouponListBy } from '@/api/loyalty'
  import { DateTime } from 'luxon'
  import AdvancedSearch from './advanced-search'
  import { deleteCategoryMixin } from './mixins'
  import VClamp from 'vue-clamp'
  export default {
    mixins: [
      deleteCategoryMixin
    ],
    components: {
      VClamp,
      TopSearch,
      PaginationContainer,
      AdvancedSearch
    },
    data() {
      return {
        search_type: 1,
        advanced_search_obj: {},
        quick_obj: {},
        menu_type_list: false,
        fit: 'cover',
        multiple_selection: [],
        table_data: [],
        advanced_state: false,
        timeSubstring(value) {
          if (!value || value === null || value === undefined) return ''
          value = value.toString()
          return value.substring(0, 10)
        },
        radio: '',
        listLoading: true,
        tableData: [],
        type_id: 2,
        listQuery: {
          page_no: 1,
          page_size: 14,
          coupon_name: '',
          asc: false,
          status: 1,
          order_by: 'id'
        },
        total: 0,
        error_image: require('../../../assets/images/error-image .png'),
        enable_coupon_tools: sessionStorage.getItem('enable_coupon_tools')
      }
    },
    created() {
      this.getList()
      this.new_table_data = this.table_data
    },
    methods: {
      handleRouter(coupon_code, type, detail) {
        this.$router.push({
          path: `/loyalty/coupon/${type}`,
          query: {
            id: coupon_code,
            type: type
          }
        })
        sessionStorage.setItem('coupon_list_info_detail', JSON.stringify(detail))
      },
      checkEffective(effective_to) {
        const now_date = new Date().valueOf()
        const end_date = DateTime.fromISO(effective_to).toFormat('x')
        if (now_date >= end_date) {
          return false
        }
        return true
      },
      getList(obj = {}) {
        this.listLoading = true
        queryCouponListBy(Object.assign({}, this.listQuery, obj)).then(res => {
          const obj = res.return_result
          this.table_data = obj.coupons
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
        this.select_type = type
        if (type === 2) {
          this.advanced_search_obj = obj
        } else {
          this.quick_obj = obj
        }
        this.listQuery.page_no = 1
        this.getList(obj)
      },
      handleCurrentChange(val) {
        this.listQuery.page_no = val
        var obj = {}
        if (this.select_type === 2) {
          obj = this.advanced_search_obj
        } else if (this.select_type === 1) {
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
        handler(val) {
          this.getList()
        }
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .coupon-tile-index {
    margin: 50px;
  }
  .tile-index {
    width: 100%;
    margin-top: 40px;
    ul{
      .add{
        width: 410px;
        height: 129px;
        margin-top: 3px;
        margin-left: 6px;
        margin-right: 70px;
        cursor: pointer;
        border-radius:4px;
        border:2px dotted $new-primary;
        display: flex;
        align-items: center;
        justify-content: center;
        img{
          width: 40px;
          cursor: pointer;
        }
      }
      display: flex;
      flex-wrap: wrap;
      .page{
        // box-shadow: 0 3px 0px -3px rgba(0, 0, 0, 0.3);
        .hover-div{
          cursor: pointer;
          position: relative;
          &:hover{
            .operation{
              opacity: 1;
            }
          }
        }
        .content{
          position: absolute;
          top: 0;
          width: 101%;
          height: 100%;
          display: flex;
          .left{
            flex:0 0 24%;
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: Apple-Myungjo;
            color:rgba(255,255,255,1);
            font-size: 30px;
            margin-left: 7px;
            .gwp{
              line-height: 0;
              display: inline-table;
            }
            .discount, .cash{
              margin-top: -16%;
              line-height: 1.4;
              span{
                &:first-child{
                  display: block;
                  max-width: 103px;
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                  font-size: 27px;
                }
                flex: 1;
              }
            }
          }
          .right{
            font-size: 18px;
            width: 76%;
            color: rgba(255,255,255,1);
            height: 100%;
            display: flex;
            align-items: center;
            margin-right: 7px;
            .padding-20{
              width: 80%;
              margin: 10px 10% 0 10%;
            }
            .coupon-channel-type{
              font-weight: 700;
              line-height: 25px;
              display: flex;
              align-items: center;
              img{
                margin-left: 7px;
                width: 16px;
                height: 14px;
              }
            }
            .coupon-name{
              white-space:nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              margin: 8px 0;
              line-height:25px;
            }
            .expiry-date{
              font-size: 14px;
              color:rgba(255,255,255,1);
              line-height: 20px;
            }
            position: relative;
          }

        }
      }
      .checkbox{
        position: absolute;
        top: 12.5%;
        right: 7%;
      }
      li{
        width: 420px;
        height: 143px;
        margin-right: 65px;
        margin-bottom: 19px;
        position: relative;
        img{
          width: 100%;
        }
        .operation{
          position: absolute;
        }
      }
      .operation{
        opacity: 0;
        height: 30px;
        width: auto;
        z-index: 99;
        background:rgba(1,33,87,0.7);;
        margin-top: -41px;
        color: #ffffff;
        display: flex;
        position: absolute;
        left: 7px;
        right: 5px;
        align-items: center;
        justify-content: space-evenly;
        cursor: pointer;
        i, .svg-icon{
          font-size: 18px;
          margin-right: 9px;
        }
        label{
          cursor: pointer;
          font-size:14px;
          width:55px;
          height:20px;
          font-weight:600;
          font-family: HelveticaNeue1;
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
        width: 100%;
        p{
          color:rgba(51,51,51,1);
          line-height:25px;
          margin-top: 16px;
          font-size:18px;
          font-weight:700;
        }
        label{
          display: block;
          font-size:14px;
          font-weight:400;
          color:rgba(51,51,51,1);
          line-height:20px;
          margin-top: 3px;
        }
        div{
          margin-top: 4px;
          font-size:16px;
          font-weight:600;
          color:rgba(51,51,51,1);
          line-height:22px;
        }
      }
    }
  }
  /*@media (max-width: 1680px) {*/
    /*.left{*/
      /*font-size: 24px!important;*/
      /*.discount, .cash{*/
        /*span{*/
          /*&:first-child{*/
            /*font-size: 25px!important;*/
          /*}*/
        /*}*/
      /*}*/
    /*}*/
    /*.padding-20{*/
      /*margin: 10px  10% 0 10%!important;*/
      /*font-size: 16px!important;*/
      /*.expiry-date{*/
        /*font-size: 12px!important;*/
      /*}*/
      /*.coupon-name{*/
        /*margin: 1px 0!important;*/
      /*}*/
    /*}*/
  /*}*/
</style>
<style rel="stylesheet/scss" lang="scss">
  @import '../new-theme-css';
</style>
