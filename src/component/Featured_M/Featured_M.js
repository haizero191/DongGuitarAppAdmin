import React, { useState, useEffect } from "react";
import "./Featured_M.scss";
import FeatureAPI from "../../apis/Feature/FeatureAPI";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import ProductFeatureAPI from "../../apis/ProductFeature/ProductFeatureAPI";
import Modal from "../Modal/Modal";
import PF_ProductAddForm from "../../utils/ProductFeatureAction/PF_ProductAddForm/PF_ProductAddForm";
import Loading from "../Loading/Loading";
import F_CreateForm from "../../utils/FeatureAction/F_CreateForm/F_CreateForm";
import F_EditForm from "../../utils/FeatureAction/F_EditForm/F_EditForm";

const Featured_M = ({ onLoad, isLoading }) => {
  const [isModalActive, setIsModalActive] = useState(false);
  const [modalAction, setModalAction] = useState(null);
  const [modalTitle, setModalTitle] = useState("");
  const [featuredList, setFeaturedList] = useState([]);
  const [featuredSelected, setFeaturedSelected] = useState(null);
  const [productList, setProductList] = useState([]);


  const onDelete = async () => {
    if (productList.length > 0) {
      alert("You must remove all products before you can take this action !");
    } else {
      if (
        window.confirm("Delete feature had selected ! Are you sure ?") == true
      ) {
        var Delete_Feature_Result = await FeatureAPI.delete([
          featuredSelected._id,
        ]);
        if (Delete_Feature_Result.success) {
          alert("Feature deleted !");
          loadData();
        }
      } else {
      }
    }
  };
  const onCreateFeature = () => {
    setIsModalActive(true);
    setModalTitle("Feature Information");
    setModalAction("FEATURE_CREATE");
  };
  const onEdit = async () => {
    setIsModalActive(true);
    setModalTitle("Feature Edit Form");
    setModalAction("FEATURE_EDIT");
  };

  // Load data brand
  const loadData = async () => {

    const Get_Featured_Result = await FeatureAPI.get();
    if (Get_Featured_Result.success) {
      setFeaturedList(Get_Featured_Result.data);
      setFeaturedSelected(Get_Featured_Result.data[0]);

      onLoad({
        name: "product-feature",
        isLoaded: true,
      });
    } else {

    }
  };

  // Xửa lí modal
  const handleModalAction = (data) => {
    switch (data.status) {
      case "close":
        setIsModalActive(false);
        break;
      default:
        break;
    }
  };

  const handleTabChange = (tabIndex) => {
    setFeaturedSelected(featuredList[tabIndex]);
  };

  // Handle adding product
  const onAddProduct = () => {
    setIsModalActive(true);
    setModalTitle("Choose featured products");
    setModalAction("P_F_ADD");
  };

  // Listen actions form
  const onActionForm = (data) => {


    if (data.status === "FORM_FINISHED") {
      setIsModalActive(false);
      console.log(data)
    }
    if (data.status === "FORM_CANCEL") {
      setIsModalActive(false);
      console.log(data)
    }

    loadData();
  };

  // Remove product from feature
  const onDeleteProductFeature = async (featureId, productId) => {
    if (
      window.confirm("Removed product in this feature ! Are you sure ?") ===
      true
    ) {
      var Delete_ProductFeature_Result = await ProductFeatureAPI.delete(
        featureId,
        productId
      );
      if (Delete_ProductFeature_Result.success) {
        loadData();
      } else {
        alert("Product remove had error !");
      }
    }
  };

  // Listen onchange switch active
  const onFeatureActiveChange = async (event) => {
    var featureUpdate = featuredSelected;
    featureUpdate.IsActive = event.target.checked;
    var Update_Feature_Result = await FeatureAPI.update(
      featureUpdate._id,
      featureUpdate
    );

    console.log("event changed", Update_Feature_Result);
    if (Update_Feature_Result.success && featureUpdate.IsActive) {
      event.target.checked = featureUpdate.IsActive;
    } else if (Update_Feature_Result.success && !featureUpdate.IsActive) {
      event.target.checked = featureUpdate.IsActive;
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const getDataProductWithFeatureId = async (id) => {
      var Get_Product_FeatureId_Result =
        await ProductFeatureAPI.getProductWithFeatureId(id);
      var products = Get_Product_FeatureId_Result.data.map((PF) => PF.Product);
      setProductList(products);
    };
    if (featuredSelected) getDataProductWithFeatureId(featuredSelected._id);
  }, [featuredSelected]);

  return isLoading ? (
    <></>
  ) : (
    <div className="Featured_M">
      <div className="FM-header">
        <div className="title">Sản phẩm nổi bật</div>
        <div className="btn-action">
          <button className="btn-delete" onClick={onDelete}>
            Xóa
          </button>
          <button className="btn-edit" onClick={onEdit}>
            Chỉnh sửa
          </button>
          <button className="btn-create" onClick={onCreateFeature}>
            Tạo mới
          </button>
        </div>
      </div>

      <div className="FM-main">
        <div className="tabs-container">
          <Tabs onSelect={(index) => handleTabChange(index)}>
            <TabList>
              {featuredList.map((featured) => {
                return (
                  <Tab key={"tab-feature" + featured._id}>{featured.Name}</Tab>
                );
              })}
            </TabList>

            <div className="tab-main">
              <div className="products-container">
                {featuredList.map((featured) => {
                  return (
                    <TabPanel key={"tab-feature-content" + featured._id}>
                      <div className="P-list">
                        <div className="P-list-header">
                          <div className="P-h-item p-h-checkbox"></div>
                          <div className="P-h-item p-h-name">Name</div>
                          <div className="P-h-item p-h-actions"></div>
                        </div>
                        <div className="P-list-body">
                          <div className="P-list-inner">
                            {productList.length > 0 ? (
                              productList.map((product, index) => {
                                return (
                                  <div
                                    className="P-item"
                                    key={
                                      "Product-feature-render-" +
                                      featured._id +
                                      "-" +
                                      product._id +
                                      "-" +
                                      index
                                    }
                                  >
                                    <div className="p-checkbox"></div>
                                    <div className="p-name">{product.Name}</div>
                                    <div className="p-actions">
                                      <div
                                        className="remove"
                                        onClick={() =>
                                          onDeleteProductFeature(
                                            featured._id,
                                            product._id
                                          )
                                        }
                                      >
                                        <i className="bi bi-x"></i>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })
                            ) : (
                              <p className="no-product">
                                Chưa có sản phẩm nổi bật nào
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </TabPanel>
                  );
                })}
              </div>

              {!featuredSelected ? (
                <></>
              ) : (
                <>
                  <div className="actions-p-f">
                    <p>Actions</p>
                    <button onClick={onAddProduct}>
                      Thêm sản phẩm
                      <i className="bi bi-plus"></i>
                    </button>
                    <button className="switch-active">
                      Hiển thị nội dung
                      <label className="switch">
                        <input
                          className="switch-active-btn"
                          type="checkbox"
                          onChange={(event) => onFeatureActiveChange(event)}
                          checked={featuredSelected.IsActive}
                        />
                        <span className="slider round"></span>
                      </label>
                    </button>
                  </div>
                </>
              )}
            </div>
          </Tabs>
        </div>
      </div>

      <div className="modal-container">
        <Modal
          active={isModalActive}
          action={handleModalAction}
          title={modalTitle}
          size={
            modalAction === "FEATURE_CREATE" || modalAction === "FEATURE_EDIT"
              ? "sm"
              : ""
          }
        >
          {modalAction === "P_F_ADD" ? (
            // eslint-disable-next-line react/jsx-pascal-case
            <PF_ProductAddForm
              onFinish={onActionForm}
              active={isModalActive}
              data={{
                feature: featuredSelected,
                products: productList,
              }}
            />
          ) : (
            <></>
          )}

          {modalAction === "FEATURE_CREATE" ? (
            // eslint-disable-next-line react/jsx-pascal-case
            <F_CreateForm onFinish={onActionForm} active={isModalActive} />
          ) : (
            <></>
          )}

          {modalAction === "FEATURE_EDIT" ? (
            // eslint-disable-next-line react/jsx-pascal-case
            <F_EditForm
              onFinish={onActionForm}
              active={isModalActive}
              data={featuredList.find((p) => p._id === featuredSelected._id)}
            />
          ) : (
            <></>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default Featured_M;
