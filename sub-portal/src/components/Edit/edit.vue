<template>
  <textarea :id="id" :value="value"></textarea>
</template>
<script>
import { projectName } from "@/api/api";
import { uploadImage } from "@/api/master";
import tinymce from "tinymce/tinymce";
import "tinymce/themes/modern/theme";
import "tinymce/plugins/advlist";
import "tinymce/plugins/autolink";
import "tinymce/plugins/autoresize";
import "tinymce/plugins/autosave";
import "tinymce/plugins/bbcode";
import "tinymce/plugins/charmap";
import "tinymce/plugins/code";
import "tinymce/plugins/codesample";
import "tinymce/plugins/colorpicker";
import "tinymce/plugins/contextmenu";
import "tinymce/plugins/directionality";
import "tinymce/plugins/emoticons";
import "tinymce/plugins/fullpage";
import "tinymce/plugins/fullscreen";
import "tinymce/plugins/help";
import "tinymce/plugins/hr";
import "tinymce/plugins/image";
import "tinymce/plugins/imagetools";
import "tinymce/plugins/importcss";
import "tinymce/plugins/insertdatetime";
import "tinymce/plugins/legacyoutput";
import "tinymce/plugins/link";
import "tinymce/plugins/lists";
import "tinymce/plugins/media";
import "tinymce/plugins/nonbreaking";
import "tinymce/plugins/noneditable";
import "tinymce/plugins/paste";
import "tinymce/plugins/table";
import "tinymce/plugins/textcolor";
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
  computed: {
    ...mapGetters(["language"])
  },
  watch: {
    language() {
      tinymce.get(this.id).destroy();
      this.init();
    },
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
    }
  },
  data() {
    return {
      status: INIT,
      id: "editor-" + new Date().getMilliseconds(),
      setting1: null
    };
  },
  methods: {
    handlePreview() {
      const w = window.open("about:blank");
      w.document.write(this.value);
      w.document.close();
      // tinymce.activeEditor.execCommand('mcePreview')
    },
    init() {
      const _this = this;
      const setting = {
        selector: "#" + _this.id,
        language: _this.language.indexOf("en") > -1 ? "en_GB" : "zh_CN",
        entity_encoding: "xml",
        branding: false, // 是否禁用“Powered by TinyMCE”
        init_instance_callback: function(editor) {
          // EDITOR = editor
          // console.log('Editor: ' + editor.id + ' is now initialized.')
          editor.on("input change undo redo", () => {
            var content = editor.getContent();
            _this.$emit("show", content);
          });
        },
        // custom toolbar preview
        setup: function(editor) {
          editor.addButton("custom-preview", {
            text: "Preview",
            icon: false,
            onclick: function() {
              _this.handlePreview();
            }
          });
        },
        content_style: `
            *                         { padding:0; margin:0; }
            html, body                { height:100%; }
            img                       { max-width:100%; display:block;height:auto; }
            a                         { text-decoration: none; }
            iframe                    { width: 100%; }
            p                         { line-height:1.6; margin: 0px; }
            table                     { word-wrap:break-word; word-break:break-all; max-width:100%; border:none; border-color:#999; }
            .mce-object-iframe        { width:100%; box-sizing:border-box; margin:0; padding:0; }
            ul,ol                     { list-style-position:inside; }
          `,
        insert_button_items: "image link | inserttable",
        paste_retain_style_properties: "all",
        paste_word_valid_elements: "*[*]", // word需要它
        paste_data_images: false, // 粘贴的同时能把内容里的图片自动上传，非常强力的功能
        paste_convert_word_fake_lists: true, // 插入word文档需要该属性
        paste_webkit_styles: "all",
        visual: false,
        relative_urls: false,
        remove_script_host: false,
        paste_merge_formats: true,
        nonbreaking_force_tab: false,
        paste_auto_cleanup_on_paste: false,
        contextmenu: "bold italic underline strikethrough ",
        plugins: [
          "advlist link image  autolink contextmenu emoticons fullscreen help insertdatetime",
          "code",
          "table textcolor paste"
        ], // 配置
        toolbar_items_size: "small",
        block_formats:
          "Paragraph=p;Heading 1=h1;Heading 2=h2;Heading 3=h3;Heading 4=h4;Heading 5=h5;Heading 6=h6;",
        toolbar1:
          "table |insertfile undo redo | formatselect | link unlink | uploadimg image media", // 工具栏1
        toolbar2:
          " fontsizeselect | forecolor backcolor | fontselect bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | outdent indent | removeformat emoticons fullscreen help insertdatetime custom-preview", // 工具栏2
        // 图片上传
        images_upload_handler: function(blobInfo, success, failure) {
          // failure(blobInfo)
          // _this.$emit('on-ready', blobInfo.blob().size, blobInfo.blob())
          // if (blobInfo.blob().size > _this.maxSize) {
          //   failure('文件体积过大')
          // }
          if (_this.accept.indexOf(blobInfo.blob().type) >= 0) {
            uploadPic();
          } else {
            // failure('Picture format error')
            _this.$message.error("Picture format error");
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
                // failure()
                failure("Upload success");
                if (res.return_code !== "2000") {
                  // 抛出 'on-upload-fail' 钩子
                  _this.$emit("on-upload-fail");
                  failure("fail to upload");
                  return;
                }
                const json = res.return_result.url[0];
                // 抛出 'on-upload-success' 钩子
                _this.$emit("on-upload-success", json);
                tinymce.execCommand(
                  "mceInsertContent",
                  false,
                  "<img src=" + json + ">"
                );
              })
              .catch(() => {
                failure("fail to upload");
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
