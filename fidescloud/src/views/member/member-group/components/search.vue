<template>
  <div>
    <div style="margin-top: 15px;" class="search-box">
      <el-input :placeholder="$t('member.fc_member_group_recommended_input_empty_label')" v-model="input5" class="input-with-select">
      </el-input>
      <el-button slot="append" icon="el-icon-search" class="search-btn" @click="clickSearch">{{$t('member.fc_member_group_recommended_btn_search_label')}}</el-button>
      <el-button slot="append" icon="el-icon-circle-plus-outline" v-if="is_add === 'add'" class="search-btn" @click="addMemberGroup">{{$t('member.fc_member_group_my_btn_add_label')}}</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Search',
  props: {
    add: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      input5: '',
      is_add: false
    }
  },
  created() {
    this.is_add = this.add
  },
  methods: {
    addMemberGroup() {
      this.$router.push('/member/member-group/add')
    },
    clickSearch() {
      this.$emit('clickSearch', this.input5 && this.input5.trim())
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
    &:focus {
      outline: none;
    }
  }
}
</style>
