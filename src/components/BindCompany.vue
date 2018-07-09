<template>
  <div>
    <h1 class="title">绑定公司</h1>
    <div class="bind-phone-div">
      <span class="form-error">公司一旦绑定则不可以更改，请正确选择所在公司</span>
        <mt-search
          v-model="key"
          :autofocus=true
          :show=false
          cancel-text=""
          placeholder="请输入公司名称或ID"
          @keyup.enter="searchCompany"
          id="searchCompany">
        </mt-search>
      <mt-button class="searchBtn" type="primary" size="small" @click.native="searchCompany">查找</mt-button>
      <mt-radio
          :title="title"
          align="right"
          v-model="compantId"
          :options="options"
          style="padding-top: 5px">
        </mt-radio>
        <div class="submit-div">
          <mt-button type="primary" size="large" @click.native="bindCompany">确定</mt-button>
        </div>
    </div>
  </div>
</template>

<script>
    export default {
        name: "bind-company",
        data(){
          return {
            title: '等待搜索',
            compantId: '',
            key: '',
            options: []
            ,
          }
        },
        methods: {
          onSubmit: function(){
            return false;
          },
          bindCompany: function(){
            if(!this.compantId){
              this.$toast('请选择所在公司');
              return;
            }

            this.$messagebox({
              title: '提示',
              message: '公司一旦绑定则不可以修改，您选择的公司是：' + this.getSelectCompanyName(this.compantId),
              showCancelButton: true
            }).then(action => {
              if(action == 'confirm'){
                // 绑定公司
                var that = this;
                this.$request({
                  url: '/ac/bindCompany',
                  data: {openId: this.$store.getters.openId, companyId: that.compantId}
                }).then((reponse) => {
                  if(reponse.data.code == '0'){
                    this.$store.dispatch('updateToken', reponse.data.data.token);
                    var userInfo = {
                      userId: reponse.data.data.userId,
                      companyId: reponse.data.data.companyId,
                      serverUrl: reponse.data.data.serverUrl,
                      fileUrl: reponse.data.data.fileUrl,
                    };
                    this.$store.dispatch('updateUserInfo', userInfo);

                    this.$router.replace({
                      name: 'BindDept',
                      params: {}
                    })
                  }

                })

              }

            });

          },
          searchCompany: function(){
            this.title = '搜索结果';
            if(!this.key){
              this.$toast('请输入公司名称或ID');
              return;
            }
            var k = this.key;
            var data = {};
            if(isNaN(k)){
              data.name = k;
            }else{
              data.id = k;
            }
            this.$request({
              url: '/ac/searchCompany',
              data: data
            }).then((reponse) => {
              if(reponse.data.code == '0'){
                this.options = [];
                var d = reponse.data.data;
                if(d && d.length > 0){
                  for(var i in d){
                    this.options.push({
                      label: d[i].name,
                      value: d[i].id.toString()
                    });
                  }

                }else{
                  this.title = "没找到相应的公司";
                  this.$toast('没找到相应的公司，请检查搜索条件或联系公司相关负责人！');
                }
              }

            })
          },
          getSelectCompanyName:function(id){
            if(!id){
              return '';
            }
            var d = this.options;
            for(var i in d){
             if( d[i].value == id){
               return d[i].label;
             }
            }
            return '';
          }
        }
    }
</script>

<style scoped>
  .title{
    color: #26a2ff;
  }
  .bind-phone-div{
    padding: 10px 10px 30px 10px;
  }
  .submit-div{
    margin-top: 30px;
  }
  .form-error{
    margin-bottom: 20px;
  }
  .mint-search {
    height: 9vh;
    overflow: auto;
  }
  .searchBtn{
    /*position: absolute;
    top: 157px;
    right: 35px;
    z-index: 100;*/
    margin-bottom: 10px;
  }
  .mint-radiolist{
    min-height: 200px;
    background-color: #fff;
  }
  #searchCompany .mint-searchbar {
    padding: 4px 5px;
    background-color: #f00;
  }
</style>
