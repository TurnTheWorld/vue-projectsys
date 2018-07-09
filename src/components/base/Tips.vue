<template>
  <mt-popup v-model="tipsShow" position="top" class="tips" :modal="false">
    <p>{{msg}}</p>
  </mt-popup>
</template>

<script>
    export default {
        name: "tips",
        data(){
          return {
          /*  msg: '',*/
            tipsShow: false,
            time: 2000,
          };
        },
        props:{
            msg: {
              type: String
            },
            isShow: {
                type: Boolean
            }

        },
        methods:{
          hide:function(){

          }
        },
        watch: {
          // 监听isShow数据变化
          isShow: function (val) {
            console.log(val);
            this.isShow = val
            this.tipsShow = val
            if(val){
              var that = this;
              setTimeout(function(){
                that.tipsShow = false
              }, 2000);
            }
          }
        },
        computed:{

        }
    }
</script>

<style scoped>
  .tips p {
    line-height: 50px;
    color: #fff;
    margin: 0;
  }
  .tips{
    width: 100%;
    height: 50px;
    text-align: center;
    background-color: rgba(0,0,0,.7);
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    color: #fff;
  }
</style>
