import React, { useEffect, useState } from "react";
import "./PF_ProductAddForm.scss";
import Loading from "../../../component/Loading/Loading";
import ProductAPI from "../../../apis/Product/ProductAPI";
import ProductFeatureAPI from "../../../apis/ProductFeature/ProductFeatureAPI";

const PF_ProductAddForm = ({ onFinish, active, data }) => {
  const [productList, setProductList] = useState([]);
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const [productSelected, setProductSelected] = useState([]);

  const loadData = async () => {
    var Get_Product_Result = await ProductAPI.get();
    if (Get_Product_Result.success) {
      var newData = Get_Product_Result.data.filter((product) => {
        return !data.products.find((p) => p._id === product._id);
      });
      setProductList(newData);
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
    setIsLoadingButton(true)
    var Create_ProductFeature_Result_Map = await Promise.all([
      productSelected.map((product) => {
        return ProductFeatureAPI.create({
          Feature: data.feature._id,
          Product: product._id,
        });
      }),
    ]);

    var response = await Promise.all(Create_ProductFeature_Result_Map[0].map(promise => {
      return promise
    }))

    var checkResponse = response.map(result => result.success )
    const hasFalse = checkResponse.some(element => !element);


    if(!hasFalse) {
      onFinish({
        status: "FORM_FINISHED",
      });
      setIsLoadingButton(false)
    }
    else {
      setIsLoadingButton(false)
      alert("Thêm sản phẩm thất bại")
    }
  };

  const onProductSelect = (product, event) => {
    var pSelected = productSelected;
    var pExist = pSelected.find((item) => item._id === product._id);
    var pElement = event.currentTarget;

    if (pExist) {
      pSelected = pSelected.filter((p) => p._id !== pExist._id);
      pElement.classList.remove("p-active");
      setProductSelected(pSelected);
    } else {
      pElement.classList.add("p-active");
      pSelected.push(product);
      setProductSelected(pSelected);
    }
  };

  const dataReset = () => {
    setProductList([])
    setProductSelected([])
  }

  // cancel form create
  const onCancel = () => {
    onFinish({
      status: "FORM_CANCEL",
    });
    dataReset();
  };

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
                          className={"P-item "}
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
