<template>
  <div class="by-profile">
    <ul>
      <template v-for="(item) in data">
        <li :class="{'bg-f5f7fa': disabled}" class="li">
          <label>{{item}}</label>
          <svg-icon @click.native="handleDelete(item)" icon-class="delete-1" />
        </li>
      </template>
    </ul>
  </div>
</template>

<script>
  export default {
    name: 'by-profile',
    props: {
      data: {
        type: Array,
        default: []
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
      handleDelete(item) {
        this.$emit('handleDelete', item)
      }
    }
  }
</script>

<style scoped rel="stylesheet/scss" lang="scss">
  .by-profile {
    ul {
      border: 1px dashed rgba(198,219,255,1);
      margin-left: -16px;
      z-index: -1;
      background:rgba(74,144,226,0.07);
      border-radius:15px;
      display: flex;
      flex-wrap: wrap;
      .li {
        display: flex;
        font-size: 14px;
        line-height: 17px;
        padding: 6px 17px;
        &:not(:first-child) {
          padding-left: 0!important;
        }
        color: $new-primary;
      }
      .line {
        position: relative;
        div {
          position: absolute;
          top: 0;
          bottom: 0;
          margin: auto;
          width: 1px;
          background-color: rgb(187, 187, 187);
          height: 70%;
        }
      }
      .svg-icon {
        z-index: 12;
        font-size: 15px;
        margin-left: 5px;
        color: $new-primary;
      }
    }
  }
</style>
