<template>
   <ul class="list">
     <li class="list-li" v-for="(item,index) in list" :key="index">
       <!-- handleGlobalI18n('member',  -->
       <p class="header">{{item.segmentation_type_name}}</p>
       <ul class="detail">
         <li v-for="(item1, index1) in item.segmentation_values" :key="index1">{{item1.segmentation_value_name}}</li>
       </ul>
     </li>
   </ul>
</template>
<script>
  import { getMemberSegmentationList } from '@/api/member'
  export default {
    props: {
      member_code: {
        type: String
      }
    },
    data() {
      return {
        list: []
      }
    },
    created() {
      this.getMemberSegmentationList()
    },
    methods: {
      getMemberSegmentationList() {
        getMemberSegmentationList(this.member_code).then((res) => {
          this.list = res.return_result.member_segmentations || []
        })
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .list{
    padding: 0 10% 10% 20px;
    .list-li{
      margin-top:50px;
    }
    .header{
      padding: 6px;
      background: linear-gradient(to bottom, #F0B74E, #F37030);
      border-radius: 3px;
      display: inline;
      color: #ffffff;
      font-weight: bold;
      font-size:15px;
    }
    .detail{
      margin-top:20px;
      border-top:1px solid rgba(176, 192, 214, 0.4);
      padding-top:5px;
      display: flex;
      flex-wrap: wrap;
      li{
        margin-right:10px;
        padding:4px;
        background-color: rgba(213, 222, 232, 0.47);
        border-radius: 3px;
        margin-top:10px
      }
    }
  }
</style>
