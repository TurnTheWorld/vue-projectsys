<template>
 <div class="myuploader">
  <div class="myuploader-title">
    <span>{{title}}</span>
  </div>
   <div class="myuploader-value">
     <!-- 给这个input 设置样式隐藏，切忌不可用display控制隐藏,可能不能跨浏览器 -->
     <input type="file" id="file" @change="handleFileChange"
            style="filter:alpha(opacity=0);opacity:0;width: 0;height: 0;" :ref="fref"/>
     <mt-button type="primary" size="small" @click.native="openSelectFile">选择文件</mt-button>
   </div>
 </div>
</template>

<script>
    export default {
        name: "uploader-input",
        components: {

        },
        data(){
          return {
            fref: '',
            file: undefined,
            maxFileSize: 1024 * 10,
            fileName: undefined,
            errText: '',
            result: '',
            loadingText: ''
          }
        },
        props: {
          title: {
            type: String,
            required: false,
            default(){
              return ''
            }
          }
        },
        methods:{
          handleFileChange : function (e) {
            let inputDOM = this.$refs[this.fref];
            // 通过DOM取文件数据
            let file = undefined;
            if(inputDOM.files){
              file = inputDOM.files[0];
            }
            if(!file){
              return;
            }
            this.errText = '';

            let size = Math.floor(file.size / 1024);
            if (size > this.maxFileSize) {
              // 这里可以加个文件大小控制
              this.$toast('文件大小不能超过10兆');
              return false
            }

            // 判断手否要进行压缩
            var that = this;
            if (file && window.FileReader && /^image/.test(file.type) && size > 1024){
              this.photoCompress(file, {
                quality: 0.2
              }, function (base64Codes) {
                that.$indicator.close();
                var bl = that.convertBase64UrlToBlob(base64Codes);
                // 上传blob
                that.uploadFile(bl, 'blob', file.name);
              })

            }else{
              // 直接上传
              this.uploadFile(file, 'f', file.name);
            }

            // 触发这个组件对象的input事件
            //this.$emit('input', this.file);

            // 这里就可以获取到文件的名字了
            //this.fileName = file.name;

            // 这里加个回调也是可以的
            //this.onChange && this.onChange(file, inputDOM.value);
          },
          openSelectFile: function () {
            this.$refs[this.fref].click()
          },
          gengerateRef () {
            return Math.random().toString(36).substring(3, 8);
          },
          uploadFile: function (file, type, fileName) {
            this.loadingText = '文件上传中...';
            var that = this;
            that.$indicator.open({
              text: that.loadingText,
            });
            var formData = new FormData();
            formData.append('token', this.$store.getters.token);

            if(type =='blob'){
              formData.append('file', file, fileName);
            }else{
              formData.append('file', file);
            }
            this.$request({
              url: '/file/uploadFile',
              data: formData,
              isFile: true,
              hideLoading: true,
              onUploadProgress(progressEvent){
                if (progressEvent.lengthComputable) {
                  //let val = (progressEvent.loaded / progressEvent.total * 100).toFixed(0);
                }
              }
            }).then((reponse) => {
              that.$indicator.close();
              var d = reponse.data;
              if(d.code != '0'){
                that.$messagebox('提示', d.msg);
                return;
              }
              that.$toast("文件上传成功");
              // tod 返回成功事件给调用处
              that.$emit('uploadSuccess', d);

            });
          },
          /*
          三个参数
          file：一个是文件(类型是图片格式)，
          w：一个是文件压缩的后宽度，宽度越小，字节越小
          objDiv：一个是容器或者回调函数
          photoCompress()
         */
          photoCompress: function (file,w,callback){
            this.$indicator.open("正在压缩图片...")
            var ready = new FileReader();
            /*开始读取指定的Blob对象或File对象中的内容. 当读取操作完成时,readyState属性的值会成为DONE
            ,如果设置了onloadend事件处理程序,则调用之.同时,result属性中将包含一个data: URL格式的字符串以表示所读取文件的内容.*/
            ready.readAsDataURL(file);
            var that = this;
            ready.onload = function(){
              var re = this.result;
              that.canvasDataURL(re,w,callback)
            }
          },
          canvasDataURL: function(path, obj, callback){
            var img = new Image();
            img.src = path;
            img.onload = function(){
              var that = this;
              // 默认按比例压缩
              var w = that.width,
                h = that.height,
                scale = w / h;
              w = obj.width || w;
              h = obj.height || (w / scale);
              var quality = 0.7;  // 默认图片质量为0.7
              //生成canvas
              var canvas = document.createElement('canvas');
              var ctx = canvas.getContext('2d');
              // 创建属性节点
              var anw = document.createAttribute("width");
              anw.nodeValue = w;
              var anh = document.createAttribute("height");
              anh.nodeValue = h;
              canvas.setAttributeNode(anw);
              canvas.setAttributeNode(anh);
              ctx.drawImage(that, 0, 0, w, h);
              // 图像质量
              if(obj.quality && obj.quality <= 1 && obj.quality > 0){
                quality = obj.quality;
              }
              // quality值越小，所绘制出的图像越模糊
              var base64 = canvas.toDataURL('image/jpeg', quality);
              // 回调函数返回base64的值
              callback(base64);
            }
          },
          /**
           * 将以base64的图片url数据转换为Blob
           * @param urlData
           *            用url方式表示的base64图片数据
           */
          convertBase64UrlToBlob: function (urlData){
            var arr = urlData.split(','), mime = arr[0].match(/:(.*?);/)[1],
              bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
            while(n--){
              u8arr[n] = bstr.charCodeAt(n);
            }
            return new Blob([u8arr], {type:mime});
          }

        },
        created: function () {
          this.fref = this.gengerateRef();
        }

    }
</script>

<style scoped>
  .myuploader{
    background-color: #fff;
    height: 48px;
    padding: 0 10px;
    line-height: 48px;
    border-bottom: 1px dashed #eee;
  }
  .myuploader-title{
    width: 120px;
    display: inline-block;
  }
  .myuploader-value{
    display: inline-block;
    text-align: right;
    width: 60%;
    float: right;
  }
</style>
