<template>
  <div class="privacyPolicyWrapper">
    <el-dialog
      :close-on-click-modal='false'
      :showClose="false"
      :visible.sync="privacyData.isShow"
      title="Privacy Policy have been updated"
      width="50%">
      <div class="content-body">
        <div style="height: 300px;">
          <el-scrollbar style="height:100%;">
            <div class="main-body" v-html="privacyContent">
            </div>
          </el-scrollbar>
        </div>
      </div>
      <span class="dialog-footer" slot="footer">
        <el-button :disabled="btnText !== 'I agree'" @click="handleAgree" type="primary" v-html="btnText"></el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { PrivacyCn } from '@/data/privacy/cn.js'
import { PrivacySg } from '@/data/privacy/sg.js'
import { PrivacyUk } from '@/data/privacy/uk.js'
import { PrivacyMas } from '@/data/privacy/mas.js'
import { PrivacyJa } from '@/data/privacy/ja.js'
import { PrivacyFr } from '@/data/privacy/fr.js'
import { PrivacyHk } from '@/data/privacy/hk.js'
import { PrivacyTw } from '@/data/privacy/tw.js'
import { PrivacyInd } from '@/data/privacy/ind.js'
export default {
  name: 'DialogPrivacy',
  props: {
    content: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      dialogVisible: false,
      privacyContent: null,
      privacyData: {},
      btnText: ''
    }
  },
  methods: {
    handleClose(done) {
      done()
    },
    handleAgree() {
      this.$emit('handleAgree')
    },
    countDownTime() {
      let count = 10
      const timer = setInterval(() => {
        count--
        if (count === 0) {
          this.btnText = 'I agree'
          clearInterval(timer)
        } else {
          this.btnText = `${count}<sup>''</sup>`
        }
      }, 1000)
    }
  },
  watch: {
    'content': {
      deep: true, // 深度监视
      handler: function(val) {
        // 开始倒计时
        this.countDownTime()
        this.privacyData = { ...val }
        let PC = this.privacyData.privacy_country
        PC = PC && PC.toLocaleLowerCase()
        if (PC === 'cn') { // 中国
          this.privacyContent = PrivacyCn
        } else if (PC === 'ja' || PC === 'jp') { // 日本
          this.privacyContent = PrivacyJa
        } else if (PC === 'uk') {
          this.privacyContent = PrivacyUk
        } else if (PC === 'sg') {
          this.privacyContent = PrivacySg
        } else if (PC === 'hk') {
          this.privacyContent = PrivacyHk
        } else if (PC === 'tw') {
          this.privacyContent = PrivacyTw
        } else if (PC === 'my') {
          this.privacyContent = PrivacyMas
        } else if (PC === 'ind' || PC === 'in') {
          this.privacyContent = PrivacyInd
        } else if (PC === 'fr') {
          this.privacyContent = PrivacyFr
        } else { // other
          this.privacyData.isShow = false
          this.$message.error("Can't find privacy policy")
        }
      }
    }
  }
}
</script>
<style lang='scss'>
.privacyPolicyWrapper /deep/ .el-dialog__header {
  text-align: left !important;
}
.privacyPolicyWrapper /deep/ .el-dialog__body {
  text-align: initial !important;
}
.privacyPolicyWrapper .el-dialog__wrapper /deep/ .el-scrollbar__wrap {
  overflow-x: hidden !important;
}
.privacyPolicyWrapper {
  /deep/ li {
    list-style: inherit !important;
  }
  .main-body {
    padding: 30px 20px 30px 30px;
  }
  .content-body {
    // margin-bottom: 200px;
    /deep/ p {
      line-height: 22px
    }
  }
  .dialog-footer {
    .el-button {
      sup {
        position: relative;
        top: 6px;
        left: 3px;
      }
    }
  }
}
</style>
