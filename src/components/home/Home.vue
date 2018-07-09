<template>
 <div>
   <mt-header fixed :title="title[selected]">
     <router-link to="/AddProject" slot="left" >
       <mt-button class="my-click" v-if="selected == 'proList'"><i class="iconfont icon-add"></i>新增项目</mt-button>
     </router-link>
     <router-link to="/BindProject" slot="right" >
       <mt-button  class="my-click" v-if="selected == 'proList'"><i class="iconfont icon-accessory"></i>绑定项目</mt-button>
     </router-link>
   </mt-header>
   <!-- 项目列表 -->
   <mt-tab-container v-model="selected">
     <mt-tab-container-item id="proList">
       <div v-if="proList.length == 0" class="noProjectTips">
         <p>
           <i class="iconfont icon-publishgoods_fill"></i>
         </p>
         <p>
           还没有项目？
         </p>
         <p>
           快去<span class="todoPass">绑定</span>或者<span class="todoPass">添加</span>项目吧！
         </p>
       </div>
       <ul
         v-infinite-scroll="loadMorePro"
         infinite-scroll-disabled="loading"
         infinite-scroll-distance="10"
          class="pro-list-ul">
         <li v-for="p in proList" class="pro-item-container my-click">
          <div >
            <h4 class="pro-item-title">{{p.name}}</h4>
            <p>
              <span class="pro-item-span">项目编号：{{p.proNumber}}</span><span class="pro-item-span">分类：{{p.category}}</span>
            </p>
            <p>
              <span class="pro-item-span">金额(元)：￥{{p.money ? dealNumber(p.money) : ''}}</span><span class="pro-item-span">状态：<span :class="authClass[p.auth + '']">{{auth[p.auth + ""]}}</span></span>
            </p>
            <p>
              建设方：{{p.buildSide}}
            </p>
            <p>
              监理方：{{p.superSide}}
            </p>
            <p>
              项目地址：{{p.address}}
            </p>
            <p>
              项目简介：{{p.intro}}
            </p>
            <p>
              <span class="pro-item-span">创建日期：{{p.insertTime}}</span><span class="pro-item-span"></span>
            </p>
            <p>
              <span class="pro-item-span"></span><span class="pro-item-span" style="text-align: right">
                <mt-button class="my-click" size="small" type="primary" @click.native="editProject(p)"><i class="iconfont icon-editor"></i>编辑</mt-button>
                <mt-button class="my-click" size="small" type="primary" @click.native="moreOper(p)">更多操作...</mt-button>
              </span>
            </p>
          </div>
         </li>
       </ul>
       <div style="text-align: center; margin-left: 45%;" v-if="showLoading"><mt-spinner type="fading-circle" color="rgb(38, 162, 255)"></mt-spinner></div>
     </mt-tab-container-item>
     <!--日常操作-->
     <mt-tab-container-item id="day">
       <mt-swipe :show-indicators="false" v-if="selected == 'day'">
         <mt-swipe-item>
           <img src="../../../static/imgs/swiper1.jpg" alt="" style="width: 100%; height: 100%;">
         </mt-swipe-item>
       </mt-swipe>
       <div class="main">
         <div class="box">
           <div class="content my-click">
            <div ><i class="iconfont icon-qiandao menuIcon"></i></div>
             <div class="menuText">签到</div>
           </div>
         </div>
         <div class="box">
           <div class="content my-click">
             <div ><i class="iconfont icon-tongzhi menuIcon"></i></div>
             <div class="menuText">通知消息</div>
           </div>
         </div>
         <div class="box">
           <div class="content my-click">
             <div ><i class="iconfont icon-tongxunlu menuIcon"></i></div>
             <div class="menuText">通讯录</div>
           </div>
         </div>
         <div class="box">
           <div class="content my-click">
             <div ><i class="iconfont icon-suyaniconchanpinleibufenzuodaohangbufen87 menuIcon"></i></div>
             <div class="menuText">部门管理</div>
           </div>
         </div>
         <div class="box">
           <div class="content my-click">
             <div ><i class="iconfont icon-setting-role menuIcon"></i></div>
             <div class="menuText">职位管理</div>
           </div>
         </div>
         <div class="box">
           <div class="content my-click">
             <div ><i class="iconfont icon-quanxianguanli menuIcon"></i></div>
             <div class="menuText">权限管理</div>
           </div>
         </div>
       </div>
     </mt-tab-container-item>
     <!--我的-->
     <mt-tab-container-item id="my">
       <!--<mt-cell v-for="n in 6" :title="'我的 ' + n" />-->
       <div class="me-top-container">
         <ul>
           <li class="bb"><span class="me-item-left">姓名</span><span class="me-item-right">{{me.name}}</span></li>
           <li class="bb"><span class="me-item-left">性别</span><span class="me-item-right">{{me.gender}}</span></li>
           <li class="bb"><span class="me-item-left">手机号</span><span class="me-item-right">{{me.phone}}</span></li>
         </ul>
       </div>
       <div class="me-top-container">
         <ul>
           <li class="bb"><span class="me-item-left">公司</span><span class="me-item-right">{{me.companyName}}</span></li>
           <li class="bb"><span class="me-item-left">部门</span><span class="me-item-right">{{me.dept ? me.dept.name : ''}}</span></li>
           <li class="bb"><span class="me-item-left">职位</span><span class="me-item-right">{{me.role ? me.role.name: ''}}</span></li>
         </ul>
       </div>
       <div class="me-top-container">
         <mt-cell title="通知消息" class="bbb" style="color: #26a2ff"></mt-cell>
         <ul style="min-height: 200px;">
           <li v-if="noticeList.length == 0" style="text-align: center;" >暂时没有通知消息！</li>
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
           <router-link to="/NoticeList"  v-if="noticeList.length > 0">
            <li class="msg" ><span class="me-item-left"></span><span class="me-item-right" style="text-align: right;color: #26a2ff;">更多...</span></li>
           </router-link>
         </ul>
       </div>
     </mt-tab-container-item>
   </mt-tab-container>
   <!--底部nav-->
   <mt-tabbar v-model="selected" :fixed=true>
     <mt-tab-item id="proList">
       <img slot="icon" :src="selected == 'proList' ? navBar.proList.select : navBar.proList.normal">
       项目
     </mt-tab-item>
     <mt-tab-item id="day">
       <img slot="icon" :src="selected == 'day' ? navBar.day.select : navBar.day.normal">
       日常
     </mt-tab-item>
     <mt-tab-item id="my">
       <img slot="icon" :src="selected == 'my' ? navBar.my.select : navBar.my.normal">
       我的
       <span v-if="me.noticeCount && me.noticeCount > 0" class="unRead" style="right: 45px; top: 10px;"></span>
     </mt-tab-item>
   </mt-tabbar>
 </div>
