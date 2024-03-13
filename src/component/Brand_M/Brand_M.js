import React, { useState, useEffect } from "react";
import "./Brand_M.scss";
import BrandAPI from "../../apis/Brand/BrandAPI";
import Modal from "../Modal/Modal";
import B_CreateForm from "../../utils/BrandAction/B_CreateForm/B_CreateForm";
import ProductAPI from "../../apis/Product/ProductAPI";
import B_EditForm from "../../utils/BrandAction/B_EditForm/B_EditForm";

const Brand_M = ({ onLoad, isLoading }) => {
  const [isModalActive, setIsModalActive] = useState(false);
  const [modalAction, setModalAction] = useState(null);
  const [modalTitle, setModalTitle] = useState("");
  const [brandList, setBrandList] = useState([]);
  const [brandSelected, setBrandSelected] = useState([]);
  const [amountProductList, setAmountProductList] = useState([]);

  const onDelete = async () => {
    if (brandSelected.length === 0)
      alert("Please select category to delete !!!");
    else {
      if (
        window.confirm("Delete all brand had selected ! Are you sure ?") == true
      ) {
        var Delete_Brand_Result = await BrandAPI.delete(brandSelected);
        console.log(Delete_Brand_Result)
        if (Delete_Brand_Result.success) {
          alert("Brands had deleted !");
          loadData();
        }
      } else {
      }
    }
  };
  const onCreate = () => {
    setIsModalActive(true);
    setModalAction("B_Create");
    setModalTitle("BRAND INFORMATION");
  };
  const onEdit = () => {
    if (brandSelected.length === 1) {
      setIsModalActive(true);
      setModalAction("B_Edit");
      setModalTitle("CATEGORY EDIT FORM");
    } else if (brandSelected.length === 0)
      alert("Please select a product to edit !");
    else alert("Only select a product to edit !");
  };

  // Handle brand select
  const onSelectBrand = (event) => {
    var id = event.target.getAttribute("data-id");

    if (event.target.checked) {
      let brandListSelected = brandSelected;
      let isExist = brandListSelected.includes(id);
      if (!isExist) {
        brandListSelected.push(id);
        setBrandSelected(brandListSelected);
      }
    } else {
      let brandListSelected = brandSelected;
      let isExist = brandListSelected.includes(id);
      if (isExist) {
        brandListSelected = brandListSelected.filter((id) => {
          return id !== id;
        });
        setBrandSelected(brandListSelected);
      }
    }
  };

  const getAmountProductOfBrand = async (category) => {
    const pAmount = await ProductAPI.getAmount("brand", category._id);
    return pAmount;
  };

  // Load data brand
  const loadData = async () => {
    const Get_Brand_Result = await BrandAPI.get();
    if (Get_Brand_Result.success) {
      const Get_Product_Amount_Result = await Promise.all(
        Get_Brand_Result.data.map((brand) => {
          return getAmountProductOfBrand(brand);
        })
      );

      onLoad({
        name: "brand",
        isLoaded: true,
      });
      setAmountProductList(Get_Product_Amount_Result.map((item) => item.data));
      setBrandList(Get_Brand_Result.data);
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

  // Xử lý sự kiện từ form
  const handleFormEvent = (data) => {
    loadData();
    if (data.status === "FORM_FINISHED") {
      setIsModalActive(false);
    }
    if (data.status === "FORM_CANCEL") {
      setIsModalActive(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return isLoading ? (
    <></>
  ) : (
    <div className="Brand_M">
      <div className="BM-header">
        <div className="title">Nhãn hàng</div>
        <div className="btn-action">
          <button className="btn-delete" onClick={onDelete}>
            Xóa
          </button>
          <button className="btn-edit" onClick={onEdit}>
            Chỉnh sửa
          </button>
          <button className="btn-create" onClick={onCreate}>
            Tạo mới
          </button>
        </div>
      </div>
      <div className="BM-main">
        <div className="B-list">
          <div className="B-list-header">
            <div className="B-h-item B-h-checkbox"></div>
            <div className="B-h-item B-h-name">Name</div>
            <div className="B-h-item B-h-pAmount">Product amount</div>
          </div>
          <div className="B-list-body">
            <div className="B-list-inner">
              {brandList ? (
                brandList.map((brand, index) => {
                  return (
                    <div className="B-item" key={"brand-render-" + brand._id}>
                      <div className="B-checkbox">
                        <input
                          type="checkbox"
                          onChange={onSelectBrand}
                          data-id={brand._id}
                        />
                      </div>
                      <div className="B-name">{brand.Name}</div>
                      <div className="B-pAmount">
                        {amountProductList[index]}
                      </div>
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

      <div className="modal-container">
        <Modal
          active={isModalActive}
          action={handleModalAction}
          size="sm"
          title={modalTitle}
        >
          {modalAction === "B_Create" ? (
            <B_CreateForm onFinish={handleFormEvent} active={isModalActive} />
          ) : (
            <></>
          )}

          {modalAction === "B_Edit" ? (
            <B_EditForm
              onFinish={handleFormEvent}
              active={isModalActive}
              data={brandList.find((p) => p._id === brandSelected[0])}
            />
          ) : (
            <></>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default Brand_M;
