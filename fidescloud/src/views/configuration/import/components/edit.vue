<template>
  <div class="importEditComponent">
    <div class="stepBox">
      <el-steps :active="active" finish-status="success">
        <el-step title="Input basic info"></el-step>
        <el-step title="Select template"></el-step>
        <el-step title="Select file location"></el-step>
        <el-step title="Set up schedule"></el-step>
        <el-step title="Complete"></el-step>
      </el-steps>
    </div>
    <Step1 v-show="active === 1" :content="fileImportItemValue" @nextStep="nextStep"></Step1>
    <Step2 v-show="active === 2" @back="back" @nextStep="nextStep" :content="fileImportItemValue"></Step2>
    <Step3 v-show="active === 3" @back="back" @nextStep="nextStep" :filePath="fileImportItemValue.file_path" :remoteId="fileImportItemValue.remote_storage_cfg_id" :patternId="fileImportItemValue.file_import_pattern_id"></Step3>
    <Step4 v-show="active === 4" @nextStep="nextStep" :content="fileImportItemValue" @back="back"></Step4>
    <Step5 v-show="active === 5" :patternId="fileImportItemValue.file_import_pattern_id"></Step5>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import Step1 from './step1'
import Step2 from './step2'
import Step3 from './step3'
import Step4 from './step4'
import Step5 from './step5'
export default {
  data() {
    return {
      active: 1
    }
  },
  components: {
    Step1,
    Step2,
    Step3,
    Step4,
    Step5
  },
  computed: {
    ...mapGetters([
      'fileImportItemValue'
    ])
  },
  created() {
    if (!Object.keys(this.fileImportItemValue).length) {
      this.setEditItem(JSON.parse(sessionStorage.getItem('import')))
    }
  },
  methods: {
    ...mapMutations({
      setEditItem: 'SET_EDIT_ITEM'
    }),
    back() {
      this.active--
    },
    nextStep() {
      if (this.active++ > 4) this.active = 1
    }
  }
}
</script>

<style lang="scss" scoped>
.importEditComponent {
  margin: 35px 26px;
  .stepBox {
    margin-bottom: 49px;
    padding-left: 149px;
    padding-right: 149px;
  }
}
</style>
