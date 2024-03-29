import axios from "axios";

class ProductAPI {
  async get(args) {
    if (args) {
      const { page, limit, filter } = args; // Destructure tham số từ args
      const response = await axios.get(
        process.env.REACT_APP_API_URL + `/api/products`,
        {
          params: {
            page: page,
            limit: limit,
            filter: filter,
          },
        }
      )
      return response.data;
    } else {
      const response = await axios.get(
        process.env.REACT_APP_API_URL + `/api/products`
      );
      return response.data;
    }
  }

  async create(product) {
    var result = await axios({
      method: "post",
      url: process.env.REACT_APP_API_URL + "/api/products/create",
      headers: {
        Authorization: localStorage.getItem("DONGGUITAR_JWT_ACCESS_TOKEN")
          ? "Bearer " + localStorage.getItem("DONGGUITAR_JWT_ACCESS_TOKEN")
          : null,
        "X-Refresh-Token": localStorage.getItem("DONGGUITAR_JWT_REFRESH_TOKEN")
          ? localStorage.getItem("DONGGUITAR_JWT_REFRESH_TOKEN")
          : null,
      },
      data: product,
    });
    return result.data;
  }

  async delete(lsId) {
    var result = await axios({
      method: "delete",
      url: process.env.REACT_APP_API_URL + "/api/products/delete",
      headers: {
        Authorization: localStorage.getItem("DONGGUITAR_JWT_ACCESS_TOKEN")
          ? "Bearer " + localStorage.getItem("DONGGUITAR_JWT_ACCESS_TOKEN")
          : null,
        "X-Refresh-Token": localStorage.getItem("DONGGUITAR_JWT_REFRESH_TOKEN")
          ? localStorage.getItem("DONGGUITAR_JWT_REFRESH_TOKEN")
          : null,
      },
      data: lsId,
    });

    return result.data;
  }

  async update(id, dataUpdate) {
    var result = await axios({
      method: "put",
      url: process.env.REACT_APP_API_URL + `/api/products/update/${id}`,
      headers: {
        Authorization: localStorage.getItem("DONGGUITAR_JWT_ACCESS_TOKEN")
          ? "Bearer " + localStorage.getItem("DONGGUITAR_JWT_ACCESS_TOKEN")
          : null,
        "X-Refresh-Token": localStorage.getItem("DONGGUITAR_JWT_REFRESH_TOKEN")
          ? localStorage.getItem("DONGGUITAR_JWT_REFRESH_TOKEN")
          : null,
      },
      data: dataUpdate,
    });
    return result.data;
  }

  async getAmount(type, id) {
    var result = await axios({
      method: "get",
      url:
        process.env.REACT_APP_API_URL +
        `/api/products/getAmount?type=${type}&id=${id}`,
      headers: {},
    });
    return result.data;
  }

  async detail(id) {
    var result = await axios.get(
      process.env.REACT_APP_API_URL + "/api/products/detail/" + id
    );
    return result.data;
  }
}

export default new ProductAPI();
