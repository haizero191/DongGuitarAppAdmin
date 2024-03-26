import React, { useEffect, useState } from "react";
import "./PF_ProductAddForm.scss";
import Loading from "../../../component/Loading/Loading";
import ProductAPI from "../../../apis/Product/ProductAPI";
import ProductFeatureAPI from "../../../apis/ProductFeature/ProductFeatureAPI";

const PF_ProductAddForm = ({ onFinish, active, data }) => {
  const [productList, setProductList] = useState([]);
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const [productSelected, setProductSelected] = useState([]);
  const [productLastSelected, setProductLastSelected] = useState([]);
  const [navigateData, setNavigateData] = useState(null);
  const [page, setPage] = useState(1);

  const loadData = async () => {
    var Get_Product_Result = await ProductAPI.get({
      page: page,
      limit: 5,
      filter: null,
    });

    if (Get_Product_Result.success) {

      setProductLastSelected(data.products);
      setNavigateData(Get_Product_Result.navigate);
      setProductList(Get_Product_Result.data);
    }
  };

  // Chuyển đổi sang định dạng VND
  const formatCurrency = (amount) => {
    const formatter = new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    });
    return formatter.format(amount);
  };

  const onSave = async () => {
    setIsLoadingButton(true);
    var Create_ProductFeature_Result_Map = await Promise.all([
      productSelected.map((product) => {
        return ProductFeatureAPI.create({
          Feature: data.feature._id,
          Product: product._id,
        });
      }),
    ]);

    var response = await Promise.all(
      Create_ProductFeature_Result_Map[0].map((promise) => {
        return promise;
      })
    );

    var checkResponse = response.map((result) => result.success);
    const hasFalse = checkResponse.some((element) => !element);

    if (!hasFalse) {
      onFinish({
        status: "FORM_FINISHED",
      });
      setIsLoadingButton(false);
      setProductSelected([]);
    } else {
      setIsLoadingButton(false);
      alert("Thêm sản phẩm thất bại");
    }
  };

  const onProductSelect = (product, event) => {
    var pSelected = productSelected;
    var pLastExist = productLastSelected.find((item) => item._id === product._id);
    if (!pLastExist) {
      var pExist = productSelected.find((item) => item._id === product._id);
      if(!pExist) {
        pSelected.push(product);
        setProductSelected([...pSelected]);
      }
      else {
        var newProductSelected = productSelected.filter(ps => ps._id !== product._id)
        setProductSelected([...newProductSelected]);
      }
    } 
  };

  const dataReset = () => {
    setProductList([]);
    setProductSelected([]);
  };

  // cancel form create
  const onCancel = () => {
    onFinish({
      status: "FORM_CANCEL",
    });
    dataReset();
  };

  const onNavigate = (page, event) => {
    setPage(page);
  };

  const checkLastAndMarker = (pId) => {
    var isExistProduct = productLastSelected.filter((ps) => ps._id === pId);
    if (isExistProduct.length > 0) return true;
    else return false;
  };

  const checkAndMarker = (pId) => {
    var isExistProduct = productSelected.filter((ps) => ps._id === pId);
    if (isExistProduct.length > 0) return true;
    else return false;
  };

  useEffect(() => {
    loadData();
  }, [page]);

  useEffect(() => {
    if (active) loadData();
  }, [active]);

  return (
    <div className="PF_ProductAddForm">
      <div className="P-pick-list">
        <div className="P-pick-main">
          <div className="P-list">
            <div className="P-list-header">
              <div className="P-h-item p-h-name">Name</div>
              <div className="P-h-item p-h-cate">Category</div>
              <div className="P-h-item p-h-brand">Brand</div>
              <div className="P-h-item p-h-selling-price">Selling price</div>
              <div className="P-h-item p-h-quantity">Quantity</div>
            </div>
            <div className="P-list-body">
              <div className="P-list-inner">
                {isLoadingButton ? (
                  <Loading isLoading={isLoadingButton}></Loading>
                ) : (
                  <>
                    {productList.map((item) => {
                      return (
                        <div
                          className={
                            "P-item " +
                            (checkLastAndMarker(item._id)
                              ? "p-last-active "
                              : " ") +
                            (checkAndMarker(item._id)
                              ? "p-active"
                              : "")
                          }
                          key={"Product-render-modal-" + item._id}
                          onClick={(event) => onProductSelect(item, event)}
                        >
                          <div className="p-name">{item.Name}</div>
                          <div className="p-cate">
                            {item.Category ? item.Category.Name : "N/a"}
                          </div>
                          <div className="p-brand">
                            {item.Brand ? item.Brand.Name : "N/a"}
                          </div>
                          <div className="p-selling-price">
                            {formatCurrency(item.SellingPrice)}
                          </div>
                          <div className="p-quantity">
                            {item.Quantity ? item.Quantity : "N/a"}
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
              {/* product navigation */}
              <div className="navigation-container">
                <div className="navigation">
                  {navigateData ? (
                    Array.from({
                      length: navigateData.totalPage,
                    }).map((item, index) => {
                      return (
                        <div
                          key={"product-render" + index}
                          className={
                            index + 1 === page
                              ? "navigation-number navigate-active"
                              : "navigation-number"
                          }
                          onClick={(event) => onNavigate(index + 1, event)}
                        >
                          {index + 1}
                        </div>
                      );
                    })
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="btn-final">
        <button onClick={onCancel}>Cancel</button>
        <button onClick={onSave}>
          {!isLoadingButton ? <p>Save</p> : <></>}
          <Loading isLoadingButton={isLoadingButton}></Loading>
        </button>
      </div>
    </div>
  );
};

export default PF_ProductAddForm;
