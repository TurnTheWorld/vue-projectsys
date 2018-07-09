<template>
    <div>
      <mt-header fixed title="选择用户">
          <mt-button slot="left" class="my-click" icon="back" @click.native="back">返回</mt-button>
          <mt-button slot="right" class="my-click"  @click.native="confirm"><i class="iconfont icon-right"></i>确定</mt-button>
      </mt-header>
      <!-- 生成用户列表选项 -->
      <!--<div v-infinite-scroll="loadMore"-->
           <!--:infinite-scroll-disabled="loading"-->
      <!--&gt;-->
        <!--<div v-if="more">-->
          <!--<mt-checklist-->
            <!--align="right"-->
            <!--v-model="values"-->
            <!--:options="userList">-->
          <!--</mt-checklist>-->
        <!--</div>-->
        <!--<div v-if="!more">-->
          <!--<mt-radio-->
            <!--align="right"-->
            <!--v-model="value"-->
            <!--:options="userList">-->
          <!--</mt-radio>-->
        <!--</div>-->
        <div v-if="more">
          <mt-index-list>
            <template v-for="(user, index)  in userList">
              <mt-index-section :index="index" >
                <mt-checklist
                  align="right"
                  v-model="values"
                  :options="user">
                </mt-checklist>
              </mt-index-section>
            </template>
          </mt-index-list>
        </div>
        <div v-if="!more">
          <mt-index-list>
            <template v-for="(user, index)  in userList">
              <mt-index-section :index="index">
                <mt-radio
                  align="right"
                  v-model="value"
                  :options="user">
                </mt-radio>
              </mt-index-section>
            </template>
          </mt-index-list>
        </div>
      </div>

    <!--</div>-->
</template>

<script>
    export default {
        name: "select-user",
        data(){
         return {
           page: 1,
           limit: 10,
           loading: false,
           showLoading: true,
           more: undefined,
           backName: undefined,
           mykey: undefined,
           values: [],
           value: undefined,
           userList: {},
           projectId: undefined
         }
        },
        methods: {
          back: function () {
            this.$router.replace({
              name: this.backName,
              params: {
                mykey: this.mykey,
                projectId: this.projectId
              }
            });
          },
          confirm: function () {
            var value = undefined
            var values = []
            // 获取对应的值
            var find = false;
            if(this.userList){
              for(var key in this.userList){
                if(find){
                  break;
                }
                var users = this.userList[key]
                for(var index in users){
                  if(!this.more){
                    if(users[index].value == this.value){
                      value = {id:users[index].value, name: users[index].name}
                      find = true;
                      break
                    }
                  }else{
                    for(var i in this.values){
                      if(users[index].value == this.values[i]){
                        values.push({id:users[index].value, name: users[index].name})
                        break;
                      }

                    }

                  }

                }
              }
            }

            this.$router.replace({
              name: this.backName,
              params: {
                mykey: this.mykey,
                values: values,
                value: value,
                projectId: this.projectId
              }
            });
          },
          loadMore: function () {
            console.log('loadMore');
            // for(var i = 0; i < 100; i++){
            //   this.userList.push({
            //     label: '被禁用',
            //     value: '值F',
            //   })
            // }
          }
        },
        mounted: function () {
          this.backName = this.$route.params.backName
          this.mykey = this.$route.params.mykey
          this.more = this.$route.params.more
          this.projectId = this.$route.params.projectId
          // 获取公司所有用户
          var that = this
          this.$request({
            url: '/dept/getAllUsers',
            data:{}
          }).then((reponse) => {
            if(reponse.data.code == '0'){
              var d = reponse.data.data;
              // 组装数据
              var userList = {};
              for(var key in d){
                var users = d[key];
                var arr = userList[key]
                if(!arr){
                  arr = []
                  userList[key] = arr
                }
                for(var index in users){
                  var user = users[index];
                  user.deptName = user.deptName ? user.deptName : ''
                  user.roleName = user.roleName ? user.roleName : ''
                  var label = user.name + ' (部门：' + user.deptName + ', 岗位：' + user.roleName +  ')'
                  arr.push({value: user.id + '', label: label, name: user.name})
                }

              }

              that.userList = userList;
            }
          });

        }
    }
</script>

<style scoped>
  .mint-cell-title{
    text-align: left;
    font-size: 14px;
    overflow: hidden;
  }
  .mint-checkbox-label {
    font-size: 14px;
    overflow: hidden;
  }
  .mint-cell{
    height: 36px;
  }
  .mint-radio-label {
    vertical-align: middle;
    margin-left: 6px;
    font-size: 14px;
  }
</style>
