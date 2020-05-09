<template>
  <div class="who-item config">
    <el-dialog title="Select Age:" :visible.sync="dialog_visible"  width="400px">
      <el-form label-position="top" :model="dialogData" ref="dialog" :rules="rulesDialog">
        <div>
          <el-form-item :label="handleGlobalI18n('campaign', 'select_from')" prop="age_from">
            <el-input-number style="width:200px;" :min="0" :precision="0" :step="1" v-model="dialogData.age_from"></el-input-number>
          </el-form-item>
          <el-form-item :label="handleGlobalI18n('campaign', 'select_to')"  prop="age_to">
            <el-input-number style="width:200px;" :min="0" :precision="0" :step="1" v-model="dialogData.age_to"></el-input-number>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialog_visible = false">{{handleGlobalI18n('campaign', 'back')}}</el-button>
        <el-button type="primary" @click="closeDialog">{{handleGlobalI18n('campaign', 'submit')}}</el-button>
      </div>
    </el-dialog>
    <el-form ref="campaign_info" label-position="top" label-width="100px" :disabled="!edit_state">
      <div class="item" :class="{'not-allowed ': !edit_state}">
        <div :class="{'pointer-events': !edit_state}"  @click="form.select_type = 'everyone'; show_filter=false">
          <svg-icon :icon-class="form.select_type === 'everyone' ? 'radiobox' : 'radio02'"></svg-icon>
        </div>
        <el-form-item :label="handleGlobalI18n('campaign', 'lifecycle_everyone') + ':'"></el-form-item>
      </div>
      <div class="item" :class="{'not-allowed ': !edit_state}">
        <div :class="{'pointer-events': !edit_state}"  @click="form.select_type = 'filter';show_filter=true">
          <svg-icon :icon-class="form.select_type === 'filter' ? 'radiobox' : 'radio02'" ></svg-icon>
        </div>
        <el-form-item :label="handleGlobalI18n('campaign', 'lifecycle_filter') + ':'">
          <el-collapse-transition>
            <div class="tage-item" v-show="show_filter">
            <div class="profile-target">
              <label class="title">{{handleGlobalI18n('campaign', 'demographic')}}</label>
              <div class="ul" :class="{'pointer-events': !edit_state}"  >
                <div class="li"  :class="{'check': age.length > 0}">
                  <p @click="dialog_visible = true">+ {{handleGlobalI18n('campaign', 'age')}}</p>
                  <by-profile :data="age" @handleDelete="handleDeleteAge" />
                </div>
              </div>
            </div>
            <div class="profile-target">
              <label class="title">{{handleGlobalI18n('campaign', 'register_channel')}}</label>
              <div class="ul" :class="{'pointer-events': !edit_state}">
                <div class="li" :class="{'check' : select_register_channel_id[index] === index + 1}" v-for="(item, index) in register_channel_data" :key="item.channel_code" @click="handleSelectRegisterChannel(index)">
                  <p>{{item.resources_key ? $t(`reporting.${item.resources_key}`) : item.channel_name}}</p>
                </div>
              </div>
            </div>
          </div>
          </el-collapse-transition>
        </el-form-item>
      </div>
      <div class="button">
        <el-button @click="save">{{handleGlobalI18n('campaign', 'lifecycle_save')}}</el-button>
        <el-button @click="next">{{handleGlobalI18n('campaign', 'next')}}</el-button>
      </div>
    </el-form>
  </div>
