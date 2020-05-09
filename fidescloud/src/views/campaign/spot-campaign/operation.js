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
        path: '/campaign/spot-campaign/edit',
        query: {
          type: 'edit',
          id: id
        }
      })
    },
    async copyRouter(item) {
      if (!item.campaign_wizard_id) {
        this.$message.error(this.$t('configuration.fc_operation_failed_notification_label'))
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
        console.log(e)
        this.table_loading = false
        this.$message.error(this.$t('configuration.fc_operation_failed_notification_label'))
      }
    },
    handleCopyCommunicationChannel() {
      if (!this.copy.info.communication) {
        this.$message.success(this.$t('configuration.fc_operation_feedback_notification_label'))
        this.detailRouter(this.copy.campaign_wizard_id)
        return Promise.resolve()
      }
      return new Promise((resolve, reject) => {
        const communication = this.copy.info.communication ? JSON.parse(this.copy.info.communication) : {}
        const obj = {
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
            this.$message.success(this.$t('configuration.fc_operation_feedback_notification_label'))
            this.detailRouter(this.copy.campaign_wizard_id)
            resolve()
          }).catch(() => {
            reject()
          })
        } else {
          this.$message.success(this.$t('configuration.fc_operation_feedback_notification_label'))
          this.detailRouter(this.copy.campaign_wizard_id)
          resolve()
        }
      })
    },
    handleCopyHow() {
      if (!this.copy.info.communication) {
        return Promise.resolve()
      }
      const communication = this.copy.info.communication ? JSON.parse(this.copy.info.communication) : {}
      const obj = {
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
        addOrUpdateCampaignCommunication(obj).then(() => {
          resolve()
        }).catch(() => {
          reject()
        })
      })
    },
    handleCopyWhat() {
      const reward = this.copy.info.reward ? JSON.parse(this.copy.info.reward) : {}
      return addOrUpdateCampaignReward(Object.assign({}, reward, { compaign_wizard_id: this.copy.campaign_wizard_id })).then(() => {})
    },
    handleCopyWho() {
      const target = this.copy.info.target ? JSON.parse(this.copy.info.target) : {}
      return addOrUpdateCampaignTarget(Object.assign({}, target, { compaign_wizard_id: this.copy.campaign_wizard_id })).then(() => {})
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
      const obj = {
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
      const period = this.copy.info.period ? JSON.parse(this.copy.info.period) : {}
      const obj = {
        compaign_wizard_id: this.copy.campaign_wizard_id,
        campaign_name: 'Copy-' + item.campaign_name.slice(0, 32),
        campaign_description: this.copy.info.campaign_description,
        campaign_type_code: item.campaign_type,
        when_type: this.copy.info.when_type,
        campaign_start_date: item.campaign_start_date ? item.campaign_start_date.substring(0, 10) + ' 00:00:00' : item.campaign_start_date,
        campaign_end_date: item.campaign_end_date ? item.campaign_start_date.substring(0, 10) + ' 23:59:59' : item.campaign_start_date,
        send_date: null,
        limit_flag: period.limitFlag || null
      }
      if (parseInt(obj.when_type) === 1) {
        // 20200417修改 specific date 的send time 添加时分秒
        obj.send_date = `${this.formatTimeStamp(item.send_date)} 00:00:00`
      } else {
        const generate_time = DateTime.local().toISO()
        obj.send_date = `${generate_time.substring(0, 10)} ${generate_time.substring(11, 19)}`
      }
      return new Promise((resolve, reject) => {
        addOrUpdateCampaignInfo(obj).then(() => {
          resolve()
        }).catch(() => {
          reject()
        })
      })
    },
    detailRouter(id) {
      this.$router.push({
        path: '/campaign/spot-campaign/detail',
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
              this.$message.success(this.$t('configuration.fc_operation_feedback_notification_label'))
              resolve()
            } else {
              this.$message.error(this.$t('configuration.fc_operation_failed_notification_label'))
              reject()
            }
          }).catch(() => {
            this.$message.error(this.$t('configuration.fc_operation_failed_notification_label'))
            reject()
          })
        }).catch(() => {
        })
      })
    }
  }
}
