<!--
  Tier
  2020/01/11
-->
<template>
  <div :class="{'check': tier_name_list.length>0, 'pointer-events not-allowed ': campaign_respondent_state}" class="li" ref="tier_component">
    <p :class="{'bg-f5f7fa': campaign_respondent_state}" @click="dialog = true">
      <span>+</span>Tiers
    </p>
    <by-profile :data="tier_name_list" :disabled="campaign_respondent_state" @handleDelete="handleDelete" />
    <ed-dialog>
      <el-dialog :visible.sync="dialog" title="Tiers" width="350px">
        <div class="dialog_body_height">
          <el-select :loading="select_loading" filterable multiple placeholder="Please select tier" v-model="select_tier_list">
            <el-option :key="item.member_tier_code" :label="item.member_tier_name" :value="index" v-for="(item, index) in tier_list" />
          </el-select>
        </div>
        <div class="dialog-footer" slot="footer">
          <el-button @click="dialog = false" class="cancel">Cancel</el-button>
          <el-button @click="closeDialog" class="save" type="primary">Save</el-button>
        </div>
      </el-dialog>
    </ed-dialog>
  </div>
</template>
<script>
  import { getTenantKPIByTier } from '@/api/kpi'
  import ByProfile from '../by-profile'
  export default {
    props: {
      campaign_respondent_state: {
        type: Boolean,
        default: false
      },
      target: {
        type: Object
      }
    },
    components: {
      ByProfile
    },
    data() {
      return {
        dialog: false,
        select_tier_list: [],
        tier_name_list: [],
        tier_code_list: [],
        select_loading: true,
        tier_list: []
      }
    },
    created() {
      getTenantKPIByTier().then(res => {
        this.select_loading = false
        this.tier_list = res.return_result.kpis || []
        this.init()
      }).catch(res => {
        this.select_loading = false
      })
    },
    methods: {
      init() {
        if (this.target) {
          var list = this.target.target_profiles && this.target.target_profiles[0].criteria_fields ? this.target.target_profiles[0].criteria_fields : []
          if (list.length <= 0) {
            return true
          }
          for (var item of list) {
            var code = []
            var name = []
            if (item.criteria_field_option.hasOwnProperty('criteria_field_option_code')) {
              code = item.criteria_field_option.criteria_field_option_code
            }
            if (item.criteria_field_option.hasOwnProperty('criteria_field_option_name')) {
              name = item.criteria_field_option.criteria_field_option_name
            }
            if (item.criteria_field_name === 'tiers') {
              this.tier_code_list = code ? code.split(',') : []
              this.tier_name_list = name ? name.split(',') : []
              this.select_tier_list = []
              for (let i = 0; i < this.tier_list.length; i++) {
                if (item.criteria_field_option.hasOwnProperty('criteria_field_option_code')) {
                  if (item.criteria_field_option.criteria_field_option_code.indexOf(this.tier_list[i].member_tier_code) > -1) {
                    this.select_tier_list.push(i)
                  }
                }
              }
              break
            }
          }
        }
      },
      calcValue() {
        return this.tier_code_list.join(',')
      },
      handleDelete(tag) {
        const key = this.tier_name_list.indexOf(tag)
        this.tier_name_list.splice(key, 1)
        this.tier_code_list.splice(key, 1)
        this.select_tier_list.splice(key, 1)
      },
      closeDialog() {
        this.dialog = false
        this.tier_name_list = []
        this.tier_code_list = []
        if (this.select_tier_list.length <= 0) {
          return false
        }
        for (const index of this.select_tier_list) {
          this.tier_code_list.push(this.tier_list[index].member_tier_code)
          this.tier_name_list.push(this.tier_list[index].member_tier_name)
        }
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  @import '../common';
</style>
