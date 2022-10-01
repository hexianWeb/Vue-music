import axios from "axios";

// 线上
// const baseURL = "http://106.14.211.207:9002";
const hostUrl =
  process.env.NODE_ENV === "production"
    ? "http://106.14.211.207"
    : "http://127.0.0.1";
const baseURL =
  process.env.NODE_ENV === "production" ? `${hostUrl}/hexianMusic/` : "/";

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
