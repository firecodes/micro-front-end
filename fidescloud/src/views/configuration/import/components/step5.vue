<template>
  <div class="step5Component" v-loading="loading">
    <i class="el-icon-finished"></i>
    <p>You have completed the setup，do you want to enable the configuration right now?</p>
    <span class="pointer" @click="save(0)">Save only</span>
    <span class="pointer" @click="save(1)">Save and Enable</span>
  </div>
</template>

<script>
import { patternStatus } from '@/api/configuration'
import { Message } from 'element-ui'
export default {
  props: {
    patternId: {
      type: Number
    }
  },
  data() {
    return {
      loading: false
    }
  },
  methods: {
    save(arg) {
      this.loading = true
      patternStatus({ file_import_pattern_id: this.patternId, activate: arg !== 0 }).then(res => {
        this.loading = false
        if (res.return_result) {
          this.$router.push('/configuration/import1')
        } else {
          Message({ message: res.msg, type: 'error' })
        }
      }).catch(err => {
        this.loading = false
        Message({ message: err, type: 'error' })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.step5Component {
  .pointer {
    cursor: pointer;
  }
  text-align: center;
  .el-icon-finished {
    font-size: 128px;
    color: #ccc;
  }
  p {
    margin-top: 20px;
    margin-bottom: 36px;
    font-size: 16px;
    color: rgba(16, 16, 16, 1);
  }
  span {
    display: inline-block;
    width: 125px;
    height: 30px;
    line-height: 30px;
    border-radius: 4px;
    color: rgba(16, 16, 16, 1);
    font-size: 14px;
    text-align: center;
    font-family: Roboto;
    border: 1px solid rgba(187, 187, 187, 1);
  }
}
</style>
