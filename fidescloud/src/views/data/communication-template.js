/*
  获取沟通的模板
  2020/01/08
*/
import { getTemplateListByCommunicationChannelType } from '@/api/campaign'
export const handleCommunicationTemplateListMixin = {
  methods: {
    handleGetCommunicationTemplateList(channel_type, page_no, page_size = 5) {
      return new Promise((resolve, reject) => {
        getTemplateListByCommunicationChannelType({ communication_channel_type: channel_type, campaign_type_id: this.campaign_type_id, page_size: page_size, page_no: page_no }).then(res => {
          resolve(res.return_result === null || res.return_result.result.length <= 0 ? { list: [], count: 0 } : { list: res.return_result.result, count: res.return_result.total_count })
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}
