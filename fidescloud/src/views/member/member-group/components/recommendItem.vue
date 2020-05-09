<template>
  <div class="recommendedItemComponent">
    <search @clickSearch="clickSearch"></search>
    <div class="main-area" v-loading="loading">
      <div class="recommend-box" v-for="(item, index) in recommendList" :key="index">
        <div class="top-tier">
          <div class="person-nums">
            <div class="img-box">
              <img :src="require('@/assets/images/canyurenshu.png')" alt="">
            </div>
            <span>{{ item.member_num }}</span>
          </div>
          <span class="date-time">{{$t('member.fc_member_group_recommended_last_update_label')}} {{ item.modify_date | formatTimeStamp }}</span>
        </div>
        <div class="center-tier">
          <p>{{ item.group_name }}</p>
          <button :key="idx" class="type-btn" v-for="(key, idx) in item.tag_names">{{ key }}</button>
        </div>
        <div class="bottom-tier">
          <button @click="handleClickAdd(item.group_id)">{{$t('member.fc_member_group_recommended_btn_add_to_label')}}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Search from './search'
import { queryMemberGroupList, addRecommendMemberGroup } from '@/api/memberGroup'
import { mapActions } from 'vuex'
export default {
  components: {
    Search
  },
  data() {
    return {
      listQuery: {
        asc: true,
        group_or_tag_name: '',
        group_type: 0,
        page_no: 1,
        page_size: 15
      },
      loading: true,
      recommendList: []
    }
  },
  created() {
    this.init()
  },
  methods: {
    ...mapActions(['setAddRecommand']),
    init() {
      this.getRecommGroupList()
    },
    handleClickAdd(id) {
      addRecommendMemberGroup(id).then(res => {
        if (res.return_result) {
          this.$message.success('Add success')
          this.setAddRecommand(id)
          this.init()
        } else {
          this.$message.error(res.msg)
        }
      }).catch(err => {
        this.$message.error(err)
      })
    },
    getRecommGroupList() {
      this.loading = true
      return queryMemberGroupList({
        ...this.listQuery
      }).then(res => {
        this.loading = false
        if (res.return_result) {
          this.recommendList = res.return_result.results
          this.total = res.return_result.total_count
        } else {
          this.$message.error(res.msg)
        }
      }).catch(err => {
        this.loading = false
        this.$message.error(err)
      })
    },
    clickSearch(val) {
      this.listQuery.group_or_tag_name = val
      this.getRecommGroupList()
    }
  }
}
</script>

<style lang="scss" scoped>
.recommendedItemComponent {
  .main-area {
    margin-top: 40px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .recommend-box {
      margin-bottom: 20px;
    }
  }
  .recommend-box {
    width: 500px;
    height: 253px;
    box-sizing: border-box;
    box-shadow: 0 5px 15px -3px #ccc;
    padding: 30px 20px 0 20px;
    position: relative;
    z-index: 9999;
    background-color: #fff;
    .top-tier {
      display: flex;
      justify-content: space-between;
      .person-nums {
        display: flex;
        align-items: center;
        .img-box {
          img {
            width: 30px;
            height: 30px;
          }
        }
        span {
          font-size: 20px;
          color: #2777FF;
          margin-left: 8px;
        }
      }
      .date-time {
        color: #666;
        font-size: 14px;
      }
    }
    .center-tier {
      > p {
        color: #333;
        font-weight: 550;
        margin: 21px 0 17px 0;
      }
      .type-btn {
        min-width: 80px;
        height: 30px;
        border-radius: 15px;
        border: 1px solid #2777FF;
        font-size: 14px;
        color: #2777FF;
        background-color: rgba(74, 144, 226, 0.07);
        margin-bottom: 8px;
        margin-right: 8px;
      }
    }
    .bottom-tier {
      width: 100%;
      height: 60px;
      position: absolute;
      bottom: 0;
      left: 0;
      background-color: rgba(236, 244, 255, 1.0);
      display: flex;
      align-items: center;
      button {
        padding: 11px 7px;
        box-shadow: 0 6px 10px -2px #80AFFF;
        background-color: rgba(39, 119, 255, 1.0);
        cursor: pointer;
        border: none;
        color: #fff;
        font-size: 14px;
        border-radius: 4px;
        position: absolute;
        right: 20px;
      }
    }
  }
}
</style>
