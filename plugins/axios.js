
import { Message } from 'element-ui';
export default function({ $axios, redirect }) {
  // $axios.defaults.baseURL  = window.location.host
  $axios.onRequest(config => {
  });
  $axios.onResponse(resp => {
    if (resp.status == "200") {
      if (resp.data.code == "-9") {
        Message({
          type: "warning",
          message: "登录已过期",
          duration: 2000
        })
        setTimeout(()=>{
          window.location.href = "/login"
        },2000)
      }
    }
  });

  $axios.onError(error => {
    // const code = parseInt(error.response && error.response.status)
    // if (code === 400) {
    //   redirect('/400')
    // }
  });
}
