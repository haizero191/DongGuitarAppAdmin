import axios from "axios";

class ProductFeatureAPI {

  async get() {
    var result = await axios.get(process.env.REACT_APP_API_URL + "/api/product-feature");
    return result.data;
  }

  async getProductWithFeatureId(featureId) {
    var result = await axios.get(process.env.REACT_APP_API_URL + `/api/product-feature/getProductWithFeatureId/${featureId}`);
    return result.data;
  }

  async create(data) {
    var result = await axios({
      method: "post",
      url: process.env.REACT_APP_API_URL + "/api/product-feature/create",
      headers: {
        'Authorization': localStorage.getItem("DONGGUITAR_JWT_ACCESS_TOKEN") ? 'Bearer ' + localStorage.getItem("DONGGUITAR_JWT_ACCESS_TOKEN") : null,
        "X-Refresh-Token": localStorage.getItem("DONGGUITAR_JWT_REFRESH_TOKEN") ? localStorage.getItem("DONGGUITAR_JWT_REFRESH_TOKEN") : null
      },
      data: data,
    });

    return result.data;
  }

  async delete(featureId, productId) {
    var result = await axios({
      method: "delete",
      url: process.env.REACT_APP_API_URL + "/api/product-feature/delete",
      headers: {
        'Authorization': localStorage.getItem("DONGGUITAR_JWT_ACCESS_TOKEN") ? 'Bearer ' + localStorage.getItem("DONGGUITAR_JWT_ACCESS_TOKEN") : null,
        "X-Refresh-Token": localStorage.getItem("DONGGUITAR_JWT_REFRESH_TOKEN") ? localStorage.getItem("DONGGUITAR_JWT_REFRESH_TOKEN") : null
      },
      data: {
        feature: featureId,
        product: productId
      },
    });

    return result.data;
  }


//   async update(id, data) {
//     var result = await axios({
//       method: "put",
//       url: process.env.REACT_APP_API_URL + `/api/brands/update/${id}`,
//       headers: {},
//       data: data,
//     });
//     return result.data;
//   }
}

export default new ProductFeatureAPI();
