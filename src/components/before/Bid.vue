<template>
  <div>
    <mt-header fixed title="竞标">
      <router-link to="/ProOperList" replace slot="left">
        <mt-button class="my-click" icon="back">返回</mt-button>
      </router-link>
    </mt-header>
    <div style="padding-bottom: 30px;">
      <form @submit.prevent="onSubmit">
        <mt-field label="招标单位:" name="bidCompanyName" type="textarea" rows="3" :attr="{ maxlength: 166 }" placeholder="必填(160字以内)"  v-model="bid.bidCompanyName" disableClear  v-validate="'required|bidCompanyName'" class="bb"></mt-field>
        <span v-if="errors.has('bidCompanyName')" class="form-error">请输入招标单位</span>
        <mt-field label="代理机构:" name="agencyCompanyName" type="textarea" rows="3" :attr="{ maxlength: 166 }" placeholder="(160字以内)"  v-model="bid.agencyCompanyName" disableClear  class="bb"></mt-field>
        <mt-field label="招标类型:" name="bidType" type="text" :attr="{ maxlength: 30 }" placeholder="(30字以内)"  v-model="bid.bidType" disableClear  class="bb"></mt-field>
        <mt-field label="招标日期:" name="bidType" type="text" readonly  v-model="bid.bidDate" disableClear  class="bb">
          <mt-button size="small" type="primary" @click.native="openBidDatePicker">选择</mt-button>
          <mt-datetime-picker
            type="date"
            ref="bidDatePicker"
            v-model="defaultDate"
            @confirm="handleBidDateConfirm"
          >
          </mt-datetime-picker>
        </mt-field>
        <mt-field label="开标日期:" name="bidType" type="text" readonly  v-model="bid.bidOpenDate" disableClear  class="bb">
          <mt-button size="small" type="primary" @click.native="openBidOpenDatePicker">选择</mt-button>
          <mt-datetime-picker
            type="date"
            ref="bidOpenDatePicker"
            v-model="defaultDate"
            @confirm="handleBidOpenDateConfirm"
          >
          </mt-datetime-picker>
        </mt-field>
        <mt-field label="资金来源:" name="moneySource" type="text" :attr="{ maxlength: 30 }" placeholder="(30字以内)"  v-model="bid.moneySource" disableClear  class="bb"></mt-field>
        <mt-field label="报价类型:" name="offerType" type="text" :attr="{ maxlength: 30 }" placeholder="(30字以内)"  v-model="bid.offerType" disableClear  class="bb"></mt-field>
        <mt-field label="蓝标:" name="blueBid" type="text" :attr="{ maxlength: 30 }" placeholder="(30字以内)"  v-model="bid.blueBid" disableClear  class="bb"></mt-field>
        <mt-field label="红标:" name="redBid" type="text" :attr="{ maxlength: 30 }" placeholder="(30字以内)"  v-model="bid.redBid" disableClear  class="bb"></mt-field>
        <mt-field label="自报:" name="selfApplyBid" type="text" :attr="{ maxlength: 30 }" placeholder="(30字以内)"  v-model="bid.selfApplyBid" disableClear  class="bb"></mt-field>
        <mt-field label="保证金-现金:" name="depositCash" type="text" :attr="{ maxlength: 30 }" placeholder="(30字以内)"  v-model="bid.depositCash" disableClear  class="bb"></mt-field>
        <mt-field label="保证金-现金占比:" name="depositCashRatio" type="text" :attr="{ maxlength: 30 }" placeholder="(30字以内)"  v-model="bid.depositCashRatio" disableClear  class="bb"></mt-field>
        <mt-field label="保证金-保函:" name="depositGuarantee" type="text" :attr="{ maxlength: 30 }" placeholder="(30字以内)"  v-model="bid.depositGuarantee" disableClear  class="bb"></mt-field>
        <mt-field label="保证金-保函占比:" name="depositGuaranteeRatio" type="text" :attr="{ maxlength: 30 }" placeholder="(30字以内)"  v-model="bid.depositGuaranteeRatio" disableClear  class="bb"></mt-field>
        <mt-field label="中标后处理:" name="winHandle" type="textarea" rows="5" :attr="{ maxlength: 1000 }" placeholder="(1000字以内)"  v-model="bid.winHandle" disableClear  class="bb"></mt-field>
        <mt-field label="未中标处理:" name="notWinHandle" type="textarea" rows="5" :attr="{ maxlength: 1000 }" placeholder="(1000字以内)"  v-model="bid.notWinHandle" disableClear  class="bb"></mt-field>
        <mt-field label="签约时限:" name="signLimit" type="text" readonly  v-model="bid.signLimit" disableClear  class="bb">
          <mt-button size="small" type="primary" @click.native="openBidLimitDatePicker">选择</mt-button>
          <mt-datetime-picker
            type="date"
            ref="bidLimitDatePicker"
            v-model="defaultDate"
            @confirm="handleBidLimitDateConfirm"
          >
          </mt-datetime-picker>
        </mt-field>
        <mt-field label="建设方信息:" name="buildDetail" type="textarea" rows="2" :attr="{ maxlength: 300 }" placeholder="(300字以内)"  v-model="bid.buildDetail" disableClear  class="bb"></mt-field>
        <mt-field label="摘抄人:" name="regUserName" type="text" :attr="{ maxlength: 5 }" placeholder="(5字以内)"  v-model="bid.regUserName" disableClear  class="bb"></mt-field>
        <mt-field label="摘抄日期:" name="regDate" type="text" readonly  v-model="bid.regDate" disableClear  class="bb">
          <mt-button size="small" type="primary" @click.native="openBidRegDatePicker">选择</mt-button>
          <mt-datetime-picker
            type="date"
            ref="bidRegDatePicker"
            v-model="defaultDate"
            @confirm="handleBidRegDateConfirm"
          >
          </mt-datetime-picker>
        </mt-field>

       <div>
         <UploaderInput :title="'招标文件：'" @uploadSuccess="handleZbwjUploadSuccess($event)"></UploaderInput>
         <ul class="file-list-item">
           <li v-if="bid.zbwjUri">
             <span class="file-name"><i class="iconfont icon-document"></i>招标文件.{{getExt(bid.zbwjUri)}}</span>
             <span class="file-download"><a :href="$store.getters.fileUrl + bid.zbwjUri" v-clipboard:copy="$store.getters.fileUrl + bid.zbwjUri" v-clipboard:success="downloadFile" :download="'招标文件.' + getExt(bid.zbwjUri)" target="_blank" @click.prevent="downloadFile">下载</a></span>
             <!--<span>预览</span>-->
             <span class="file-delete" @click="deleteUri('zbwjUri')">删除</span>
           </li>
         </ul>
       </div>
        <div>
          <UploaderInput :title="'招标答疑：'" @uploadSuccess="handleZbdyUploadSuccess($event)"></UploaderInput>
          <ul class="file-list-item">
            <li v-if="bid.zbdyUri">
              <span class="file-name"><i class="iconfont icon-document"></i>招标答疑.{{getExt(bid.zbdyUri)}}</span>
              <span class="file-download"><a :href="$store.getters.fileUrl + bid.zbdyUri" v-clipboard:copy="$store.getters.fileUrl + bid.zbdyUri" v-clipboard:success="downloadFile" :download="'招标答疑.' + getExt(bid.zbdyUri)" target="_blank" @click.prevent="downloadFile">下载</a></span>
              <!--<span>预览</span>-->
              <span class="file-delete" @click="deleteUri('zbdyUri')">删除</span>
            </li>
          </ul>
        </div>
        <div>
          <UploaderInput :title="'投标文件：'" @uploadSuccess="handleTbwjUploadSuccess($event)"></UploaderInput>
          <ul class="file-list-item">
            <li v-if="bid.tbwjUri">
              <span class="file-name"><i class="iconfont icon-document"></i>投标文件.{{getExt(bid.tbwjUri)}}</span>
              <span class="file-download"><a :href="$store.getters.fileUrl + bid.tbwjUri" v-clipboard:copy="$store.getters.fileUrl + bid.tbwjUri" v-clipboard:success="downloadFile" :download="'投标文件.' + getExt(bid.tbwjUri)" target="_blank" @click.prevent="downloadFile">下载</a></span>
              <!--<span>预览</span>-->
              <span class="file-delete" @click="deleteUri('tbwjUri')">删除</span>
            </li>
          </ul>
        </div>
        <div>
          <UploaderInput :title="'投标书：'" @uploadSuccess="handleTbsUploadSuccess($event)"></UploaderInput>
          <ul class="file-list-item">
            <li v-if="bid.tbsUri">
              <span class="file-name"><i class="iconfont icon-document"></i>投标书.{{getExt(bid.tbsUri)}}</span>
              <span class="file-download"><a :href="$store.getters.fileUrl + bid.tbsUri" v-clipboard:copy="$store.getters.fileUrl + bid.tbsUri" v-clipboard:success="downloadFile" :download="'投标书.' + getExt(bid.tbsUri)" target="_blank" @click.prevent="downloadFile">下载</a></span>
              <!--<span>预览</span>-->
              <span class="file-delete" @click="deleteUri('tbsUri')">删除</span>
            </li>
          </ul>
        </div>
        <div>
          <UploaderInput :title="'报价单：'" @uploadSuccess="handleBjdUploadSuccess($event)"></UploaderInput>
          <ul class="file-list-item">
            <li v-if="bid.bjdUri">
              <span class="file-name"><i class="iconfont icon-document"></i>报价单.{{getExt(bid.bjdUri)}}</span>
              <span class="file-download"><a :href="$store.getters.fileUrl + bid.bjdUri" v-clipboard:copy="$store.getters.fileUrl + bid.bjdUri" v-clipboard:success="downloadFile" :download="'报价单.' + getExt(bid.bjdUri)" target="_blank" @click.prevent="downloadFile">下载</a></span>
              <!--<span>预览</span>-->
              <span class="file-delete" @click="deleteUri('bjdUri')">删除</span>
            </li>
          </ul>
        </div>
        <div>
          <UploaderInput :title="'中标通知书：'" @uploadSuccess="handleZbtzsUploadSuccess($event)"></UploaderInput>
          <ul class="file-list-item">
            <li v-if="bid.zbtzsUri">
              <span class="file-name"><i class="iconfont icon-document"></i>中标通知书.{{getExt(bid.zbtzsUri)}}</span>
              <span class="file-download"><a :href="$store.getters.fileUrl + bid.zbtzsUri" v-clipboard:copy="$store.getters.fileUrl + bid.zbtzsUri" v-clipboard:success="downloadFile" :download="'中标通知书.' + getExt(bid.zbtzsUri)" target="_blank" @click.prevent="downloadFile">下载</a></span>
              <!--<span>预览</span>-->
              <span class="file-delete" @click="deleteUri('zbtzsUri')">删除</span>
            </li>
          </ul>
        </div>
        <div>
          <UploaderInput :title="'其它文件：'" @uploadSuccess="handleOtherUploadSuccess($event)"></UploaderInput>
          <ul class="file-list-item">
            <li v-for="attUri in bid.attList">
              <span class="file-name"><i class="iconfont icon-document"></i>{{getUriName(attUri)}}</span>
              <span class="file-download"><a :href="$store.getters.fileUrl + attUri" v-clipboard:copy="$store.getters.fileUrl + attUri" v-clipboard:success="downloadFile" :download="getUriName(attUri)" target="_blank" @click.prevent="downloadFile">下载</a></span>
              <!--<span>预览</span>-->
              <span class="file-delete" @click="deleteListUri(attUri)">删除</span>
            </li>
          </ul>
        </div>

        <div style="margin-top: 30px;">
          <mt-button type="primary" size="large" @click.native="saveBid">保存</mt-button>
        </div>
      </form>
    </div>
    </div>
