<template>
    <div>
      <mt-header fixed title="通知消息">
        <router-link to="/home" slot="left">
          <mt-button class="my-click" icon="back">返回</mt-button>
        </router-link>
      </mt-header>
      <div v-if="noticeList.length == 0" class="noNoticeTips">
        <p>
          <i class="iconfont icon-publishgoods_fill"></i>
        </p>
        <p>
          没有任何消息！
        </p>
      </div>
      <div class="me-top-container">
        <ul
          v-infinite-scroll="loadMoreNotice"
          infinite-scroll-disabled="loading"
          infinite-scroll-distance="10"
          class="pro-list-ul">
          <li v-for="n in noticeList" class="notice-item">
            <div @click="noticeDetail(n)">
              <h5 class="notice-title">{{n.title}}<span v-if="!n.read" class="unRead" style="right: 16px;top: 25px;"></span></h5>
              <p class="notice-content">
                {{n.content}}
              </p>
              <p style="position: relative;">
                <span class="notice-date"><i class="iconfont icon-time"></i>{{n.sendTime}}</span>
                <span class="notice-enter"><i class="iconfont icon-enter"></i></span>
              </p>
            </div>
          </li>
        </ul>
      </div>
    </div>
</template>

<script>
    export default {
        name: "notice-list",
        data(){
          return {
            noticeList:[],
            loading: false,
            page: 1,
            limit: 15
          }
        },
        methods: {
          loadMoreNotice() {
            this.loading = true;
            this.showLoading = true;
            var that = this;
            this.$request({
              url: '/notice/getNotices',
              data: {page: this.page, limit: this.limit, notice: 'recv'},
            }).then((reponse) => {
              if(reponse.data.code == '0'){
                var d = reponse.data.data;
                var count = reponse.data.count;
                for(var i in d){
                  that.noticeList.push(d[i]);
                }
                if(that.limit * that.page < count){
                  this.loading = false;
                }
                that.page++;
              }else{
                this.loading = true;
              }
              this.showLoading = false;
            })
          },
          noticeDetail: function (notice) {
            this.changeNoticeRead(notice.noticeId)
            this.$router.push({
              name: 'NoticeDetail',
              params: {noticeId: notice.noticeId, back: '/NoticeList'}
            })
          },
          changeNoticeRead: function (noticeId) {
            if(noticeId){
              for(var i in this.noticeList){
                if(this.noticeList[i].noticeId == noticeId){
                  this.noticeList[i].read = true;
                  var d = this.noticeList[i]
                  // 这样修改数组的值后才会刷新
                  this.noticeList.splice(i, 1, d);
                  break;
                }
              }
            }
          }
        },
        mounted: function () {
          this.loadMoreNotice();
        },
        // 回到首页时刷新首页
        beforeRouteLeave(to, from, next) {
          if(to.path == '/home'){
            this.$route.meta.keepAlive = false
          }
          next();
        },
    }
</script>

<style scoped>
  .me-top-container{
    width: 100%;
    background-color: #fff;
    margin-bottom: 10px;
    text-align: left;
  }
  .me-top-container ul{
    padding: 0 10px;
  }
  .me-top-container li{
    padding: 10px;
    letter-spacing: 2px;
  }
  .msg{
    position: relative;
    color: #999;
    border-bottom: 1px solid #eee;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .msg-enter{
    color: #26a2ff;
    position: absolute;
    right: 0px;
    top: 30%;
  }
  .unRead::before {
    z-index: 0;
  }
  .noNoticeTips{
    text-align: center;
    color: #707274;
    margin-top: 50%;
  }
  .icon-publishgoods_fill{
    font-size: 42px;
  }
</style>
