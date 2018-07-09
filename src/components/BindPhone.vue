<template>
  <div>
    <h1 class="title">绑定手机号</h1>
    <div class="bind-phone-div">
      <form @submit.prevent="onSubmit">
        <mt-field label="手机号" name="phone" type="number" placeholder="必填"  v-model="phone" v-validate="'required|phone'" class="bb"></mt-field>
        <span v-if="errors.has('phone')" class="form-error">{{ errors.first('phone') }}</span>
        <mt-field label="验证码" name="vcode" type="number" placeholder="必填"  v-model="vcode" disableClear class="bb">
          <mt-button size="small" type="danger" @click.native="sendSms"  :disabled="state.sendSmsBtnDisabled">{{sendSmsBtnTitle}}</mt-button>
        </mt-field>
        <span v-if="state.vcode" class="form-error">请输入短信验证码</span>
        <div class="submit-div">
          <mt-button type="primary" size="large" @click.native="bindPhone">确定</mt-button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
    import { Validator } from 'vee-validate';
    Validator.extend('phone', {
      getMessage(field, args) {
        return "请输入正确的手机号"
      },
      validate(value, args){
        var rs = value.length == 11 && /^[1][3,4,5,7,8][0-9]{9}$/.test(value);
        return rs;
      }
    });
    export default {
        name: "bind-phone",
        data(){
          return {
            phone: '',
            vcode: '',
            popupVisible: false,
            msg: '请填写完整表单',
            state: {
              phone: '',
              vcode: false,
              sendSmsBtnDisabled: false
            },
            sendSmsBtnTitle: '发送验证码'
          };
        },
        compouted: {

        },
        methods:{
          sendSms: function(){
            this.$validator.validate('phone').then(result => {
              if(!result){
                return;
              }
            })

            this.$request({
              url: '/vc/sendSms',
              data: {phone: this.phone}
            }).then((reponse) => {
              this.state.sendSmsBtnDisabled = true;
              this.changeSendSmsBtn(60);
              if(reponse.data.code == '0'){
                this.$toast('发送成功，请注意查收短信验证码！');
                if(reponse.data.data){
                  this.vcode =reponse.data.data;
                }
              }

            })
          }
          ,bindPhone: function(){
            this.$validator.validate().then(result => {
              if (result) {
                if(!this.vcode){
                  this.state.vcode = true;
                  return;
                }else{
                  this.state.vcode = false;
                }

                this.$request({
                  url: '/ac/bindPhone',
                  data: {phone: this.phone, vcode: this.vcode, openId: this.$store.getters.openId}
                }).then((reponse) => {
                  if(reponse.data.code == '0'){
                    this.$router.replace({
                      name: 'BindCompany',
                      params: {}
                    })
                  }

                })
              }
            });
          }
          ,changeSendSmsBtn: function(max){
            if(max <= 0){
              this.sendSmsBtnTitle = "发送验证码";
              this.state.sendSmsBtnDisabled = false;
            }else{
              this.sendSmsBtnTitle = "发送成功(" + max + ")";
            }
            var that = this;
            if(max > 0){
              setTimeout(function(){
                max--
                that.changeSendSmsBtn(max);
              }, 1000);
            }
          }
          ,onSubmit: function(){
            return false;
          }

        }

    }
</script>

<style scoped>
  .title{
    color: #26a2ff;
  }
  .bind-phone-div{
    padding-bottom: 30px;
  }
  .tips p {
    line-height: 50px;
    color: #fff;
    margin: 0;
  }
  .submit-div{
    margin-top: 30px;
  }
</style>
