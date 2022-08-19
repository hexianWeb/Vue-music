import axios from "axios";

const baseURL = "/";

axios.defaults.baseURL = baseURL;

export function get(url, params) {
  return axios
    .get(url, {
      params,
    })
    .then((res) => {
      // console.log(res);
      const serverData = res.data;
      // 这里只简单对错误码进行判断 实际场景需要对错误码进行区别处理
      // console.log(res.data);
      if (serverData.code === 0) {
        // console.log("成功传输");
        return serverData.result;
      }
    })
    .catch((e) => {
      console.log(e);
    });
}
