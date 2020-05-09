/**
 *  Addtional info
 *  2019/11/21
 */
import { getMemberDynamicInfo } from '@/api/member'
export const getMemberDynamicInfoMixin = {
  data() {
    return {
      dynamic_info: null
    }
  },
  mounted() {
    this.getDynamicInfo()
  },
  methods: {
    getLanguage() {
      return sessionStorage.getItem('language')
    },
    getDynamicInfo() {
      getMemberDynamicInfo(this.member_code).then(res => {
        var fields = res.return_result.fields
        if (Array.prototype.isPrototypeOf(fields) && fields.length !== 0) {
          this.dynamic_info = {
            'lang_zh': [],
            'lang_tw': [],
            'lang_en': [],
            'lang_ja': [],
            'value': []
          }
          for (var item of fields) {
            this.dynamic_info.value.push({
              dynamic_field_code: item.dynamic_field_code,
              field_value: item.field_value
            })
            this.dynamic_info.lang_zh.push({
              dynamic_field_name: item.dynamic_field_label_zh || item.dynamic_field_name
            })
            this.dynamic_info.lang_tw.push({
              dynamic_field_name: item.dynamic_field_label_tw || item.dynamic_field_name
            })
            this.dynamic_info.lang_en.push({
              dynamic_field_name: item.dynamic_field_label_en || item.dynamic_field_name
            })
            this.dynamic_info.lang_ja.push({
              dynamic_field_name: item.dynamic_field_label_ja || item.dynamic_field_name
            })
          }
        }
      })
    }
  }
}
