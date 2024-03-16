import axios from "axios";

class OrderAPI {
  async get(params) {
    var result = await axios({
      method: "get",
      url: process.env.REACT_APP_API_URL + "/api/orders/create",
      headers: {
        'Authorization': localStorage.getItem("DONGGUITAR_JWT_ACCESS_TOKEN") ? 'Bearer ' + localStorage.getItem("DONGGUITAR_JWT_ACCESS_TOKEN") : null,
        "X-Refresh-Token": localStorage.getItem("DONGGUITAR_JWT_REFRESH_TOKEN") ? localStorage.getItem("DONGGUITAR_JWT_REFRESH_TOKEN") : null
      },
      params: {
        status: params.status ? params.status : null
      }
    });
    return result.data;
  }


  async create(data) {
    var result = await axios({
      method: "post",
      url: process.env.REACT_APP_API_URL + "/api/orders/create",
      headers: {},
      data: data,
    });
    return result.data;
  }

  async update(id, data) {
    var result = await axios({
      method: "put",
      url: process.env.REACT_APP_API_URL + `/api/orders/update/${id}`,
      headers: {
        'Authorization': localStorage.getItem("DONGGUITAR_JWT_ACCESS_TOKEN") ? 'Bearer ' + localStorage.getItem("DONGGUITAR_JWT_ACCESS_TOKEN") : null,
        "X-Refresh-Token": localStorage.getItem("DONGGUITAR_JWT_REFRESH_TOKEN") ? localStorage.getItem("DONGGUITAR_JWT_REFRESH_TOKEN") : null
      },
      data: data,
    });
    return result.data;
  }

  async count(field, value) {
    var result = await axios({
      method: "get",
      url: process.env.REACT_APP_API_URL + "/api/orders/count",
      headers: {
        'Authorization': localStorage.getItem("DONGGUITAR_JWT_ACCESS_TOKEN") ? 'Bearer ' + localStorage.getItem("DONGGUITAR_JWT_ACCESS_TOKEN") : null,
        "X-Refresh-Token": localStorage.getItem("DONGGUITAR_JWT_REFRESH_TOKEN") ? localStorage.getItem("DONGGUITAR_JWT_REFRESH_TOKEN") : null
      },
      params: field && value ? {
        'field' : field,
        'value' : value
      } : {}
    });
    return result.data;
  }

  async search(data) {
    console.log(data)
    var result = await axios({
      method: "get",
      url: process.env.REACT_APP_API_URL + "/api/orders/search",
      headers: {
        'Authorization': localStorage.getItem("DONGGUITAR_JWT_ACCESS_TOKEN") ? 'Bearer ' + localStorage.getItem("DONGGUITAR_JWT_ACCESS_TOKEN") : null,
        "X-Refresh-Token": localStorage.getItem("DONGGUITAR_JWT_REFRESH_TOKEN") ? localStorage.getItem("DONGGUITAR_JWT_REFRESH_TOKEN") : null
      },
      params: {
        code : data.code ? data.code : null,
        phone: data.phone ? data.phone : null
      }
    });
    return result.data;
  }
}

export default new OrderAPI();
