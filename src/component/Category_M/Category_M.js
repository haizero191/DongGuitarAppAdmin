import React from "react";
import "./Category_M.scss";
import Modal from "../Modal/Modal";
import { useState } from "react";
import C_CreateForm from "../../utils/CategoryAction/C_CreateForm/C_CreateForm";
import CategoryAPI from "../../apis/Category/CategoryAPI";
import { useEffect } from "react";
import C_EditForm from "../../utils/CategoryAction/C_EditForm/C_EditForm";
import ProductAPI from "../../apis/Product/ProductAPI";
import SubCategoryAPI from "../../apis/SubCategoryAPI/SubCategoryAPI";

const Category_M = ({ onLoad, isLoading }) => {
  const [isModalActive, setIsModalActive] = useState(false);
  const [modalAction, setModalAction] = useState(null);
  const [modalTitle, setModalTitle] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const [cateSelected, setCateSelected] = useState([]);
  const [amountProductList, setAmountProductList] = useState([]);

  // Handle actions for category management
  const onDelete = async () => {
    if (cateSelected.length === 0)
      alert("Please select category to delete !!!");
    else {
      if (
        window.confirm("Delete all category had selected ! Are you sure ?") ==
        true
      ) {
        var cateSelectedDelete = categoryList.filter(
          (cate) => cate._id === cateSelected[0]
        );
        var subCateIds = cateSelectedDelete[0].SubCategory.map((sc) => sc._id);
        var Delete_All_SubCategory_Result = await SubCategoryAPI.delete(
          subCateIds
        );

        if (Delete_All_SubCategory_Result.success) {
          var response = await CategoryAPI.delete(cateSelected);
          if (response.success) {
            alert("Categories had deleted !");
            loadData();
          }
        }
      } else {
      }
    }
  };
  const onCreate = () => {
    setIsModalActive(true);
    setModalAction("C_Create");
    setModalTitle("CATEGORY INFORMATION");
  };
  const onEdit = () => {
    if (cateSelected.length === 1) {
      setIsModalActive(true);
      setModalAction("C_Edit");
      setModalTitle("CATEGORY EDIT FORM");
    } else if (cateSelected.length === 0)
      alert("Please select a product to edit !");
    else alert("Only select a product to edit !");
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

  // Get amount product of category
  const getAmountProductOfCategory = async (category) => {
    const pAmount = await ProductAPI.getAmount("category", category._id);
    return pAmount;
  };

  // Xử lý sự kiện từ form
  const handleFormEvent = (data) => {
    if (data.status === "FORM_FINISHED") {
      setIsModalActive(false);
      loadData();
    }
    if (data.status === "FORM_CANCEL") {
      setIsModalActive(false);
      loadData();
    }
  };

  //  Handle select category
  const onSelectCategory = (event) => {
    var pId = event.target.getAttribute("data-id");

    if (event.target.checked) {
      var cateList = cateSelected;
      var isExist = cateList.includes(pId);
      if (!isExist) {
        cateList.push(pId);
        setCateSelected(cateList);
      }
    } else {
      var cateList = cateSelected;
      var isExist = cateList.includes(pId);
      if (isExist) {
        cateList = cateList.filter((id) => {
          return id !== pId;
        });
        setCateSelected(cateList);
      }
    }
  };

  const loadData = async () => {
    const Get_Category_Result = await CategoryAPI.get();
    if (Get_Category_Result.success) {
      onLoad({
        name: "category",
        isLoaded: true,
      });
      const Get_Product_Amount_Result = await Promise.all(
        Get_Category_Result.data.map((category) => {
          return getAmountProductOfCategory(category);
        })
      );
      setAmountProductList(
        Get_Product_Amount_Result.map((item) => item.data)
      );
      setCategoryList(Get_Category_Result.data);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="Category_M">
      <div className="CM-header">
        <div className="title">Danh mục</div>
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

      <div className="CM-main">
        <div className="C-list">
          <div className="C-list-header">
            <div className="C-h-item C-h-checkbox"></div>
            <div className="C-h-item C-h-name">Name</div>
            <div className="C-h-item C-h-pAmount">Product amount</div>
          </div>
          <div className="C-list-body">
            <div className="C-list-inner">
              {categoryList ? (
                categoryList.map((cate, index) => {
                  return (
                    <div className="C-item" key={"category-render-" + cate._id}>
                      <div className="C-checkbox">
                        <input
                          type="checkbox"
                          onChange={onSelectCategory}
                          data-id={cate._id}
                        />
                      </div>
                      <div className="C-name">{cate.Name}</div>
                      <div className="C-pAmount">
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
          size="nor"
          title={modalTitle}
        >
          {modalAction === "C_Create" ? (
            <C_CreateForm onFinish={handleFormEvent} active={isModalActive} />
          ) : (
            <></>
          )}

          {modalAction === "C_Edit" ? (
            <C_EditForm
              onFinish={handleFormEvent}
              active={isModalActive}
              data={categoryList.find((p) => p._id === cateSelected[0])}
            />
          ) : (
            <></>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default Category_M;