</template>

<script>

    export default {
        name: "home",
        data(){
          return {
            title: {
              'proList': '项目列表',
              'day': '日常操作',
              'my': '个人中心',
            },
            selected: 'proList',
            navBar:{
              my:{
                select: require('../../assets/imgs/my.png'),
                normal: require('../../assets/imgs/my_n.png')
              },
              day:{
                select: require('../../assets/imgs/day.png'),
                normal: require('../../assets/imgs/day_n.png')
              },
              proList:{
                select: require('../../assets/imgs/proList.png'),
                normal: require('../../assets/imgs/proList_n.png')
              }
            },
            auth:{
              "-2": "待申请授权",
              "-1": '未通过',
              "0": '待授权',
              "1": '通过',
            },
            loading: false,
            proList: [],
            showLoading: false,
            authClass: {
              "-2": "todoPass",
              "-1": 'notPass',
              "0": 'waitPass',
              "1": 'pass',
            },
            page: 1,
            limit: 5,
            loadedMe: false,
            me: {
              role: {},
              dept: {},
              id:'',
              name:'',
              phone:'',
              gender:'',
              companyName: this.$store.getters.companyName,
              noticeCount: 0
            },
            noticeList:[],

          }
        },
        computed:{

        },
        methods: {
          loadMorePro: function () {
            // 防止其他列表拉取列表
            if(this.selected != 'proList'){
              return;
            }
            this.loading = true;
            this.showLoading = true;
            var that = this;
            this.$request({
              url: '/pu/getPorjects',
              data: {page: this.page, limit: this.limit},
              hideLoading: true
            }).then((reponse) => {
              if(reponse.data.code == '0'){
                var d = reponse.data.data;
                var count = reponse.data.count;
                for(var i in d){
                  that.proList.push(d[i]);
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
          editProject: function (pro) {
            this.$router.push({
              name: 'AddProject',
              params: {pro: pro}
            })
          },
          moreOper: function (pro) {
            if(pro.auth != '1'){
              this.$toast('该项目还没有审核通过')
              return;
            }

            localStorage.setItem("proId", pro.id);
            this.$router.push({
               path: '/ProOperList/',
               params: {proId: pro.id}
            })
          },
          dealNumber: function(money, scale) {
            if (!scale || isNaN(scale) || scale < 0) {
              scale = 2;
            }
            if (money && money != null) {
              var last = '';
              if(money >= 10000){
                money /= 10000;
                last = '万';
              }
              money = String(money);
              var left = money.split('.')[0], right = money.split('.')[1];
              right = right ? (right.length >= 2 ? '.' + right.substr(0, scale) : '.' + right + '0') : '.00';
              var temp = left.split('').reverse().join('').match(/(\d{1,3})/g);
              return (Number(money) < 0 ? "-" : "") + temp.join(',').split('').reverse().join('') + right + last;
            } else if (money === 0) {   //注意===在这里的使用，如果传入的money为0,if中会将其判定为boolean类型，故而要另外做===判断
              return '0.00';
            } else {
              return "";
            }
          },
          getMe: function () {
            var that = this
            this.$request({
              url: '/pu/me',
              data: {},
              hideLoading: true
            }).then((reponse) => {
              if(reponse.data.code == '0'){
                var d = reponse.data.data;
                if(d){
                  that.me.role = d.role
                  that.me.dept = d.dept
                  that.me.id = d.id, that.me.name = d.name
                  that.me.phone = d.phone
                  that.me.gender = d.gender
                  that.me.noticeCount = d.noticeCount
                }
              }
            })
          },
          getNoticeList: function () {
            var that = this;
            this.$request({
              url: '/notice/getNotices',
              data: {page: 1, limit: 3, notice: 'recv'},
              hideLoading: true
            }).then((reponse) => {
              if(reponse.data.code == '0'){
                var d = reponse.data.data;
                for(var i in d){
                  that.noticeList.push(d[i]);
                }
              }
            })
          },
          noticeDetail: function (notice) {
            this.changeNoticeRead(notice.noticeId)
            this.$router.push({
              name: 'NoticeDetail',
              params: {noticeId: notice.noticeId}
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
          this.$route.meta.keepAlive = true;
          this.loadMorePro()
          this.getMe()
          this.getNoticeList()
        },
        activated: function () {
          //
        },
        deactivated: function () {

        }
    }
</script>

<style scoped>
  .mint-tabbar > .mint-tab-item.is-selected {
    background: none;
  }
  .pro-list-ul{
    margin-top: 0px;
    text-align: center;
    padding: 0 2px;
  }
  .pro-item-container{
    background-color: #fff;
    padding: 0 10px 10px 10px;
    border-radius: 5px;
    box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19);
  }
  .pro-item-container p{
    margin: 0;
    /*padding: 0 5px 10px 5px;*/
    text-align: left;
    font-size: 14px;
    color: #666;
    line-height: 22px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .pro-item-container h4{
    margin: 10px 0;
    padding: 10px 5px 5px 5px;
    text-align: left;
    word-wrap:break-word;
  }
  .pro-item-title{

  }
  .pro-item-span{
    display: inline-block;
    width: 50%;
    text-align: left;
    letter-spacing: 1px;
  }

  /*九宫格*/
  .main {

    background-color: #fff;
    width: 100%;
    padding-bottom: 80%;
    padding-left: 0.5%;
  　padding-top: 0.5%;
  }
  .main .box {
    width: 31%;
    padding: 5% 0;
    background-color: #26a2ff;
    float: left;
    margin: 1%;
    position: relative;   /*父元素给相对定位*/
    color: #fff;
  }
  .main .box .content {
  　　position: absolute;    /*子元素给绝对定位*/
  　　width: 100%;
  　　height: 100%;
  }
  .menuIcon{
    font-size: 40px;
  }
  .menuText{
    font-size: 14px;
  }

  .mint-swipe {
    height: 230px;
  }
  .mint-tab-container {
    position: absolute;
    top: 40px;
    left: 0px;
    width: 100%;
    margin-bottom: 60px;
    padding-bottom: 20px;

  }
  .mint-tabbar{
    border-top: 1px solid #eee;
  }
  .noProjectTips{
    text-align: center;
    color: #707274;
    margin-top: 50%;
  }
  .icon-publishgoods_fill{
    font-size: 42px;
  }
  /*个人中心*/
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
  .me-item-left{
    display: inline-block;
    width: 30%;
    text-align: left;
  }
  .me-item-right{
    display: inline-block;
    text-align: left;
    width: 70%;
    color: #999;
  }

</style>
