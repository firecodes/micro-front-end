/**
 *  tier list
 *  2019/10/30
 */
import { queryMemberTierList } from '@/api/loyalty'
export const getTierListMixin = {
  data() {
    return {
      tier_list: [],
      tier_list_status: true
    }
  },
  created() {
    this.handleGetTierLists()
  },
  methods: {
    handleGetTierLists() {
      return queryMemberTierList({ page_no: 1, page_size: 100 }).then(res => {
        this.tier_list_status = false
        this.tier_list = res.return_result.tiers
      }).catch(() => {
        this.tier_list_status = true
      })
    }
  }
}