</template>

<script>
  import {parseTime, getUriName, getExt} from '../../utils/index.js';
  import UploaderInput from '../base/UploaderInput'
  import { Validator } from 'vee-validate';
  Validator.extend('bidCompanyName', {
    getMessage(field, args) {
      return "请输入招标单位"
    },
    validate(value, args){
      return true;
    }
  });
    export default {
        name: "bid",
        components: {
          UploaderInput
        },
        data(){
          return {
            bid:{
              proId: '',
              bidCompanyName: '',
              agencyCompanyName: '',
              bidDate: '',
              bidOpenDate: '',
              moneySource: '',
              blueBid:'',
              redBid:'',
              selfApplyBid:'',
              depositCash:'',
              depositCashRatio: '',
              depositGuarantee: '',
              depositGuaranteeRatio: '',
              winHandle: '',
              notWinHandle: '',
              signLimit: '',
              buildDetail: '',
              regUserName: '',
              regDate: '',
              zbwjUri: '',
              zbdyUri: '',
              tbwjUri: '',
              tbsUri: '',
              bjdUri: '',
              zbtzsUri: '',
              attList: [],

            },
            title: '测试上传文件a',
            defaultDate: new Date(),

          }
        },
        mounted: function () {
          this.bid.projectId = this.$route.params.proId
          // 请求数据
          var that = this;
          this.$request({
            url: '/before/getBidPage',
            data: {projectId: this.bid.projectId},
          }).then((reponse) => {
            var d = reponse.data.data;
            if(d && d.length > 0){
              var b = JSON.parse(JSON.stringify(d[0]));
              if(b.attList){
                var arr = [];
                for(var i in b.attList){
                  arr.push(b.attList[i].attUrl)
                }
                b.attList = arr;
              }
              that.bid = b;
            }
          });

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
          openBidDatePicker: function () {
            this.$refs.bidDatePicker.open();
          },
          handleBidDateConfirm: function (bidDate) {
            this.bid.bidDate = parseTime(bidDate, '{y}-{m}-{d}');
          },
          openBidOpenDatePicker: function () {
            this.$refs.bidOpenDatePicker.open();
          },
          handleBidOpenDateConfirm: function (bidOpenDate) {
            this.bid.bidOpenDate = parseTime(bidOpenDate, '{y}-{m}-{d}');
          },
          openBidLimitDatePicker: function () {
            this.$refs.bidLimitDatePicker.open();
          },
          handleBidLimitDateConfirm: function (signLimit) {
            this.bid.signLimit = parseTime(signLimit, '{y}-{m}-{d}');
          },
          openBidRegDatePicker: function () {
            this.$refs.bidRegDatePicker.open();
          },
          handleBidRegDateConfirm: function (regDate) {
            this.bid.regDate = parseTime(regDate, '{y}-{m}-{d}');
          },
          deleteUri: function (key, notConfirm) {
            var that = this;
            if(!notConfirm){
              this.$messagebox.confirm('确定删除此文件?').then(action => {
                that.bid[key] = ''
              }).catch(error=>{});
            }else{
              that.bid[key] = ''
            }

          },
          handleZbwjUploadSuccess: function (reponse) {
            this.deleteUri('zbwjUrl', true);
            this.bid.zbwjUri = reponse.data.uri;
          },
          handleZbdyUploadSuccess: function (reponse) {
            this.deleteUri('zbdyUrl', true);
            this.bid.zbdyUri = reponse.data.uri;
          },
          handleTbwjUploadSuccess: function (reponse) {
            this.deleteUri('tbwjUrl', true);
            this.bid.tbwjUri = reponse.data.uri;
          } ,
          handleTbsUploadSuccess: function (reponse) {
            this.deleteUri('tbsUrl', true);
            this.bid.tbsUri = reponse.data.uri;
          } ,
          handleBjdUploadSuccess: function (reponse) {
            this.deleteUri('bjdUrl', true);
            this.bid.bjdUri = reponse.data.uri;
          },
          handleZbtzsUploadSuccess: function (reponse) {
            this.deleteUri('zbtzsUrl', true);
            this.bid.zbtzsUri = reponse.data.uri;
          },
          handleOtherUploadSuccess: function (reponse) {
            if(!this.bid.attList){
              this.bid.attList = [];
            }
            this.bid.attList.push(reponse.data.uri);
          },
          deleteListUri: function (attUri) {
            this.$messagebox.confirm('确定删除此文件?').then(action => {
              var arr = this.bid.attList;
              if(arr){
                for(var i in arr){
                  if(arr[i] == attUri){
                    arr.splice(i,1);
                    break;
                  }
                }
                this.bid.attList = arr;
              }
            }).catch(error=>{});
          },
          saveBid: function () {
            this.$validator.validate().then(result => {
              if(result){
                // 处理List
                var attUris = '';
                if(this.bid.attList){
                  attUris = this.bid.attList.join(',');
                }
                // 保存
                var d = JSON.parse(JSON.stringify(this.bid));
                d.attList = null;
                d.insertTime = null;

                this.$request({
                  url: 'before/saveBid',
                  data: {...d, attUris: attUris}
                }).then((reponse)=>{
                  if(reponse.data.code == '0'){
                    this.$toast('操作成功');
                  }
                });
              }
            })
          }

        }

    }
</script>

<style scoped>

</style>
