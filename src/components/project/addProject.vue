<template>
  <div>
    <mt-header fixed title="新增 / 编辑项目">
      <router-link to="/home" replace slot="left">
        <mt-button class="my-click" icon="back">返回</mt-button>
      </router-link>
      <mt-button v-if="pro.auth && pro.auth != '0' && pro.auth != '1'" slot="right" class="my-click" @click.native="applyAuth"><i class="iconfont icon-editor"></i>申请审核</mt-button>
    </mt-header>
    <div style="padding-bottom: 30px;">
      <form @submit.prevent="onSubmit">
        <mt-field label="项目名称:" name="name" type="text" :attr="{ maxlength: 66 }" placeholder="必填(60字以内)"  v-model="pro.name" disableClear  v-validate="'required'" class="bb"></mt-field>
        <span v-if="errors.has('name')" class="form-error">请输入项目名称</span>
        <mt-field v-if="pro.id" label="项目编号:" readonly name="proNumber" type="number" v-model="pro.proNumber" disableClear  class="bb"></mt-field>
        <mt-field label="项目分类:" name="category" type="text" :attr="{ maxlength: 15 }" placeholder="必填(15字以内)"  v-model="pro.category" disableClear  v-validate="'required'" class="bb"></mt-field>
        <span v-if="errors.has('category')" class="form-error">请输入项目分类</span>
        <mt-field label="金额(元):" name="money" type="number" :attr="{ maxlength: 15 }" placeholder="必填"  v-model="pro.money" disableClear  v-validate="'required|money'" class="bb"></mt-field>
        <span v-if="errors.has('money')" class="form-error">{{ errors.first('money') }}</span>
        <mt-field v-if="pro.id" label="状态:" readonly name="auth" type="text" v-model="auth[pro.auth + '']" disableClear class="bb"></mt-field>
        <mt-field label="建设方:" name="buildSide"  type="textarea" rows="2" :attr="{ maxlength: 160 }" placeholder="(必填)160字以内"  v-model="pro.buildSide" disableClear  v-validate="'required'" class="bb"></mt-field>
        <span v-if="errors.has('buildSide')" class="form-error">请输入建设方</span>
        <mt-field label="监理方:" name="superSide"  type="textarea" rows="2" :attr="{ maxlength: 160 }" placeholder="160字以内"  v-model="pro.superSide" disableClear  class="bb"></mt-field>
        <mt-field label="项目地址:" name="address" type="textarea" rows="5" :attr="{ maxlength: 1000 }" placeholder="1000字以内"  v-model="pro.address" disableClear  class="bb"></mt-field>
        <mt-field label="项目简介:" name="intro" type="textarea" rows="5" :attr="{ maxlength: 1000 }" placeholder="1000字以内"  v-model="pro.intro" disableClear  class="bb"></mt-field>
        <mt-field autoComplete="off" label="项目密码:" name="password" :type="pwdInputType" :placeholder="passwordPh"  :attr="{ maxlength: 20 }" v-model="pro.password"  disableClear class="bb">
        </mt-field>
        <span v-if="showPasswordError" class="form-error">请输入4到15位数字字母组成的密码</span>

        <div style="margin-top: 30px;">
          <mt-button type="primary" size="large" @click.native="addProject">确定</mt-button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
  import { Validator } from 'vee-validate';
  Validator.extend('money', {
    getMessage(field, args) {
      return "请输入正确的金额"
    },
    validate(value, args){
      return value && value > 0;
    }
  });

  export default {
    name: "add-project",
    data(){
      return {
        pwdInputType: 'text',
        pro: {
            id:'',
            companyId:'',
            createUserId:'',
            proNumber:'',
            password:'',
            name:'',
            auth:'',
            intro:'',
            address:'',
            buildSide:'',
            superSide:'',
            money:'',
            category:'',
            reason:''
        },
        passwordPh: '必填(20位以内)',
        needPassword: true,
        showPasswordError: false,
        auth:{
          "-2": "待申请授权",
          "-1": '未通过',
          "0": '待授权',
          "1": '通过',
        },
        authClass: {
          "-2": "todoPass",
          "-1": 'notPass',
          "0": 'waitPass',
          "1": 'pass',
        },
        refreshParent: false
      }
    },
    mounted: function () {
      var p = this.$route.params.pro;
      if(p){
        this.pro = p;
        this.passwordPh = "不填则不修改(20位以内)"
        this.needPassword = false
        this.pro.password = ''
      }
    },
    // 回到首页时刷新首页
    beforeRouteLeave(to, from, next) {
      to.meta.keepAlive = !this.refreshParent;
      next();
    },
    methods: {
      onSubmit:function () {
        return false;
      },
      addProject: function () {
        var that = this
        this.$validator.validate().then(result => {
          if(that.needPassword){
            if(!that.pro.password || !/^[0-9a-zA-Z]{4,15}$/.test(that.pro.password)){
              that.showPasswordError = true;
              return;
            }else{
              that.showPasswordError = false;
            }
          }
          if (result) {
            var d = JSON.parse(JSON.stringify(this.pro));
            delete d.insertTime
            this.$request({
              url: '/p/addProject',
              data: {...d}
            }).then((reponse) => {
              that.pro.password = ''
              if(reponse.data.code == '0'){
                that.pwdInputType = 'text'
                this.$toast('操作成功！')
                that.refreshParent = true
                this.$router.replace({
                  name: 'home',
                  params: {}
                })
              }

            })
          }
        });
      }
      ,applyAuth: function () {
        var that = this;
        this.$request({
          url: '/p/applyAuth',
          data: {projectId: that.pro.id}
        }).then((reponse) => {
          if(reponse.data.code == '0'){
            this.$toast('申请成功，等待审核！')
            that.pro.auth = '0';
          }

        })
      }
    }
  }
</script>

<style scoped>

</style>
