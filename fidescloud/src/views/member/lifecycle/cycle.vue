<template>
  <div class="cycle-card-comp">
    <el-card class="box-card">
      <div slot="header" class="clearfix headers">
        <span><img :src="require('@/assets/images/canyurenshu.png')" alt=""> <span class="nums">{{this.content.nums ? this.content.nums : '--'}}</span></span>
        <span style="float: right;" class="date">{{this.content.date}}</span>
      </div>
      <div class="title">{{this.content.title}}</div>
      <p>{{this.content.desc}}</p>
      <div class="bottom">
        <span v-if="!this.content.none" class="launch-campaign">Launch a campaign </span>
        <img v-if="!this.content.none" :src="require('@/assets/images/launch.png')" alt="">
        <el-button @click="clickEnable">Enable</el-button>
        <el-button style="marginLeft: 10px;marginRight:10px;" v-if="!this.content.none" @click="clickEdit">Edit</el-button>
        <el-button class="Analysis-btn" v-if="!this.content.none" @click="clickAnalysis">Analysis</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  props: {
    content: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    clickAnalysis() {
      this.$router.push('/member/member-lifecycle/analysis')
    },
    clickEdit() {
      this.$router.push('/member/member-lifecycle/edit')
    },
    clickEnable() {
      this.$confirm('Are you sure you want to enable this lifecycle stage? <br /> Then You will be able to see the analysis info ', 'Please confirm', {
        dangerouslyUseHTMLString: true,
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        confirmButtonClass: 'new_confirm_confirm',
        cancelButtonClass: 'new_confirm_cancel'
      }).then(() => {
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 480px;
    height: 260px;
    position: relative;
    box-sizing: border-box;
    /deep/ .el-card__header {
      border-bottom: none !important;
    }
    .headers {
      .nums {
        color: #2777FF;
        font-size: 20px;
        margin-left: 8px;
        position: relative;
        top: 5px;
      }
      img {
        width: 30px;
        height: 30px;
        float: left;
      }
      .date {
        color: #666;
        font-size: 14px;
        position: relative;
        top: 5px;
      }
    }
    .title {
      color: #333;
      font-size: 26px;
      font-weight: bold;
      margin-bottom: 24px;
    }
    p {
      color: #999;
      font-size: 14px;
      font-style: italic;
      font-family: Helvetica Neue Italic;
    }
    .bottom {
      height: 60px;
      background-color: #ECF4FF;
      width: 100%;
      position: absolute;
      left: 0;
      bottom: 0;
      padding-left: 20px;
      padding-right: 10px;
      span {
        line-height: 60px;
      }
      img {
        width: 21px;
        height: 20px;
        position: relative;
        top: 6px;
        margin-left: 6px;
      }
      .el-button {
        background-color: #2777FF;
        border-color: #2777FF;
        box-shadow: 0 6px 10px -2px #80AFFF;
        border-radius: 4px;
        color: #fff;
        font-size: 14px;
        float: right;
        margin-top: 12.5px;
      }
      .launch-campaign {
        color: #2777FF;
        font-size: 14px;
        font-weight: bold;
      }
    }
  }
  .cycle-card-comp /deep/ .box-card {
    background:rgba(255,255,255,1) !important;
    box-shadow:0px 5px 15px -3px rgba(204,204,204,1) !important;
  }
</style>
