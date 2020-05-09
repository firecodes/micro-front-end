/**
 *  addOrUpdateCampaignReward
 *  2020/01/09
 */
import { addOrUpdateCampaignReward } from '@/api/campaign'
export const addOrUpdateCampaignRewardMixin = {
  methods: {
    saveCampaignReward(obj) {
      return new Promise((resolve, reject) => {
        addOrUpdateCampaignReward(obj).then(res => {
          resolve(res)
        }).catch(res => {
          reject(res)
        })
      })
    }
  }
}
