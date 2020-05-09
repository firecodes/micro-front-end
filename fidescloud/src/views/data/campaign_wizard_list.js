/**
 * spot campaign list
 *  2020/01/08
 */
import { getCampaignWizardList } from '@/api/campaign'
export const handleCampaignWizardListMixin = {
  methods: {
    handleGetCampaignWizardList(type, page_no = 1, page_size = 5) {
      return new Promise((resolve, reject) => {
        getCampaignWizardList({ type: type, page_no: page_no, page_size: page_size }).then(res => {
          var result = res.return_result
          resolve({ total_count: result.total_count, list: result.result })
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}
