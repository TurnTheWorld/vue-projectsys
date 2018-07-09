<template>
  <div>
    <mt-header fixed title="绑定项目">
      <router-link to="/home" replace slot="left">
        <mt-button class="my-click" icon="back">返回</mt-button>
      </router-link>
    </mt-header>
    <div style="padding-bottom: 30px;">
      <form @submit.prevent="onSubmit">
        <mt-field label="项目编号" name="proNumber" type="number" placeholder="必填"  v-model="proNumber" disableClear  v-validate="'required|proNumber'" class="bb"></mt-field>
        <span v-if="errors.has('proNumber')" class="form-error">{{ errors.first('proNumber') }}</span>
        <mt-field autoComplete="off"  label="项目密码" name="password" :type="pwdInputType" placeholder="必填"  v-model="password" v-validate="'required|password'"  disableClear class="bb">
        </mt-field>
        <span v-if="errors.has('password')" class="form-error">{{ errors.first('password') }}</span>
        <div style="margin-top: 30px;">
          <mt-button type="primary" size="large" @click.native="bindProject">确定</mt-button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
    import { Validator } from 'vee-validate';
    Validator.extend('proNumber', {
      getMessage(field, args) {
        return "请输入正确的三位数项目编号"
      },
      validate(value, args){
        return value.length == 3 && /^1[0-9]{2}$/.test(value);
      }
    });
    Validator.extend('password', {
      getMessage(field, args) {
        return "请输入4到15位数字字母组成的密码"
      },
      validate(value, args){
        return /^[0-9a-zA-Z]{4,15}$/.test(value);
      }
    });
    export default {
        name: "bind-project",
        data(){
          return {
            proNumber: '',
            password:'',
            refreshParent: false,
            pwdInputType: 'text'
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
          bindProject: function () {
            var that = this;
            this.$validator.validate().then(result => {
              if (result) {
                this.$request({
                  url: '/pu/bindProject',
                  data: {proNumber: this.proNumber, projectPwd: this.password}
                }).then((reponse) => {
                  if(reponse.data.code == '0'){
                    this.$toast('绑定成功！')
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
        }
    }
</script>

<style scoped>

</style>
