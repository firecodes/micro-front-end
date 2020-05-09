<template>
  <div class="addProduct" v-loading="loading">
    <top-btn @handleSave="handleClickSave" :saveloading="saveloading"></top-btn>
    <ed-header-title
      :title="$t('configuration.fc_product_add_basic_section_title')"
    ></ed-header-title>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="180px"
      class="ruleForm"
      label-position="left"
    >
      <el-form-item
        :label="$t('configuration.fc_product_add_code_label')"
        prop="code"
        :class="{ disabledInput: ruleForm.checked }"
        class="productCode"
      >
        <el-input
          @input="changeCode"
          :disabled="ruleForm.checked || (this.$route.params.id ? true : false)"
          @keyup.native="
            $event.target.value = $event.target.value.replace(/^\s+|\s+$/gm, '')
          "
          v-model="ruleForm.code"
          :maxlength="50"
          :placeholder="$t('configuration.fc_product_add_code_input_label')"
        ></el-input>
        <el-checkbox
          :disabled="this.$route.params.id ? true : false"
          v-model="ruleForm.checked"
          >{{ $t("configuration.fc_product_add_code_auto_label") }}</el-checkbox
        >
      </el-form-item>
      <el-form-item
        :label="$t('configuration.fc_product_add_name_label')"
        prop="name"
      >
        <el-input
          v-model="ruleForm.name"
          @keyup.native="
            $event.target.value = $event.target.value.replace(/^\s+/gm, '')
          "
          :maxlength="64"
          :placeholder="$t('configuration.fc_product_add_name_input_label')"
        ></el-input>
      </el-form-item>
      <el-form-item
        :label="$t('configuration.fc_product_add_brand_label')"
        prop="brand"
        class="brandName"
      >
        <el-select
          v-model="ruleForm.brand"
          clearable
          filterable
          :placeholder="$t('configuration.fc_product_add_brand_input_label')"
        >
          <el-option
            v-for="item in brandsList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
        <el-button type="primary" @click="handleAddBrand">{{
          $t("configuration.fc_product_add_brand_btn_add_label")
        }}</el-button>
      </el-form-item>
      <el-form-item
        :label="$t('configuration.fc_product_add_category_label')"
        prop="category"
        class="productCategory"
      >
        <el-select
          v-model="ruleForm.category"
          @change="handleChangeCategory"
          clearable
          filterable
          :placeholder="$t('configuration.fc_product_add_category_input_label')"
        >
          <el-option
            v-for="item in categorysList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
        <el-button type="primary" @click="handleAddCategory">{{
          $t("configuration.fc_product_add_category_btn_add_label")
        }}</el-button>
      </el-form-item>
      <el-form-item
        :label="$t('configuration.fc_product_add_sub_category_label')"
        prop="category"
        class="productCategory"
      >
        <el-select
          :disabled="ruleForm.category ? false : 'disabled'"
          v-model="ruleForm.subCategory"
          clearable
          filterable
          :placeholder="
            $t('configuration.fc_product_add_sub_category_input_label')
          "
        >
          <el-option
            v-for="item in subCategorysList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
        <el-button
          :disabled="ruleForm.category ? false : 'disabled'"
          type="primary"
          @click="handleAddSubCategory"
          >{{
            $t("configuration.fc_product_add_sub_category_btn_add_label")
          }}</el-button
        >
      </el-form-item>
      <el-form-item
        :label="$t('configuration.fc_product_add_unit_label')"
        prop="unit"
        class="productUnit"
      >
        <!-- @input="changeUnitPrice('unit') -->
        <el-input
          v-model="ruleForm.unit"
          maxlength="15"
          :placeholder="$t('configuration.fc_product_add_unit_input_label')"
        ></el-input>
        <el-select v-model="ruleForm.unitselect" placeholder="">
          <el-option
            v-for="item in unitlist"
            :key="item.id"
            :label="item.label"
            :value="item.label"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <!-- @input="changeUnitPrice('marketPrice')" -->
      <el-form-item
        :label="$t('configuration.fc_product_add_market_price_label')"
        prop="marketPrice"
        class="reatilPrice"
      >
        <el-input
          maxlength="12"
          v-model="ruleForm.marketPrice"
          :placeholder="
            $t('configuration.fc_product_add_market_price_input_label')
          "
        ></el-input>
        <el-select v-model="ruleForm.retailpriceselect" placeholder="">
          <el-option
            v-for="item in currencyList"
            :key="item.id"
            :label="item.label"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <!-- @input="changeUnitPrice('price')" -->
      <el-form-item
        :label="$t('configuration.fc_product_add_purchased_price_label')"
        prop="price"
        class="purchasedPrice"
      >
        <el-input
          maxlength="12"
          v-model="ruleForm.price"
          :placeholder="
            $t('configuration.fc_product_add_purchased_price_input_label')
          "
        ></el-input>
        <el-select v-model="ruleForm.purpriceselect" placeholder="">
          <el-option
            v-for="item in currencyList"
            :key="item.id"
            :label="item.label"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        :label="$t('configuration.fc_product_add_image_label')"
        prop="image"
        class="upload"
        v-loading="uploadImageLoading"
      >
        <el-upload
          :file-list="fileList"
          :action="upload_img_url"
          list-type="picture-card"
          :http-request="handleHttpRequest"
          :before-upload="beforeAvatarUpload"
          :limit="3"
          :class="computedImageUrl"
          :on-remove="handleRemove"
        >
          <img
            v-if="image_url.length !== 3"
            :src="require('@/assets/images/shape.png')"
            alt=""
          />
          <span v-if="image_url.length !== 3" class="addImages">{{
            $t("configuration.fc_product_add_image_btn_add_label")
          }}</span>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="ruleForm.image" alt="" />
        </el-dialog>
        <p>
          <i class="el-icon-info"></i
          ><span>{{
            $t("configuration.fc_product_add_image_tips_label")
          }}</span>
        </p>
      </el-form-item>
    </el-form>
    <div style="margin-top: 30px"></div>
    <ed-header-title
      :title="$t('configuration.fc_product_add_detail_section_title')"
    ></ed-header-title>
    <editor :value="ruleForm.detailInformation" @show="editors"></editor>
    <add-brand
      :dialog_show="dialog_brand_show"
      @closeAddBrand="closeAddBrand"
      @updateBrandData="updateBrandDatas"
    ></add-brand>
    <add-category
      :dialog_show="dialog_category_show"
      @closeAddCategory="closeAddCategory"
      @updateCategoryData="updateCategoryDatas"
    ></add-category>
    <add-sub-category
      :category_id="dialog_category_id"
      :dialog_show="dialog_sub_category_show"
      @closeAddSubCategory="closeAddSubCategory"
      @updateSubCategoryData="updateSubCategoryDatas"
    ></add-sub-category>
  </div>
</template>

<script>
import TopBtn from "./components/topbtn";
import EdHeaderTitle from "@/components/Ed-header-title/ed-header-title";
import AddBrand from "./components/addbrand";
import AddCategory from "./components/addcategory";
import AddSubCategory from "./components/addsubcategory";
import Editor from "./components/editor";
import { handleOssFileHtmlStr } from "@/views/data/oss-file-html-str";
import { addProduct } from "./mixins/add";
export default {
  components: {
    TopBtn,
    EdHeaderTitle,
    AddBrand,
    AddCategory,
    AddSubCategory,
    Editor
  },
  mixins: [addProduct, handleOssFileHtmlStr],
  data() {
    return {};
  },
  created() {
    this.init();
    this.getCurrency();
  },
  methods: {
    init() {
      // this.getParentCategory()
      this.$route.params.id && this.getProductDetail(+this.$route.params.id);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./styles/addproduct.scss";
</style>
