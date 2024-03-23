import React, { useEffect, useState } from "react";
import "./P_CreateForm.scss";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import ProductAPI from "../../../apis/Product/ProductAPI";
import BrandAPI from "../../../apis/Brand/BrandAPI";
import Loading from "../../../component/Loading/Loading";
import CategoryAPI from "../../../apis/Category/CategoryAPI";
import ImageAPI from "../../../apis/Image/ImageAPI";

import AuthAPI from "../../../apis/Auth/AuthAPI";

const P_CreateForm = ({ onFinish, active }) => {
  const { quill, quillRef } = useQuill();

  const [product, setProduct] = useState({});
  const [brandList, setBrandList] = useState([]);
  const [cateList, setCateList] = useState([]);
  const [subCateList, setSubCateList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editorContent, setEditorContent] = useState("");
  const [productFiles, setProductFiles] = useState([null, null, null, null, null, null]);
  const [productVideo, setProductVideo] = useState([]);
  const [isMiniFormActive, setIsMiniFormActive] = useState(false);

  useEffect(() => {
    if (quill) {
      quill.on("text-change", (delta, oldDelta, source) => {
        var htmlEncoded = htmlEncode(quill.root.innerHTML.toString());
        setEditorContent(htmlEncoded);
      });
      console.log("active form", active);
    }
  }, [quill]);

  useEffect(() => {
    if (!active) {
      dataReset();
      quill.setContents([{ insert: "\n" }]);
      closeMiniForm();
    } else {
      getBrands();
      getCategories();
    }
  }, [active]);

  useEffect(() => {
    console.log("image upload");
  }, [productFiles]);

  // Editor Encoded
  const htmlEncode = (input) => {
    const textArea = document.createElement("textarea");
    textArea.innerText = input;
    return textArea.innerHTML.split("<br>").join("\n");
  };

  // Editor Dencoded
  const htmlDecode = (input) => {
    const textArea = document.createElement("textarea");
    textArea.innerHTML = input;
    return textArea.value;
  };

  // get all brand for product select
  const getBrands = async () => {
    var result = await BrandAPI.get();
    if (result.data) setBrandList(result.data);
  };
  // get all category for product select
  const getCategories = async () => {
    var result = await CategoryAPI.get();
    if (result.data) setCateList(result.data);
  };

  // handle save a new product
  const onSave = async () => {
    var newProduct = product;
    newProduct = { ...newProduct, ["Description"]: editorContent };

    if (dataChecker(newProduct)) {
      //-------------------------- HANDLE CREATE A NEW PRODUCT -------------------------------

      try {
        setIsLoading(true);
        var [C_Product_Result, C_Image_Result] = await Promise.all([
          ProductAPI.create(newProduct), // Tạo sản phẩm trong database
          ImageAPI.upload(productFiles), // Upload hình ảnh lên google driver
        ]);
        // Xử lí Promise result ----------------------------------------------
        if (C_Product_Result.success && C_Image_Result.success) {
          // Tạo document Image trong database --------------------------------
          var Upload_Image_Result = await Promise.all(
            C_Image_Result.data.map(async (item) => {
              var result = await ImageAPI.create(item);
              return result;
            })
          );

          console.log("Image Uploading....");
          // Xử lí kết quả tạo document Image ---------------------------------
          var productCreated = C_Product_Result.data;
          // Update Liên kết Hình ảnh vừa tạo cho sản phẩm --------------------
          if (Upload_Image_Result) {
            var imageList = Upload_Image_Result.map((res) => res.data._id);
            var updateResult = await ProductAPI.update(productCreated._id, {
              Images: imageList,
            });
            console.log("Product Updating....");
            // Xử lí kết quả update sản phẩm theo hình ảnh
            if (updateResult.success) {
              console.log("Finish and Close....");
              setIsLoading(false);
              onFinish({
                status: "FORM_FINISHED",
              });
              dataReset();
            } else {
              alert("Update product failed !");
            }
          } else {
            alert("Upload image failed !");
          }
        } else {
          alert("Product create failed !");
        }
      } catch (error) {
        console.log("Have error: ", error);
        return;
      }
      //--------------------------------------------------------------------------------------
    } else {
      alert("Vui lòng điền đầy đủ thông tin để tạo sản phẩm mới");
    }
  };

  // Kiểm tra form
  const dataChecker = (data) => {
    if (
      data.Name &&
      data.Brand &&
      data.Category &&
      data.Description &&
      data.SellingPrice &&
      data.PurchasePrice &&
      data.Quantity
    ) {
      return true;
    } else {
      return false;
    }
  };

  // reset form create
  const dataReset = () => {
    setProduct({});
    setBrandList([]);
    setCateList([]);
    setEditorContent("");
    setProductFiles([null, null, null, null]);
  };

  // cancel form create
  const onCancel = () => {
    onFinish({
      status: "FORM_CANCEL",
    });
    dataReset();
  };

  // handle input change
  const handleChange = (event) => {
    setProduct({ ...product, [event.target.name]: event.target.value });
  };

  // handle brand selected
  const onBrandSelected = (event) => {
    var brandEL = document.getElementsByName("Brand");
    brandEL[0].value = event.target.getAttribute("data-name");
    setProduct({
      ...product,
      ["Brand"]: event.target.getAttribute("data-value"),
    });
  };

  // handle brand selected
  const onSubCateSelected = (event) => {
    var subCateEL = document.getElementsByName("SubCategory");
    subCateEL[0].value = event.target.getAttribute("data-name");
    setProduct({
      ...product,
      ["SubCategory"]: event.target.getAttribute("data-value"),
    });
  };

  // handle category selected
  const onCateSelected = async (event) => {
    var cateEL = document.getElementsByName("Category");
    cateEL[0].value = event.target.getAttribute("data-name");
    var Get_Category_Result = await CategoryAPI.detail(
      event.target.getAttribute("data-value")
    );
    if (Get_Category_Result.success) {
      setSubCateList(Get_Category_Result.data.SubCategory);
    }
    setProduct({
      ...product,
      ["Category"]: event.target.getAttribute("data-value"),
    });
  };

  // Handle image uploade
  const onUpload = (index, event) => {
    var fileTypeUpload = event.currentTarget.getAttribute("data-name");
    if (fileTypeUpload === "image-upload-element") {
      const inputUpload = document.createElement("input");
      inputUpload.type = "file";
      inputUpload.addEventListener("change", (event) => {
        var files = inputUpload.files;
        if (files && files[0]) {
          var fileList = productFiles;
          fileList[index] = files[0];
          setProductFiles([...fileList]);
        }
      });
      inputUpload.click();
    } else if (fileTypeUpload === "video-upload-element") {
      const inputUpload = document.createElement("input");
      inputUpload.type = "file";
      inputUpload.addEventListener("change", (event) => {
        var files = inputUpload.files;
        if (files[0]) {
          var fileList = productVideo;
          fileList[0] = files[0];
          setProductVideo(fileList);
        }
      });
      inputUpload.click();
    }
  };

  // mini form action
  const openMiniForm = () => {
    setIsMiniFormActive((isMiniFormActive) => !isMiniFormActive);
  };

  // Handle miniform close
  const closeMiniForm = () => {
    setIsMiniFormActive(false);
  };

  return (
    <div className="P_CreateForm">
      <div className="form-container">
        {!active ? (
          <></>
        ) : (
          <div>
            <div className="flex-row">
              <div
                className="field-input flex-60"
                // onClick={(event) => onUpload(0, event)}
                data-name="video-upload-element"
              >
                <div className="video-container">
                  <div className="image-empty">
                    <i class="bi bi-youtube"></i>
                    <input
                      type="text"
                      className="video-input"
                      name="Video"
                      onChange={handleChange}
                    />
                    <p>Import Youtube Link</p>
                  </div>
                </div>
              </div>
              <div className="field-input flex-40">
                <div className="flex-row">
                  {productFiles.map((file, index) => {
                    return (
                      <div
                        className="field-input flex-50"
                        style={{ margin: 0 }}
                        onClick={(event) => onUpload(index, event)}
                        key={"product-image-upload-" + index}
                        data-name="image-upload-element"
                      >
                        <div className="image-container">
                          <div className="image-empty">
                            <i class="bi bi-image"></i>
                            <p>Upload</p>
                          </div>

                          {file ? (
                            <div className="image-load">
                              <img
                                alt="image"
                                src={URL.createObjectURL(file)}
                              />
                            </div>
                          ) : (
                            <></>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <br />
            <div className="flex-row">
              <div className="field-input flex-70">
                <p>Name</p>
                <input type="text" name="Name" onChange={handleChange}></input>
              </div>
              <div className="field-input flex-30">
                <p>Brand</p>
                <input
                  type="text"
                  name="Brand"
                  onChange={handleChange}
                  readOnly
                ></input>
                <div className="drop-menu">
                  <p>Brand list</p>
                  <ul>
                    {brandList.map((brand) => {
                      return (
                        <li
                          key={"np-create-brand-selected" + brand._id}
                          onClick={onBrandSelected}
                          data-name={brand.Name}
                          data-value={brand._id}
                        >
                          {brand.Name}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
            <div className="flex-row">
              <div className="field-input flex-50">
                <p>Category</p>
                <input type="text" name="Category" readOnly></input>
                <div className="drop-menu">
                  <p>Category list</p>
                  <ul>
                    {cateList.map((cate) => {
                      return (
                        <li
                          key={"np-create-category-selected" + cate._id}
                          onClick={onCateSelected}
                          data-name={cate.Name}
                          data-value={cate._id}
                        >
                          {cate.Name}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
              <div className="field-input flex-50">
                <p>Sub-Category</p>
                <input type="text" name="SubCategory" readOnly></input>
                <div className="drop-menu">
                  <p>Category list</p>
                  <ul>
                    {subCateList &&
                      subCateList.map((subCate) => {
                        return (
                          <li
                            key={"np-create-subcategory-selected" + subCate._id}
                            onClick={onSubCateSelected}
                            data-name={subCate.Name}
                            data-value={subCate._id}
                          >
                            {subCate.Name}
                          </li>
                        );
                      })}
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex-row">
              <div className="field-input flex-40">
                <p>Purchase price</p>
                <input
                  type="number"
                  name="PurchasePrice"
                  onChange={handleChange}
                ></input>
              </div>
              <div className="field-input flex-40">
                <p>Selling price</p>
                <input
                  type="number"
                  name="SellingPrice"
                  onChange={handleChange}
                ></input>
              </div>
              <div className="field-input flex-20">
                <p>Quantity</p>
                <input
                  type="number"
                  name="Quantity"
                  onChange={handleChange}
                ></input>
              </div>
            </div>
          </div>
        )}

        <div className="flex-row">
          <div className="field-input flex-100">
            <p style={{ marginBottom: "12px" }}>Description</p>
            <div ref={quillRef} style={{ height: "350px" }}></div>
          </div>
        </div>

        <div className="flex-row">
          <div className="btn-final">
            <button onClick={onCancel}>Cancel</button>
            <button onClick={onSave}>
              {!isLoading ? <p>Save</p> : <></>}

              <Loading isLoading={isLoading}></Loading>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default P_CreateForm;
