<template>
  <textarea :id="id" :value="value"></textarea>
</template>
<script>
  import { projectName } from '@/api/api'
  import { uploadImage } from '@/api/master'
  import tinymce from 'tinymce/tinymce'
  import 'tinymce/themes/modern/theme'
  import 'tinymce/plugins/advlist'
  import 'tinymce/plugins/autolink'
  import 'tinymce/plugins/image'
  import 'tinymce/plugins/imagetools'
  import 'tinymce/plugins/wordcount'// 字数统计插件
  import { mapGetters } from 'vuex'
  const INIT = 0
  const CHANGED = 2
  // var EDITOR = null
  export default {
    props: {
      value: {
        type: String,
        editor: null,
        required: true
      },
      setting: {},
      url: { // 接口
        default: '',
        type: String
      },
      accept: { // 文件类型
        default: 'image/jpeg, image/png',
        type: String
      },
      maxSize: { // 大小
        default: 20971520,
        type: Number
      },
      withCredentials: {
        default: false,
        type: Boolean
      },
      reserved_field: {
        type: String,
        default: ''
      }
    },
    computed: {
      ...mapGetters([
        'language'
      ])
    },
    watch: {
      language() {
        tinymce.get(this.id).destroy()
        this.init()
      },
      value: function(val) {
        if (this.status === INIT || tinymce.activeEditor.getContent() !== val) {
          tinymce.activeEditor.setContent(val)
        }
        this.status = CHANGED
      },
      reserved_field() {
        tinymce.execCommand('mceInsertContent', false, `{${this.reserved_field}}`)
      }
    },
    data() {
      return {
        status: INIT,
        id: 'editor-' + new Date().getMilliseconds(),
        setting1: null
      }
    },
    methods: {
      // handlePreview() {
      //   const w = window.open('about:blank')
      //   w.document.write(this.value)
      //   w.document.close()
      //   // tinymce.activeEditor.execCommand('mcePreview')
      // },
      init() {
        const _this = this
        const setting =
          {
            selector: '#' + _this.id,
            language: _this.language.indexOf('en') > -1 ? 'en_GB' : 'zh_CN',
            entity_encoding: 'xml',
            init_instance_callback: function(editor) {
              // EDITOR = editor
              // console.log('Editor: ' + editor.id + ' is now initialized.')
              editor.on('input change undo redo', () => {
                var content = editor.getContent()
                _this.$emit('show', content)
              })
            },
            branding: false, // 是否禁用“Powered by TinyMCE”
            menubar: false, // 隐藏最上方menu菜单
            // custom toolbar preview
            setup: function(editor) {
              // editor.addButton('custom-preview', {
              //   text: 'Preview',
              //   icon: false,
              //   onclick: function() {
              //     _this.handlePreview()
              //   }
              // })
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
            paste_retain_style_properties: 'all',
            paste_word_valid_elements: '*[*]', // word需要它
            paste_data_images: true, // 粘贴的同时能把内容里的图片自动上传，非常强力的功能
            paste_convert_word_fake_lists: true, // 插入word文档需要该属性
            paste_webkit_styles: 'all',
            visual: false,
            relative_urls: false,
            remove_script_host: false,
            paste_merge_formats: true,
            nonbreaking_force_tab: false,
            paste_auto_cleanup_on_paste: false,
            'plugins': [
              'advlist image  autolink wordcount'
            ], // 配置
            'toolbar_items_size': 'small',
            'block_formats': 'Paragraph=p;Heading 1=h1;Heading 2=h2;Heading 3=h3;Heading 4=h4;Heading 5=h5;Heading 6=h6;',
            'toolbar1': 'uploadimg image media | bold italic underline | alignleft aligncenter alignright alignjustify', // 工具栏2
            // 图片上传
            images_upload_handler: function(blobInfo, success, failure) {
              if (_this.accept.indexOf(blobInfo.blob().type) >= 0) {
                uploadPic()
              } else {
                failure('图片格式错误')
              }
              function uploadPic() { // 发送请求
                // const xhr = new XMLHttpRequest()
                // const formData = new FormData()
                // xhr.withCredentials = _this.withCredentials
                // xhr.open('POST', _this.url)
                // xhr.onload = function() {
                //   failure('上传---' + xhr.status)
                //   if (xhr.status !== 200) {
                //     // 抛出 'on-upload-fail' 钩子
                //     _this.$emit('on-upload-fail')
                //     failure('上传失败: ' + xhr.status)
                //     return
                //   }
                //   const json = JSON.parse(xhr.responseText)
                //   // 抛出 'on-upload-success' 钩子
                //   _this.$emit('on-upload-success', [
                //     json, success, failure
                //   ])
                // }
                // xhr.onerror = function() {
                //   _this.$emit('on-ready', '上传失败')
                // }
                // formData.append('file', blobInfo.blob())
                // xhr.send(formData)

                var formData = new FormData()
                formData.append('file', blobInfo.blob())
                formData.append('oldUrl', '')
                formData.append('project', projectName)
                formData.append('module', 'campaign')
                uploadImage(formData).then(res => {
                  failure('Upload---' + res.return_code)
                  if (res.return_code !== '2000') {
                    // 抛出 'on-upload-fail' 钩子
                    _this.$emit('on-upload-fail')
                    failure('fail to upload: ' + res.return_code)
                    return
                  }
                  const json = res.return_result.url[0]
                  // 抛出 'on-upload-success' 钩子
                  _this.$emit('on-upload-success', json)
                  tinymce.execCommand('mceInsertContent', false, '<img style="width: 100%" src=' + json + '>')
                }).catch(() => {
                  _this.$message.error('fail to upload')
                  _this.$emit('on-ready', 'fail to upload')
                })
              }
            }
          }
        Object.assign(setting, _this.setting)
        this.setting1 = setting
        tinymce.init(setting)
      }
    },
    mounted() {
      this.init()
    },
    beforeDestroy: function() {
      tinymce.get(this.id).destroy()
    }
  }
</script>

