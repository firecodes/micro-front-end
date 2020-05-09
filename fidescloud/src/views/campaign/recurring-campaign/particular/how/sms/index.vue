<template>
  <div class="sms" ref="SmsComponent" v-if="channel_type_id">
    <component :channel_type_id="channel_type_id" :channel_value="channel_value" :form_data="form_data" :is="currentComponent()" :refresh_template="refresh_template" :select_obj="select_obj" @handleAdd="handleAdd" @handleCheckBox = "handleCheckBox" @handleEditTemplate = "handleEditTemplate" />
  </div>
</template>
<script>
  import ListComponent from './list'
  import TileListComponent from './tile_list'
  export default {
    props: {
      form_data: {
        type: Object
      },
      refresh_template: {
        type: Boolean
      },
      channel_type_id: {
        type: Number
      },
      channel_value: {
        type: String
      },
      menu_type_list: {
        type: Boolean,
        default: true
      },
      communication: {
        type: Object
      }
    },
    watch: {
      communication: {
        handler() {
          this.select_obj.id = this.communication && Object.keys(this.communication).length > 0 ? this.communication.communication_channels[0].communication_template_id : ''
        },
        deep: true
      }
    },
    data() {
      return {
        select_obj: {}
      }
    },
    components: { ListComponent, TileListComponent },
    created() {
      this.select_obj.id = this.communication && Object.keys(this.communication).length > 0 ? this.communication.communication_channels[0].communication_template_id : ''
    },
    methods: {
      handleCheckBox(obj) {
        this.select_obj = obj
      },
      handleAdd(type) {
        this.$emit('handleAdd', type)
      },
      handleEditTemplate(row, type) {
        this.$emit('handleEditTemplate', row, type)
      },
      currentComponent() {
        return this.menu_type_list ? 'ListComponent' : 'TileListComponent'
      },
      handleSaveValue() {
        return {
          communication_channels: [{
            communication_channel_code: 1,
            communication_template_id: this.select_obj.id || null,
            send_date: null
          }],
          communication_info: this.select_obj || null
        }
      }
    }
  }
</script>
