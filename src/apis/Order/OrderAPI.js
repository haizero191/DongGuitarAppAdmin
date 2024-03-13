import axios from "axios";

class OrderAPI {
  async create(data) {
    var result = await axios({
      method: "post",
      url: process.env.REACT_APP_API_URL + "/api/orders/create",
      headers: {},
      data: data,
    });
    return result.data;
  }
}

export default new OrderAPI();
