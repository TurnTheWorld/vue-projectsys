<template>
  <div>
    微信登录<span style="color: #f00;font-size: 18px;" v-if="showError"><{{errorMsg}}></span>
  </div>
</template>

<script>
    export default {
        name: "wx-login",
        data(){
          return {
            errorMsg: '网络错误，请稍后重试！',
            showError: false
          }
        },
        beforeCreate: function(){
          this.$indicator.open('登录中...');
        },
        created:function(){
          // 获取openId,登录操作
          var that = this;
          //var openId = 'testOpenId3';
          // 通过code获取openId
          //var url = 'https://api.weixin.qq.com/sns/oauth2/access_token';
          var openId = this.$route.query.openId;
          if(process.env.NODE_ENV == "development"){
            openId = 'testOpenId3';
          }
          console.log(openId);
          if(!openId){
            this.$indicator.close();
            this.$messagebox({
              title: '提示',
              message: '获取微信授权失败，如果您要访问页面，请给予授权！',
              showCancelButton: false
            }).then(()=>{
              that.errorMsg = '获取微信授权失败，如果您要访问页面，请给予授权！';
              that.showError = true;
            });
            return;
          }
          this.$store.dispatch('updateOpenId', openId)
          // 发起请求
          this.$request({
            url: '/ac/wxLogin',
            data:{
              openId: openId
            }
          }).then((response)=>{
            if(response.data.code == 'user.notBindPhone'){
              this.$router.replace({ name: 'BindPhone', params: { }})

            }else if(response.data.code == 'user.notBindCompany'){
              this.$router.replace({ name: 'BindCompany', params: { }})

            }else if(response.data.code == '0'){
              this.$store.dispatch('updateToken', response.data.data.token);
              var userInfo = {
                userId: response.data.data.userId,
                companyId: response.data.data.companyId,
                companyName: response.data.data.companyName,
                serverUrl: response.data.data.serverUrl,
                fileUrl: response.data.data.fileUrl,
              };
              this.$store.dispatch('updateUserInfo', userInfo);

              this.$router.replace({ name: 'home', params: { }})

            }

          }).catch(()=>{
            that.errMsg = "网络错误，请稍后重试！";
            that.showError = true;
          });

        }
    }
</script>

<style scoped>

</style>
