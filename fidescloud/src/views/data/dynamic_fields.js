/**
 *  Addtional fields
 *  2019/11/21
 */
import { getMemberDynamicFields } from '@/api/member'
export const getDynamicFieldsMixin = {
  data() {
    return {
      dynamic_fields: null
    }
  },
  created() {
    this.getDynamicFields()
  },
  methods: {
    getLanguage() {
      return sessionStorage.getItem('language')
    },
    getDynamicFields() {
      getMemberDynamicFields().then(res => {
        var fields = res.return_result.fields
        if (Array.prototype.isPrototypeOf(fields) && fields.length !== 0) {
          this.dynamic_fields = {
            'lang_zh': [],
            'lang_tw': [],
            'lang_en': [],
            'lang_ja': [],
            'value': []
          }
          for (var item of fields) {
            this.dynamic_fields.value.push({
              dynamic_field_code: item.dynamic_field_code,
              field_value: item.field_value
            })
            this.dynamic_fields.lang_zh.push({
              dynamic_field_name: item.dynamic_field_label_zh || item.dynamic_field_name
            })
            this.dynamic_fields.lang_tw.push({
              dynamic_field_name: item.dynamic_field_label_tw || item.dynamic_field_name
            })
            this.dynamic_fields.lang_en.push({
              dynamic_field_name: item.dynamic_field_label_en || item.dynamic_field_name
            })
            this.dynamic_fields.lang_ja.push({
              dynamic_field_name: item.dynamic_field_label_ja || item.dynamic_field_name
            })
          }
        }
      })
    }
  }
}
