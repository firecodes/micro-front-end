<template>
  <div>
    <div style="margin-top: 15px;" class="search-box">
      <el-input :placeholder="$t('member.fc_member_tag_input_empty_tips')" v-model="input5" class="input-with-select">
      </el-input>
      <el-button slot="append" icon="el-icon-search" class="search-btn" @click="clickSearch">{{$t('member.fc_member_tag_btn_search_label')}}</el-button>
      <el-button slot="append" icon="el-icon-circle-plus-outline" class="search-btn" @click="addNewTag">{{$t('member.fc_member_tag_btn_add_label')}}</el-button>
      <!-- <el-button slot="append" class="search-btn update-btn" @click="updateTags"><img :src="require('@/assets/images/gengxin.png')" alt="">{{$t('member.fc_member_tag_btn_update_label)}}</el-button> -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'Search',
  data() {
    return {
      input5: '',
      is_add: false
    }
  },
  methods: {
    clickSearch() {
      this.$emit('clickSearch', this.input5 && this.input5.trim())
    },
    addNewTag() {
      this.$router.push('/member/member-tag/add')
    },
    updateTags() {
    }
  }
}
</script>

<style lang="scss" scoped>
.search-box {
  display: flex;
  .el-input {
    width: 600px;
  }
  .search-btn {
    background-color: #2777FF !important;
    color: #fff !important;
    margin-left: 8px;
    border-radius: 4px;
  }
  .update-btn {
    img {
      width: 14px;
    }
  }
}
</style>
