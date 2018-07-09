<template>
    <div>
      <h1 class="title">绑定部门</h1>
      <div class="bind-phone-div">
        <form @submit.prevent="onSubmit">
          <mt-field label="姓名"  :attr="{ maxlength: 5 }" name="name" type="text" placeholder="必填"  v-model="name" v-validate="'required|name'" class="bb"></mt-field>
          <span v-if="errors.has('name')" class="form-error">{{ errors.first('name') }}</span>

          <div class="mint-cell-wrapper sex-container bb" >
            <div class="mint-cell-title sex-title">
              <span class="mint-cell-text">性别</span>
              </div>
            <div class="mint-cell-value">
              <label class="mint-radiolist-label"><span class="mint-radio"><input type="radio" class="mint-radio-input" :checked="sex == '男'" v-model="sex" value="男" name="sex"> <span class="mint-radio-core"></span></span> <span class="mint-radio-label">男</span></label>
              <label class="mint-radiolist-label"><span class="mint-radio"><input type="radio" class="mint-radio-input" :checked="sex == '女'" v-model="sex" value="女" name="sex"> <span class="mint-radio-core"></span></span> <span class="mint-radio-label">女</span></label>
            </div> <!---->
          </div>

          <mt-field class="bb" disableClear label="部门" placeholder="请选择部门" type="text" readonly  v-model="deptName"  @click.native="showDeptSheet"></mt-field>
          <mt-field class="bb" disableClear label="岗位" placeholder="请选择岗位" type="text" readonly  v-model="roleName"  @click.native="showRoleSheet"></mt-field>

          <mt-actionsheet
            :actions="depts"
            v-model="state.showDept">
          </mt-actionsheet>

          <mt-actionsheet
            :actions="roles"
            v-model="state.showRole">
          </mt-actionsheet>

          <div class="submit-div">
            <mt-button type="primary" size="normal" @click.native="updateInfo">确定</mt-button>
            <mt-button type="primary" size="normal" @click.native="skip">跳过</mt-button>
          </div>
        </form>
      </div>
    </div>
</template>

<script>
  import { Validator } from 'vee-validate';
  Validator.extend('name', {
    getMessage(field, args) {
      return "请输入姓名，5个字以内"
    },
    validate(value, args){
      var rs = value && value.length > 0 && value.length <= 5;
      return rs;
    }
  });
    export default {
        name: "bind-dept",
        data(){
          return {
            name: '',
            sex: '男',
            deptId: '',
            roleId: '',
            deptName: '',
            roleName: '',
            state: {
              showDept: false,
              showRole: false
            },
            depts: [],
            roles: []
          }
        },
        methods: {
          onSubmit: function(){
            return false;
          },
          updateInfo: function(){
            this.$validator.validate('name').then(result => {
              if(!result){
                return;
              }
              // 更新用户信息
              this.$request({
                url: '/pu/updateInfo',
                data:{roleId: this.roleId, deptId: this.deptId, name: this.name, gender: this.sex }
              }).then((response)=>{
                if(response.data.code == '0'){
                  this.$router.replace({
                    name: 'home',
                    params: {}
                  })

                }

              })


            })

          },
          skip: function(){
            this.$router.replace({
              name: 'home',
              params: {}
            })
          },
          showDeptSheet: function(){
            this.state.showDept = true;
          },
          showRoleSheet: function(){
            this.state.showRole = true;
          },
          getDeptFunction: function(id, name){
            var that = this;
            return function(){
              that.deptId = id;
              that.deptName = name;
            }
          },
          getRoleFunction: function(id, name){
            var that = this;
            return function(){
              that.roleId = id;
              that.roleName = name;
            }
          }

        },
      mounted: function(){
          var that = this;
          // 获取部门信息
          this.$request({
            url: '/dept/getDepts',
            data:{ }
          }).then((response)=>{
            if(response.data.code == '0'){
              that.depts = [];
              var d = response.data.data;
              for(var i in d){
                that.depts.push({
                  name: d[i].name,
                  method: this.getDeptFunction(d[i].id, d[i].name)
                });
              }
            }

          })
        // 获取角色信息
        this.$request({
          url: '/dept/getRoles',
          data:{ }
        }).then((response)=>{
          if(response.data.code == '0'){
            that.roles = [];
            var d = response.data.data;
            for(var i in d){
              that.roles.push({
                name: d[i].name,
                method: this.getRoleFunction(d[i].id, d[i].name)
              });
            }
          }

        })

        }
    }
</script>

<style scoped>
  .title{
    color: #26a2ff;
  }
  .sex-container{
   height: 48px;
  }
  .sex-container input{
    width: 50px;
    height: 50px;
  }
  .sex-title{
    width: 105px;
    flex: none;
  }
  .submit-div{
    padding: 30px;
  }
  .bb{
    border-bottom: 1px solid #eee;
    background-color: #fff;
  }
  .mint-cell-wrapper{
    background-image: none;
  }
</style>
