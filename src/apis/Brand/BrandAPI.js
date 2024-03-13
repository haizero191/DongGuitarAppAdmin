import axios from "axios";

class BrandAPI {

  async get() {
    var result = await axios.get(process.env.REACT_APP_API_URL + "/api/brands");
    return result.data;
  }

  async create(data) {
    var result = await axios({
      method: "post",
      url: "http://localhost:4000/api/brands/create",
      headers: {},
      data: data,
    });

    return result.data;
  }

  async delete(lsId) {
    var result = await axios({
      method: "delete",
      url: "http://localhost:4000/api/brands/delete",
      headers: {
        "Authorization": localStorage.getItem("DONGGUITAR_JWT_ACCESS_TOKEN") ? 'Bearer ' + localStorage.getItem("DONGGUITAR_JWT_ACCESS_TOKEN") : null,
        "X-Refresh-Token": localStorage.getItem("DONGGUITAR_JWT_REFRESH_TOKEN") ? localStorage.getItem("DONGGUITAR_JWT_REFRESH_TOKEN") : null
      },
      data: lsId,
    });

    return result.data;
  }


  async update(id, data) {
    var result = await axios({
      method: "put",
      url: `http://localhost:4000/api/brands/update/${id}`,
      headers: {},
      data: data,
    });
    return result.data;
  }
}

export default new BrandAPI();
