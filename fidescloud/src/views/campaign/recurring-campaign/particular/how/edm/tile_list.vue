<template>
  <div class="recurring_campaign_how_tile_list" ref="TileListComponent">
    <div class="left">
      <div class="img ipad">
        <img :src="require('@/assets/images/iPad.png')" alt="preview">
        <div class="content">
          <el-scrollbar style="height:100%; width: 100%">
            <p class="center">
              <label>To:</label>
              <span>Target Group</span>
            </p>
            <p class="center subject">
              <label>Subject:</label>
              <span><ed-clamp :max-lines="1" autoresize style="text-align: left; word-wrap:break-word;word-break:break-all;">{{check_arr.length ? check_arr[0].subject : table_placeholder}}</ed-clamp></span>
            </p>
            <div class="line"></div>
            <p v-html="check_arr.length ? check_arr[0].content : table_placeholder"></p>
          </el-scrollbar>
        </div>
      </div>
    </div>
    <div class="right" v-loading="edm_loading">
      <ul style=" height: 340px;">
        <li @click="handleAdd"  class="add">
          <svg-icon icon-class="add1"></svg-icon>
        </li>
        <li :class="{'item_check': check_arr[0] === item }" :key="index" @click="handleClick(item)"  v-for="(item, index) in list_data">
          <p><ed-clamp :max-lines="3" autoresize style="text-align: left; word-wrap:break-word;word-break:break-all;" >{{item.content}}</ed-clamp></p>
          <div class="bottom-button">
            <div @click.stop="editTileTemplate(item)" class="edit">
              <svg-icon icon-class="how_modify"></svg-icon>
              <!--Edit-->
              <p>{{$t('campaign.fc_campaign_spot_create_how_edm_btn_edit_label')}}</p>
            </div>
            <div class="line"></div>
            <div @click.stop="handleDelete(item.id)" class="delete">
              <svg-icon icon-class="spot-campaign-how-delete"></svg-icon>
              <!--Delete-->
              <p>{{$t('campaign.fc_campaign_spot_create_how_edm_btn_delete_label')}}</p>
            </div>
          </div>
        </li>
      </ul>
      <pagination-container
        :page = "list_query.page_no"
        :page_size = 'list_query.page_size'
        :total = 'total'
        @handleCurrentChange = "handleCurrentChange"
      ></pagination-container>
    </div>
  </div>
