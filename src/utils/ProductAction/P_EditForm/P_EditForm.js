import React, { useState } from "react";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import "./P_EditForm.scss";
import ProductAPI from "../../../apis/Product/ProductAPI";
import BrandAPI from "../../../apis/Brand/BrandAPI";
import Loading from "../../../component/Loading/Loading";
import CategoryAPI from "../../../apis/Category/CategoryAPI";
import ImageAPI from "../../../apis/Image/ImageAPI";
import { useEffect } from "react";
import ProductSpecsAPI from "../../../apis/Product_specs/ProductSpecsAPI";
import DriverAPI from "../../../apis/Driver/DriverAPI";
import SpecsAPI from "../../../apis/Specs/SpecsAPI";

const P_EditForm = ({ onFinish, active, data }) => {
  const [productFiles, setProductFiles] = useState([null, null, null, null, null, null]);
  const [brandList, setBrandList] = useState([]);
  const [cateList, setCateList] = useState([]);
  const [subCateList, setSubCateList] = useState([]);
  const { quill, quillRef } = useQuill();
  const [editorContent, setEditorContent] = useState("");
  const [product, setProduct] = useState({});

  const [isMiniFormActive, setIsMiniFormActive] = useState(false);
  const [productSpecs, setProductSpecs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newSpecs, setNewSpecs] = useState({
    Name: "",
    Description: "",
  });

  useEffect(() => {
    if (quill) {
      quill.root.innerHTML = htmlDecode(data.Description);
      quill.on("text-change", (delta, oldDelta, source) => {
        var htmlEncoded = htmlEncode(quill.root.innerHTML.toString());
        setEditorContent(htmlEncoded);
        // console.log(quill.root.innerHTML); // Get innerHTML using quill
        // console.log(quill.getText()); // Get text only
        // console.log(quill.getContents()); // Get delta contents
        // console.log(quillRef.current.firstChild.innerHTML); // Get innerHTML using quillRef
      });
    }
  }, [quill]);

  useEffect(() => {
    if (!active) {
      dataReset();
      const closeMiniFormEl = document.querySelector(".miniform-close");
      if (closeMiniFormEl.classList.contains("show-miniform-close")) {
        closeMiniFormEl.click();
      }
    } else {
      setProduct(data);
      getBrands();
      getCategories();
      getProductSpecs(data._id);
    }
  }, [active]);

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

  // Upload image
  const onUpload = (index, event) => {
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
  };

  // handle input change
  const handleChange = (event) => {
    setProduct({ ...product, [event.target.name]: event.target.value });
  };

  // handle create Specs change
  const handleSpecsChange = (event) => {
    setNewSpecs({ ...newSpecs, [event.target.name]: event.target.value });
  };

  // Get Product Specs
  const getProductSpecs = async (productId) => {
    const Get_ProductSpecs_Result = await ProductSpecsAPI.get(productId);
    if (Get_ProductSpecs_Result.success) {
      setProductSpecs(Get_ProductSpecs_Result.data);
    }
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
    console.log(Get_Category_Result);
    if (Get_Category_Result.success) {
      setSubCateList(Get_Category_Result.data.SubCategory);
      var dataProductUpdate = product;

      if (!Get_Category_Result.data.SubCategory) {
        dataProductUpdate.SubCategory = null;
        setProduct(dataProductUpdate);
      } else if (Get_Category_Result.data.SubCategory.length === 0) {
        dataProductUpdate.SubCategory = null;
        setProduct(dataProductUpdate);
      }

      setProduct({
        ...dataProductUpdate,
        ["Category"]: event.target.getAttribute("data-value"),
      });
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

  const updateProductImage = async (file, fileSaved) => {
    if (file && fileSaved) {
      var [Delete_Driver_Result, Upload_Driver_Result] = await Promise.all([
        DriverAPI.delete(fileSaved.DriverId),
        DriverAPI.upload([file]),
      ]);

      if (Delete_Driver_Result.success && Upload_Driver_Result.success) {
        var Update_Image_Result = await ImageAPI.update(fileSaved._id, {
          DriverId: Upload_Driver_Result.data[0].id,
          Url: Upload_Driver_Result.data[0].url,
        });

        if (Update_Image_Result.success) return Update_Image_Result.data;
      }
    } else if (file && !fileSaved) {
      var Upload_Driver_Result = await DriverAPI.upload([file]);
      if (Upload_Driver_Result.success) {
        const Create_Image_Result = await ImageAPI.create(
          Upload_Driver_Result.data[0]
        );
        if (Create_Image_Result.success) return Create_Image_Result.data;
      }
    } else if (!file && fileSaved) {
      return fileSaved;
    }
  };

  // handle save update
  const onSave = async () => {
    var updateProduct = product;
    updateProduct = { ...updateProduct, ["Description"]: editorContent };

    setIsLoading(true);
    var Update_Product_Image_Result = await Promise.all(
      productFiles.map(async (file, index) => {
        if (await updateProductImage(file, updateProduct.Images[index]))
          return await updateProductImage(file, updateProduct.Images[index]);
      })
    );

    Update_Product_Image_Result = Update_Product_Image_Result.filter(
      (Image) => {
        return Image !== undefined;
      }
    );

    updateProduct.Images = Update_Product_Image_Result;

    // Update thông tin sản phẩm
    var [U_Product_Result] = await Promise.all([
      ProductAPI.update(updateProduct._id, updateProduct),
    ]);

    console.log(U_Product_Result.success);

    // Kết thúc xử lí
    if (U_Product_Result.success) {
      onFinish({
        status: "FORM_FINISHED",
      });
      alert("Update product success");
      setIsLoading(false);
    } else {
      alert("Update failed");
      setIsLoading(false);
    }
  };

  // Handle add new Product Specs
  const onAddProductSpecs = async () => {
    var Create_ProductSpecs_Result = await ProductSpecsAPI.create({
      Product: product._id,
      Name: newSpecs.Name,
      Description: newSpecs.Description,
    });

    if (Create_ProductSpecs_Result.success) {
      getProductSpecs(product._id);
      var inputNameEl = document.querySelector(
        ".miniform-container-left .specs-name input"
      );
      var inputDescEl = document.querySelector(
        ".miniform-container-left .specs-desc input"
      );
      inputNameEl.value = "";
      inputDescEl.value = "";
    }
  };

  // Handle delete Products Specs
  const onDeleteProductSpecs = async (productSpecs, event) => {
    const Delete_ProductSpecs_Result = await ProductSpecsAPI.delete([productSpecs._id]);
    if (Delete_ProductSpecs_Result.success) {
      getProductSpecs(product._id);
    }
  };

  // Kiểm tra dữ liệu form
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

  // Get image from google driver
  const getImageFromDriver = (id) => {
    return `https://lh3.googleusercontent.com/d/${id}?authuser=0`;
  };

  const onCancel = () => {
    dataReset();
    closeMiniForm();
    onFinish({
      status: "FORM_FINISHED",
    });
  };

  // open mini form
  const openMiniForm = () => {
    setIsMiniFormActive((isMiniFormActive) => !isMiniFormActive);
  };

  // close mini form
  const closeMiniForm = () => {
    setIsMiniFormActive(false);
  };

  return (
    <div className="P_EditForm">
      <div className="form-container">
        {!active ? (
          <></>
        ) : (
          <div>
            {/* Image Area */}
            <div className="flex-row">
              <div className="field-input flex-60">
                <div className="video-container">
                  <div className="image-empty">
                    <i className="bi bi-youtube"></i>
                    <input
                      type="text"
                      className="video-input"
                      name="Video"
                      onChange={handleChange}
                      value={product.Video}
                    />
                    <p>Import Youtube Link</p>
                  </div>
                </div>
              </div>
              <div className="field-input flex-40">
                <div className="flex-row">
                  {Array.from({ length: 6 }).map((file, index) => {
                    return (
                      <div
                        className="field-input flex-50"
                        style={{ margin: 0 }}
                        onClick={() => onUpload(index)}
                        key={"product-image-upload-" + index}
                      >
                        <div className="image-container">
                          <div className="image-empty">
                            <i className="bi bi-image"></i>
                            <p>Upload</p>
                          </div>
                          {data.Images[index] ? (
                            <div className="image-load">
                              <img
                                alt="img-edit"
                                src={getImageFromDriver(
                                  data.Images[index].DriverId
                                )}
                              />
                            </div>
                          ) : (
                            <></>
                          )}

                          {productFiles[index] ? (
                            <div className="image-load">
                              <img
                                alt="img-edit"
                                src={URL.createObjectURL(productFiles[index])}
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

            {/* Form input content Area */}
            <div className="flex-row">
              <div className="field-input flex-70">
                <p>Name</p>
                <input
                  type="text"
                  name="Name"
                  onChange={(e) => handleChange(e)}
                  value={product.Name}
                ></input>
              </div>
              <div className="field-input flex-30">
                <p>Brand</p>
                <input
                  type="text"
                  name="Brand"
                  onChange={handleChange}
                  value={product.Brand ? product.Brand.Name : ""}
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
                <input
                  type="text"
                  name="Category"
                  value={product.Category ? product.Category.Name : ""}
                  readOnly
                ></input>
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
                <input
                  type="text"
                  name="SubCategory"
                  value={product.SubCategory ? product.SubCategory.Name : ""}
                  readOnly
                ></input>
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
                  value={product.PurchasePrice}
                ></input>
              </div>
              <div className="field-input flex-40">
                <p>Selling price</p>
                <input
                  type="number"
                  name="SellingPrice"
                  onChange={handleChange}
                  value={product.SellingPrice}
                ></input>
              </div>
              <div className="field-input flex-20">
                <p>Quantity</p>
                <input
                  type="number"
                  name="Quantity"
                  onChange={handleChange}
                  value={product.Quantity}
                ></input>
              </div>
            </div>
          </div>
        )}

        {/* Description input Area */}
        <div className="flex-row">
          <div className="field-input flex-100">
            <p style={{ marginBottom: "12px" }}>Description</p>
            <div ref={quillRef} style={{ height: "350px" }}></div>
          </div>
        </div>

        {/* Button actions input Area */}
        <div className="flex-row">
          <div className="btn-final">
            <button onClick={onCancel}>Cancel</button>
            <button onClick={onSave}>
              {isLoading ? (
                <Loading isLoading={isLoading}></Loading>
              ) : (
                <span>Update</span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="miniform-container-left">
        {active ? (
          <div
            className={
              isMiniFormActive ? "specs-btn show-specs-btn" : "specs-btn"
            }
            onClick={openMiniForm}
          >
            <span>Advanced</span>
          </div>
        ) : (
          <></>
        )}

        <div
          className={isMiniFormActive ? "miniform miniform-active" : "miniform"}
        >
          <div className="miniform-header">
            <h2>Key Features </h2>
          </div>

          <div
            className={
              isMiniFormActive
                ? "miniform-close show-miniform-close"
                : "miniform-close"
            }
            onClick={closeMiniForm}
          >
            <i class="bi bi-arrow-left-short"></i>
          </div>

          <div className="miniform-content">
            {/* Specs Create HTML */}
            <div className="miniform-create">
              <div className="miniform-flex-row">
                <div className="field-input specs-name">
                  <input
                    type="text"
                    name="Name"
                    placeholder="Name"
                    onChange={handleSpecsChange}
                  ></input>
                </div>
                <div className="field-input specs-desc">
                  <input
                    type="text"
                    name="Description"
                    placeholder="Description"
                    onChange={handleSpecsChange}
                  ></input>
                </div>
                <button onClick={onAddProductSpecs}>
                  <i class="bi bi-plus"></i>
                </button>
              </div>
            </div>

            {/* Specs List HTML */}
            <div className="miniform-list">
              {productSpecs.map((ps) => {
                return (
                  <div className="specs-item">
                    <span>{ps.Name}</span>
                    <span>{ps.Description}</span>
                    <span onClick={(event) => onDeleteProductSpecs(ps, event)}>
                      <i class="bi bi-x-lg"></i>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default P_EditForm;
