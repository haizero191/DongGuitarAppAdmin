import axios from "axios";

class FeatureAPI {

  async get() {
    var result = await axios.get(process.env.REACT_APP_API_URL + "/api/features");
    return result.data;
  }

  async create(data) {
    var result = await axios({
      method: "post",
      url: process.env.REACT_APP_API_URL + "/api/features/create",
      headers: {
        'Authorization': localStorage.getItem("DONGGUITAR_JWT_ACCESS_TOKEN") ? 'Bearer ' + localStorage.getItem("DONGGUITAR_JWT_ACCESS_TOKEN") : null,
        "X-Refresh-Token": localStorage.getItem("DONGGUITAR_JWT_REFRESH_TOKEN") ? localStorage.getItem("DONGGUITAR_JWT_REFRESH_TOKEN") : null
      },
      data: data,
    });

    return result.data;
  }

  

  async delete(lsId) {
    var result = await axios({
      method: "delete",
      url: process.env.REACT_APP_API_URL + "/api/features/delete",
      headers: {
        'Authorization': localStorage.getItem("DONGGUITAR_JWT_ACCESS_TOKEN") ? 'Bearer ' + localStorage.getItem("DONGGUITAR_JWT_ACCESS_TOKEN") : null,
        "X-Refresh-Token": localStorage.getItem("DONGGUITAR_JWT_REFRESH_TOKEN") ? localStorage.getItem("DONGGUITAR_JWT_REFRESH_TOKEN") : null
      },
      data: lsId,
    });

    return result.data;
  }


  async update(id, data) {
    var result = await axios({
      method: "put",
      url: process.env.REACT_APP_API_URL + `/api/features/update/${id}`,
      headers: {
        'Authorization': localStorage.getItem("DONGGUITAR_JWT_ACCESS_TOKEN") ? 'Bearer ' + localStorage.getItem("DONGGUITAR_JWT_ACCESS_TOKEN") : null,
        "X-Refresh-Token": localStorage.getItem("DONGGUITAR_JWT_REFRESH_TOKEN") ? localStorage.getItem("DONGGUITAR_JWT_REFRESH_TOKEN") : null
      },
      data: data,
    });
    return result.data;
  }
}

export default new FeatureAPI();
