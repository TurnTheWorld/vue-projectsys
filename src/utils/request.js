import axios from 'axios'
import Qs from 'qs'
import { MessageBox, Indicator, Toast } from 'mint-ui'
import router from '@/router'
import store from '@/store'
// import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 30000 // request timeout
  ,method: 'post'
  ,responseType: 'json'
 /* ,transformRequest: [function (data) {
    //if(!this.config.isFile){
      // 对 data 进行任意转换处理
      console.log('-----------------')
      if(!data){
        data = {}
      }
      data.token = store.getters.token;
      data = Qs.stringify(data);
    // }else{
    //   console.log('isfile')
    // }

    return data;
  }],*/

})

// request interceptor
service.interceptors.request.use(config => {
  if(!config.isFile){ // 是上传文件就不做处理了
    config.transformRequest = [function (data) {
      // 对 data 进行任意转换处理
      if(!data){
        data = {}
      }
      data.token = store.getters.token;
      var d = {};
      for(var key in data){
        if(data[key] && data[key] != ''){
          d[key] = data[key];
        }
      }
      data = Qs.stringify(d);
      return data;
    }]
  }

  if(config.isFile){
    config.headers = { 'Content-Type': 'multipart/form-data' }
    config.timeout = 2 * 60 * 1000 // 2分钟
  }
  // 在发送请求之前做些什么
  if(!config.hideLoading){
    Indicator.open('Loading...');
  }
  return config
}, error => {
  // 对响应错误做点什么
  console.log(error) // for debug
  return Promise.reject(error);
})

// respone interceptor
service.interceptors.response.use(function (response) {
  Indicator.close();
  // 对响应数据做点什么
  console.log(response.data);
  var code = response.data.code;
  if(code != "0" && code != "-2" && code != "user.notBindPhone"
    && code != "user.notBindCompany"){
    Toast(response.data.msg);

    // token失效
  }else if(code == '-2'){
    if(process.env.NODE_ENV != "development"){
      window.location.href = process.env.WX_INDEX
    }else{
      router.replace({
        path: process.env.WX_INDEX,
        //query: {redirect: router.currentRoute.fullPath}
        query: {redirect: '/home'}
      })
    }

  }else{
    //MessageBox('提示', response.data);
  }
  return response;

}, function (error) {
  // 对响应错误做点什么
  MessageBox('提示', '网络错误');
  Indicator.close();
  return Promise.reject(error);
});

export default service
