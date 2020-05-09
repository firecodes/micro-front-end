<template>
  <div class="when-item config">
    <el-form label-width="130px" class="campaign" :disabled="!edit_state">
      <div class="item" :class="{'not-allowed ': !edit_state}" v-if="lifecycle_type === 1 || lifecycle_type === 2">
        <el-form-item label=" " style="margin-left: -100px">
          <label>
            {{handleGlobalI18n('campaign', 'last_purchase_happened_before')}}
          </label>
          <el-input-number :min="0" v-model="form.exec_date" maxlength="32"></el-input-number>
        </el-form-item>
        <span class="tips">{{handleGlobalI18n('campaign', 'month')}}</span>
      </div>
      <div class="item" :class="{'not-allowed ': !edit_state}"  v-else-if="lifecycle_type === 0 || lifecycle_type === 3">
          <el-form-item :label="handleGlobalI18n('campaign', 'fixed_time') + ':'">
            <el-input-number :min="0" v-model.number="form.delay_value" maxlength="32"></el-input-number>
          </el-form-item>
          <span class="tips">{{handleGlobalI18n('campaign', 'lifecycle_days_after')}}</span>
      </div>
      <div class="button">
        <el-button @click="save">{{handleGlobalI18n('campaign', 'lifecycle_save')}}</el-button>
        <el-button @click="next">{{handleGlobalI18n('campaign', 'next')}}</el-button>
      </div>
    </el-form>
  </div>
</template>
<script>
  import { mapGetters, mapMutations } from 'vuex'
  export default {
    props: {
      edit_state: {
        type: Boolean,
        default: false
      },
      nonius_id: {
        type: Number,
        default: 1
      },
      lifecycle_type: {
        type: Number,
        default: 0
      }
    },
    computed: {
      ...mapGetters([
        'lifecycle_info',
        'lifecycle_configuration'
      ])
    },
    data() {
      return {
        tip_state: true,
        form: {}
      }
    },
    methods: {
      ...mapMutations({
        setLifecycleWhen: 'SET_LIFECYCLE_WHEN'
      }),
      init() {
        this.tip_state = true
        const info = JSON.parse(JSON.stringify(this.lifecycle_info))
        const when_definition = info.wave_list[this.nonius_id - 1].when_definition
        this.form = { ...when_definition }
        if (this.lifecycle_type === 1 || this.lifecycle_type === 2) {
          this.form.type = 3
        } else {
          this.form.type = 2
        }
        const has = Object.prototype.hasOwnProperty
        if (has.call(when_definition, 'exec_date')) {
          this.form.exec_date = parseInt(when_definition.exec_date)
        }
      },
      next() {
        this.$emit('next', 2)
      },
      save() {
        this.$emit('save', 'save')
      }
    },
    watch: {
      'form': {
        deep: true,
        handler(val) {
          this.setLifecycleWhen({ info: JSON.parse(JSON.stringify({ ...this.form, exec_date: parseInt(this.form.exec_date) })), nonius_id: this.nonius_id })
          // if ((this.lifecycle_type === 1 || this.lifecycle_type === 2) && parseInt(this.form.exec_date) > 0 && parseInt(this.form.delay_value) > 0) {
          //   this.tip_state = false
          // } else if ((this.lifecycle_type === 0 || this.lifecycle_type === 3) && parseInt(this.form.delay_value) > 0) {
          //   this.tip_state = false
          // }
        }
      },
      nonius_id: {
        handler(val) {
          this.init()
        },
        immediate: true
      },
      lifecycle_info: {
        handler(val) {
          if (this.nonius_id === 1) this.init()
        }
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .config{
    .el-input, .el-input-number{
      width: 200px;
    }
    min-height: 436px;
    padding-bottom: 20px;
    margin-top: 55px;
    .button{
      margin-left: 200px;
      .el-button{
        color: rgba(16, 16, 16, 1);
        font-size: 14px;
        text-align: center;
        width: 90px;
      }
    }
  }
  .when-item{
    .item{
      cursor: pointer;
      display: flex;
      align-items: flex-start;
      .svg-icon{
        margin-top: 5px;
        font-size: 20px;
        margin-left: 50px;
      }
      .tips{
        padding-left:10px;
        line-height: 32px;
        color: rgba(16, 16, 16, 1);
        font-size: 14px;
        text-align: left;
      }
    }
    .button{
      margin-top: 20px;
    }
  }
</style>
