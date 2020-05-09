/**
 *  将数据保存为链接, 获取链接数据
 *  2019/12/12
 */
import { str2html, html2Str } from "@/api/oss";
export const handleOssFileHtmlStr = {
  data() {
    return {
      dynamic_fields: null
    };
  },
  methods: {
    handleStr2html(content, pack_html = false) {
      return new Promise((resolve, reject) => {
        str2html(content, pack_html)
          .then(res => {
            resolve(res.return_result.url);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    handleHtml2str(fileUrl) {
      return new Promise((resolve, reject) => {
        html2Str(fileUrl)
          .then(res => {
            resolve(res.return_result.content);
          })
          .catch(error => {
            reject(error);
          });
      });
    }
  }
};
