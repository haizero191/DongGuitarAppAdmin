import axios from "axios";

class CategoryAPI {
  async get() {
    var result = await axios.get(process.env.REACT_APP_API_URL + "/api/categories");
    return result.data;
  }

  async create(category) {
    var result = await axios({
      method: "post",
      url: process.env.REACT_APP_API_URL + "/api/categories/create",
      headers: {
        "Authorization": localStorage.getItem("DONGGUITAR_JWT_ACCESS_TOKEN") ? 'Bearer ' + localStorage.getItem("DONGGUITAR_JWT_ACCESS_TOKEN") : null,
        "X-Refresh-Token": localStorage.getItem("DONGGUITAR_JWT_REFRESH_TOKEN") ? localStorage.getItem("DONGGUITAR_JWT_REFRESH_TOKEN") : null
      },
      data: category,
    });

    return result.data;
  }

  async delete(ids) {
    var result = await axios({
      method: "delete",
      url: process.env.REACT_APP_API_URL + "/api/categories/delete",
      headers: {
        "Authorization": localStorage.getItem("DONGGUITAR_JWT_ACCESS_TOKEN") ? 'Bearer ' + localStorage.getItem("DONGGUITAR_JWT_ACCESS_TOKEN") : null,
        "X-Refresh-Token": localStorage.getItem("DONGGUITAR_JWT_REFRESH_TOKEN") ? localStorage.getItem("DONGGUITAR_JWT_REFRESH_TOKEN") : null
      },
      data: ids,
    });
    return result.data;
  }

  async update(id, data) {
    var result = await axios({
      method: "put",
      url: process.env.REACT_APP_API_URL + `/api/categories/update/${id}`,
      headers: {
        "Authorization": localStorage.getItem("DONGGUITAR_JWT_ACCESS_TOKEN") ? 'Bearer ' + localStorage.getItem("DONGGUITAR_JWT_ACCESS_TOKEN") : null,
        "X-Refresh-Token": localStorage.getItem("DONGGUITAR_JWT_REFRESH_TOKEN") ? localStorage.getItem("DONGGUITAR_JWT_REFRESH_TOKEN") : null
      },
      data: data,
    });
    return result.data;
  }

  async detail(id) {
    var result = await axios.get(process.env.REACT_APP_API_URL + "/api/categories/detail/" + id);
    return result.data;
  }
}

export default new CategoryAPI();
