import Mock from 'mockjs'
const communicationTemplateList = []
for (let i = 0; i < 5; i++) {
  communicationTemplateList.push(Mock.mock({
    template_id: '@id',
    subject: '@string(10)',
    content: '@string(60)'
  }))
}
const campaignList = []
for (let i = 0; i < 100; i++) {
  campaignList.push(Mock.mock({
    campaign_code: '@id',
    campaign_name: '@string(10)',
    campaign_type_code: '@id',
    campaign_type_name: '@string(8)',
    campaign_create_date: '@date',
    'campaign_status|1': [1, 2, 3],
    campaign_description: '@string(38)'
  }))
}
export default {
  addOrUpdateCampaignInfo: config => {
    return {
      code: '2000',
      msg: 'suc',
      result: Mock.mock({
        campaign_wizard_id: '@id'
      }),
      signature: '',
      timestamp: 11111
    }
  },
  addOrUpdateCampaignTarget: config => {
    return {
      code: '2000',
      msg: 'suc',
      result: {},
      signature: '',
      timestamp: 111111111111
    }
  },
  addOrUpdateCampaignReward: config => {
    return {
      code: '2000',
      msg: 'suc',
      result: {

      },
      signature: '',
      timestamp: 111111111111
    }
  },
  addOrUpdateCampaignCommunication: config => {
    console.log(JSON.parse(config.body).parameter)
    return {
      code: '2000',
      msg: 'suc',
      result: Mock.mock({
        campaign_wizard_id: '@id'
      }),
      signature: '',
      timestamp: 111111111111
    }
  },
  queryCommunicationTemplateByChannel: config => {
    const { page_no = 1, page_size = 10 } = JSON.parse(config.body).parameter
    return {
      code: '2000',
      msg: 'suc',
      result: {
        total_page: Math.ceil(communicationTemplateList.length / page_size),
        total_count: communicationTemplateList.length,
        communication_templates: communicationTemplateList.slice(page_no - 1, page_no + page_size - 1)
      },
      signature: '',
      timestamp: 111111111
    }
  },
  addOrUpdateCommunicationChannelTemplate: config => {
    return {
      code: '2000',
      msg: 'suc',
      result: {},
      signature: '',
      timestamp: 111111111
    }
  },
  getCampaignWizardInfo: config => {
    return {
      code: '2000',
      msg: 'suc',
      result: {},
      signature: '',
      timestamp: 111111111
    }
  },
  submitCampaign: config => {
    return {
      code: '2000',
      msg: 'suc',
      result: Mock.mock({
        campaign_wizard_id: '@id'
      }),
      signature: '',
      timestamp: 111111111
    }
  },
  queryCampaignListBySearch: config => {
    const { page_no = 1, page_size = 10 } = JSON.parse(config.body).parameter
    return {
      code: '2000',
      msg: 'suc',
      result: {
        total_page: Math.ceil(communicationTemplateList.length / page_size),
        total_count: communicationTemplateList.length,
        campaigns: communicationTemplateList.slice(page_no - 1, page_no + page_size - 1)
      },
      signature: '',
      timestamp: 111111111
    }
  }
}
