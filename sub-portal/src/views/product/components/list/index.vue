<template>
  <div class="list">
    <ed-table>
      <el-table v-loading="loadingTable" :data="tableData" style="width: 100%">
        <el-table-column
          prop="code"
          :label="$t('configuration.fc_product_table_code_label')"
          align="center"
        >
          <template slot-scope="scope">
            <ed-clamp :max-lines="1" autoresize>{{
              scope.row.code || "-"
            }}</ed-clamp>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          :label="$t('configuration.fc_product_table_name_label')"
          align="center"
        >
          <template slot-scope="scope">
            <ed-clamp :max-lines="1" autoresize>{{
              scope.row.name || "-"
            }}</ed-clamp>
          </template>
        </el-table-column>
        <el-table-column
          prop="category"
          :label="$t('configuration.fc_product_table_category_label')"
          align="center"
        >
          <template slot-scope="scope">
            <ed-clamp :max-lines="1" autoresize>{{
              scope.row.parent_category || "-"
            }}</ed-clamp>
          </template>
        </el-table-column>
        <el-table-column
          prop="category"
          :label="$t('configuration.fc_product_table_sub_category_label')"
          align="center"
        >
          <template slot-scope="scope">
            <ed-clamp :max-lines="1" autoresize>{{
              scope.row.category || "-"
            }}</ed-clamp>
          </template>
        </el-table-column>
        <el-table-column
          prop="unit"
          :label="$t('configuration.fc_product_table_unit_label')"
          align="center"
        >
          <template slot-scope="scope">
            <ed-clamp :max-lines="1" autoresize>{{
              scope.row.unit
                ? scope.row.unit.split(" ").length >= 2 &&
                  scope.row.unit.split(" ")[0]
                  ? scope.row.unit.replace(/\s+/gi, "")
                  : "-"
                : "-"
            }}</ed-clamp>
          </template>
        </el-table-column>
        <el-table-column
          prop="brand"
          :label="$t('configuration.fc_product_table_brand_label')"
          align="center"
        >
          <template slot-scope="scope">
            <ed-clamp :max-lines="1" autoresize>{{
              scope.row.brand || "-"
            }}</ed-clamp>
          </template>
        </el-table-column>
        <el-table-column
          prop="retail_market_price"
          :label="$t('configuration.fc_product_table_market_price_label')"
          align="center"
        >
          <template slot-scope="scope">
            <ed-clamp :max-lines="1" autoresize>{{
              scope.row.retail_market_price
            }}</ed-clamp>
          </template>
        </el-table-column>
        <el-table-column
          prop="purchased_price"
          :label="$t('configuration.fc_product_table_purchased_price_label')"
          align="center"
        >
          <template slot-scope="scope">
            <ed-clamp :max-lines="1" autoresize>{{
              scope.row.purchased_price === ""
            }}</ed-clamp>
          </template>
        </el-table-column>
        <el-table-column
          prop="operation"
          :label="$t('configuration.fc_product_table_operation_label')"
          width="260px"
          align="center"
        >
          <template slot-scope="scope">
            <operation-btn
              ><router-link :to="`/product/details/${scope.row.id}`">{{
                $t("loyalty.fc_operation_btn_details_label")
              }}</router-link></operation-btn
            >
            <!-- <operation-btn
              ><router-link
                :to="`/configuration/product/edit/${scope.row.id}`"
                >{{ $t("loyalty.fc_operation_btn_edit_label") }}</router-link
              ></operation-btn
            > -->
            <operation-btn @click="handleDelete(scope.row.id)">{{
              $t("loyalty.fc_operation_btn_delete_label")
            }}</operation-btn>
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
          :total="total"
        >
        </el-pagination>
      </div>
    </ed-table>
  </div>
</template>

<script>
import EdTable from "@/components/Ed-table/ed-table";
import OperationBtn from "../rowbtn/index";
export default {
  components: {
    EdTable,
    OperationBtn
  },
  props: {
    content: {
      type: Array,
      default: () => []
    },
    listQuery: {
      type: Object,
      default: () => {}
    },
    count: {
      type: [Number, String]
    },
    loadingTable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      total: 1,
      tableData: []
    };
  },
  watch: {
    content: {
      deep: true,
      handler: function() {
        this.init();
      }
    }
  },
  methods: {
    init() {
      this.tableData = this.content;
      this.total = this.count;
    },
    handleSizeChange(val) {
      this.$emit("handleSizeChange", val);
    },
    handleCurrentChange(val) {
      this.$emit("handleCurrentChange", val);
    },
    handleDelete(id) {
      this.$emit("handleDelete", id);
    }
  }
};
</script>

<style lang="scss" scoped>
.list {
  padding-top: 20px;
  .el-pagination {
    padding: 20px;
    text-align: center;
    background-color: #fff;
  }
}
</style>
