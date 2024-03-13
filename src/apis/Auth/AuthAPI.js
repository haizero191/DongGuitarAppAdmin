import axios from "axios";

class AuthAPI {
  async login(username, password) {
    console.log(process.env.REACT_APP_API_URL)
    var Login_User_Result = await axios.post(
      process.env.REACT_APP_API_URL + "/api/auth/login",
      {
        username: username,
        password: password,
      }
    );
    return Login_User_Result.data;
  }

  async checkAuth() {
    var result = await axios({
      method: "post",
      url: process.env.REACT_APP_API_URL + `/api/auth/check`,
      headers: {
        "Authorization": localStorage.getItem("DONGGUITAR_JWT_ACCESS_TOKEN") ? localStorage.getItem("DONGGUITAR_JWT_ACCESS_TOKEN") : null,
        "X-Refresh-Token": localStorage.getItem("DONGGUITAR_JWT_REFRESH_TOKEN") ? localStorage.getItem("DONGGUITAR_JWT_REFRESH_TOKEN") : null
      },
    });
    return result.data;
  }
}

export default new AuthAPI();
