<template>
    <div>
      <mt-header fixed title="签订合同">
        <router-link to="/ProOperList" replace slot="left">
          <mt-button class="my-click" icon="back">返回</mt-button>
        </router-link>
      </mt-header>
      <div style="padding-bottom: 30px;">
        <form @submit.prevent="onSubmit">
          <mt-field label="甲方:" name="partyA" type="textarea" rows="3" :attr="{ maxlength: 100 }" placeholder="必填(100字以内)"  v-model="contract.partyA" disableClear v-validate ="'required|partA'"  class="bb"></mt-field>
          <span v-if="errors.has('partyA')" class="form-error">请输入甲方</span>
          <mt-field label="乙方:" name="partyB" type="textarea" rows="3" :attr="{ maxlength: 100 }" placeholder="必填(100字以内)"  v-model="contract.partyB" disableClear v-validate ="'required|partB'"  class="bb"></mt-field>
          <span v-if="errors.has('partyB')" class="form-error">请输入乙方</span>
          <mt-field label="总包:" name="mainContractor" type="textarea" rows="3" :attr="{ maxlength: 160 }" placeholder="必填(160字以内)"  v-model="contract.mainContractor" disableClear  class="bb"></mt-field>
          <mt-field label="分包方:" name="subContractor" type="textarea" rows="3" :attr="{ maxlength: 160 }" placeholder="必填(160字以内)"  v-model="contract.subContractor" disableClear  class="bb"></mt-field>
          <mt-field label="业主:" name="owner" type="textarea" rows="3" :attr="{ maxlength: 160 }" placeholder="必填(160字以内)"  v-model="contract.owner" disableClear  class="bb"></mt-field>
          <mt-field label="有效条件:" name="validCondition" type="textarea" rows="6" :attr="{ maxlength: 1000 }" placeholder="必填(1000字以内)"  v-model="contract.validCondition" disableClear  class="bb"></mt-field>
          <mt-field label="合同版本:" name="version" type="text" :attr="{ maxlength: 30 }" placeholder="必填(30字以内)"  v-model="contract.version" disableClear  class="bb"></mt-field>
          <mt-field label="签约日期:" name="signDate" type="text" readonly  v-model="contract.signDate" disableClear  class="bb">
            <mt-button size="small" type="primary" @click.native="openSignDatePicker">选择</mt-button>
            <mt-datetime-picker
              type="date"
              ref="signDatePicker"
              v-model="defaultDate"
              @confirm="handleSignDateConfirm"
            >
            </mt-datetime-picker>
          </mt-field>
          <mt-field label="开工日期:" name="startWorkDate" type="text" readonly  v-model="contract.startWorkDate" disableClear  class="bb">
            <mt-button size="small" type="primary" @click.native="openStartWorkDatePicker">选择</mt-button>
            <mt-datetime-picker
              type="date"
              ref="startWorkDatePicker"
              v-model="defaultDate"
              @confirm="handleStartWorkDateConfirm"
            >
            </mt-datetime-picker>
          </mt-field>
          <mt-field label="竣工日期:" name="endWorkDate" type="text" readonly  v-model="contract.endWorkDate" disableClear  class="bb">
            <mt-button size="small" type="primary" @click.native="openEndWorkDatePicker">选择</mt-button>
            <mt-datetime-picker
              type="date"
              ref="endWorkDatePicker"
              v-model="defaultDate"
              @confirm="handleEndWorkDateConfirm"
            >
            </mt-datetime-picker>
          </mt-field>
          <mt-field label="中标日期:" name="signDate" type="text" readonly  v-model="contract.winBidDate" disableClear  class="bb">
            <mt-button size="small" type="primary" @click.native="openWinBidDatePicker">选择</mt-button>
            <mt-datetime-picker
              type="date"
              ref="winBidDatePicker"
              v-model="defaultDate"
              @confirm="handleWinBidDateConfirm"
            >
            </mt-datetime-picker>
          </mt-field>

          <mt-field label="备案日期:" name="putOnRecordDate" type="text" readonly  v-model="contract.putOnRecordDate" disableClear  class="bb">
            <mt-button size="small" type="primary" @click.native="openPutOnRecordDatePicker">选择</mt-button>
            <mt-datetime-picker
              type="date"
              ref="putOnRecordDatePicker"
              v-model="defaultDate"
              @confirm="handlePutOnRecordDateConfirm"
            >
            </mt-datetime-picker>
          </mt-field>
          <mt-field label="合同价款(元):" name="contractMoney" type="number" :attr="{ maxlength: 20 }"  v-model="contract.contractMoney" disableClear  class="bb"></mt-field>
          <mt-field label="备案价款(元):" name="putOnRecordMoney" type="number" :attr="{ maxlength: 20 }"   v-model="contract.putOnRecordMoney" disableClear  class="bb"></mt-field>
          <mt-field label="担保现金(元):" name="depositCash" type="number" :attr="{ maxlength: 20 }"   v-model="contract.depositCash" disableClear  class="bb"></mt-field>
          <mt-field label="回款处理:" name="returnMoneyHandle" type="textarea" rows="6" :attr="{ maxlength: 1000 }" placeholder="(1000字以内)"  v-model="contract.returnMoneyHandle" disableClear  class="bb"></mt-field>
          <mt-field label="保函无条件:" name="depositGuaranteeNotCondition" type="textarea" rows="6" :attr="{ maxlength: 1000 }" placeholder="(1000字以内)"  v-model="contract.depositGuaranteeNotCondition" disableClear  class="bb"></mt-field>
          <mt-field label="保函附条件:" name="depositGuaranteeAddCondition" type="textarea" rows="6" :attr="{ maxlength: 1000 }" placeholder="(1000字以内)"  v-model="contract.depositGuaranteeAddCondition" disableClear  class="bb"></mt-field>
          <mt-field label="承包内容:" name="contractContent" type="textarea" rows="10" :attr="{ maxlength: 3000 }" placeholder="(3000字以内)"  v-model="contract.contractContent" disableClear  class="bb"></mt-field>
          <mt-field label="预付款(元):" name="advanceMoney" type="number" :attr="{ maxlength: 20 }"   v-model="contract.advanceMoney" disableClear  class="bb"></mt-field>
          <mt-field label="回扣约定:" name="kickbackAppoint" type="textarea" rows="6" :attr="{ maxlength: 1000 }" placeholder="(1000字以内)"  v-model="contract.kickbackAppoint" disableClear  class="bb"></mt-field>
          <mt-field label="进度款(元):" name="scheduleMoney" type="number" :attr="{ maxlength: 20 }"   v-model="contract.scheduleMoney" disableClear  class="bb"></mt-field>
          <mt-field label="结算后:" name="afterCloseMoney" type="textarea" rows="6" :attr="{ maxlength: 1000 }" placeholder="(1000字以内)"  v-model="contract.afterCloseMoney" disableClear  class="bb"></mt-field>
          <mt-field label="质保金:" name="qualityMoney" type="textarea" rows="6" :attr="{ maxlength: 1000 }" placeholder="(1000字以内)"  v-model="contract.qualityMoney" disableClear  class="bb"></mt-field>
          <mt-field label="收取约定:" name="gatherAppoint" type="textarea" rows="6" :attr="{ maxlength: 1000 }" placeholder="(1000字以内)"  v-model="contract.gatherAppoint" disableClear  class="bb"></mt-field>
          <mt-field label="提交报告约定-设计变更:" name="comitDesignChange" type="textarea" rows="6" :attr="{ maxlength: 1000 }" placeholder="(1000字以内)"  v-model="contract.comitDesignChange" disableClear  class="bb"></mt-field>
          <mt-field label="提交报告约定-增加量:" name="comitIncrement" type="textarea" rows="6" :attr="{ maxlength: 1000 }" placeholder="(1000字以内)"  v-model="contract.comitIncrement" disableClear  class="bb"></mt-field>
          <mt-field label="提交报告约定-延期:" name="comitPostpone" type="textarea" rows="6" :attr="{ maxlength: 1000 }" placeholder="(1000字以内)"  v-model="contract.comitPostpone" disableClear  class="bb"></mt-field>
          <mt-field label="提交报告约定-签证:" name="comitVisa" type="textarea" rows="6" :attr="{ maxlength: 1000 }" placeholder="(1000字以内)"  v-model="contract.comitVisa" disableClear  class="bb"></mt-field>
          <mt-field label="提交报告约定-竣工:" name="comitComplete" type="textarea" rows="6" :attr="{ maxlength: 1000 }" placeholder="(1000字以内)"  v-model="contract.comitComplete" disableClear  class="bb"></mt-field>
          <mt-field label="提交报告约定-交付:" name="comitDelivery" type="textarea" rows="6" :attr="{ maxlength: 1000 }" placeholder="(1000字以内)"  v-model="contract.comitDelivery" disableClear  class="bb"></mt-field>
          <mt-field label="提交报告约定-结算:" name="comitClose" type="textarea" rows="6" :attr="{ maxlength: 1000 }" placeholder="(1000字以内)"  v-model="contract.comitClose" disableClear  class="bb"></mt-field>
          <mt-field label="提交报告约定-索赔:" name="comitClaim" type="textarea" rows="6" :attr="{ maxlength: 1000 }" placeholder="(1000字以内)"  v-model="contract.comitClaim" disableClear  class="bb"></mt-field>
          <mt-field label="文件转送约定-甲方:" name="fileReversionPartyA" type="textarea" rows="6" :attr="{ maxlength: 1000 }" placeholder="(1000字以内)"  v-model="contract.fileReversionPartyA" disableClear  class="bb"></mt-field>
          <mt-field label="文件转送约定-乙方:" name="fileReversionPartyB" type="textarea" rows="6" :attr="{ maxlength: 1000 }" placeholder="(1000字以内)"  v-model="contract.fileReversionPartyB" disableClear  class="bb"></mt-field>
          <mt-field label="文件转送约定-监理:" name="fileReversionPartySuper" type="textarea" rows="6" :attr="{ maxlength: 1000 }" placeholder="(1000字以内)"  v-model="contract.fileReversionPartySuper" disableClear  class="bb"></mt-field>
          <mt-field label="摘抄人:" name="regUserName" type="text" :attr="{ maxlength: 5 }" placeholder="(5字以内)"  v-model="contract.regUserName" disableClear  class="bb"></mt-field>
          <mt-field label="摘抄日期:" name="regDate" type="text" readonly  v-model="contract.regDate" disableClear  class="bb">
            <mt-button size="small" type="primary" @click.native="opencontractRegDatePicker">选择</mt-button>
            <mt-datetime-picker
              type="date"
              ref="contractRegDatePicker"
              v-model="defaultDate"
              @confirm="handlecontractRegDateConfirm"
            >
            </mt-datetime-picker>
          </mt-field>
          <div>
            <UploaderInput :title="'总承包合同：'" @uploadSuccess="handleZcbhtUploadSuccess($event)"></UploaderInput>
            <ul class="file-list-item">
              <li v-if="contract.zcbhtUri">
                <span class="file-name"><i class="iconfont icon-document"></i>项目工程总承包合同.{{getExt(contract.zcbhtUri)}}</span>
                <span class="file-download"><a :href="$store.getters.fileUrl + contract.zcbhtUri" v-clipboard:copy="$store.getters.fileUrl + contract.zcbhtUri" v-clipboard:success="downloadFile" :download="'项目工程总承包合同.' + getExt(contract.zcbhtUri)" target="_blank" @click.prevent="downloadFile">下载</a></span>
                <!--<span>预览</span>-->
                <span class="file-delete" @click="deleteUri('zcbhtUri')">删除</span>
              </li>
            </ul>
          </div>
          <div>
            <UploaderInput :title="'施工合同：'" @uploadSuccess="handleSghtUploadSuccess($event)"></UploaderInput>
            <ul class="file-list-item">
              <li v-if="contract.sghtUri">
                <span class="file-name"><i class="iconfont icon-document"></i>施工合同.{{getExt(contract.sghtUri)}}</span>
                <span class="file-download"><a :href="$store.getters.fileUrl + contract.sghtUri" v-clipboard:copy="$store.getters.fileUrl + contract.sghtUri" v-clipboard:success="downloadFile" :download="'施工合同.' + getExt(contract.sghtUri)" target="_blank" @click.prevent="downloadFile">下载</a></span>
                <!--<span>预览</span>-->
                <span class="file-delete" @click="deleteUri('sghtUri')">删除</span>
              </li>
            </ul>
          </div>
          <div>
            <UploaderInput :title="'补充合同：'" @uploadSuccess="handleBcthUploadSuccess($event)"></UploaderInput>
            <ul class="file-list-item">
              <li v-if="contract.bchtUri">
                <span class="file-name"><i class="iconfont icon-document"></i>补充合同.{{getExt(contract.bchtUri)}}</span>
                <span class="file-download"><a :href="$store.getters.fileUrl + contract.bchtUri" v-clipboard:copy="$store.getters.fileUrl + contract.bchtUri" v-clipboard:success="downloadFile" :download="'补充合同.' + getExt(contract.bchtUri)" target="_blank" @click.prevent="downloadFile">下载</a></span>
                <!--<span>预览</span>-->
                <span class="file-delete" @click="deleteUri('bchtUri')">删除</span>
              </li>
            </ul>
          </div>
          <div>
            <UploaderInput :title="'设备采购合同：'" @uploadSuccess="handleSbcghtUploadSuccess($event)"></UploaderInput>
            <ul class="file-list-item">
              <li v-if="contract.sbcghtUri">
                <span class="file-name"><i class="iconfont icon-document"></i>设备采购合同.{{getExt(contract.sbcghtUri)}}</span>
                <span class="file-download"><a :href="$store.getters.fileUrl + contract.sbcghtUri" v-clipboard:copy="$store.getters.fileUrl + contract.sbcghtUri" v-clipboard:success="downloadFile" :download="'设备采购合同.' + getExt(contract.sbcghtUri)" target="_blank" @click.prevent="downloadFile">下载</a></span>
                <!--<span>预览</span>-->
                <span class="file-delete" @click="deleteUri('sbcghtUri')">删除</span>
              </li>
            </ul>
          </div>
          <div>
            <UploaderInput :title="'材料采购合同：'" @uploadSuccess="handleClcghtUploadSuccess($event)"></UploaderInput>
            <ul class="file-list-item">
              <li v-if="contract.clcghtUri">
                <span class="file-name"><i class="iconfont icon-document"></i>材料采购合同.{{getExt(contract.clcghtUri)}}</span>
                <span class="file-download"><a :href="$store.getters.fileUrl + contract.clcghtUri" v-clipboard:copy="$store.getters.fileUrl + contract.clcghtUri" v-clipboard:success="downloadFile" :download="'材料采购合同.' + getExt(contract.clcghtUri)" target="_blank" @click.prevent="downloadFile">下载</a></span>
                <!--<span>预览</span>-->
                <span class="file-delete" @click="deleteUri('clcghtUri')">删除</span>
              </li>
            </ul>
          </div>
          <div>
            <UploaderInput :title="'其它文件：'" @uploadSuccess="handleOtherUploadSuccess($event)"></UploaderInput>
            <ul class="file-list-item">
              <li v-for="attUri in contract.attList">
                <span class="file-name"><i class="iconfont icon-document"></i>{{getUriName(attUri)}}</span>
                <span class="file-download"><a :href="$store.getters.fileUrl + attUri" v-clipboard:copy="$store.getters.fileUrl + attUri" v-clipboard:success="downloadFile" :download="getUriName(attUri)" target="_blank" @click.prevent="downloadFile">下载</a></span>
                <!--<span>预览</span>-->
                <span class="file-delete" @click="deleteListUri(attUri)">删除</span>
              </li>
            </ul>
          </div>

          <div style="margin-top: 30px;">
            <mt-button type="primary" size="large" @click.native="saveContract">保存</mt-button>
          </div>
        </form>
      </div>
    </div>
