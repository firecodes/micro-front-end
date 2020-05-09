<template>
  <div class="handleRadio">
    <div class="cursor-pointer" v-for="(item, index) in data" :class="{'check': item.id === campaign_targets, 'pointer-events not-allowed bg-f5f7fa':disabled}" :key ="index" @click="checkTarget(item.id)">
      <svg-icon :icon-class="checkIcon(item.id)"></svg-icon>
      <p v-html="handleGlobalI18n('campaign', item.title)"></p>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'handleRadio',
    props: {
      data: {
        type: Array,
        default: []
      },
      campaign_targets: {
        type: Number,
        default: 1
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {}
    },
    methods: {
      checkIcon(id) {
        if (id === this.campaign_targets) {
          return 'radio-select'
        } else {
          return 'radio'
        }
      },
      checkTarget(id) {
        this.$emit('selId', id)
      }
    }
  }
</script>

<style scoped rel="stylesheet/scss" lang="scss">
  .handleRadio {
    margin-top: 4px;
    display: inline-flex;;
    .cursor-pointer {
      margin-right: 10px;
      display: flex;
      align-items: center;
      border: 1px solid rgba(190, 194, 201, 1);
      border-radius: 7px;
      padding: 5px 15px;
      .svg-icon {
        font-size: 16px;
      }
      p {
        line-height: 0;
        font-size: 14px;
        margin-left: 8px;
      }
    }
    .check {
      color: $primary;
      border-color: $primary;
    }
  }
</style>
