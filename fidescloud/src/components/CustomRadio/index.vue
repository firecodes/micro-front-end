<template>
  <div class="custom-radio" id="custom-radio">
    <div class="cursor-pointer" v-for="(item, index) in data" :class="{'check': item.id === targets, 'pointer-events not-allowed bg-f5f7fa':disabled}" :key ="index" @click="checkTarget(item.id)">
      <svg-icon :icon-class="checkIcon(item.id)"></svg-icon>
      <p v-html="item.title"></p>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'custom-radio',
    props: {
      data: {
        type: Array,
        default: []
      },
      targets: {
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
        if (id === this.targets) {
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
  .custom-radio {
    display: inline-flex;;
    .cursor-pointer {
      display: flex;
      align-items: center;
      // border: 1px solid rgba(190, 194, 201, 1);
      border-radius: 7px;
      &:not(:first-child) {
        margin-left: 55px;
      }
      .svg-icon {
        font-size: 16px;
      }
      p {
        line-height: 0;
        font-size: 13px;
        margin-left: 8px;
      }
    }
    .check {
      color: $primary;
      border-color: $primary;
    }
  }
</style>
