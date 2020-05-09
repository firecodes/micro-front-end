<template>
  <div class="add-category">
    <el-dialog
      :title="$t('configuration.fc_product_add_sub_category_title')"
      :visible.sync="dialog_show"
      width="700px"
      :before-close="handleCloseSub"
    >
      <el-table
        :data="subCategoryList"
        border
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column
          prop="name"
          :label="
            $t('configuration.fc_product_add_sub_category_table_category_label')
          "
        >
          <template slot-scope="scope">
            <template v-if="scope.row.type === 'addOrEdit'">
              <div class="add">
                <el-input
                  ref="inpt"
                  :placeholder="
                    $t('configuration.fc_product_add_category_add_input_label')
                  "
                  maxlength="32"
                  v-model="subCategoryList[scope.$index].name"
                  @keyup.native="
                    $event.target.value = $event.target.value.replace(
                      /^\s+/gm,
                      ''
                    )
                  "
                />
                <label
                  class="cancel"
                  @click="cancelAddSubCategory(scope.$index, scope.row)"
                  >{{
                    $t("configuration.fc_product_add_category_btn_cancel_label")
                  }}</label
                >
              </div>
            </template>
            <template v-else>
              {{ scope.row.name }}
            </template>
          </template>
        </el-table-column>
        <el-table-column
          prop="operation"
          :label="
            $t(
              'configuration.fc_product_add_sub_category_table_operation_label'
            )
          "
          width="200px"
        >
          <template slot-scope="scope">
            <template v-if="scope.row.type === 'addOrEdit'">
              <label
                @click.stop="saveSubCategory(scope.row, scope.$index)"
                class="ok"
                >{{
                  $t("configuration.fc_product_add_category_btn_ok_label")
                }}</label
              >
            </template>
            <template v-else>
              <div class="operation">
                <label
                  @click.stop="editSubCategory(scope.$index, scope.row)"
                  class="edit"
                  >{{
                    $t("configuration.fc_product_add_category_btn_edit_label")
                  }}</label
                >
                <label
                  @click.stop="deleteSubCategory(scope.$index, scope.row.id)"
                  class="delete"
                  >{{
                    $t("configuration.fc_product_add_category_btn_delete_label")
                  }}</label
                >
              </div>
            </template>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="listQuery.page_no"
          :page-sizes="[10, 20, 30, 40, 50]"
          :page-size="listQuery.page_size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totals"
        >
        </el-pagination>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCloseSub" class="close">{{
          $t("configuration.fc_product_add_category_popup_btn_close_label")
        }}</el-button>
        <el-button type="primary" @click="addSubCategory" class="add-button">{{
          $t("configuration.fc_product_add_category_popup_btn_add_label")
        }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { addSubCategory } from "../../mixins/addSubCategory";
import { GlobalMixin } from "@/utils/mixin";
export default {
  props: {
    dialog_show: {
      type: Boolean,
      default: false
    },
    category_id: [Number, String]
  },
  mixins: [GlobalMixin, addSubCategory],
  watch: {
    dialog_show: {
      immediate: true,
      handler: function() {
        this.init();
      }
    }
  },
  methods: {
    init() {
      if (this.category_id) {
        this.listQuery.category_parent_id = this.category_id;
        this.getSubCategorylists();
      }
    }
  }
};
</script>
<style scoped rel="stylesheet/scss" lang="scss">
.add-category {
  .search {
    display: flex;
    margin: -10px 0 20px 0;
    .el-input {
      margin-right: 20px;
      width: 280px;
    }
  }
  .el-button {
    min-width: 80px;
  }
  .add {
    display: flex;
    align-items: center;
    .el-input {
      margin-right: 20px;
    }
  }
  .edit,
  .cancel,
  .ok,
  .delete {
    width: 80px;
    height: 30px;
    background: rgba(74, 144, 226, 0.07);
    border-radius: 4px;
    cursor: pointer;
    color: $new-primary;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .close {
    border-color: $new-primary;
    color: $new-primary;
  }
  .add-button,
  .search-button {
    background-color: $new-primary;
    border-color: $new-primary;
  }
  .operation {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    font-weight: bold;
    line-height: 17px;
    align-items: center;
  }
  .el-pagination {
    padding: 20px;
    text-align: center;
    background-color: #fff;
  }
}
</style>
