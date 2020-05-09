<template>
  <transition name="fade">
    <!-- <span class="category-tit">{{ label}}</span> -->
    <!-- <span class="category-tit">{{'test1111'}}</span> -->
    <!-- {{categoryList + 'test'}} -->
    <div class="category" :id="id" v-if="child_categoryList.length !== 0">
      <span class="category-tit">{{ label }}</span>
      <div class="category-con">
        <div class="category-list" :class="{ 'category-extend': moreHTMLKey === 1 }">
          <!-- <span class="tag" :class="{ 'active': arr[-1] }" @click="selectTag(allLabel, -1)">{{ allLabel.type_name }}</span> -->
          <span class="tag" :class="{ 'active': arr[idx] }" @click="selectTag(item, idx)" v-for="(item, idx) in categoryList" :key="item.type_id">{{ item.type_name }}</span>
        </div>
        <span class="handle-tag" v-show="isMore" @click="hanldeExtend">
          <em> {{ handleHtml[moreHTMLKey].name }} </em>
          <i :class="{ 'el-icon-arrow-down': moreHTMLKey === 0, 'el-icon-arrow-up': moreHTMLKey === 1 }"></i>
        </span>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'category',
  props: {
    'label': { type: String },
    'selected': {},
    'id': { type: String }, // 组件id => 唯一标识
    'categoryList': { type: Array, default: function() {
      return []
    } }
  },
  data() {
    return {
      arr: [],
      child_categoryList: [],
      isMore: false,
      moreHTMLKey: 0
    }
  },
  watch: {
    'categoryList': {
      immediate: true,
      deep: true,
      handler() {
        this.child_categoryList = this.categoryList.map(item => {
          if (item.name) this.$set(item, 'type_name', item.name)
          if (item.id) this.$set(item, 'type_id', item.id)
          return item
        })
        // console.log(this.child_categoryList, '#' + this.id + ' .tag')
        this.arr = []
        this.arr[-1] = true
        this.$nextTick(() => {
          // if (this.id === '_city') console.log(document.querySelectorAll('#' + this.id + ' .tag'))
          const arr = [...document.querySelectorAll('#' + this.id + ' .tag')]
          for (let i = 0; i < arr.length; i++) {
            // if (this.id === '_city') console.log(arr[i].offsetTop)
            if (arr[i].offsetTop > 0) {
              this.isMore = true
            } else {
              this.isMore = false
            }
          }
        })
      }
    },
    'selected': {
      immediate: true,
      deep: true,
      handler() {
        this.arr = []
        const idx = this.categoryList.findIndex(item => item.type_id === this.selected)
        this.arr[idx] = true
      }
    }
  },
  computed: {
    allLabel() {
      return { type_id: '', type_name: this.$t('mgt_search_filter_all_label') }
    },
    handleHtml() {
      return [
        { key: 0, name: this.$t('mgt_search_filter_more_label') }, { key: 1, name: this.$t('mgt_search_filter_less_label') }
      ]
    }
  },
  methods: {
    hanldeExtend() {
      const moreHTMLKey = this.moreHTMLKey === 0 ? 1 : 0
      this.moreHTMLKey = moreHTMLKey
    },
    selectTag(item, idx) {
      this.arr = []
      this.arr[idx] = true
      this.$emit('selectTag', item.type_id)
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss' scoped>
.category {
  border-top: 1px solid #ebeef5;
  border-bottom: 1px solid #ebeef5;
  padding: 0 0 15px;
  display: flex;
  .category-tit {
    display: block;
    margin-right: 10px;
    height: 28px;
    line-height: 28px;
  }
  .category-con {
    flex: 1;
    display: flex;
  }
  .category-list {
    flex: 1;
    height: 38px;
    overflow: hidden;
    margin-bottom: -10px;
    position: relative;
    .tag {
      margin-bottom: 10px;
      margin-right: 10px;
      cursor: pointer;
      font-size: 14px;
      color: red;
      border-radius: 4px;
      // background-color: rgba(64,158,255,.1);
      padding: 0 10px;
      height: 28px;
      line-height: 26px;
      display: inline-block;
    }
    .tag.active {
      color: red;
      border: 1px solid rgba(64,158,255,.2);
      background-color: rgba(64,158,255,.1);
    }
  }
  .handle-tag {
    display: flex;
    height: 28px;
    line-height: 28px;
    border-radius: 5px;
    padding: 0 6px;
    background: #fff;
    color: red;
    font-size: 14px;
    cursor: pointer;
    i {
      height: 14px;
      margin-left: 5px;
      margin-top: 7px;
    }
  }
  .category-extend {
    height: auto;
    overflow: auto;
  }
}
</style>
