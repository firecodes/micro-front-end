<template>
  <div class="by-profile">
    <ul>
      <template v-for="(item,index) in data">
        <li class="li" :class="{'bg-f5f7fa': disabled}">
          <label>{{(item && item.length > 20) ? item.substring(0, 20) + '...' : item}}</label>
          <svg-icon @click.native="handleDelete(item)" icon-class="delete-1" />
        </li>
        <li class="line" v-if="index < data.length-1">
          <div></div>
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
      border: 1px dashed rgb(187, 187, 187);
      margin-left: -4px;
      z-index: -1;
      background-color: #ffffff;
      border-radius: 6px;
      display: flex;
      flex-wrap: wrap;
      .li {
        display: flex;
        font-size: 14px;
        padding: 6px 10px;
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
        color: red;
      }
    }
  }
</style>
