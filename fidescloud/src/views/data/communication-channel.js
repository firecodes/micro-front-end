/**
 * 活动沟通渠道
 *  2020/01/08
 */
import { getCommunicationChannelTypeList } from '@/api/campaign'
export const handleCommunicationListMixin = {
  methods: {
    handleGetCommunicationChannelList() {
      return new Promise((resolve, reject) => {
        getCommunicationChannelTypeList().then(res => {
          resolve(res.return_result)
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}
