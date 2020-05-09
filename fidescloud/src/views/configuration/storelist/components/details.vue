<template>
  <div class="r-store-detail-wrapper">
    <el-container class="container"> 
      <!--aside-->
      <el-aside class="details-aside">
        <div class="store-info">
          <div class="store-img"><img class="img" :src="default_avatar" alt=""></div>
          <p class="store-name text-center">
            <ed-clamp :max-lines="1" autoresize>{{details.store_name}}</ed-clamp>
          </p>
        </div>
        <ul class="store-infos">
          <!-- <li><label>Code:</label><span>{{details.code}}</span></li> -->
          <li><label>{{ handleGlobalI18n('store', 'mgt_store_details_phone_label') }}</label>
            <!-- <span>{{details.telephone}}</span> -->
            <ed-clamp :max-lines="1" autoresize>{{details.telephone}}</ed-clamp>
          </li>
          <li><label>{{ handleGlobalI18n('store', 'mgt_store_details_city_label') }}</label>
            <!-- <span>{{details.city_name}}</span> -->
            <ed-clamp :max-lines="1" autoresize>{{details.city_name}}</ed-clamp>
          </li>
          <li><label>{{ handleGlobalI18n('store', 'mgt_store_details_state_label') }}</label>
            <!-- <span>{{details.state_name}}</span> -->
            <ed-clamp :max-lines="1" autoresize>{{details.state_name}}</ed-clamp>
          </li>
          <li><label>{{ handleGlobalI18n('store', 'mgt_store_details_zip_label') }}</label>
            <!-- <span>{{details.zip_code}}</span> -->
            <ed-clamp :max-lines="1" autoresize>{{details.zip_code}}</ed-clamp>
          </li>
          <li><label>{{ handleGlobalI18n('store', 'mgt_store_details_address_label') }}</label>
            <!-- <span>{{details.address}}</span> -->
            <ed-clamp :max-lines="1" autoresize>{{details.address}}</ed-clamp>
          </li>
          <!-- <li><label>{{ handleGlobalI18n('store', 'mgt_store_details_group_label') }}</label><span>{{details.store_group_name}}</span></li> -->
          <!-- <li><label>{{ handleGlobalI18n('store', 'mgt_store_add_manager_label') }}</label><router-link v-if="details.manager" class="link" tag="span" :to="'/employee/list/details/' + details.manager + '/index'">{{details.manager_name}}</router-link></li> -->
        </ul>
      </el-aside>
      <!-- main -->
      <el-main class="details-main">
        <div class="store-box">
          <div class="pd-b">
            <h3 class="h3"><span>{{ handleGlobalI18n('store', 'mgt_store_details_empl_list_label') }}</span></h3>
            <div class="table-box">
              <el-table
                :data="list"
                border
                v-loading = "loading"
                style="width: 100%"
                >
                <el-table-column type="index" :index="(index) => (this.listQuery.page_no - 1) * this.listQuery.page_size + index + 1" label="#" align="center" width="80"></el-table-column>
                <el-table-column prop="name" :label="handleGlobalI18n('store', 'mgt_store_details_empl_table_name_label')" align="center"></el-table-column>
                <el-table-column prop="gender" :label="handleGlobalI18n('store', 'mgt_store_details_empl_table_gender_label')" align="center">
                  <template slot-scope="scope">
                    <span style="text-transform: capitalize;">{{ handleGlobalI18n('system', gendersValue[scope.row.gender]) || '-' }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="position" :label="handleGlobalI18n('store', 'mgt_store_details_empl_table_pos_label')" align="center"></el-table-column>
                <el-table-column prop="mobile" :label="handleGlobalI18n('store', 'mgt_store_details_empl_table_mobile_label')" align="center"></el-table-column>
                <!-- <el-table-column prop="account_name" label="Username" align="center"></el-table-column> -->
                <!-- <el-table-column :label="handleGlobalI18n('store', 'mgt_store_details_empl_table_opera_label')" align="center">
                  <template slot-scope="scope">
                    <div class="handle-btns">
                      <router-link :to="'/employee/store/list/details/' + $route.params.id + '/employeeDetails/' + scope.row.id">{{ handleGlobalI18n('store', 'mgt_operation_btn_details_label') }}</router-link>
                      <router-link :to="'/employee/list/details/' + scope.row.id + '/index'">{{ handleGlobalI18n('store', 'mgt_operation_btn_details_label') }}</router-link>
                    </div>
                  </template>
                </el-table-column> -->
              </el-table>
              <div class="pagination"  v-if="!loading && list != ''">
                <el-pagination
                  background
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="listQuery.page_no"
                  :page-sizes="[10,20,30,40,50]"
                  :page-size="listQuery.page_size"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="total">
                </el-pagination>
              </div>  
            </div>
              
          </div>
        </div>

      </el-main>
    </el-container>
  </div>
</template>

<script>
import { storeDetail } from '@/api/store'
import { Message } from 'element-ui'
export default {
  name: 'store-details',
  data() {
    return {
      gendersValue: ['unknown', 'male', 'female'],
      default_avatar: require('../../../../assets/images/store-avatar.png'),
      details: {},
      listQuery: {
        asc: false,
        page_no: 1,
        page_size: 10,
        id: this.$route.params.id
      },
      total: null,
      loading: true,
      list: []
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      if (!this.$route.params.hasOwnProperty('id')) return false
      storeDetail({
        id: this.$route.params.id,
        language: this.$store.getters.language
      }).then(res => {
        if (res.return_result) {
          this.details = { ...res.return_result }
          this.list = res.return_result.employees
          this.loading = false
          this.default_avatar = this.details.picture || require('../../../../assets/images/store-avatar.png')
        } else {
          this.loading = false
          Message({
            message: res.msg,
            type: 'error'
          })
        }
      }).catch(err => {
        this.loading = false
        Message({
          message: err,
          type: 'error'
        })
      })
    },
    getList() {
    },
    handleSizeChange(val) {
      this.listQuery.page_size = val
      this.listQuery.page_no = 1
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page_no = val
      this.getList()
    }
  },
  watch: {
    '$store.getters.language': {
      async handler(val) {
        this.fetchData(true)
      }
    },
    '$route': {
      handler(val) {
        if (val.path && val.path.indexOf('/employee/store/storeGroup/details') === 0) { // 此时需要获取店铺组的数组，在这里不需要调
          return
        }
        if (val.path && val.path.indexOf('/employee/store/list/details') !== -1 && val.path.indexOf('/employeeDetails') !== -1) {
          return
        }
        if (val.path && val.path.indexOf('/employee/list/details/') !== -1) {
          return
        }
        this.fetchData()
      }
    }
  }
}
</script>
<style lang='scss' scoped>
.r-store-detail-wrapper {
  .container {
    margin: 15px 20px;
  }
  .store-info {
    background-color: #ffffff;
    overflow: hidden;
    position: relative;
    padding: 20px;
  }
  .store-img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    position: relative;
    margin: 0 auto 20px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .store-infos {
    background-color: #F3F6FB;
    padding: 10px;
    font-size: 16px;
  }
  .store-infos li {
    padding: 10px 0;
    border-bottom: 1px solid #CECFD1;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
  }
  .store-infos li label {
    font-weight: bold;
    color: #333;
    display: block;
    margin-right: 5px;
  }
  .store-infos li div {
    word-break: break-all !important;
  }
  .h3 {
    height: 50px;
    background-color: #ffffff;
    position: relative;
    color: #409EFF;
    span {
      position: relative;
      top: 18px;
      left: 13px;
    }
  }
  .h3::before {
    content: '';
    position: absolute;
    height: 16px;
    width: 3px;
    top: 17px;
    left: 0;
    background: #409EFF;
  }
  .details-main {
    padding: 0px 0 20px;
    margin: 0 0 0 20px;
    overflow: hidden;
  }
  .pd-b {
    background-color: #fff;
    padding-bottom: 20px;
  }
  .table-box {
    padding: 0 20px;
  }
}
</style>

