<template>
    <div>
      <mt-header fixed title="签订合同">
        <router-link to="/ProOperList" replace slot="left">
          <mt-button class="my-click" icon="back">返回</mt-button>
        </router-link>
      </mt-header>
      <div style="padding-bottom: 30px;">
        <form @submit.prevent="onSubmit">

          <div style="margin-top: 30px;">
            <mt-button type="primary" size="large" @click.native="saveBid">保存</mt-button>
          </div>
        </form>
      </div>
    </div>
</template>

<script>
    export default {
        name: "sign-contract",
        data(){

        },
        methods: {
          downloadFile: function (path) {
            if(path){
              this.$toast('已复制下载地址，请到其它浏览器粘贴打开进行下载！')
            }
          },
          getUriName: function (path) {
            return getUriName(path)
          },
          getExt: function (path) {
            return getExt(path)
          },
          onSubmit:function () {
            return false;
          },
        }
    }
</script>

<style scoped>

</style>
