<template>
  <div class="productDetail">
    <top-btn @handleSave="handleSave"></top-btn>
    <ed-header-title
      :title="$t('configuration.fc_product_details_basic_section_title')"
    ></ed-header-title>
    <el-form
      :model="ruleForm"
      ref="ruleForm"
      label-width="180px"
      class="ruleForm"
      label-position="left"
      v-loading="loading_detail"
    >
      <el-form-item
        :label="$t('configuration.fc_product_details_code_label')"
        class="productCode"
      >
        <span>{{ info.code || "-" }}</span>
      </el-form-item>
      <el-form-item :label="$t('configuration.fc_product_details_name_label')">
        <span>{{ info.name || "-" }}</span>
      </el-form-item>
      <el-form-item
        :label="$t('configuration.fc_product_details_brand_label')"
        class="brandName"
      >
        <span>{{ info.brand_name || "-" }}</span>
      </el-form-item>
      <el-form-item
        :label="$t('configuration.fc_product_details_category_label')"
        class="productCategory"
      >
        <span>{{ info.parent_category_name || "-" }}</span>
      </el-form-item>
      <el-form-item
        :label="$t('configuration.fc_product_details_sub_category_label')"
        class="productCategory"
      >
        <span>{{ info.category_name || "-" }}</span>
      </el-form-item>
      <el-form-item
        :label="$t('configuration.fc_product_details_unit_label')"
        class="productUnit"
      >
        <span>{{
          info.unit
            ? info.unit.split(" ").length >= 2 && info.unit.split(" ")[0]
              ? info.unit.replace(/\s+/gi, "")
              : "-"
            : "-"
        }}</span>
      </el-form-item>
      <el-form-item
        :label="$t('configuration.fc_product_details_market_price_label')"
        class="reatilPrice"
      >
        <span>{{ info.retail_market_price }}</span>
      </el-form-item>
      <el-form-item
        :label="$t('configuration.fc_product_details_purchased_price_label')"
        class="purchasedPrice"
      >
        <span>{{ info.purchased_price }}</span>
      </el-form-item>
      <el-form-item
        :label="$t('configuration.fc_product_details_image_label')"
        class="upload"
        style="padding-bottom: 20px !important;"
      >
        <el-upload
          action=""
          :file-list="fileList"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
    </el-form>
    <ed-header-title
      :title="$t('configuration.fc_product_details_detail_section_title')"
    ></ed-header-title>
    <div
      class="detailbox"
      v-html="info.decode_desc"
      v-loading="loading_detail"
    ></div>
  </div>
</template>

<script>
import TopBtn from "./components/topbtn";
import EdHeaderTitle from "@/components/Ed-header-title/ed-header-title";
import { productDetails } from "./mixins/details";
import { handleOssFileHtmlStr } from "@/views/data/oss-file-html-str";
export default {
  components: {
    TopBtn,
    EdHeaderTitle
  },
  mixins: [productDetails, handleOssFileHtmlStr]
};
</script>

<style lang="scss" scoped>
@import "./styles/details";
</style>
