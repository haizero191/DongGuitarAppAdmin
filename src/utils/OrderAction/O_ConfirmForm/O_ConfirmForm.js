import React, { useEffect, useState } from "react";
import "./O_ConfirmForm.scss";
import ProductAPI from "../../../apis/Product/ProductAPI";
import OrderAPI from "../../../apis/Order/OrderAPI";
import Loading from "../../../component/Loading/Loading";
import moment from "moment";


const O_ConfirmForm = ({ onFinish, active, data }) => {
  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false)

  const orderStatusList = [
    {
      status: "Open",
      name: "Đơn hàng mới",
      color: "#577590",
    },
    {
      status: "Confirmed",
      name: "Đã xác nhận",
      color: "#90BE6D",
    },
    {
      status: "Paid",
      name: "Đã thanh toán",
      color: "#277DA1",
    },
    {
      status: "Shipping",
      name: "Đang giao",
      color: "#F9C74F",
    },
    {
      status: "Delivered",
      name: "Đã giao hàng",
      color: "#F8961E",
    },
    {
      status: "Finished",
      name: "Đã hoàn thành",
      color: "#008000",
    },
    {
      status: "Canceled",
      name: "Đã hủy",
      color: "#F94144",
    },
  ];

  // Chuyển đổi sang định dạng VND
  const formatCurrency = (amount) => {
    const formatter = new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    });
    return formatter.format(amount);
  };

  const onStatusSelect = (status) => {
    setStatus(status);
  };

  const initData = () => {
    const getProductWithId = async () => {
      var Detail_Product_With_Id_Result = await ProductAPI.detail(
        data.Product._id
      );
      console.log(Detail_Product_With_Id_Result);
      if (Detail_Product_With_Id_Result.success)
        setProduct(Detail_Product_With_Id_Result.data);
    };
    setStatus(data.Status);
    getProductWithId();
  };

  // Xử lý xác nhận
  const onConfirm = async () => {
    var dataUpdate = data;
    dataUpdate.Status = status;
    dataUpdate.IsReview = false;
    setIsLoading(true)
    const Update_Order_Result = await OrderAPI.update(data._id, dataUpdate);
    if (Update_Order_Result.success) {
      setTimeout(() => {
        setIsLoading(false)
        dataReset();
        onFinish({
          status: "FORM_FINISHED",
        });
      }, 500) 
    }
    else {
      setTimeout(() => {
        setIsLoading(false)
        dataReset();
        onFinish({
          status: "FORM_FINISHED",
        });
      }, 500) 
    }
  };

  // cancel form create
  const onCancel = () => {
    onFinish({
      status: "FORM_CANCEL",
    });
    dataReset();
  };

  const dataReset = () => {
    setStatus(null);
    setProduct(null);
  };

  // Format date time
  const dateTimeFormatter = (date) => {
    const formattedDate = moment(date).format("DD-MM-YYYY \n HH:mm:ss");
    return formattedDate;
  };

  useEffect(() => {
    initData();
  }, [data]);

  useEffect(() => {
    if (active) {
      initData();
    } else dataReset();
  }, [active]);

  return (
    <div className="O_ConfirmForm">
      <div className="form-container">
        <div className="flex-row">
          <div className="field-input flex-50">
            <p>Khách hàng</p>
            <p>{data.Fullname}</p>
          </div>
          <div className="field-input flex-50">
            <p>Số điện thoại</p>
            <p>{data.Phone}</p>
          </div>
          <div className="field-input flex-50">
            <p>Email</p>
            <p>{data.Email}</p>
          </div>
        </div>

        <div className="line">
          <div className="square"></div>
        </div>

        <div className="flex-row">
          <div className="field-input flex-50">
            <p>Mã đơn hàng</p>
            <p style={{ fontWeight: "700" }}>{data.Code}</p>
          </div>
          <div className="field-input flex-50">
            <p></p>
            <p style={{fontSize: "14px", opacity: 0.6}}>{dateTimeFormatter(data.CreatedAt)}</p>
          </div>

          <div className="field-input flex-50" style={{minHeight: "37px"}}>
            <p>Sản phẩm</p>
            <p>{product ? product.Name : "N/a"}</p>
          </div>
          <div className="field-input flex-50">
            <p>Nhãn hàng</p>
            <p>{product ? product.Brand.Name : "N/a"}</p>
          </div>
          <div className="field-input flex-50">
            <p>Danh mục</p>
            <p>{product ? product.Category.Name : "N/a"}</p>
          </div>

          <div className="field-input flex-50">
            <p>Giá bán</p>
            <p style={{ color: "#d52b1e", fontSize: "24px" }}>
              {formatCurrency(data.PaymentCost)}
            </p>
          </div>
        </div>

        <div className="field-input status-line">
          {orderStatusList.map((os) => {
            return (
              <div className="status-circle">
                {data.Status === os.status ? (
                  <div
                    className="status-badge-active"
                    style={{
                      background: os.color,
                      border: "1px solid " + os.color,
                      color: "white",
                    }}
                    onClick={() => onStatusSelect(os.status)}
                  >
                    {os.name}
                  </div>
                ) : status === os.status ? (
                  <div
                    className="status-badge-active"
                    style={{
                      background: os.color,
                      border: "1px solid " + os.color,
                      color: "white",
                    }}
                    onClick={() => onStatusSelect(os.status)}
                  >
                    {os.name}
                  </div>
                ) : (
                  <div
                    className="status-badge"
                    onClick={() => onStatusSelect(os.status)}
                  >
                    {os.name}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="btn-actions">
          <button className="confirm-btn" onClick={onConfirm}>
            {
              isLoading ? <Loading isLoading={isLoading}/> : <span>Xác nhận</span>
            }            
          </button>
          <button className="cancel-btn" onClick={onCancel}>
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
};

export default O_ConfirmForm;
