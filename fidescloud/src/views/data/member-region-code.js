/**
 * 查询所有手机区号
 *  2019/12/16
 */
import { getMobileRegionCode } from '@/api/cct'
export const handleMemberRegionCodeMixin = {
  data() {
    return {
      member_region_code_list: [],
      member_region_code_status: true
    }
  },
  created() {
    this.getMobileRegionCode()
  },
  methods: {
    getTenantCode() {
      var tenant_info = JSON.parse(window.localStorage.tenantInfo || '{}')
      return tenant_info ? tenant_info.code : ''
    },
    isFloorXpertUser() {
      var code = this.getTenantCode()
      return (code && code.toLowerCase().indexOf('floorxpert') > -1)
    },
    getMobileRegionCode() {
      // 添加判断根据不同租户
      if (this.isFloorXpertUser()) {
        this.member_region_code_status = false
        this.member_region_code_list = [{
          'regionCode': '60', 'displayValue': '+60'
        }, {
          'regionCode': '62', 'displayValue': '+62'
        }, {
          'regionCode': '63', 'displayValue': '+63'
        }, {
          'regionCode': '65', 'displayValue': '+65'
        }, {
          'regionCode': '66', 'displayValue': '+66'
        }, {
          'regionCode': '670', 'displayValue': '+670'
        }, {
          'regionCode': '673', 'displayValue': '+673'
        }, {
          'regionCode': '84', 'displayValue': '+84'
        }, {
          'regionCode': '855', 'displayValue': '+855'
        }, {
          'regionCode': '856', 'displayValue': '+856'
        }, {
          'regionCode': '95', 'displayValue': '+95'
        }]
      } else {
        getMobileRegionCode().then(res => {
          this.member_region_code_status = false
          var list = !res.return_result ? null : res.return_result[0] ? res.return_result[0].cfg_value : null
          if (list) {
            // eslint-disable-next-line no-eval
            list = eval('(' + list + ')') || {}
            if (Object.keys(list).length > 0) {
              var language = sessionStorage.getItem('language')
              this.member_region_code_list = list[language]
            }
          } else {
            this.member_region_code_list = []
          }
        }).catch(error => {
          this.member_region_code_status = false
          console.log(error)
        })
      }
    }
  }
}
