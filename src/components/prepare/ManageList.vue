<template>
    <div>
      <mt-header fixed title="项目管理人员">
        <router-link to="/ProOperList" replace slot="left">
          <mt-button class="my-click" icon="back">返回</mt-button>
        </router-link>
      </mt-header>
      <div style="padding-bottom: 30px;">
        <form @submit.prevent="onSubmit">
          <div v-for="user in managers">
            <mt-field  :label="user.category" name="bidType" type="text" :attr="{ maxlength: 30 }" readonly  v-model="user.userName" disableClear  class="bb">
              <mt-button size="small" type="primary" @click.native="openSelectUser(user.category)" @selectUserOver="handleSelectUserOver($event)">选择</mt-button>
            </mt-field>
          </div>
          <div style="margin-top: 30px;">
            <mt-button type="primary" size="large" @click.native="saveManagers">保存</mt-button>
          </div>
        </form>
      </div>
    </div>
</template>

<script>
    export default {
        name: "manage-list",
        data(){
          return {
            projectId: undefined,
            managers:[],
            test: undefined,
            leavePageName: undefined

          }
        },
        methods: {
          onSubmit:function () {
            return false;
          },
          initData: function () {
            console.log(this.projectId)
            this.managers = [
              {
                category: '负责人',
                userId: undefined,
                userName: undefined,
                pmanagerId: undefined,
                projectId: undefined
              },
              {
                category: '财务人员',
                userId: undefined,
                userName: undefined,
                pmanagerId: undefined,
                projectId: undefined
              },
              {
                category: '安全员',
                userId: undefined,
                userName: undefined,
                pmanagerId: undefined,
                projectId: undefined
              },
              {
                category: '资料人员',
                userId: undefined,
                userName: undefined,
                pmanagerId: undefined,
                projectId: undefined
              }
            ];
          },
          openSelectUser: function (mykey) {
            this.$router.push({
              name:'SelectUser',
              params:{mykey: mykey, backName: 'ManageList'}
            })
          },
          handleSelectUserOver: function (res) {

          },
          saveManagers: function () {
            var that = this;
            var data = {projectId: this.projectId, json: JSON.stringify(this.managers)}
            console.log(data);
            this.$request({
              url: '/prepare/saveMannagers',
              data: data
            }).then((reponse) => {
              if(reponse.data.code == '0'){
                // 重新loaddata
                that.loadData();
              }
            })
          },
          loadData: function (hideLoading) {
            var that = this;
            this.$request({
              url: '/prepare/getManagers',
              data: {projectId: that.projectId},
              hideLoading: hideLoading
            }).then((reponse) => {
              if(reponse.data.code == '0' && reponse.data.data.length > 0){
                var d = reponse.data.data
                var ds = []
                for(var i in d){
                  ds.push({
                    category: d[i].category,
                    userId: d[i].userId == 0 ? undefined : d[i].userId,
                    userName: d[i].name,
                    pmanagerId: d[i].pmanagerId,
                    projectId: d[i].projectId
                  })

                }
                that.managers = ds
              }else{
                that.initData();
              }
            }).catch(() => {
              that.initData();
            })
          }
        },
        beforeRouteLeave: function (to, from, next) {
          if(to.name != 'SelectUser'){
            this.leavePageName = undefined;
          }else{
            this.leavePageName = 'SelectUser';
          }
          next();
        },
        activated: function () {
          // 判断是不是从selectUser过来的，不然就清空页面
          var that = this;
          if(!this.leavePageName){
            that.projectId = this.$route.params.proId
            that.loadData();

          }else{
            // 解析参数
            var user = this.$route.params.value
            var mykey = this.$route.params.mykey
           // console.log(this.$route.params)
            if(user){
              for(var index in this.managers){
                if(this.managers[index].category == mykey){
                  var m = this.managers[index]
                  this.managers.splice(index, 1, {
                    category:mykey,
                    userId: user.id,
                    userName: user.name,
                    pmanagerId: m.pmanagerId,
                    projectId: m.projectId
                  })
                  break
                }
              }

            }
          }

        },
    }
</script>

<style scoped>

</style>
