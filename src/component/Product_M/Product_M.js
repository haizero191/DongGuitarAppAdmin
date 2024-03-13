import React, { useEffect, useState } from "react";
import "./Product_M.scss";
import ProductAPI from "../../apis/Product/ProductAPI";
import Modal from "../Modal/Modal";
import P_CreateForm from "../../utils/ProductAction/P_CreateForm/P_CreateForm";
import P_EditForm from "../../utils/ProductAction/P_EditForm/P_EditForm";
import Loading from "../Loading/Loading.js";

const Product_M = () => {
  const [data, setData] = useState([]);
  const [isModalActive, setIsModalActive] = useState(false);
  const [modalAction, setModalAction] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [productSelected, setProductSelected] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Chuyển đổi sang định dạng VND
  const formatCurrency = (amount) => {
    const formatter = new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    });
    return formatter.format(amount);
  };

  // Tạo sản phẩm mới
  const onCreate = () => {
    setIsModalActive(true);
    setModalAction("P_CREATE");
    setModalTitle("PRODUCT INFOMATION");
  };

  const onEdit = () => {
    if (productSelected.length === 1) {
      setIsModalActive(true);
      setModalAction("P_EDIT");
      setModalTitle("PRODUCT EDIT FORM");
    } else if (productSelected.length === 0)
      alert("Please select a product to edit !");
    else alert("Only select a product to edit !");
  };

  const onDelete = async () => {
    if (
      window.confirm("Delete all product had selected ! Are you sure ?") ===
      true
    ) {
      var result = await ProductAPI.delete(productSelected);
      if (result) {
        alert("Products had deleted !");
        loadData();
        const checkboxes = document.querySelectorAll(
          'input[type="checkbox"]:checked'
        );
        checkboxes.forEach((checkbox) => {
          checkbox.checked = false;
        });
      }
    }
  };

  //  Delete button clicked
  const onSelectProduct = (event) => {
    var pId = event.target.getAttribute("data-id");
    if (event.target.checked) {
      let productList = productSelected;
      let isExist = productList.includes(pId);
      if (!isExist) {
        productList.push(pId);
        setProductSelected(productList);
      }
    } else {
      let productList = productSelected;
      let isExist = productList.includes(pId);
      console.log(isExist);
      if (isExist) {
        productList = productList.filter((id) => {
          return id !== pId;
        });
        setProductSelected(productList);
      }
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

  // Load dữ liệu sản phẩm
  const loadData = () => {
    setIsLoading(true);
    ProductAPI.get().then((result) => {
      if (result.success) {
        setData(result.data);
      }
      setTimeout(() => {
        setIsLoading(false);
      },500)
    });
  };

  // Xử lí sự kiện sau khi lưu sản phẩm
  const onSaveProduct = (data) => {
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

  return (
    <div className="Product_M">
      <div className="PM-left">
        <div className="PM-header">
          <div className="title">Sản phẩm</div>
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
        <div className="PM-main">
          <div className="P-list">
            <div className="P-list-header">
              <div className="P-h-item p-h-checkbox"></div>
              <div className="P-h-item p-h-name">Name</div>
              <div className="P-h-item p-h-cate">Category</div>
              <div className="P-h-item p-h-brand">Brand</div>
              <div className="P-h-item p-h-selling-price">Selling price</div>
              <div className="P-h-item p-h-quantity">Quantity</div>
            </div>
            <div className="P-list-body">
              <div className="P-list-inner">
                {isLoading ? (
                  <Loading isLoading={isLoading}></Loading>
                ) : (
                  <>
                    {data.map((item) => {
                      return (
                        <div
                          className="P-item"
                          key={"Product-render-" + item._id}
                        >
                          <div className="p-checkbox">
                            <input
                              type="checkbox"
                              onChange={onSelectProduct}
                              data-id={item._id}
                            />
                          </div>
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
      <div className="PM-right"></div>
      <div className="modal-container">
        <Modal
          active={isModalActive}
          action={handleModalAction}
          title={modalTitle}
        >
          {modalAction === "P_CREATE" ? (
            <P_CreateForm onFinish={onSaveProduct} active={isModalActive} />
          ) : (
            <></>
          )}

          {modalAction === "P_EDIT" ? (
            <P_EditForm
              onFinish={onSaveProduct}
              active={isModalActive}
              data={data.find((p) => p._id === productSelected[0])}
            />
          ) : (
            <></>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default Product_M;
