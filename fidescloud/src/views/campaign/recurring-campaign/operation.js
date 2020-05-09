/**
 * operation
 *  2020/01/08
 */
import { DateTime } from 'luxon'
import { disableCampaign } from '@/api/campaign'
import { addOrUpdateCampaignInfo, getCampaignWizardInfo, addOrUpdateCampaignTarget, addOrUpdateCampaignReward, addOrUpdateCampaignCommunication, addCommunicationChannel } from '@/api/campaign'
const moment = require('moment')
export const operationMixin = {
  data() {
    return {
      copy: {
        info: {},
        campaign_wizard_id: ''
      }
    }
  },
  methods: {
    formatTimeStamp(dataStr, pattern = 'YYYY-MM-DD') {
      if (dataStr) {
        return moment(parseInt(dataStr)).format(pattern)
      } else {
        return '-'
      }
    },
    editRouter(id) {
      this.$router.push({
        path: '/campaign/recurring-campaign/edit',
        query: {
          type: 'edit',
          id: id
        }
      })
    },
    async copyRouter(item) {
      if (!item.campaign_wizard_id) {
        this.$message.error('Copy fail')
        return true
      }
      this.table_loading = true
      // 先获取详情
      try {
        await this.handleCopyGetCampaignInfo(item.campaign_wizard_id)
        // 然后添加
        await this.handleCopyAddOrUpdateCampaignInfo(item)
        // 然后添加
        await this.handleWhen(item)
        await this.handleCopyWho()
        await this.handleCopyWhat()
        await this.handleCopyHow()
        await this.handleCopyCommunicationChannel()
      } catch (e) {
        this.table_loading = false
        this.$message.error('Copy fail')
      }
    },
    handleCopyCommunicationChannel() {
      return new Promise((resolve, reject) => {
        var communication = this.copy.info.communication ? JSON.parse(this.copy.info.communication) : {}
        var obj = {
          communication_channel_type_id: communication.communication_channels[0].communication_channel_code || null,
          planned_sendout_date: null,
          template_id: communication.communication_channels[0].communication_template_id || null,
          backend_campaign_id: this.copy.campaign_wizard_id
        }
        if (obj.communication_channel_type_id) {
          obj.communication_channel_type_id = parseInt(obj.communication_channel_type_id)
        }
        if (obj.template_id) {
          addCommunicationChannel(obj).then(() => {
            this.$message.success('Success')
            this.detailRouter(this.copy.campaign_wizard_id)
            resolve()
          }).catch(() => {
            reject()
          })
        } else {
          this.$message.success('Success')
          this.detailRouter(this.copy.campaign_wizard_id)
          resolve()
        }
      })
    },
    handleCopyHow() {
      var communication = this.copy.info.communication ? JSON.parse(this.copy.info.communication) : {}
      var obj = {
        'communication_channels': [
          {
            'communication_channel_code': parseInt(communication.communication_channels[0].communication_channel_code),
            'communication_template_id': communication.communication_channels[0].communication_template_id
          }
        ],
        'communication_info': communication.communication_info,
        'compaign_wizard_id': this.copy.campaign_wizard_id,
        'select_comunication': communication.communication_channels[0].communication_template_id ? 1 : 0
      }
      return new Promise((resolve, reject) => {
        addOrUpdateCampaignCommunication(obj).then(res => {
          resolve()
        }).catch(() => {
          reject()
        })
      })
    },
    handleCopyWhat() {
      var reward = this.copy.info.reward ? JSON.parse(this.copy.info.reward) : {}
      return addOrUpdateCampaignReward(Object.assign({}, reward, { compaign_wizard_id: this.copy.campaign_wizard_id })).then(res => {})
    },
    handleCopyWho() {
      var target = this.copy.info.target ? JSON.parse(this.copy.info.target) : {}
      return addOrUpdateCampaignTarget(Object.assign({}, target, { compaign_wizard_id: this.copy.campaign_wizard_id })).then(res => {})
    },
    handleCopyGetCampaignInfo(id) {
      return new Promise((resolve, reject) => {
        getCampaignWizardInfo({ compaign_wizard_id: id }).then(res => {
          resolve()
          this.copy.info = res.return_result || {}
        }).catch(() => {
          reject()
        })
      })
    },
    handleCopyAddOrUpdateCampaignInfo(item) {
      var obj = {
        compaign_wizard_id: null,
        campaign_name: 'Copy-' + item.campaign_name.slice(0, 32),
        campaign_description: this.copy.info.campaign_description,
        campaign_type_code: '1'
      }
      return addOrUpdateCampaignInfo(obj).then(res => {
        this.copy.campaign_wizard_id = res.return_result.compaign_wizard_id
      }).catch(() => {
        this.table_loading = false
      })
    },
    handleWhen(item) {
      var period = this.copy.info.period ? JSON.parse(this.copy.info.period) : {}
      var obj = {
        compaign_wizard_id: this.copy.campaign_wizard_id,
        campaign_name: 'Copy-' + item.campaign_name.slice(0, 32),
        campaign_description: this.copy.info.campaign_description,
        campaign_type_code: item.campaign_type,
        when_type: this.copy.info.when_type,
        campaign_start_date: item.campaign_start_date,
        campaign_end_date: item.campaign_end_date,
        send_date: null,
        limit_flag: period.limitFlag || null
      }
      if (parseInt(obj.when_type) === 1) {
        obj.send_date = this.formatTimeStamp(item.send_date)
      } else {
        var generate_time = DateTime.local().toISO()
        obj.send_date = `${generate_time.substring(0, 10)} ${generate_time.substring(11, 19)}`
      }
      return new Promise((resolve, reject) => {
        addOrUpdateCampaignInfo(obj).then(res => {
          resolve()
        }).catch(() => {
          reject()
        })
      })
    },
    detailRouter(id) {
      this.$router.push({
        path: '/campaign/recurring-campaign/detail',
        query: {
          type: 'detail',
          id: id
        }
      })
    },
    // 删除
    handleDelete(id) {
      return new Promise((resolve, reject) => {
        this.$confirm(this.$t('campaign.fc_campaign_spot_delete_popup_content_label'), this.$t('campaign.fc_campaign_spot_delete_popup_title_label'), {
          confirmButtonText: this.$t('campaign.fc_campaign_spot_delete_popup_btn_confirm_label'),
          cancelButtonText: this.$t('campaign.fc_campaign_spot_delete_popup_btn_cancel_label'),
          confirmButtonClass: 'new_confirm_confirm',
          cancelButtonClass: 'new_confirm_cancel'
        }).then(() => {
          disableCampaign({ campaign_wizard_id: id }).then(res => {
            if (res.return_result) {
              this.$message.success('Success')
              resolve()
            } else {
              this.$message.error('Fail')
              reject()
            }
          }).catch(() => {
            this.$message.error('Fail')
            reject()
          })
        }).catch(() => {
        })
      })
    }
  }
}
