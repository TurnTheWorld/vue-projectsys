<template>
<div>
  <mt-header fixed title="项目操作">
    <router-link to="/home" replace slot="left">
      <mt-button class="my-click" icon="back">返回</mt-button>
    </router-link>
  </mt-header>
  <div class="ope-continaer">
    <mt-cell title="开工情况" is-link class="bb"></mt-cell>
    <mt-cell title="施工计划" is-link class="bb"></mt-cell>
    <mt-cell title="施工日志" is-link class="bb"></mt-cell>
    <mt-cell title="质量与安全" is-link class="bb"></mt-cell>
    <mt-cell title="进度" is-link class="bb"></mt-cell>
    <mt-cell title="财务" is-link class="bb"></mt-cell>
    <mt-cell title="任务" is-link class="bb"></mt-cell>
    <mt-cell title="隐蔽验收" is-link class="bb"></mt-cell>
    <mt-cell title="工程拨付款申请" is-link class="bb"></mt-cell>
  </div>
  <div class="ope-continaer">
    <mt-cell title="变更" is-link class="bb"></mt-cell>
    <mt-cell title="签证" is-link class="bb"></mt-cell>
    <mt-cell title="安全事故" is-link class="bb"></mt-cell>
    <mt-cell title="质量事故" is-link class="bb"></mt-cell>
    <mt-cell title="延期" is-link class="bb"></mt-cell>
    <mt-cell title="索赔" is-link class="bb"></mt-cell>
  </div>
  <div class="ope-continaer">
    <mt-cell title="竞标" is-link class="bb" :to="bidPath"></mt-cell>
    <mt-cell title="签订合同" is-link class="bb" :to="signContractPath"></mt-cell>
  </div>
  <div class="ope-continaer">
    <mt-cell title="项目管理人员" is-link class="bb" :to="managerList"></mt-cell>
    <mt-cell title="劳务公司" is-link class="bb"></mt-cell>
    <mt-cell title="设备信息" is-link class="bb"></mt-cell>
    <mt-cell title="材料信息" is-link class="bb"></mt-cell>
  </div>
  <div class="ope-continaer">
    <mt-cell title="初验" is-link class="bb" ></mt-cell>
    <mt-cell title="终验" is-link class="bb"></mt-cell>
  </div>
  <div class="ope-continaer">
    <mt-cell title="项目交付" is-link class="bb"></mt-cell>
  </div>
  <div class="ope-continaer">
    <mt-cell title="保修单" is-link class="bb"></mt-cell>
  </div>
</div>
</template>

<script>
    export default {
        name: "pro-oper-list",
        data(){
          return {
            proId: '',
            proNumber: '',
            childKeepLive: false,

          }
        },
        computed: {
          bidPath:function () {
            return '/before/bid/' + this.proId
          },
          signContractPath:function () {
            return '/before/SignContract/' + this.proId
          },
          managerList:function () {
            return '/prepare/ManageList/' + this.proId
          }
        },
        activated: function () {
          this.proId = localStorage.getItem("proId");
        },
    }
</script>

<style scoped>
.bb{
  text-align: left;
}
.ope-continaer{
  margin-bottom: 10px;
}
</style>