</template>
<script>
  import PaginationContainer from '@/components/PaginationContainerNew'
  import { handleCommunicationTemplateListMixin } from '@/views/data/communication-template'
  import { operationMixin } from '../operation'

  export default {
    mixins: [handleCommunicationTemplateListMixin, operationMixin],
    components: {
      PaginationContainer
    },
    props: {
      form_data: {
        type: Object
      },
      channel_type_id: {
        type: Number
      },
      channel_value: {
        type: String,
        default: ''
      },
      refresh_template: {
        type: Boolean,
        default: false
      },
      select_obj: {
        type: Object
      }
    },
    watch: {
      refresh_template() {
        this.handleCurrentChange(1)
      },
      check_arr: {
        handler() {
          this.$emit('handleCheckBox', this.check_arr[0] || {})
        },
        deep: true
      }
    },
    data() {
      return {
        check_arr: [],
        edm_loading: true,
        list_data: [],
        list_query: {
          page_no: 1,
          page_size: 5
        },
        total: 0
      }
    },
    created() {
      this.getList()
    },
    methods: {
      init() {
        if (Object.keys(this.select_obj).length > 0 && this.list_data.length) {
          for (var item of this.list_data) {
            if (item.id === this.select_obj.id) {
              this.$set(this.check_arr, 0, item)
              break
            }
          }
        }
      },
      editTileTemplate(row) {
        this.$emit('handleEditTemplate', row, 'EDM')
      },
      handleAdd() {
        this.$emit('handleAdd', 'EDM')
      },
      getList() {
        this.edm_loading = true
        this.handleGetCommunicationTemplateList(this.channel_value, this.list_query.page_no, this.list_query.page_size).then(res => {
          this.list_data = res.list
          this.total = res.count
          this.init()
          this.edm_loading = false
        }).catch(res => {
          this.edm_loading = false
        })
      },
      handleDelete(id) {
        var obj = {
          communication_template_id: id,
          communication_channel_type: this.channel_value,
          campaign_type_id: this.form_data.campaign_type_code,
          communication_channel_type_id: this.channel_type_id
        }
        this.handleDeleteTemplate(obj).then(res => {
          this.handleCurrentChange(1)
        }).catch(res => {
        })
      },
      handleClick(arr) {
        if (this.check_arr.length === 0) {
          this.check_arr.push(arr)
        } else {
          if (arr.id !== this.check_arr[0].id) {
            this.$set(this.check_arr, 0, arr)
          } else {
            this.check_arr = []
          }
        }
      },
      handleCurrentChange(val) {
        this.list_query.page_no = val
        this.getList()
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  .recurring_campaign_how_tile_list {
    display: flex;
    .subject{
      margin-top: 4px;
    }
    .left{
      position: relative;
      text-align: center;
      .icon{
        position: absolute;
        bottom: 3%;
        right: 5%;
        font-size: 24px;
        color: #101010;
      }
      width: 345px;
      background: #fff;
      .ipad{
        width: 262px;
        .content{
          overflow-y: hidden;
          height: 250px;
          width: 82%;
          top: 15px;
          position: absolute;
          bottom:0;
          margin: 62px 24px;
          padding: 2%;
          background: #ffffff;
          label{
            color: #000;
            font-size: 14px;
            font-weight: bold;
          }
          img{
            width: 100%;
          }
          /deep/ img{
            max-width: 100%;
          }
          p{
            line-height: 1.3;
            color: rgba(16, 16, 16, 1);
            font-size: 14px;
            text-align: left;
          }
          .center{
            text-align: left;
            margin: 0 10px;
            display: flex;
            label{
              display: block;
              width: 35%;
            }
          }
          .line{
            margin: 8px 0;
            width: 100%;
            border-top: 1px solid rgba(187, 187, 187, 1);
          }
        }
      }
      .img{
        margin: 30px auto 40px auto;
        position: relative;
        img{
          width: 100%;
        }
      }
    }
    .right {
      flex: 1;
      min-width: 660px;
      padding: 30px 34px 0 59px;
      ul{
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;

        li{
          height:140px;
          background:rgba(255,255,255,1);
          box-shadow:0 5px 15px -3px rgba(204,204,204,1);
          border-radius: 5px;
          overflow: hidden;
          cursor: pointer;
          display: flex;
          color: #333333;
          width: 30%;
          min-width: 180px;
          p{
            padding: 20px;
            line-height: 24px;
            color: rgba(16, 16, 16, 1);
            font-size: 14px;
            /deep/ img{
              width: 100%;
            }
          }
          position: relative;
          .bottom-button{
            position: absolute;
            bottom: 0;
            height: 30px;
            width: 100%;
            display: flex;
            justify-content: space-evenly;
            background: #CCCCCC;
          }
          .line{
            width:2px;
            background:rgba(255,255,255,1);
            height: 45%;
            position: relative;
            top: 0;
            margin: auto 0;
          }
          .svg-icon{
            margin-right: 4px;
            font-size: 14px;
          }
          .edit, .delete{
            cursor: pointer;
            line-height: 30px;
            text-align: center;
            color: #ffffff;
            p{
              color:rgba(255,255,255,1);
              display: inline;
              font-size: 14px!important;
              line-height: 1!important;
              padding: 0!important;
            }
            border: 1px solid rgba(255, 255, 255, 0);
          }
        }
        .add{
          box-shadow: none;
          height: 140px;
          cursor: pointer;
          border-radius:4px;
          border:2px $new-primary;
          border-style: dotted;
          display: flex;
          align-items: center;
          justify-content: center;
          .svg-icon{
            cursor: pointer;
            font-size: 40px;
            color: $new-primary;
          }
        }
        .item_check {
          box-sizing: border-box;
          border: 2px solid $new-primary!important;
          position: relative;
          &:before{
            content: '';
            right:0;
            top: 0;
            position: absolute;
            width: 0;
            height: 0;
            border-style: solid;
            border-width: 0 28px 28px 0;
            border-color: transparent #007bff transparent transparent;
            z-index: 1;
          }
          &:after{
            content: '';
            z-index: 10;
            position: absolute;
            right: 4px;
            top: 4px;
            background: url("../../../../../../assets/images/spot-campaign/spot-campaign-how-select.png") no-repeat!important;
            background-size: 10px!important;
            background-position: right top!important;
            width: 10px;
            height: 10px;
          }
          .bottom-button{
            background-color: $new-primary;
          }
        }
      }
    }
  }
</style>
