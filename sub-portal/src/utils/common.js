import globalVue from "../main";
// 数组查询条件
const _listQuery = {
  asc: false, // 排序 false => 倒序
  page_no: 1,
  page_size: 10,
  content: "",
  key: 0
};
const listQuery = {
  asc: _listQuery.asc,
  page_no: _listQuery.page_no,
  page_size: _listQuery.page_size,
  content: _listQuery.content,
  key: _listQuery.key
};

function getTranslateLink(str) {
  return str.slice(str.indexOf("{") + 1, str.indexOf("}"));
}

// 图片上传大小格式限制
function uploadImgRules(file, LtSize = 2) {
  const _LtSize =
    getTranslateLink(
      globalVue.handleGlobalI18n(
        "store",
        "mgt_operation_image_size_notification_label"
      )
    ) || LtSize;
  const isIMG = file.type.slice(0, 5) === "image";
  const isLtSize = file.size / 1024 / 1024 < _LtSize;
  if (!isIMG) {
    globalVue.$message.error(
      globalVue.handleGlobalI18n(
        "store",
        "mgt_operation_image_format_notification_label"
      )
    );
  }
  if (!isLtSize) {
    globalVue.$message.error(
      globalVue
        .handleGlobalI18n(
          "store",
          "mgt_operation_image_size_notification_label"
        )
        .replace("{" + _LtSize + "}", _LtSize)
    );
  }
  return isIMG && isLtSize;
}

function genderFilter(gender) {
  const genderArr = [
    {
      value: 0,
      label: globalVue.handleGlobalI18n(
        "store",
        "mgt_empl_add_gender_unspecified_label"
      )
    },
    {
      value: 1,
      label: globalVue.handleGlobalI18n(
        "store",
        "mgt_empl_add_gender_male_label"
      )
    },
    {
      value: 2,
      label: globalVue.handleGlobalI18n(
        "store",
        "mgt_empl_add_gender_female_label"
      )
    }
  ];
  const item = genderArr.find(item => item.value === gender);
  const _gender = item === undefined ? gender : item.label;
  return _gender;
}

// table list index
function tableListIdx(index, page_no, page_size) {
  return index + 1 + (page_no - 1) * page_size;
}

function getTransfirstLink(str) {
  const arr = str.split("{");
  return arr[0] || "";
}

function getTransMiddleLink(str) {
  const arr = str.split("}");
  let tmp = "";
  if (arr.length > 2) {
    tmp = arr[1].substr(1, 4) || "";
  } else {
    tmp = arr[1] || "";
  }
  return tmp;
}

/* 不能为空 不能全部是空格*/
function validatIsNull(str) {
  const reg = /^[\s]*$/;
  return reg.test(str) || str === "" || str === null;
}

export default {
  listQuery,
  tableListIdx,
  getTranslateLink,
  uploadImgRules,
  genderFilter,
  getTransfirstLink,
  getTransMiddleLink,
  validatIsNull
};
