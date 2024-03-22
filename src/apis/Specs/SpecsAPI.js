// import axios from "axios";

// class SpecsAPI {
 
// //   async get(productId) {
// //     var result = await axios({
// //       method: "get",
// //       url: process.env.REACT_APP_API_URL + "/api/product_specs?productId=" + productId,
// //       headers: {
// //         "Authorization": localStorage.getItem("DONGGUITAR_JWT_ACCESS_TOKEN") ? 'Bearer ' + localStorage.getItem("DONGGUITAR_JWT_ACCESS_TOKEN") : null,
// //         "X-Refresh-Token": localStorage.getItem("DONGGUITAR_JWT_REFRESH_TOKEN") ? localStorage.getItem("DONGGUITAR_JWT_REFRESH_TOKEN") : null
// //       }
// //     });
// //     return result.data;
// //   }

//   async create(data) {
//     var result = await axios({
//       method: "post",
//       url: process.env.REACT_APP_API_URL + "/api/specs/create",
//       headers: {
//         "Authorization": localStorage.getItem("DONGGUITAR_JWT_ACCESS_TOKEN") ? 'Bearer ' + localStorage.getItem("DONGGUITAR_JWT_ACCESS_TOKEN") : null,
//         "X-Refresh-Token": localStorage.getItem("DONGGUITAR_JWT_REFRESH_TOKEN") ? localStorage.getItem("DONGGUITAR_JWT_REFRESH_TOKEN") : null
//       },
//       data: data,
//     });
//     return result.data;
//   }

//   async delete(lsId) {
//     var result = await axios({
//       method: "delete",
//       url: process.env.REACT_APP_API_URL + "/api/specs/delete",
//       headers: {
//         "Authorization": localStorage.getItem("DONGGUITAR_JWT_ACCESS_TOKEN") ? 'Bearer ' + localStorage.getItem("DONGGUITAR_JWT_ACCESS_TOKEN") : null,
//         "X-Refresh-Token": localStorage.getItem("DONGGUITAR_JWT_REFRESH_TOKEN") ? localStorage.getItem("DONGGUITAR_JWT_REFRESH_TOKEN") : null
//       },
//       data: lsId,
//     });

//     return result.data;
//   }

// //   async update(id, dataUpdate) {
// //     var result = await axios({
// //       method: "put",
// //       url: process.env.REACT_APP_API_URL + `/api/product_specs/update/${id}`,
// //       headers: {
// //         "Authorization": localStorage.getItem("DONGGUITAR_JWT_ACCESS_TOKEN") ? 'Bearer ' + localStorage.getItem("DONGGUITAR_JWT_ACCESS_TOKEN") : null,
// //         "X-Refresh-Token": localStorage.getItem("DONGGUITAR_JWT_REFRESH_TOKEN") ? localStorage.getItem("DONGGUITAR_JWT_REFRESH_TOKEN") : null
// //       },
// //       data: dataUpdate,
// //     });
// //     return result.data;
// //   }
// }

// export default new SpecsAPI();
