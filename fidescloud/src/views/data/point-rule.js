/**
 *  query point rule
 *  2019/10/30
 */
import { queryPointRule } from '@/api/loyalty'
export const getPointRuleMixin = {
  data() {
    return {
      point_rule_obj: {}
    }
  },
  created() {
    this.handleGetPointRule()
  },
  methods: {
    handleGetPointRule() {
      return queryPointRule().then(res => {
        this.point_rule_obj = res.return_result || {}
      })
    }
  }
}
