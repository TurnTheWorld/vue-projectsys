<template>
    <div>
      <mt-header fixed title="通知消息详情">
        <router-link :to="back ? back : '/home'" replace slot="left">
          <mt-button class="my-click" icon="back">返回</mt-button>
        </router-link>
      </mt-header>
      <div class="notice-detail-container">
        <h5 class="notice-title bb">{{notice.title}}</h5>
        <p class="notice-content">
          {{notice.content}}
        </p>
        <p>
          <span class="notice-date"><i class="iconfont icon-time"></i>{{notice.sendTime}}</span>
          <span class="notice-date" style="margin-left: 10px;"><i class="iconfont icon-brush"></i>{{notice.sendUserName}}</span>
        </p>
      </div>
    </div>
</template>

<script>
    export default {
        name: "notice-detail",
        data(){
          return {
            back: this.$route.params.back,
            notice: {
              noticeId:'',
              title:'',
              content:'',
              sendTime:'',
              sendUserName: ''
            }
          }
        },
        mounted: function () {
          var notcieId = this.$route.params.noticeId;
          var that = this;
          if(notcieId){
            // 获取通知详情
            this.$request({
              url: '/notice/getNotice',
              data: {id: notcieId}
            }).then((reponse) => {
              if(reponse.data.code == '0'){
                that.notice = reponse.data.data;
              }
            });

          }
        }
    }
</script>

<style scoped>
  .notice-detail-container p{
    text-align: left;
  }
  .notice-title{
    font-size: 18px;
    padding-bottom: 5px;
  }
  .notice-content{
    min-height: 100px;
    text-indent: 2em;
    line-height: 26px;
  }
  .notice-detail-container{
    background-color: #fff;
    padding: 10px 5px;
  }
</style>