</template>
<script>
  import ByProfile from '@/views/campaign/campaign-setting/by-profile'
  import { mapGetters, mapMutations } from 'vuex'
  import {
    validateCompare,
    validatePositiveInteger
  } from '@/utils/validate'
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
      register_channel_data: {
        type: Array,
        default: []
      }
    },
    data() {
      return {
        form: {},
        show_filter: false,
        dialog_visible: false,
        select_register_channel_id: [0, 0, 0, 0, 0],
        dialogData: {
          age_from: '',
          age_to: ''
        },
        age: [],
        rulesDialog: {
          age_from: [
            { validator: this.validateAgeFrom, trigger: ['blur', 'change'] }
          ],
          age_to: [
            { validator: this.validateAgeTo, trigger: ['blur', 'change'] }
          ]
        }
      }
    },
    computed: {
      ...mapGetters([
        'lifecycle_info'
      ])
    },
    components: {
      ByProfile
    },
    created() {
    },
    methods: {
      validateCompare,
      validatePositiveInteger,
      ...mapMutations({
        setLifecycleWho: 'SET_LIFECYCLE_WHO'
      }),
      init() {
        // 重置
        this.age = []
        this.dialogData = { age_from: '', age_to: '' }
        this.show_filter = false
        this.select_register_channel_id = [0, 0, 0, 0, 0]
        const info = JSON.parse(JSON.stringify(this.lifecycle_info))
        const who_definition_list = info.wave_list[this.nonius_id - 1].who_definition_list[0]
        this.form = { ...who_definition_list }
        if (this.form.select_type === 'filter') {
          this.show_filter = true
        }
        if (this.form.target_criteria > 1) {
          if (this.form.target_criteria[0].criteria_value && this.form.target_criteria[1].criteria_value) {
            this.dialogData = {
              age_from: this.form.target_criteria[0].criteria_value,
              age_to: this.form.target_criteria[1].criteria_value
            }
            this.age = [`${this.dialogData.age_from}-${this.dialogData.age_to}`]
          }
        }
        if (this.form.target_criteria > 2) {
          if (this.form.target_criteria[2].criteria_value) {
            this.select_register_channel_id = [0, 0, 0, 0, 0]
            for (var i in this.register_channel_data) {
              if (this.form.target_criteria[2].criteria_value.indexOf(this.register_channel_data[i].channel_name) > -1) {
                this.select_register_channel_id[i] = parseInt(i) + 1
              }
            }
          }
        }
      },
      handleSelectRegisterChannel(index) {
        var value = index
        if (this.select_register_channel_id[index] !== 0) {
          value = 0
        } else {
          value += 1
        }
        this.$set(this.select_register_channel_id, index, value)
      },
      handleDeleteAge(tag) {
        this.age.splice(this.age.indexOf(tag), 1)
      },
      closeDialog() {
        this.$refs['dialog'].validate((valid) => {
          if (valid) {
            this.$set(this.age, 0, `${this.dialogData.age_from}-${this.dialogData.age_to}`)
          } else {
            return false
          }
          this.dialog_visible = false
        })
      },
      next() {
        this.$emit('next', 3)
      },
      save() {
        this.$emit('save', 'save')
      },
      validateAgeFrom(rule, value, callback) {
        this.validatePositiveInteger(this.dialogData.age_from, callback)
      },
      validateAgeTo(rule, value, callback) {
        this.validateCompare(this.dialogData.age_from, this.dialogData.age_to, callback)
      }
    },
    watch: {
      'age': {
        deep: true,
        handler(val) {
          this.form.target_criteria[0].criteria_code = this.dialogData.age_from
          this.form.target_criteria[0].criteria_value = this.dialogData.age_from
          this.form.target_criteria[1].criteria_code = this.dialogData.age_to
          this.form.target_criteria[1].criteria_value = this.dialogData.age_to
          this.setLifecycleWho({ info: JSON.parse(JSON.stringify(this.form)), nonius_id: this.nonius_id })
        }
      },
      'select_register_channel_id': {
        deep: true,
        handler(val) {
          var value = []
          var code = []
          for (var i in this.register_channel_data) {
            if (this.select_register_channel_id[i] === parseInt(i) + 1) {
              code.push(this.register_channel_data[i].channel_code)
              value.push(this.register_channel_data[i].channel_name)
            }
          }
          this.form.target_criteria[2].criteria_code = code.join(',')
          this.form.target_criteria[2].criteria_value = value.join(',')
          this.setLifecycleWho({ info: JSON.parse(JSON.stringify(this.form)), nonius_id: this.nonius_id })
        }
      },
      'form.select_type': {
        handler(val) {
          this.setLifecycleWho({ info: JSON.parse(JSON.stringify(this.form)), nonius_id: this.nonius_id })
        }
      },
      nonius_id: {
        handler(val) {
          this.init()
        },
        immediate: true
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
  .who-item{
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
    .el-form-item{
      margin-left: 20px;
    }
    .item{
      cursor: pointer;
      display: flex;
      align-items: flex-start;
      .svg-icon{
        margin-top: 5px;
        font-size: 20px;
        margin-left: 50px;
      }
    }
    .tage-item{
      margin-top: 20px;
    }
    .profile-target{
      line-height: 1;
      .title {
        line-height: 27px;
        border:1px solid red;
        min-width: 95px;
        text-align: center;
        margin-right: 14px;
        border-radius: 6px;
        padding: 0 10px;
        background-color: $primary;
        color: rgba(255, 255, 255, 1);
        font-size: 14px;
        border: 1px solid rgba(255, 255, 255, 0);
      }
      display: flex;
      flex:1;
      margin-bottom: 25px;
    }
    .ul {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      .li {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        margin-right: 16px;
        cursor: pointer;
        p {
          font-size: 14px;
          padding: 6px 10px;
          border-radius: 6px;
          line-height: 1;
          border: 1px dashed rgb(187, 187, 187);
          color: rgb(136, 136, 136);
          background-color: #ffffff;
          z-index:11;
          span {
            padding-right: 3px;
          }
        }
      }
      .check{
        p{
          border-style: solid;
          border-color: $primary;
          color: $primary;
        }
      }
    }
  }
</style>
