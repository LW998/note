if (typeof axios !== 'undefined') {
    axios.defaults.baseURL = 'http://127.0.0.1:8082';
    axios.defaults.withCredentials = true; //=>允许跨域请求
    axios.defaults.transformRequest = data => {
        let str = ``;
        if (data && typeof data === 'object') {
            for (let attr in data) {
                if (data.hasOwnProperty(attr)) {
                    str += `${attr}=${data[attr]}&`;
                }
            }
        }
        return str.substring(0, str.length - 1);
    };
    // axios.defaults.headers['Content-Type'] = 'x-www-form-urlencoded';
    axios.interceptors.response.use(result => result.data);
}