</template>

<script>
  import UploaderInput from '../base/UploaderInput'
  import {parseTime, getUriName, getExt} from '../../utils/index.js';
    import { Validator } from 'vee-validate';
    Validator.extend('partA', {
      getMessage(field, args) {
        return "请输入甲方"
      },
      validate(value, args){
        return true;
      }
    });
    Validator.extend('partB', {
      getMessage(field, args) {
        return "请输入乙方"
      },
      validate(value, args){
        return true;
      }
    });
    export default {
        name: "sign-contract",
        components: {
          UploaderInput
        },
        data(){
         return {
           contract:{
             id:undefined,
             companyId:undefined,
             projectId:undefined,
             partyA:undefined,
             partyB:undefined,
             mainContractor:undefined,
             subContractor:undefined,
             owner:undefined,
             validCondition:undefined,
             version:undefined,
             signDate:undefined,
             startWorkDate:undefined,
             endWorkDate:undefined,
             winBidDate:undefined,
             putOnRecordDate:undefined,
             contractMoney:undefined,
             putOnRecordMoney:undefined,
             depositCash:undefined,
             returnMoneyHandle:undefined,
             depositGuaranteeNotCondition:undefined,
             depositGuaranteeAddCondition:undefined,
             contractContent:undefined,
             advanceMoney:undefined,
             kickbackAppoint:undefined,
             scheduleMoney:undefined,
             afterCloseMoney:undefined,
             qualityMoney:undefined,
             gatherAppoint:undefined,
             comitDesignChange:undefined,
             comitIncrement:undefined,
             comitPostpone:undefined,
             comitVisa:undefined,
             comitComplete:undefined,
             comitDelivery:undefined,
             comitClose:undefined,
             comitClaim:undefined,
             fileReversionPartyA:undefined,
             fileReversionPartyB:undefined,
             fileReversionPartySuper:undefined,
             attUrls:undefined,
             regUserName:undefined,
             regDate:undefined,
             attList:[],
             zcbhtUri: undefined,
             sghtUri: undefined,
             bchtUri: undefined,
             sbcghtUri: undefined,
             clcghtUri: undefined,
           },
           defaultDate: new Date(),
         }
        },
        mounted: function () {
          this.contract.projectId = this.$route.params.proId
          // 请求数据
          var that = this;
          this.$request({
            url: '/before/getSignContractPage',
            data: {projectId: this.contract.projectId},
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
              that.contract = b;
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
          openSignDatePicker: function () {
            this.$refs.signDatePicker.open();
          },
          handleSignDateConfirm: function (date) {
            this.contract.signDate = parseTime(date, '{y}-{m}-{d}');
          },
          openStartWorkDatePicker: function () {
            this.$refs.startWorkDatePicker.open();
          },
          handleStartWorkDateConfirm: function (date) {
            this.contract.startWorkDate = parseTime(date, '{y}-{m}-{d}');
          },
          openEndWorkDatePicker: function () {
            this.$refs.endWorkDatePicker.open();
          },
          handleEndWorkDateConfirm: function (date) {
            this.contract.endWorkDate = parseTime(date, '{y}-{m}-{d}');
          },
          openWinBidDatePicker: function () {
            this.$refs.winBidDatePicker.open();
          },
          handleWinBidDateConfirm: function (date) {
            this.contract.winBidDate = parseTime(date, '{y}-{m}-{d}');
          } ,
          openPutOnRecordDatePicker: function () {
            this.$refs.putOnRecordDatePicker.open();
          },
          handlePutOnRecordDateConfirm: function (date) {
            this.contract.putOnRecordDate = parseTime(date, '{y}-{m}-{d}');
          },
          opencontractRegDatePicker: function () {
            this.$refs.contractRegDatePicker.open();
          },
          handlecontractRegDateConfirm: function (regDate) {
            this.contract.regDate = parseTime(regDate, '{y}-{m}-{d}');
          },
          deleteUri: function (key, notConfirm) {
            var that = this;
            if(!notConfirm){
              this.$messagebox.confirm('确定删除此文件?').then(action => {
                that.contract[key] = ''
              }).catch(error=>{});
            }else{
              that.contract[key] = ''
            }

          },
          handleZcbhtUploadSuccess: function (reponse) {
            this.deleteUri('zcbhtUri', true);
            this.contract.zcbhtUri = reponse.data.uri;
          }
          ,handleSghtUploadSuccess: function (reponse) {
            this.deleteUri('sghtUri', true);
            this.contract.sghtUri = reponse.data.uri;
          }
          ,handleBcthUploadSuccess: function (reponse) {
            this.deleteUri('bchtUri', true);
            this.contract.bchtUri = reponse.data.uri;
          }
          ,handleSbcghtUploadSuccess: function (reponse) {
            this.deleteUri('sbcghtUri', true);
            this.contract.sbcghtUri = reponse.data.uri;
          }
         ,handleClcghtUploadSuccess: function (reponse) {
            this.deleteUri('clcghtUri', true);
            this.contract.clcghtUri = reponse.data.uri;
          },
          handleOtherUploadSuccess: function (reponse) {
            if(!this.contract.attList){
              this.contract.attList = [];
            }
            this.contract.attList.push(reponse.data.uri);
          },
          deleteListUri: function (attUri) {
            this.$messagebox.confirm('确定删除此文件?').then(action => {
              var arr = this.contract.attList;
              if(arr){
                for(var i in arr){
                  if(arr[i] == attUri){
                    arr.splice(i,1);
                    break;
                  }
                }
                this.contract.attList = arr;
              }
            }).catch(error=>{});
          },
          saveContract: function () {
            this.$validator.validate().then(result => {
              if(result){
                // 处理List
                var attUris = '';
                if(this.contract.attList){
                  attUris = this.contract.attList.join(',');
                }
                // 保存
                var d = JSON.parse(JSON.stringify(this.contract));
                d.attList = null;
                d.insertTime = null;

                this.$request({
                  url: 'before/saveSignContract',
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
