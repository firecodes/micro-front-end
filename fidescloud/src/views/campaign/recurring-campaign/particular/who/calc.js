/*
*   计算预估人数
*   2020/01/09
* */
// import { getFcHomepageMember } from '@/api/dwKpi'
// import { quickQueryMemberNumByGroup } from '@/api/member'
import { calcTarget, queryCalcTarget } from '@/api/campaign'
export const recurringCampaignWhoCalcMixin = {
  data() {
    return {
      target_code: '',
      timer: null
    }
  },
  methods: {
    // all member calc
    // calcAllMember() {
    //   var myDate = new Date()
    //   const nowYear = myDate.getFullYear()
    //   return new Promise((resolve, reject) => {
    //     getFcHomepageMember({ query_year: nowYear }).then(res => {
    //       resolve({ calc_value: res.return_result.total_member || 0 })
    //     }).catch(res => {
    //       reject(res)
    //     })
    //   })
    // },
    // member group calc
    // calcMemberGroup(arr) {
    //   return new Promise((resolve, reject) => {
    //     quickQueryMemberNumByGroup({ group_id_list: arr }).then(res => {
    //       resolve({ calc_value: res.return_result.total_member_num || 0 })
    //     }).catch(res => {
    //       reject(res)
    //     })
    //   })
    // },
    // Targeted members calc     Upload file calc          Member group         Tagged members
    calcTargetMemberOrMemberGroupOrTaggedMembers(params) {
      this.target_code = ''
      return new Promise((resolve, reject) => {
        calcTarget(params).then(res => {
          this.target_code = res.return_result.target_code
          if (this.target_code) {
            resolve(this.setTimer(params.campaign_wizard_id))
          } else {
            reject('Fail')
          }
        }).catch(() => {
          reject('Fail')
        })
      })
    },
    setTimer(id) {
      return new Promise((resolve, reject) => {
        this.timer = setInterval(() => {
          resolve(this.getCaleValue(id))
        }, 10000)
      })
    },
    getCaleValue(id) {
      return new Promise((resolve) => {
        if (this.target_code) {
          queryCalcTarget({ target_code: this.target_code, campaign_id: id }).then(res => {
            if (res.return_result.finish) {
              clearInterval(this.timer)
              resolve({ calc_value: res.return_result.total_targets || 0 })
            }
          })
        }
      })
    }
  }
}
