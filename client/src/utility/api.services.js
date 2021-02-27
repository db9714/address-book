import axios from "axios";
const API_URL = "";
let ApiService = {
  get: (url, payload, headers, showLoader, callback) => {
    console.log(url, "url");
    showLoader(true);
    axios
      .get(API_URL + url, {
        params: payload,
        headers:
          headers === false
            ? null
            : {
                Authorization: `Bearer ${headers.Token}`,
              },
      })
      .then((responseData) => {
        showLoader(false);
        if (responseData) {
          callback && callback(responseData.data, null);
        }
      })
      .catch((error) => {
        showLoader(false);
        console.log(JSON.stringify(error));

        if (error.response) {
          // if (error.response.status === 401) {
          //   window.location.replace("/");
          //   return;
          // }
          // if (error.response.data.detail) {
          //   alert(error.response.data.detail);
          //   global.navigate("/");
          // }
          callback && callback(null, error.response.data);
        }
      });
  },
  post: (url, data, headers, showLoader, callback) => {
    showLoader(true);
    axios
      .post(API_URL + url, data, { headers: headers })
      .then((responseData) => {
        showLoader(false);
        callback && callback(responseData.data, null);
      })
      .catch((error) => {
        showLoader(false);
        console.log(JSON.stringify(error));
        if (error.response) {
          // if (error.response.status === 401) {
          //   window.location.replace("/");
          //   return;
          // }
          // if (error.response.data.detail) {
          //   alert(error.response.data.detail);
          //   global.navigate("/");
          // }
          callback && callback(null, error.response.data);
        }
      });
  },
  del: (url, payload, headers, showLoader, callback) => {
    showLoader(true);
    axios
      .delete(API_URL + url, {
        params: payload,
        headers: headers,
      })
      .then((responseData) => {
        showLoader(false);
        callback && callback(responseData.data, null);
      })
      .catch((error) => {
        showLoader(false);
        console.log(JSON.stringify(error));
        if (error.response) {
          if (error.response.status === 401) {
            window.location.replace("/");
            return;
          }
          callback && callback(null, error.response.data);
        }
      });
  },
  patch: (url, data, headers, showLoader, callback) => {
    showLoader(true);
    axios
      .patch(API_URL + url, data, { headers: headers })
      .then((responseData) => {
        showLoader(false);
        callback && callback(responseData.data, null);
      })
      .catch((error) => {
        showLoader(false);
        console.log(JSON.stringify(error));
        if (error.response) {
          if (error.response.status === 401) {
            window.location.replace("/");
            return;
          }
          callback && callback(null, error.response.data);
        }
      });
  },
  put: (url, data, headers, showLoader, callback) => {
    showLoader(true);
    axios
      .put(API_URL + url, data, { headers: headers })
      .then((responseData) => {
        showLoader(false);
        callback && callback(responseData.data, null);
      })
      .catch((error) => {
        showLoader(false);
        console.log(JSON.stringify(error));
        if (error.response) {
          if (error.response.status === 401) {
            window.location.replace("/");
            return;
          }
          if (error.response.data.detail) {
            alert(error.response.data.detail);
            global.navigate("/");
          }
          callback && callback(null, error.response.data);
        }
      });
  },
  patchFile: (url, data, headers, showLoader, callback) => {
    showLoader(true);
    axios
      .patch(API_URL + url, data, { headers: headers })
      .then((responseData) => {
        showLoader(false);
        callback && callback(responseData.data, null);
      })
      .catch((error) => {
        showLoader(false);
        console.log(JSON.stringify(error));
        if (error.response) {
          if (error.response.status === 401) {
            window.location.replace("/");
            return;
          }
          if (error.response.data.detail) {
            alert(error.response.data.detail);
            global.navigate("/");
          }
          callback && callback(null, error.response.data);
        }
      });
  },
};

export default ApiService;
