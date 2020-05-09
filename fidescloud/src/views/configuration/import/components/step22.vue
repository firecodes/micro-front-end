<template>
  <div class="Step22Component" v-if="!inResize">
    <el-table
      v-loading="loading1"
      :data="this.tableData"
      border
      style="width: 100%"
    >
      <el-table-column
        type="index"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column
        prop="field_name"
        label="Source Field"
        width="180">
        <template slot-scope="scope">
          <div>
            <span>{{scope.row.field_name}} </span>
            <el-popover
              placement="bottom"
              width="500"
              trigger="hover">
              <el-row :gutter="20">
                <el-col :xs="24" :sm="12" :md="12" :lg="12">
                  <span>File Name: </span> <span>{{scope.row.field_name}}</span>
                </el-col>
                <el-col :xs="24" :sm="12" :md="6" :lg="6">
                  <span>File Type: </span> <span>{{scope.row.field_type}}</span>
                </el-col>
                <el-col :xs="24" :sm="12" :md="6" :lg="6">
                  <span>File Desc: </span> <span>{{scope.row.field_desc}}</span>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :xs="24" :sm="12" :md="12" :lg="12">
                  <span>Mandatory: </span> <span>{{scope.row.mandatory ? 'Yes' : 'No'}}</span>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="12">
                  <span>Unique Field: </span> <span>{{scope.row.unique ? 'Yes' : 'No'}}</span>
                </el-col>
              </el-row>
              <i v-if="scope.row.addnewfield === false" slot="reference" @click="clickInfo(scope.row)" style="color: rgb(136,136,136);" class="el-icon-info"></i>
            </el-popover>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="mandatory"
        label="Mandatory"
        width="180">
        <template slot-scope="scope">
          <div>
            {{scope.row.mandatory ? 'Yes' : 'No'}}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="field_type"
        label="Source Field Type"
        width="180">
      </el-table-column>
      <el-table-column
        prop="customized_field_name"
        label="Target Field">
        <template slot-scope="scope">
          <div>
            <el-input maxlength="60" @blur="blurTargetField(scope.row.customized_field_name, scope.row.field_id, scope.row.defined, templateId, scope.row.old_customized_field_name)" v-model="scope.row.customized_field_name" placeholder=""></el-input>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        label="Operation"
        width="180">
        <template slot-scope="scope">
          <div>
            <el-switch
              :disabled="scope.row.mandatory ? true : false"
              v-if="scope.row.defined === false"
              v-model="scope.row.status"
              active-color="#13ce66"
              @change="changeSwitch(scope.row.customized_field_name, scope.row.status, scope.row.field_id)"
              inactive-color="#ccc">
            </el-switch>
            <span @click="click(scope.row.field_id, scope.row.field_name)" style="fontSize: 22px;paddingLeft: 10px;" v-if="scope.row.defined === true"><i class="el-icon-delete pointer"></i></span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="addNewFieldBox" @click="handleClickAddField">
      <span>+Add New Field</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    loading1: {
      type: Boolean,
      default: true
    },
    content: {
      type: Array,
      default: []
    },
    templateId: {
      type: Number
    }
  },
  data() {
    return {
      targetFieldInput: '',
      tableData: [],
      popContent: '',
      inResize: true
    }
  },
  methods: {
    blurTargetField(field, id, isNew, templateId, oldField) {
      if (field === oldField) {
        return
      }
      this.loading1 = true
      this.$emit('blurTargetFileld', field, id, isNew, templateId)
    },
    changeSwitch(name, status, id) {
      this.$emit('changeSwitch', name, status, id)
    },
    clickInfo(scope) {
      this.popContent = `<h1>${'world'}</h1>`
    },
    click(id, name) {
      if (name === '-') {
        this.tableData.pop()
        return
      }
      this.$emit('delete', id)
    },
    handleClickAddField() {
      this.tableData.push({
        field_name: '-',
        mandatory: true,
        field_type: 'character',
        customized_field_name: '',
        status: false,
        defined: true,
        addnewfield: true
      })
    }
  },
  watch: {
    content: {
      deep: true,
      immediate: true,
      handler: function(newV, oldV) {
        const arr = JSON.parse(JSON.stringify(newV))
        arr.forEach(element => {
          element['addnewfield'] = false
          element['old_customized_field_name'] = element['customized_field_name']
        })
        this.tableData = [...arr]
        this.inResize = true
        this.$nextTick(() => {
          this.inResize = false
        })
        this.loading1 = false
        return this.tableData
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.Step22Component {
  .pointer {
    cursor: pointer;
  }
  .addNewFieldBox {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 40px;
    background-color: #f4f4f4;
    cursor: pointer;
  }
}
</style>
