<template>
  <div class="editorComp">
    <textarea :id="id" :value="value"></textarea>
  </div>
</template>
<script>
import tinymce from "tinymce/tinymce";
import { uploadImage } from "@/api/master";
import { projectName } from "@/api/api";
import "tinymce/themes/modern/theme";
import "tinymce/plugins/advlist";
import "tinymce/plugins/autolink";
import "tinymce/plugins/image";
import "tinymce/plugins/imagetools";
import "tinymce/plugins/wordcount"; // 字数统计插件
// import 'tinymce/plugins/emoticons'// 表情插件
import "tinymce/plugins/fullscreen"; // 全屏插件
import "tinymce/plugins/help"; // 帮助插件
import "tinymce/plugins/insertdatetime"; // 插入日期时间
import "tinymce/plugins/preview"; // 预览插件
import "tinymce/plugins/link"; // 超链接
import "tinymce/plugins/table"; // 表格插件
import { mapGetters } from "vuex";
const INIT = 0;
const CHANGED = 2;
// var EDITOR = null
export default {
  props: {
    value: {
      type: String,
      editor: null,
      required: true
    },
    setting: {},
    url: {
      // 接口
      default: "",
      type: String
    },
    accept: {
      // 文件类型
      default: "image/jpeg, image/png",
      type: String
    },
    maxSize: {
      // 大小
      default: 20971520,
      type: Number
    },
    withCredentials: {
      default: false,
      type: Boolean
    },
    reserved_field: {
      type: String,
      default: ""
    }
  },
  watch: {
    value: function(val) {
      if (this.status === INIT || tinymce.activeEditor.getContent() !== val) {
        tinymce.activeEditor.setContent(val);
      }
      this.status = CHANGED;
    },
    reserved_field() {
      tinymce.execCommand(
        "mceInsertContent",
        false,
        `{${this.reserved_field}}`
      );
    },
    language() {
      tinymce.get(this.id).destroy();
      this.init();
    }
  },
  computed: {
    ...mapGetters(["language"])
  },
  data() {
    return {
      status: INIT,
      id: "editor-" + new Date().getMilliseconds(),
      setting1: null
    };
  },
  methods: {
    init() {
      const _this = this;
      const setting = {
        selector: "#" + _this.id,
        branding: false,
        language: _this.language.indexOf("en") > -1 ? "en_GB" : "zh_CN",
        insert_button_items: "image link | inserttable",
        paste_retain_style_properties: "all",
        paste_word_valid_elements: "*[*]", // word需要它
        paste_data_images: true, // 粘贴的同时能把内容里的图片自动上传，非常强力的功能
        paste_convert_word_fake_lists: true, // 插入word文档需要该属性
        paste_webkit_styles: "all",
        visual: false,
        relative_urls: false,
        remove_script_host: false,
        paste_merge_formats: true,
        nonbreaking_force_tab: false,
        paste_auto_cleanup_on_paste: false,
        init_instance_callback: function(editor) {
          editor.on("input change undo redo", () => {
            var content = editor.getContent();
            _this.$emit("show", content);
          });
        },
        // toolbar: 'undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | outdent indent', emoticons
        plugins: [
          "image",
          "autolink",
          "fullscreen",
          "help",
          "insertdatetime",
          "preview",
          "link",
          "table"
        ],
        toolbar: [
          "table | undo redo | formatselect | link unlink | uploadimg image media | indent",
          "fontsizeselect | fontselect | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | outdent indent | help | insertdatetime | preview | fullscreen"
        ],
        // insertdatetime_formats: ['%H点%M分', '%Y年%m月%d日'],
        fontsize_formats: "12px 13px 14px 16px 18px 20px 28px 36px 48px 72px",
        // 菜单栏 edit
        // menubar: 'file help',
        menubar: "",
        images_upload_handler: function(blobInfo, success, failure) {
          if (_this.accept.indexOf(blobInfo.blob().type) >= 0) {
            uploadPic();
          } else {
            failure("Picture format error");
          }
          function uploadPic() {
            // 发送请求
            var formData = new FormData();
            formData.append("file", blobInfo.blob());
            formData.append("oldUrl", "");
            formData.append("project", projectName);
            formData.append("module", "campaign");
            uploadImage(formData)
              .then(res => {
                failure("Upload---" + res.return_code);
                if (res.return_code !== "2000") {
                  _this.$emit("on-upload-fail"); // 抛出 'on-upload-fail' 钩子
                  failure("fail to upload: " + res.return_code);
                  return;
                }
                const json = res.return_result.url[0];
                _this.$emit("on-upload-success", json); // 抛出 'on-upload-success' 钩子
                tinymce.execCommand(
                  "mceInsertContent",
                  false,
                  "<img src=" + json + ">"
                );
              })
              .catch(() => {
                _this.$message.error("fail to upload");
                _this.$emit("on-ready", "fail to upload");
              });
          }
        }
      };
      Object.assign(setting, _this.setting);
      this.setting1 = setting;
      tinymce.init(setting);
    }
  },
  mounted() {
    this.init();
  },
  beforeDestroy: function() {
    tinymce.get(this.id).destroy();
  }
};
</script>
<style lang="scss" scoped>
.editorComp {
  /deep/ .mce-first .mce-container-body {
    border-bottom: 1px solid #e2e4e7 !important;
  }
  /deep/
    .mce-container-body
    .mce-panel
    .mce-stack-layout
    .mce-last
    .mce-container-body {
    border-bottom: none !important;
  }
}
</style>
