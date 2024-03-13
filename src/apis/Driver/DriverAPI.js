import axios from "axios";

class DriverAPI {
//   async create(image) {
//     var result = await axios({
//       method: "post",
//       url: "http://localhost:4000/api/images/create",
//       headers: {},
//       data: image,
//     });
//     return result.data;
//   }

  async upload(imageFiles) {
    const formData = new FormData();
    imageFiles.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const response = await axios.post(
        process.env.REACT_APP_API_URL + "/api/images/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": localStorage.getItem("DONGGUITAR_JWT_ACCESS_TOKEN") ? 'Bearer ' + localStorage.getItem("DONGGUITAR_JWT_ACCESS_TOKEN") : null,
            "X-Refresh-Token": localStorage.getItem("DONGGUITAR_JWT_REFRESH_TOKEN") ? localStorage.getItem("DONGGUITAR_JWT_REFRESH_TOKEN") : null
          },
        }
      );
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      console.error("Error uploading images:", error);
    }
  }

  async delete(id) {
    var result = await axios({
      method: "delete",
      url: `http://localhost:4000/api/images/drive/delete`,
      headers: {
        "Authorization": localStorage.getItem("DONGGUITAR_JWT_ACCESS_TOKEN") ? 'Bearer ' + localStorage.getItem("DONGGUITAR_JWT_ACCESS_TOKEN") : null,
        "X-Refresh-Token": localStorage.getItem("DONGGUITAR_JWT_REFRESH_TOKEN") ? localStorage.getItem("DONGGUITAR_JWT_REFRESH_TOKEN") : null
      },
      data: id
    });
    return result.data;
  }

}

export default new DriverAPI();
